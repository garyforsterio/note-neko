"use server";

import { parseWithZod } from "@conform-to/zod";
import * as Sentry from "@sentry/nextjs";
import { getLocale } from "next-intl/server";
import { revalidateTag } from "next/cache";
import { redirect } from "#i18n/navigation";
import { requireAuth } from "#lib/auth";
import {
	createDiaryEntry,
	createPerson,
	deleteDiaryEntry,
	updateDiaryEntry,
} from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { deleteDiaryEntrySchema, diaryEntrySchema } from "#schema/diary";
import { extractEntitiesFromText } from "./extractEntities";

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Shared function to process AI entity extraction and create/update diary entry
 */
async function processDiaryEntry(
	submission: { value: { content: string; date: Date; id?: string } },
	isUpdate = false,
) {
	const t = await getTranslations();

	try {
		// Extract entities using AI
		const extractedEntities = await extractEntitiesFromText(
			submission.value.content,
		);

		// Process people - create new ones if they don't exist and confidence is high
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
		const locations = extractedEntities.locations
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

		// Process content to insert links for matched entities
		let processedContent = submission.value.content;

		// Insert person links for matched people (not new people)
		for (const person of extractedEntities.people) {
			if (person.existingPerson) {
				const regex = new RegExp(`\\b${escapeRegex(person.name)}\\b`, "gi");
				processedContent = processedContent.replace(
					regex,
					`[${person.name}](/people/${person.existingPerson.id})`,
				);
			}
		}

		// Insert location links for locations with Google Places data
		for (const location of extractedEntities.locations) {
			if (location.googlePlaceResult) {
				const regex = new RegExp(`\\b${escapeRegex(location.name)}\\b`, "gi");
				const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${location.googlePlaceResult.placeId}`;
				processedContent = processedContent.replace(
					regex,
					`[${location.name}](${mapsUrl})`,
				);
			}
		}

		// Create or update the diary entry with processed content
		if (isUpdate && submission.value.id) {
			await updateDiaryEntry(submission.value.id, {
				content: processedContent,
				date: submission.value.date,
				mentions,
				locations,
			});
		} else {
			await createDiaryEntry({
				content: processedContent,
				date: submission.value.date,
				mentions,
				locations,
			});
		}

		// Revalidate the diary cache
		revalidateTag("diaryEntry");
		return null; // Success
	} catch (error) {
		Sentry.captureException(error);
		const errorMessage = isUpdate ? "error.updateFailed" : "error.createFailed";
		return { formErrors: [t(errorMessage)] };
	}
}

export async function createDiaryEntryAction(
	prevState: unknown,
	formData: FormData,
) {
	await requireAuth();

	const submission = parseWithZod(formData, { schema: diaryEntrySchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	const result = await processDiaryEntry(submission, false);
	if (result) {
		return submission.reply(result);
	}

	const locale = await getLocale();
	redirect({ href: "/diary", locale });
}

export async function updateDiaryEntryAction(
	prevState: unknown,
	formData: FormData,
) {
	await requireAuth();

	const submission = parseWithZod(formData, { schema: diaryEntrySchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	if (!submission.value.id) {
		return submission.reply({
			formErrors: ["Diary entry ID is required for update"],
		});
	}

	const result = await processDiaryEntry(submission, true);
	if (result) {
		return submission.reply(result);
	}

	const locale = await getLocale();
	redirect({ href: "/diary", locale });
}

export async function deleteDiaryEntryAction(
	prevState: unknown,
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

		// Revalidate the diary cache
		revalidateTag("diaryEntry");
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.deleteFailed")],
		});
	}

	const locale = await getLocale();
	redirect({ href: "/diary", locale });
}
