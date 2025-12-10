"use server";

import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import OpenAI from "openai";
import { z } from "zod";
import { requireAuth } from "#lib/auth";
import { getSimplePeopleList } from "#lib/dal";

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPENROUTER_API_KEY,
});

// Schema for extracted entities
const matchedPersonSchema = z.object({
	name: z.string(), // Full name from database
	mentionedAs: z.string(), // How they were mentioned in text
	confidence: z.number().min(0).max(1),
});

const newPersonSchema = z.object({
	name: z.string(), // Name as mentioned in text
	confidence: z.number().min(0).max(1),
});

const extractedLocationSchema = z.object({
	name: z.string(),
	confidence: z.number().min(0).max(1),
});

const entityExtractionSchema = z.object({
	matchedPeople: z.array(matchedPersonSchema),
	newPeople: z.array(newPersonSchema),
	locations: z.array(extractedLocationSchema),
});

export interface ExtractedPerson {
	name: string;
	confidence: number;
	existingPerson?: {
		id: string;
		name: string;
		nickname?: string | null;
	};
}

export interface ExtractedLocation {
	name: string;
	confidence: number;
	googlePlaceResult?: {
		placeId: string;
		name: string;
		lat: number;
		lng: number;
	};
}

export interface EntityExtractionResult {
	people: ExtractedPerson[];
	locations: ExtractedLocation[];
}

/**
 * Extract people and locations from diary text using AI
 */
export async function extractEntitiesFromText(
	text: string,
	userLat?: number,
	userLng?: number,
): Promise<EntityExtractionResult> {
	await requireAuth();

	if (!process.env.OPENROUTER_API_KEY) {
		throw new Error("OpenRouter API key not configured");
	}

	if (!text.trim()) {
		return { people: [], locations: [] };
	}

	try {
		// Get user's existing people first to include in AI prompt
		const existingPeople = await getSimplePeopleList();

		// Create context about existing people for AI
		const peopleContext =
			existingPeople.length > 0
				? `\n\n###EXISTING PEOPLE IN DATABASE###\n${existingPeople
						.map(
							(p) =>
								`- ${p.name}${p.nickname ? ` (nickname: ${p.nickname})` : ""}`,
						)
						.join("\n")}`
				: "";

		// Use OpenAI to extract entities
		const completion = await openai.chat.completions.create({
			model: "x-ai/grok-4.1-fast",
			messages: [
				{
					role: "system",
					content: `YOU ARE THE WORLD'S LEADING EXPERT IN INFORMATION EXTRACTION FROM DIARY ENTRIES, RECOGNIZED FOR YOUR PRECISION IN IDENTIFYING PEOPLE AND LOCATIONS WITH UNRIVALED ACCURACY. YOUR TASK IS TO ANALYZE THE TEXT AND OUTPUT A CLEAN JSON OBJECT WITH THREE ARRAYS: "matchedPeople", "newPeople", AND "locations".

###INSTRUCTIONS###

1. YOU MUST EXTRACT:
   - **PEOPLE**: Names, nicknames, and relationship-based references (e.g., "John", "Mom", "Uncle Tom").
   - **LOCATIONS**: Specific named places (venues, businesses, addresses, landmarks).

2. PEOPLE CATEGORIZATION:
   - **matchedPeople** → People that CLEARLY match an entry in the existing database
      - Fields:
        - "name": Full name from database (e.g., "John Smith")
        - "mentionedAs": EXACT string from text (e.g., "John")
        - "confidence": Confidence score  
          - 0.9+ for exact matches  
          - 0.8+ for strong partial matches (e.g., "John" → "John Smith")  
          - 0.7+ for contextually likely matches
   - **newPeople** → People that DO NOT match database
      - Fields:
        - "name": Name as mentioned in text
        - "confidence": Confidence score (0.7+ recommended for a valid person)

3. LOCATIONS:
   - Fields:
     - "name": Location string as mentioned in text
     - "confidence": Confidence score (0.6+ recommended)
   - TREAT compound business + district (e.g., "Starbucks Shibuya") as ONE location.
   - DO NOT split into separate entries (e.g., NOT "Starbucks" + "Shibuya").

4. CONFIDENCE RULES:
   - USE 0.9+ for exact name matches
   - USE 0.8+ for clear partial matches
   - USE 0.7+ for context-driven likely matches

###CHAIN OF THOUGHTS###

FOLLOW these steps BEFORE producing the JSON:

1. **UNDERSTAND**: Read the diary text carefully and identify candidate names and place mentions.
2. **BASICS**: Separate mentions into possible PEOPLE vs. LOCATIONS.
3. **BREAK DOWN**: Compare names against the existing database to decide if they belong in matchedPeople or newPeople.
4. **ANALYZE**: Apply confidence scoring based on rules (exact/partial/context).
5. **BUILD**: Format extractions into the JSON structure with precision.
6. **EDGE CASES**: Check against “What Not To Do” rules to avoid false positives.
7. **FINAL ANSWER**: Output the JSON object ONLY, without commentary.

###WHAT NOT TO DO###

- DO NOT extract vague time/setting words: "today", "yesterday", "tonight", "morning", "home", "work", "bed".
- DO NOT extract generic venues without unique names: "the gym", "a bar", "a restaurant".
- DO NOT extract broad regions: "Tokyo", "Germany", "California".
- DO NOT extract BOTH a compound location and its parts ("Lawson Roppongi" AND "Roppongi") → ONLY keep the full compound ("Lawson Roppongi").
- DO NOT extract houses as locations. If text says "John's house", extract "John" as person, NOT "house" as location.
- DO NOT extract public figures, celebrities, politicians, or famous people → ONLY extract personally known individuals relevant to the diary writer.
- DO NOT include duplicate entries across arrays.

###OUTPUT FORMAT###

RETURN JSON ONLY, with this structure:
{
  "matchedPeople": [
    {
      "name": "John Smith",
      "mentionedAs": "John",
      "confidence": 0.9
    }
  ],
  "newPeople": [
    {
      "name": "Uncle Tom",
      "confidence": 0.8
    }
  ],
  "locations": [
    {
      "name": "Starbucks Shibuya",
      "confidence": 0.85
    }
  ]
}
${peopleContext}`,
				},
				{
					role: "user",
					content: text,
				},
			],
			response_format: { type: "json_object" },
			temperature: 0.1,
		});

		const content = completion.choices[0]?.message?.content;
		if (!content) {
			throw new Error("No response from OpenAI");
		}

		const parsed = JSON.parse(content);
		console.log("AI extracted entities:", parsed);

		const validated = entityExtractionSchema.parse(parsed);

		// Process matched people (AI already identified them as existing)
		const matchedPeople: ExtractedPerson[] = validated.matchedPeople.map(
			(person) => {
				const existingPerson = existingPeople.find(
					(p) => p.name.toLowerCase() === person.name.toLowerCase(),
				);

				return {
					name: person.mentionedAs, // Use how they were mentioned
					confidence: person.confidence,
					existingPerson: existingPerson || undefined,
				};
			},
		);

		// Process new people (AI identified as new)
		const newPeople: ExtractedPerson[] = validated.newPeople.map((person) => ({
			name: person.name,
			confidence: person.confidence,
			existingPerson: undefined,
		}));

		// Combine all people
		const processedPeople: ExtractedPerson[] = [...matchedPeople, ...newPeople];

		// Process extracted locations and try to geocode them
		const processedLocations: ExtractedLocation[] = await Promise.all(
			validated.locations.map(async (location) => {
				// Try to find the location using Google Places API
				let googlePlaceResult:
					| {
							placeId: string;
							name: string;
							lat: number;
							lng: number;
					  }
					| undefined;
				try {
					// Check if we have the API key
					if (!process.env.GOOGLE_MAPS_API_KEY) {
						console.warn(
							"Google Maps API key not configured, skipping location geocoding",
						);
						return {
							name: location.name,
							confidence: location.confidence,
							googlePlaceResult: undefined,
						};
					}

					// Get user location from parameters or Vercel headers
					const headersList = await headers();
					const latitude = userLat || headersList.get("x-vercel-ip-latitude");
					const longitude = userLng || headersList.get("x-vercel-ip-longitude");
					const country = headersList.get("x-vercel-ip-country");

					// Get user's locale
					const locale = await getLocale();

					// Build URL with location bias and language
					let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
						location.name,
					)}&inputtype=textquery&fields=place_id,name,geometry&language=${locale}&key=${
						process.env.GOOGLE_MAPS_API_KEY
					}`;

					// Add location bias if available
					if (latitude && longitude) {
						url += `&locationbias=circle:50000@${latitude},${longitude}`;
					} else if (country) {
						url += `&region=${country.toLowerCase()}`;
					}

					console.log("Geocoding request for:", location.name, {
						hasLocationBias: !!(latitude && longitude),
						hasRegion: !!country,
						language: locale,
					});

					const response = await fetch(url);

					// Check if the response is ok
					if (!response.ok) {
						console.error(
							"Google Places API HTTP error:",
							response.status,
							response.statusText,
						);
						return {
							name: location.name,
							confidence: location.confidence,
							googlePlaceResult: undefined,
						};
					}
					const data = (await response.json()) as {
						candidates?: Array<{
							place_id: string;
							name: string;
							geometry: {
								location: {
									lat: number;
									lng: number;
								};
							};
						}>;
						status?: string;
						error_message?: string;
					};

					console.log("Geocoding response:", {
						status: data.status,
						candidatesCount: data.candidates?.length || 0,
						error: data.error_message,
					});

					if (data.candidates?.[0]) {
						const place = data.candidates[0];
						googlePlaceResult = {
							placeId: place.place_id,
							name: place.name,
							lat: place.geometry.location.lat,
							lng: place.geometry.location.lng,
						};
						console.log("Found location match:", googlePlaceResult);
					} else {
						console.log("No location candidates found for:", location.name);
					}
				} catch (error) {
					console.error("Error geocoding location:", error);
					// Continue without geocoding data
				}

				return {
					name: location.name,
					confidence: location.confidence,
					googlePlaceResult,
				};
			}),
		);

		console.log("Final processed results:", {
			matchedPeopleCount: matchedPeople.length,
			newPeopleCount: newPeople.length,
			locationsCount: processedLocations.length,
			matchedPeople: matchedPeople.map((p) => ({
				name: p.name,
				confidence: p.confidence,
				hasExisting: !!p.existingPerson,
			})),
			newPeople: newPeople.map((p) => ({
				name: p.name,
				confidence: p.confidence,
			})),
			locations: processedLocations.map((l) => ({
				name: l.name,
				confidence: l.confidence,
				hasGooglePlace: !!l.googlePlaceResult,
			})),
		});

		return {
			people: processedPeople,
			locations: processedLocations,
		};
	} catch (error) {
		console.error("Entity extraction error:", error);
		throw new Error("Failed to extract entities from text");
	}
}
