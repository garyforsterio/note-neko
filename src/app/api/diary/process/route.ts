import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { extractEntitiesFromText } from "#actions/extractEntities";
import { requireAuth } from "#lib/auth";
import { getDiaryEntry, updateDiaryEntry } from "#lib/dal";
import { createPerson } from "#lib/dal";

const processRequestSchema = z.object({
	entryId: z.string().min(1, "Entry ID is required"),
	location: z
		.object({
			latitude: z.number(),
			longitude: z.number(),
		})
		.optional(),
});

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: NextRequest) {
	try {
		await requireAuth();

		const requestBody = await request.json();
		const validation = processRequestSchema.safeParse(requestBody);

		if (!validation.success) {
			return new Response(
				JSON.stringify({
					error: "Invalid request",
					details: validation.error.issues,
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const { entryId, location } = validation.data;

		// Create a readable stream
		const stream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();

				// Helper function to send JSON messages
				const sendMessage = (data: object) => {
					const message = `data: ${JSON.stringify(data)}\n\n`;
					controller.enqueue(encoder.encode(message));
				};

				try {
					// Get the existing entry to preserve its date
					const existingEntry = await getDiaryEntry(entryId);
					if (!existingEntry) {
						throw new Error("Diary entry not found");
					}

					// Send initial processing message
					sendMessage({
						type: "progress",
						message: "Starting AI analysis of your diary entry...",
					});

					// Extract entities using AI
					sendMessage({
						type: "progress",
						message: "Identifying people and places in your text...",
					});

					const extractedEntities = await extractEntitiesFromText(
						existingEntry.content,
						location?.latitude,
						location?.longitude,
					);

					// Process people - create new ones if they don't exist and confidence is high
					sendMessage({
						type: "progress",
						message: "Processing mentioned people...",
					});

					const mentions: string[] = [];
					const newlyCreatedPeople: Array<{ name: string; id: string }> = [];

					for (const person of extractedEntities.people) {
						if (person.existingPerson) {
							// Use existing person
							mentions.push(person.existingPerson.id);
						} else if (person.confidence > 0.7) {
							// Create new person if confidence is high
							const newPerson = await createPerson({ name: person.name });
							mentions.push(newPerson.id);
							// Track newly created people for linking
							newlyCreatedPeople.push({ name: person.name, id: newPerson.id });
						}
						// Skip people with low confidence for now
					}

					// Process locations - only include if we have Google Places data
					sendMessage({
						type: "progress",
						message: "Processing mentioned locations...",
					});

					const locations = extractedEntities.locations
						.filter(
							(location) =>
								location.googlePlaceResult && location.confidence > 0.6,
						)
						.map((location) => location.googlePlaceResult)
						.filter(
							(place): place is NonNullable<typeof place> =>
								place !== undefined,
						)
						.map((place) => ({
							name: place.name,
							placeId: place.placeId,
							lat: place.lat,
							lng: place.lng,
						}));

					// Process content to insert ID references for matched entities
					sendMessage({
						type: "progress",
						message: "Adding references to people and places...",
					});

					let processedContent = existingEntry.content;

					// Collect all entities to process, sorted by length (longest first to avoid nested replacements)
					const entitiesToReplace: Array<{
						searchText: string;
						replacement: string;
						type: "person" | "location";
					}> = [];

					// Add person references for matched people
					for (const person of extractedEntities.people) {
						if (person.existingPerson) {
							entitiesToReplace.push({
								searchText: person.name,
								replacement: `[person:${person.existingPerson.id}]`,
								type: "person",
							});
						}
					}

					// Add person references for newly created people
					for (const newPerson of newlyCreatedPeople) {
						entitiesToReplace.push({
							searchText: newPerson.name,
							replacement: `[person:${newPerson.id}]`,
							type: "person",
						});
					}

					// Add location references for locations with Google Places data
					for (const location of extractedEntities.locations) {
						if (location.googlePlaceResult) {
							entitiesToReplace.push({
								searchText: location.name,
								replacement: `[location:${location.googlePlaceResult.placeId}]`,
								type: "location",
							});
						}
					}

					// Sort by length (longest first) to prevent nested replacements
					entitiesToReplace.sort(
						(a, b) => b.searchText.length - a.searchText.length,
					);

					// Replace each entity, ensuring we don't replace inside existing references
					for (const entity of entitiesToReplace) {
						// Create a regex that matches the text only if it's not already in a reference
						// Negative lookbehind for [ and negative lookahead for :
						const regex = new RegExp(
							`(?<!\\[)\\b${escapeRegex(entity.searchText)}\\b(?!:)`,
							"gi",
						);
						processedContent = processedContent.replace(
							regex,
							entity.replacement,
						);
					}

					// Update the diary entry with processed content
					sendMessage({
						type: "progress",
						message: "Updating diary entry...",
					});

					// Update the entry with processed content, preserving the original date
					await updateDiaryEntry(entryId, {
						content: processedContent,
						mentions,
						locations,
						date: existingEntry.date,
					});

					// Revalidate the diary cache
					revalidateTag("diaryEntry");

					// Send completion message
					sendMessage({
						type: "complete",
						success: true,
						message: "Diary entry processed successfully!",
					});
				} catch (error) {
					console.error("Processing error:", error);
					sendMessage({
						type: "complete",
						success: false,
						error: error instanceof Error ? error.message : "Processing failed",
					});
				} finally {
					controller.close();
				}
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		console.error("API error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
