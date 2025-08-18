"use server";

import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import OpenAI from "openai";
import { z } from "zod";
import { requireAuth } from "#lib/auth";
import { db } from "#lib/db";

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
		const { userId } = await requireAuth();
		const existingPeople = await db.person.findMany({
			where: { userId },
			select: { id: true, name: true, nickname: true },
		});

		// Create context about existing people for AI
		const peopleContext =
			existingPeople.length > 0
				? `\n\nExisting people in the database:\n${existingPeople
						.map(
							(p) =>
								`- ${p.name}${p.nickname ? ` (nickname: ${p.nickname})` : ""}`,
						)
						.join("\n")}`
				: "";

		// Use OpenAI to extract entities
		const completion = await openai.chat.completions.create({
			model: "gpt-5-mini",
			messages: [
				{
					role: "system",
					content: `You are an expert at extracting people and locations from diary entries. 

Analyze the text and extract:
1. People mentioned (names, nicknames, relationships) 
2. Locations mentioned (places, venues, addresses, landmarks)

For people, categorize them into two groups:
- **matchedPeople**: People that clearly match someone from the existing database
- **newPeople**: People that appear to be new/unknown

Return a JSON object with THREE arrays:
1. "matchedPeople": Array of people that match existing database entries
   - "name": Full name from database (e.g., "John Smith") 
   - "mentionedAs": Exactly how they were mentioned in text (e.g., "John")
   - "confidence": 0.8+ for obvious matches, 0.7+ for likely matches

2. "newPeople": Array of people that don't match existing database
   - "name": Name as mentioned in text
   - "confidence": How confident this is a real person (0.7+ recommended)

3. "locations": Array of places mentioned
   - "name": Location as mentioned in text
   - "confidence": How confident this is a real place (0.6+ recommended)

Guidelines:
- Use 0.9+ confidence for exact matches
- Use 0.8+ confidence for obvious partial matches (e.g., "John" → "John Smith") 
- Use 0.7+ confidence for likely matches with context clues
- Avoid common words that aren't people/places
- DON'T extract: "today", "yesterday", "morning", "home", "work", "bed", etc.
- DON'T extract public figures, celebrities, music artists, actors, politicians, or any famous people - only extract people who are personally known to the diary writer
- For locations: When a specific place name is connected to a broader location (e.g., "Lawson Roppongi", "Starbucks Shibuya"), treat it as ONE location, not two separate locations. The first part is usually a business/venue name and the second part is the area/district.
- DON'T extract both "Lawson Roppongi" AND "Roppongi" - only extract "Lawson Roppongi" as a single location${peopleContext}`,
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
