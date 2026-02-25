"use server";

import { parseWithZod } from "@conform-to/zod";
import * as Sentry from "@sentry/nextjs";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { extractEntitiesFromText } from "#actions/extractEntities";
import type { Prisma } from "#generated/prisma";
import { redirect } from "#i18n/navigation";
import { requireAuth } from "#lib/auth";
import {
	createConversation,
	createDiaryEntry,
	createPerson,
	deleteDiaryEntry,
	updateDiaryEntry,
} from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { getDateString, getNextDayString } from "#lib/utils/diary";
import { getHistoricWeather } from "#lib/utils/weather";
import { deleteDiaryEntrySchema, diaryEntrySchema } from "#schema/diary";

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

const LocationDataSchema = z
	.object({
		latitude: z.coerce.number(),
		longitude: z.coerce.number(),
		placeId: z.string().optional(),
		name: z.string().optional(),
	})
	.partial(); // All fields are optional at the top level for flexibility

export async function createDiaryEntryAction(
	_prevState: unknown,
	formData: FormData,
) {
	await requireAuth();
	const t = await getTranslations();
	const locale = await getLocale();

	const submission = parseWithZod(formData, { schema: diaryEntrySchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	let entryId: string;

	try {
		// Create diary entry with original content (no AI processing yet)
		const newEntry = await createDiaryEntry({
			content: submission.value.content,
			date: submission.value.date,
			mentions: [], // Will be populated after AI processing
			locations: [],
		});

		entryId = newEntry.id;

		// Get location data from form data if available
		const locationDataJson = formData.get("locationData");
		let locationData: z.infer<typeof LocationDataSchema> | undefined;

		if (typeof locationDataJson === "string" && locationDataJson.length > 0) {
			try {
				const parsed = LocationDataSchema.safeParse(
					JSON.parse(locationDataJson),
				);
				if (parsed.success) {
					locationData = parsed.data;
				}
			} catch (error) {
				console.error("Failed to parse locationData JSON string:", error);
			}
		}

		// Prepare for AI biasing
		let userLatForBias: number | undefined;
		let userLngForBias: number | undefined;

		if (
			locationData?.latitude !== undefined &&
			locationData?.longitude !== undefined
		) {
			// If only lat/lng is available (e.g., browser geo), use for AI biasing
			userLatForBias = locationData.latitude;
			userLngForBias = locationData.longitude;
		}

		// Extract entities using AI
		const extractedEntities = await extractEntitiesFromText(
			submission.value.content,
			userLatForBias,
			userLngForBias,
		);

		// Process people - create new ones if they don't exist and confidence is high
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

		// Process locations from AI
		const locations: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[] =
			extractedEntities.locations
				.filter(
					(location) => location.googlePlaceResult && location.confidence > 0.6,
				)
				.map((location) => location.googlePlaceResult)
				.filter(
					(place): place is NonNullable<typeof place> => place !== undefined,
				)
				.map((place) => ({
					name: place.name,
					placeId: place.placeId,
					lat: place.lat,
					lng: place.lng,
				}));

		// Process content to insert ID references for matched entities
		let processedContent = submission.value.content;

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
		entitiesToReplace.sort((a, b) => b.searchText.length - a.searchText.length);

		// Replace each entity, ensuring we don't replace inside existing references
		for (const entity of entitiesToReplace) {
			// Create a regex that matches the text only if it's not already in a reference
			// Negative lookbehind for [ and negative lookahead for :
			const regex = new RegExp(
				`(?<!\\[)\\b${escapeRegex(entity.searchText)}\\b(?!:)`,
				"gi",
			);
			processedContent = processedContent.replace(regex, entity.replacement);
		}

		// Update the diary entry with processed content and entities
		await updateDiaryEntry(entryId, {
			content: processedContent,
			mentions,
			locations,
			date: submission.value.date, // Preserve the original date
		});
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.createFailed")],
		});
	}

	// Check if nextDay parameter was passed from the client (catch-up flow) and that it is the day after the current entry date (confirm date wasn't edited during catch-up flow)
	const nextDay = formData.get("nextDay") as string;
	const nextDayParam =
		nextDay === getNextDayString(getDateString(submission.value.date))
			? `?nextDay=${nextDay}`
			: "";

	// Redirect to edit page to allow user to validate extractions
	// This is outside the try-catch because redirect() throws an error to signal the redirect
	redirect({
		href: `/diary/${entryId}${nextDayParam}${nextDayParam ? "&" : "?"}mode=edit`,
		locale,
	});
}

export async function updateDiaryEntryAction(
	_prevState: unknown,
	formData: FormData,
) {
	await requireAuth();
	const t = await getTranslations();

	const submission = parseWithZod(formData, { schema: diaryEntrySchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	if (!submission.value.id) {
		return submission.reply({
			formErrors: ["Diary entry ID is required for update"],
		});
	}

	try {
		// Extract people IDs and locations from formData
		const peopleIdsJson = formData.get("peopleIds") as string;
		const locationsJson = formData.get("locations") as string;

		const providedPeopleIds = peopleIdsJson ? JSON.parse(peopleIdsJson) : [];
		const providedLocations = locationsJson ? JSON.parse(locationsJson) : [];

		// Parse content to find actually referenced entities
		const content = submission.value.content;
		const personReferences = [...content.matchAll(/\[person:([^\]]+)\]/g)];
		const locationReferences = [...content.matchAll(/\[location:([^\]]+)\]/g)];

		// Extract referenced person IDs and location place IDs
		const referencedPersonIds = personReferences.map((match) => match[1]);
		const referencedLocationPlaceIds = locationReferences.map(
			(match) => match[1],
		);

		// Filter entities to only include those actually referenced in content
		const finalPeopleIds = providedPeopleIds.filter((id: string) =>
			referencedPersonIds.includes(id),
		);
		const finalLocations = providedLocations.filter(
			(location: Prisma.DiaryLocationCreateWithoutDiaryEntryInput) =>
				referencedLocationPlaceIds.includes(location.placeId),
		);

		// Update diary entry with only referenced entities
		await updateDiaryEntry(submission.value.id, {
			content: submission.value.content,
			date: submission.value.date,
			mentions: finalPeopleIds,
			locations: finalLocations,
		});

		// Return success
		const successReply = submission.reply({
			formErrors: [],
		});

		// Handle person enrichment asynchronously (but await here to ensure it's done before redirect/refresh)
		// Handle person enrichment asynchronously (but await here to ensure it's done before redirect/refresh)
		const personContexts: Record<string, string> = {};
		const updateEntryId = submission.value.id;

		for (const [key, value] of formData.entries()) {
			if (
				key.startsWith("person-context-") &&
				typeof value === "string" &&
				value.trim()
			) {
				const personId = key.replace("person-context-", "");
				personContexts[personId] = value.trim();
			}
		}

		if (Object.keys(personContexts).length > 0) {
			try {
				await Promise.all(
					Object.entries(personContexts).map(([personId, context]) => {
						return createConversation({
							diaryEntryId: updateEntryId, // ID is guaranteed here by validation above
							personId,
							content: context,
						});
					}),
				);
			} catch (e) {
				console.error("Error creating conversations", e);
			}
		}

		return successReply;
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.updateFailed")],
		});
	}
}

export async function deleteDiaryEntryAction(
	_prevState: unknown,
	formData: FormData,
) {
	await requireAuth();
	const t = await getTranslations();

	const submission = parseWithZod(formData, { schema: deleteDiaryEntrySchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	try {
		await deleteDiaryEntry(submission.value.id);
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.deleteFailed")],
		});
	}

	const locale = await getLocale();
	redirect({ href: "/diary", locale });
}

/**
 * Fetch weather data for a given location and date.
 * This server action allows client components to fetch weather data.
 */
export async function getWeatherAction(
	lat: number,
	lng: number,
	date: Date,
) {
	try {
		return await getHistoricWeather(lat, lng, date);
	} catch (error) {
		Sentry.captureException(error);
		return null;
	}
}
