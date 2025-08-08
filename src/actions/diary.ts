"use server";

import { parseWithZod } from "@conform-to/zod";
import * as Sentry from "@sentry/nextjs";
import { getLocale } from "next-intl/server";
import { revalidateTag } from "next/cache";
import { redirect } from "#i18n/navigation";
import { requireAuth } from "#lib/auth";
import { createDiaryEntry, deleteDiaryEntry, updateDiaryEntry } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { deleteDiaryEntrySchema, diaryEntrySchema } from "#schema/diary";

export async function createDiaryEntryAction(
	prevState: unknown,
	formData: FormData,
) {
	await requireAuth();
	const t = await getTranslations();

	const submission = parseWithZod(formData, { schema: diaryEntrySchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	try {
		// Create diary entry with original content (no AI processing)
		const newEntry = await createDiaryEntry({
			content: submission.value.content,
			date: submission.value.date,
			mentions: [], // Empty for now, will be populated by background processing
			locations: [],
		});

		// Revalidate the diary cache
		revalidateTag("diaryEntry");

		// Return success with entry ID (no redirect)
		const result = submission.reply({
			formErrors: [],
		});
		// Add the entryId to the result
		return { ...result, entryId: newEntry.id };
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.createFailed")],
		});
	}
}

export async function updateDiaryEntryAction(
	prevState: unknown,
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
		// Update diary entry with original content (no AI processing)
		await updateDiaryEntry(submission.value.id, {
			content: submission.value.content,
			date: submission.value.date,
			mentions: [], // Keep empty for now
			locations: [], // Keep empty for now
		});

		// Revalidate the diary cache
		revalidateTag("diaryEntry");

		// Return success with entry ID (no redirect)
		const result = submission.reply({
			formErrors: [],
		});
		// Add the entryId to the result
		return { ...result, entryId: submission.value.id };
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.updateFailed")],
		});
	}
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
