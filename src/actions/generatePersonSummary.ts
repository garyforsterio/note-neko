"use server";

import { getLocale } from "next-intl/server";
import OpenAI from "openai";
import { z } from "zod";
import { requireAuth } from "#lib/auth";
import { getPerson } from "#lib/dal";

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPENROUTER_API_KEY,
});

const personSummarySchema = z.object({
	summary: z.string(),
	conversationTopics: z.array(z.string()),
	activitySuggestions: z.array(z.string()),
	suggestedInterests: z.array(z.string()),
	relationshipTips: z.array(z.string()),
});

export interface PersonSummary {
	summary: string;
	conversationTopics: string[];
	activitySuggestions: string[];
	suggestedInterests: string[];
	relationshipTips: string[];
}

/**
 * Generate an AI summary of a person based on their profile and diary mentions
 */
export async function generatePersonSummary(
	personId: string,
): Promise<PersonSummary> {
	await requireAuth();

	if (!process.env.OPENROUTER_API_KEY) {
		throw new Error("OpenRouter API key not configured");
	}

	const person = await getPerson(personId);
	if (!person) {
		throw new Error("Person not found");
	}

	// If there's no meaningful data to analyze, return early
	const hasProfileData = !!(
		person.howWeMet ||
		person.interests.length > 0 ||
		person.notes
	);
	const hasDiaryData = person.mentions.length > 0;

	if (!hasProfileData && !hasDiaryData) {
		return {
			summary:
				"Not enough information available to generate relationship-building suggestions.",
			conversationTopics: [],
			activitySuggestions: [],
			suggestedInterests: [],
			relationshipTips: [],
		};
	}

	try {
		// Get user's locale for context
		const locale = await getLocale();

		// Prepare profile context
		const profileContext = `
Profile Information:
- Name: ${person.name}${person.nickname ? ` (nickname: ${person.nickname})` : ""}
- Birthday: ${person.birthday ? person.birthday.toDateString() : "Not specified"}
- How we met: ${person.howWeMet || "Not specified"}
- Interests: ${person.interests.length > 0 ? person.interests.join(", ") : "None specified"}
- Notes: ${person.notes || "None"}
- Profile created: ${person.createdAt.toDateString()}
`;

		// Prepare diary context
		const diaryContext =
			person.mentions.length > 0
				? `

Diary Entries (${person.mentions.length} mentions):
${person.mentions
	.map((mention, index) => {
		const entry = mention.diaryEntry;
		return `
${index + 1}. Date: ${entry.date.toDateString()}
   Content: ${entry.content}
   Other people mentioned: ${
			entry.mentions
				.filter((m) => m.personId !== person.id)
				.map((m) => m.person.name)
				.join(", ") || "None"
		}
   Locations: ${entry.locations.map((l) => l.name).join(", ") || "None"}`;
	})
	.join("\n")}
`
				: "\n\nDiary Entries: No mentions found in diary entries.";

		const fullContext = profileContext + diaryContext;

		// Generate AI summary
		const completion = await openai.chat.completions.create({
			model: "google/gemini-2.5-flash",
			messages: [
				{
					role: "system",
					content: `YOU ARE A RELATIONSHIP INSIGHTS ASSISTANT. YOUR ROLE IS TO ANALYZE A USER'S DIARY ENTRIES ABOUT SOMEONE THEY KNOW AND PROVIDE PERSONALIZED SUGGESTIONS TO STRENGTHEN THEIR RELATIONSHIP.

###CONTEXT###

The user keeps a diary documenting their life and interactions with various people. You are analyzing:
1. Profile information the user has recorded about a specific person
2. Diary entries where the user mentioned spending time with or observing this person

The diary entries describe what THE USER did WITH this person, not what the person did independently. Your goal is to help the user deepen their connection based on past interactions.

###INSTRUCTIONS###

RETURN A JSON OBJECT WITH THIS EXACT FORMAT:

{
  "summary": string,
  "conversationTopics": string[],
  "activitySuggestions": string[],
  "suggestedInterests": string[],
  "relationshipTips": string[]
}

###OUTPUT SPECIFICATIONS###

1. **summary** (2-3 sentences)
   - Briefly describe this person's personality traits as observed by the user
   - Note the current relationship dynamic and interaction patterns

2. **conversationTopics** (1-2 items)
   - Suggest natural conversation starters based on:
     - Topics they've enjoyed discussing before
     - Their known interests
     - Follow-ups to previous interactions

3. **activitySuggestions** (1-2 items)
   - Recommend specific activities the user could do with this person
   - Base on successful past experiences or complementary interests
   - Keep practical and achievable

4. **suggestedInterests** (1-2 items)
   - New hobbies or interests this person might enjoy
   - Short labels for display as chips (e.g., "Photography", "Board games")
   - Based on their existing preferences

5. **relationshipTips** (1-2 items)
   - Actionable advice for the user to strengthen the connection
   - Based on observed interaction patterns
   - Specific to this individual relationship

###ANALYSIS APPROACH###

1. EXAMINE the diary entries to understand:
   - How the user and this person typically spend time together
   - What activities or topics create positive interactions
   - The person's responses and preferences during past meetings

2. IDENTIFY patterns:
   - What does this person seem to enjoy?
   - What conversation topics engage them?
   - How do they prefer to connect?

3. GENERATE suggestions that:
   - Build on successful past interactions
   - Match the person's communication style
   - Fit the current relationship depth

###GUIDELINES###

- Keep all suggestions concise and actionable
- Base recommendations on observed data, not assumptions
- Match the relationship's current level (don't suggest intimate activities for acquaintances)
- Write in ${locale === "ja" ? "Japanese" : "English"}
- Focus on what the USER can do to strengthen the connection

###AVOID###

- Generic suggestions without personal context
- Misinterpreting diary entries as the person's independent actions
- Overly ambitious or expensive suggestions
- Lengthy explanations or descriptions
- Suggestions inappropriate for the relationship level

###EXAMPLE###

**Input:**
- Profile: Sarah, met at book club, likes mystery novels and coffee
- Diary entries: "Had coffee with Sarah, she recommended three new authors" and "Sarah and I discussed the latest book club pick for an hour after the meeting"

**Output:**
{
  "summary": "Sarah is passionate about literature and enjoys deep discussions about books. Your conversations flow naturally when focused on reading and literary analysis.",
  "conversationTopics": ["The authors she recently recommended", "Next book club selection"],
  "activitySuggestions": ["Visit a local bookstore together", "Attend an author reading event"],
  "suggestedInterests": ["Creative writing", "Literary podcasts"],
  "relationshipTips": ["Ask for her book recommendations regularly", "Share interesting literary articles you find"]
}`,
				},
				{
					role: "user",
					content: fullContext,
				},
			],
			response_format: { type: "json_object" },
			temperature: 0.3,
		});

		const content = completion.choices[0]?.message?.content;
		if (!content) {
			throw new Error("No response from OpenAI");
		}

		const parsed = JSON.parse(content);
		console.log("AI generated person summary:", {
			personId,
			hasProfileData,
			hasDiaryData,
			summaryLength: parsed.summary?.length || 0,
			keyInsightsCount: parsed.keyInsights?.length || 0,
		});

		const validated = personSummarySchema.parse(parsed);

		return {
			summary: validated.summary,
			conversationTopics: validated.conversationTopics,
			activitySuggestions: validated.activitySuggestions,
			suggestedInterests: validated.suggestedInterests,
			relationshipTips: validated.relationshipTips,
		};
	} catch (error) {
		console.error("Person summary generation error:", error);
		throw new Error("Failed to generate person summary");
	}
}
