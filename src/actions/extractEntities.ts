"use server";

import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { requireAuth } from "#lib/auth";
import { getSimplePeopleList } from "#lib/dal";
import { generateJSON } from "#lib/llm";

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

		const systemPrompt = `YOU ARE AN EXPERT AI ANALYST FOR DIARY ENTRIES. YOUR TASK IS TO EXTRACT PEOPLE AND LOCATIONS WITH HIGH PRECISION, FOCUSING ONLY ON REAL-WORLD INTERACTIONS AND VISITS.

### STRICT FILTERING RULES (CRITICAL) ###

1. **PHYSICAL PRESENCE ONLY**:
   - ONLY extract locations where the author was *physically present* during the entry's timeframe.
   - **MUST EXCLUDE** locations mentioned in:
     - TV, movies, news, sports broadcasts (e.g., "Watched the F1 in Abu Dhabi" → IGNORE "Abu Dhabi").
     - Books, dreams, thoughts, or future plans not yet realized.
     - General references (e.g., "The weather in London is bad" → IGNORE "London" if user is not there).

2. **PERSONAL CONNECTIONS ONLY**:
   - ONLY extract people the author knows personally or interacted with directly.
   - **MUST EXCLUDE** celebrities, athletes, or public figures mentioned in passing or viewed on screens.
   - *Exception*: Extract them ONLY if the author explicitly describes a direct, two-way interaction (e.g., "I shook hands with...").

3. **AMBIGUITY & NICKNAMES**:
   - **PRIORITIZE NICKNAMES**: If a mentioned name matches multiple existing people (e.g. "James" matches "James Smith" and "James Doe"):
     - **PREFER** the person who explicitly has that **nickname** listed in the database, as this implies a closer relationship.
     - Example: If DB has "James Smith (nickname: James)" and "James Doe", and text says "James", map to "James Smith".

4. **SPECIFICITY & FORMATTING**:
   - **EXCLUDE** broad regions ("Japan", "Europe") and generic places ("home", "work", "gym", "restaurant").
   - **EXTRACT** specific venues ("Starbucks Shibuya", "Joe's Gym").
   - Keep compound names together ("Disney Land Tokyo" -> One location).

### DATA STRUCTURE ###

1. **matchedPeople**:
   - People mentioned who match the "EXISTING PEOPLE" list below.
   - Fields: "name" (from DB), "mentionedAs" (from text), "confidence" (0.9=exact, 0.7=likely).

2. **newPeople**:
   - Other personally known people mentioned.
   - Fields: "name", "confidence".

3. **locations**:
   - Specific visited places.
   - Fields: "name", "confidence".
${peopleContext}`;

		const validated = await generateJSON(
			text,
			entityExtractionSchema,
			systemPrompt,
		);

		console.log("AI extracted entities:", validated);

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
