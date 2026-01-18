"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuth } from "#lib/auth";
import { db } from "#lib/db";
import { generateJSON } from "#lib/llm";

// DB Accessors
async function getUnprocessedConversations(personId: string, userId: string) {
	return db.conversation.findMany({
		where: {
			personId,
			userId,
			processedAt: null,
		},
		include: {
			diaryEntry: true,
		},
		orderBy: { createdAt: "asc" },
	});
}

// Schemas for AI generation
const suggestionSchema = z.object({
	type: z.enum(["UPDATE_FIELD", "ADD_RELATIONSHIP"]),
	targetField: z
		.string()
		.nullable()
		.describe(
			"Field to update if type is UPDATE_FIELD (e.g. 'interests', 'occupation')",
		),
	value: z
		.string()
		.nullable()
		.describe(
			"The suggested value. For lists (e.g. interests), use a comma-separated string.",
		),
	relatedPersonId: z
		.string()
		.nullable()
		.describe("The ID of the related person if type is ADD_RELATIONSHIP"),
	relationshipType: z
		.string()
		.nullable()
		.describe(
			"The relationship type if type is ADD_RELATIONSHIP (e.g. 'friend', 'spouse')",
		),
	reason: z
		.string()
		.describe("Why this suggestion is being made based on the conversation."),
});

const suggestionsResponseSchema = z.object({
	suggestions: z.array(suggestionSchema),
});

export async function generatePersonSuggestions(personId: string) {
	const { userId } = await requireAuth();

	const [person, conversations, allPeople, existingSuggestions] =
		await Promise.all([
			db.person.findUnique({ where: { id: personId, userId } }),
			getUnprocessedConversations(personId, userId),
			db.person.findMany({
				where: { userId },
				select: { id: true, name: true, nickname: true },
			}),
			db.suggestion.findMany({
				where: {
					personId,
					userId,
					status: { in: ["PENDING", "ACCEPTED", "REJECTED"] },
				},
				select: {
					targetField: true,
					value: true,
					relatedPersonId: true,
					relationshipType: true,
				},
			}),
		]);

	if (!person) throw new Error("Person not found");

	if (conversations.length === 0) {
		return [];
	}

	// Format known people list (Name + Nickname + ID) for the system prompt
	const knownPeopleContext = allPeople
		.map((p) => {
			let str = `- ${p.name} (ID: ${p.id})`;
			if (p.nickname) str += ` [Nickname: ${p.nickname}]`;
			return str;
		})
		.join("\n");

	// Prepare context for AI
	// Note: content may contain [person:ID] tags. The system prompt explains this format.
	const conversationContext = conversations
		.map(
			(c) =>
				`Date: ${c.diaryEntry.date.toISOString()}\nContent: "${c.content}"\nFull Diary Entry Context: "${c.diaryEntry.content}"`,
		)
		.join("\n\n---\n\n");

	const personalContext = JSON.stringify(
		{
			name: person.name,
			interests: person.interests,
			occupation: person.occupation,
			nationality: person.nationality,
			notes: person.notes,
			birthday: person.birthday,
		},
		null,
		2,
	);

	const existingSuggestionsContext = JSON.stringify(
		existingSuggestions,
		null,
		2,
	);

	const systemPrompt = `You are an expert personal relationship assistant. 
  Your goal is to update a person's profile based on new conversations/notes recorded by the user.
  
  PEOPLE FORMAT:
  The conversation content may reference people using the format "[person:ID]". 
  Use the "KNOWN PEOPLE" list below to match IDs to names/nicknames if needed for context.
  
  KNOWN PEOPLE IN DATABASE:
  ${knownPeopleContext}
  `;

	const prompt = `
  SUBJECT PERSON:
  ${personalContext}

  EXISTING SUGGESTIONS (DO NOT DUPLICATE):
  ${existingSuggestionsContext}

  NEW CONVERSATIONS / NOTES:
  ${conversationContext}

  TASK:
  Analyze the NEW CONVERSATIONS to find NEW information about the SUBJECT PERSON.
  Generate suggestions to update their profile or add relationships.
  
  RULES:
  1. **Strictly avoiding duplicates**: If a piece of info is already in "SUBJECT PERSON" or "EXISTING SUGGESTIONS", DO NOT suggest it again.
  2. **Interests**: Suggest adding new interests. 
     - Set "type" to "UPDATE_FIELD".
     - Set "targetField" to "interests".
     - Set "value" to the interest string. If multiple, separate with commas (e.g. "Hiking, Swimming").
  3. **Occupation/Nationality/Birthday/PhoneticName**: Suggest updates if new info contradicts or adds to empty fields.
     - Set "type" to "UPDATE_FIELD".
     - Set "targetField" to the field name.
     - Set "value" to the new string value.
  4. **Relationships**: Suggest adding relationships (e.g., "wife Sarah", "brother John"). 
     - Set "type" to "ADD_RELATIONSHIP".
     - **CRITICAL**: You MUST try to match the related person to one of the "KNOWN PEOPLE".
     - If you find a match, set "relatedPersonId" to their actual ID.
     - If NO match found in KNOWN PEOPLE, do NOT make a suggestion (we only link to existing people for now).
     - Set "relationshipType" to the relationship (e.g., "friend", "spouse").
  5. **Logic**: inferred info is okay if confidence is high.
  6. **Reason**: Provide a short reasoning string for every suggestion.

  OUTPUT FORMAT:
  Return a JSON object with a "suggestions" array.
  `;

	try {
		const result = await generateJSON(
			prompt,
			suggestionsResponseSchema,
			systemPrompt,
		);

		// Create suggestions in DB
		const createdSuggestions = [];

		for (const s of result.suggestions) {
			// Validate relationship ID if present
			let finalRelatedPersonId: string | null = null;
			if (s.type === "ADD_RELATIONSHIP") {
				if (s.relatedPersonId) {
					const exists = allPeople.find((p) => p.id === s.relatedPersonId);
					if (!exists) {
						console.warn(
							`AI suggested non-existent person ID: ${s.relatedPersonId}`,
						);
						continue;
					}
					finalRelatedPersonId = s.relatedPersonId;
				} else {
					// Logic to skip if strictly enforcing IDs?
					// "If NO match found ... do NOT make a suggestion" rule should handle this, but double check.
					console.log("Skipping relationship suggestion without ID");
					continue;
				}
			}

			const suggestion = await db.suggestion.create({
				data: {
					personId,
					userId,
					type: s.type,
					targetField: s.targetField,
					value: s.value,
					reason: s.reason,
					relatedPersonId: finalRelatedPersonId,
					relationshipType: s.relationshipType,
					status: "PENDING",
				},
			});
			createdSuggestions.push(suggestion);
		}

		// Mark conversations as processed
		await db.conversation.updateMany({
			where: {
				id: { in: conversations.map((c) => c.id) },
			},
			data: {
				processedAt: new Date(),
			},
		});

		return createdSuggestions;
	} catch (error) {
		console.error("Error generating suggestions:", error);
		return [];
	}
}

export async function resolveSuggestion(
	suggestionId: string,
	accepted: boolean,
) {
	const { userId } = await requireAuth();

	const suggestion = await db.suggestion.findUnique({
		where: { id: suggestionId, userId },
		include: { person: true },
	});

	if (!suggestion) throw new Error("Suggestion not found");

	if (!accepted) {
		await db.suggestion.update({
			where: { id: suggestionId },
			data: { status: "REJECTED" },
		});
		revalidatePath(`/people/${suggestion.personId}`);
		return { success: true };
	}

	const person = suggestion.person;

	if (suggestion.type === "UPDATE_FIELD") {
		const field = suggestion.targetField;
		const valueStr = suggestion.value;

		if (field && valueStr) {
			if (field === "interests") {
				// Split by comma
				const newInterests = valueStr
					.split(",")
					.map((i) => i.trim())
					.filter(Boolean);
				const currentInterests = person.interests || [];
				const interestsToAdd = newInterests.filter(
					(i: string) => !currentInterests.includes(i),
				);

				if (interestsToAdd.length > 0) {
					await db.person.update({
						where: { id: person.id },
						data: { interests: { push: interestsToAdd } },
					});
				}
			} else {
				// Simple field update
				// Check if field is valid on person model (simple check)
				const validFields = [
					"namePhonetic",
					"nickname",
					"nationality",
					"occupation",
					"howWeMet",
					"notes",
					"email",
					"phoneNumber",
					"website",
				];

				if (validFields.includes(field)) {
					await db.person.update({
						where: { id: person.id },
						data: { [field]: valueStr },
					});
				} else if (field === "birthday") {
					// Try parse date
					const date = new Date(valueStr);
					if (!Number.isNaN(date.getTime())) {
						await db.person.update({
							where: { id: person.id },
							data: { birthday: date },
						});
					}
				}
			}
		}
	} else if (suggestion.type === "ADD_RELATIONSHIP") {
		const relatedPersonId = suggestion.relatedPersonId;
		const relationshipType = suggestion.relationshipType || "related";

		if (relatedPersonId) {
			// Create bidirectional or single? Model seems to support meaningful direction.
			// Relationship model: fromPerson, toPerson.
			// If suggestion is for 'person', adding relationship TO 'relatedPerson'.

			const otherPerson = await db.person.findUnique({
				where: { id: relatedPersonId, userId },
			});

			if (otherPerson) {
				await db.relationship.create({
					data: {
						userId,
						fromPersonId: person.id,
						toPersonId: otherPerson.id,
						type: relationshipType,
					},
				});
			} else {
				console.warn(
					`Cannot apply relationship: Related Person ID '${relatedPersonId}' not found.`,
				);
			}
		} else {
			console.warn(
				"Cannot apply relationship: Missing relatedPersonId in suggestion",
			);
		}
	}

	await db.suggestion.update({
		where: { id: suggestionId },
		data: { status: "ACCEPTED" },
	});

	revalidatePath(`/people/${suggestion.personId}`);
	return { success: true };
}

export async function getSuggestions(personId: string) {
	const { userId } = await requireAuth();
	return db.suggestion.findMany({
		where: { personId, userId, status: "PENDING" },
		include: { relatedPerson: true },
		orderBy: { createdAt: "desc" },
	});
}
