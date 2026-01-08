import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { type ZodSchema, z } from "zod";

/**
 * Get a configured OpenAI client instance
 */
export function getOpenAIClient(): OpenAI {
	const apiKey = process.env.OPENROUTER_API_KEY;

	if (!apiKey) {
		throw new Error("OpenRouter API key not configured");
	}

	return new OpenAI({
		baseURL: "https://openrouter.ai/api/v1",
		apiKey,
	});
}

/**
 * Generate a structured JSON response using an LLM
 */
export async function generateJSON<T>(
	prompt: string,
	schema: ZodSchema<T>,
	systemPrompt: string,
): Promise<T> {
	const client = getOpenAIClient();

	try {
		const completion = await client.chat.completions.create({
			model: "google/gemini-3-flash-preview",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: prompt },
			],
			response_format: zodResponseFormat(schema, "result"),
			temperature: 0.1,
		});

		const content = completion.choices[0]?.message?.content;

		if (!content) {
			throw new Error("No response content from LLM");
		}

		// content should be a JSON string matching the schema
		const parsed = JSON.parse(content);

		return parsed;
	} catch (error) {
		console.error("LLM JSON generation error:", error);
		throw error;
	}
}
