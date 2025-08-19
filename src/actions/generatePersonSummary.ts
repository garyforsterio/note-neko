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
			model: "gpt-5-mini",
			messages: [
				{
					role: "system",
					content: `You are an expert relationship coach focused on helping people build deeper, more meaningful relationships.

Analyze the data and provide actionable relationship-building suggestions:

1. **summary**: Brief 1-2 paragraph overview of your relationship and their personality

2. **conversationTopics**: 3-4 specific topics to discuss in your next encounter based on their interests, recent diary mentions, or unexplored areas

3. **activitySuggestions**: 3-4 concrete activity ideas you could do together based on shared or complementary interests

4. **suggestedInterests**: 3-4 interests they might have based on their known interests, activities mentioned in diary entries, or personality indicators (these will be shown as suggested interest chips)

5. **relationshipTips**: 3-4 specific tips for strengthening your relationship with this person

Guidelines:
- Focus on actionable, specific suggestions
- Base suggestions on actual data from their profile and diary entries
- Consider both shared interests and opportunities to learn about each other
- Be practical and realistic
- Write in ${locale === "ja" ? "Japanese" : "English"}
- Make suggestions feel natural and authentic to your relationship

Return JSON: { "summary": string, "conversationTopics": string[], "activitySuggestions": string[], "suggestedInterests": string[], "relationshipTips": string[] }`,
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
