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
					for (const person of extractedEntities.people) {
						if (person.existingPerson) {
							// Use existing person
							mentions.push(person.existingPerson.id);
						} else if (person.confidence > 0.7) {
							// Create new person if confidence is high
							const newPerson = await createPerson({ name: person.name });
							mentions.push(newPerson.id);
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

					// Process content to insert links for matched entities
					sendMessage({
						type: "progress",
						message: "Adding links to people and places...",
					});

					let processedContent = existingEntry.content;

					// Insert person links for matched people (not new people)
					for (const person of extractedEntities.people) {
						if (person.existingPerson) {
							const regex = new RegExp(
								`\\b${escapeRegex(person.name)}\\b`,
								"gi",
							);
							processedContent = processedContent.replace(
								regex,
								`[${person.name}](/people/${person.existingPerson.id})`,
							);
						}
					}

					// Insert location links for locations with Google Places data
					for (const location of extractedEntities.locations) {
						if (location.googlePlaceResult) {
							const regex = new RegExp(
								`\\b${escapeRegex(location.name)}\\b`,
								"gi",
							);
							const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceResult.placeId}`;
							processedContent = processedContent.replace(
								regex,
								`[${location.name}](${mapsUrl})`,
							);
						}
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
