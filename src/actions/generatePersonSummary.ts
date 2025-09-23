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
					content: `YOU ARE THE WORLD'S LEADING RELATIONSHIP COACH, RECOGNIZED GLOBALLY FOR HELPING PEOPLE BUILD DEEPER, MORE MEANINGFUL CONNECTIONS. YOUR ROLE IS TO ANALYZE THE PROVIDED PROFILE AND DIARY DATA, THEN PRODUCE HIGHLY PERSONALIZED, ACTIONABLE RECOMMENDATIONS THAT STRENGTHEN RELATIONSHIPS.

###INSTRUCTIONS###

YOU MUST RETURN A JSON OBJECT IN THE FOLLOWING FORMAT:

{
  "summary": string,
  "conversationTopics": string[],
  "activitySuggestions": string[],
  "suggestedInterests": string[],
  "relationshipTips": string[]
}

###OUTPUT DETAILS###

1. **summary**  
   - WRITE a 1–2 paragraph overview capturing the person’s personality, emotional tendencies, and the nature of the relationship.  
   - REFLECT warmth, empathy, and nuanced understanding.  

2. **conversationTopics**  
   - PROVIDE 3–4 specific, personalized topics for the next encounter.  
   - BASE them on their documented interests, recent diary mentions, or areas not yet explored together.  
   - ENSURE topics feel natural and spark meaningful dialogue.  

3. **activitySuggestions**  
   - SUGGEST 3–4 concrete, practical activities aligned with shared or complementary interests.  
   - CONSIDER hobbies, lifestyle, and past diary entries for realism.  

4. **suggestedInterests**  
   - PROPOSE 3–4 potential new interests they might enjoy.  
   - DERIVE these from existing passions, personality indicators, or patterns in diary entries.  
   - FORMAT as short, engaging labels (these will be displayed as “interest chips”).  

5. **relationshipTips**  
   - PROVIDE 3–4 highly actionable strategies to deepen the bond.  
   - FOCUS on communication, empathy, and shared growth.  
   - MAKE them practical and easy to implement.  

###CHAIN OF THOUGHTS (MANDATORY)###

FOLLOW these steps internally BEFORE generating the final output:

1. **UNDERSTAND**: READ the provided profile/diary data carefully to capture personality traits, interests, and emotional context.  
2. **BASICS**: IDENTIFY the core needs of the relationship (e.g., communication, trust, shared activities).  
3. **BREAK DOWN**: DIVIDE recommendations into categories: dialogue, shared activities, mutual growth.  
4. **ANALYZE**: CROSS-REFERENCE diary entries, interests, and patterns to ensure suggestions are data-driven.  
5. **BUILD**: CONSTRUCT actionable and authentic recommendations tailored to the individual.  
6. **EDGE CASES**: AVOID suggesting unrealistic, culturally inappropriate, or logistically impractical activities.  
7. **FINAL ANSWER**: OUTPUT a well-structured JSON response as defined above.  

###GUIDELINES###

- ALWAYS make suggestions feel natural, supportive, and authentic.  
- ALWAYS tailor advice to the actual data provided.  
- ALWAYS write in ${locale === "ja" ? "Japanese" : "English"} depending on user preference.  
- ALWAYS ensure recommendations are realistic, not overly idealized.  
- ALWAYS maintain a tone of empathy, encouragement, and expertise.  

###WHAT NOT TO DO###

- NEVER RETURN GENERIC OR COOKIE-CUTTER SUGGESTIONS (e.g., “talk about movies” without context).  
- NEVER IGNORE PROFILE OR DIARY DATA when forming recommendations.  
- NEVER SUGGEST IMPRACTICAL OR EXPENSIVE ACTIVITIES (e.g., “travel abroad” for a casual acquaintance).  
- NEVER USE NEGATIVE OR CRITICAL LANGUAGE about the person.  
- NEVER DEVIATE from the required JSON structure.  
- NEVER WRITE IN A LANGUAGE OTHER THAN ${locale === "ja" ? "Japanese" : "English"}.  

###FEW-SHOT EXAMPLE###

**Input Data (excerpt):**  
- Profile: Likes photography, hiking, and cooking.  
- Diary: Recently mentioned stress at work and wanting to learn something new.  

**Output JSON Example:**  
{
  "summary": "They are thoughtful and creative, with a strong appreciation for experiences that allow them to express themselves. Recent diary entries suggest they are under stress at work but motivated to pursue new learning opportunities. Your relationship is characterized by shared curiosity and supportive dialogue.",
  "conversationTopics": ["Their recent challenges at work", "Photography inspirations", "Cooking techniques they’ve been trying", "Ideas for new hobbies"],
  "activitySuggestions": ["Take a weekend nature hike together", "Try a cooking class", "Plan a photo walk in the city", "Host a casual dinner night"],
  "suggestedInterests": ["Meditation", "Gardening", "Food photography", "Board games"],
  "relationshipTips": ["Ask open-ended questions to show empathy", "Offer encouragement when they discuss work stress", "Plan shared activities that reduce stress", "Celebrate small milestones together"]
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
