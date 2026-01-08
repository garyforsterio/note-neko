"use server";

import { z } from "zod";
import { requireAuth } from "#lib/auth";
import { getPerson, updatePerson } from "#lib/dal";
import { generateJSON } from "#lib/llm";

const enrichmentSchema = z.object({
	summary: z.string().describe("Brief updated summary/bio of the person"),
	interests: z
		.array(z.string())
		.describe("Updated list of interests, merging new ones with existing ones"),
	birthday: z
		.string()
		.nullable()
		.describe(
			"Birthday in ISO format (YYYY-MM-DD) if found/updated, otherwise null",
		),
	howWeMet: z
		.string()
		.nullable()
		.describe("Updated story of how we met if found/updated"),
	notes: z
		.string()
		.nullable()
		.describe(
			"Strategic relationship notes: preferences, history, and actionable details for future interactions. NOT a summary of events.",
		),
});

/**
 * Enrich person details using AI based on provided context and diary entry content
 */
export async function enrichPersonDetails(
	personId: string,
	context: string,
	diaryContent: string,
	diaryDate: Date,
): Promise<void> {
	await requireAuth();

	if (!context.trim()) {
		// Nothing to enrich if no context provided
		return;
	}

	try {
		const person = await getPerson(personId);
		if (!person) {
			console.error(`Person not found for enrichment: ${personId}`);
			return;
		}

		console.log(`Enriching details for person: ${person.name}`);

		const systemPrompt = `YOU ARE AN INTELLIGENT DATA MANAGER. YOUR TASK IS TO UPDATE A PERSON'S PROFILE BY INTELLIGENTLY MERGING NEW INFORMATION WITH EXISTING DATA.

### INPUTS ###
1. **Existing Profile**: Current data about the person.
2. **New Context**: Notes provided by the user specifically about this person.
3. **Diary Content**: The diary entry where this interaction took place (for background).

### INSTRUCTIONS ###
- **PERSPECTIVE CHECK**: The diary entry is written by the user ("I"). The person you are profiling is the SUBJECT. Do NOT attribute facts about "I" to the Subject. Reference the Subject by their name or "he/she/they".
- **ABSOLUTE DATES**: Convert ALL relative time references (e.g., "last summer", "2 years ago", "yesterday") into ABSOLUTE dates (e.g., "July 2023", "2022", "Jan 12, 2024") based on the provided "Diary Entry Date". Never leave a relative date in the notes.
- Analyze the "New Context" and "Diary Content" for new facts about the Subject (interests, birthday, how we met, background info).
- MERGE this new info with the "Existing Profile".
- **Interests**: ADD new interests to the existing list. Remove duplicates. Keep existing interests unless explicitly contradicted.
- **Birthday**: Update ONLY if the new info provides a more specific date.
- **How We Met**: Update ONLY if the new info clarifies or adds detail to the origin story.
- **Notes**: EXTRACT RELATIONSHIP INTELLIGENCE. Do NOT summarize the events or "what happened". Focus solely on **future-useful insights**: preferences, specific dislikes, communication style, values, family details/names, or personal struggles. Ask: "What information will help the User connect better with this Subject next time?"
- **Summary**: Generate or update a brief bio/summary based on all data.

### OUTPUT FORMAT (JSON) ###
{
  "summary": string,
  "interests": string[],
  "birthday": string | null (YYYY-MM-DD),
  "howWeMet": string | null,
  "notes": string | null
}
`;

		const userPrompt = `
### EXISTING PROFILE ###
Name: ${person.name}
Nickname: ${person.nickname || "None"}
Birthday: ${person.birthday ? person.birthday.toISOString().split("T")[0] : "Unknown"}
Interests: ${person.interests.join(", ")}
How We Met: ${person.howWeMet || "Unknown"}
Notes: ${person.notes || "None"}

### NEW CONTEXT (User Input) ###
${context}

### DIARY ENTRY CONTENT ###
Date: ${diaryDate.toISOString().split("T")[0]}
${diaryContent}
`;

		const result = await generateJSON(
			userPrompt,
			enrichmentSchema,
			systemPrompt,
		);

		// Prepare update data
		const updateData: Parameters<typeof updatePerson>[1] = {
			name: person.name, // Keep name as is
			interests: result.interests,
			notes: result.notes,
			howWeMet: result.howWeMet || person.howWeMet,
		};

		// If AI returned null for these, use existing (AI instructions said to return merged, but just in case)
		if (result.howWeMet) updateData.howWeMet = result.howWeMet;
		if (result.notes) updateData.notes = result.notes;

		if (result.birthday) {
			const date = new Date(result.birthday);
			if (!Number.isNaN(date.getTime())) {
				updateData.birthday = date;
			} else {
				console.warn(`Invalid birthday returned by AI: ${result.birthday}`);
			}
		}

		await updatePerson(personId, updateData);
		console.log(`Successfully enriched person: ${person.name}`);
	} catch (error) {
		console.error(`Failed to enrich person ${personId}:`, error);
		// Don't throw, just log error so we don't block the main save flow
	}
}
