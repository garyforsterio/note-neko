"use server";

import { parseWithZod } from "@conform-to/zod";
import * as Sentry from "@sentry/nextjs";
import { getLocale } from "next-intl/server";
import { revalidateTag } from "next/cache";
import { redirect } from "#i18n/navigation";
import { requireAuth } from "#lib/auth";
import { createPerson, deletePerson, updatePerson } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { deletePersonSchema, personSchema } from "#schema/people";

export async function createPersonAction(
	prevState: unknown,
	formData: FormData,
) {
	await requireAuth();
	const t = await getTranslations();

	const submission = parseWithZod(formData, { schema: personSchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	try {
		// Process the interests field from comma-separated string to array
		const interests = submission.value.interests
			? submission.value.interests
					.split(",")
					.map((i) => i.trim())
					.filter(Boolean)
			: [];

		// Process birthday to Date if provided
		const birthday = submission.value.birthday
			? new Date(submission.value.birthday)
			: null;

		await createPerson({
			name: submission.value.name,
			nickname: submission.value.nickname || null,
			birthday,
			howWeMet: submission.value.howWeMet || null,
			interests,
			notes: submission.value.notes || null,
		});

		// Revalidate the people cache
		revalidateTag("people");
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.createFailed")],
		});
	}

	const locale = await getLocale();
	redirect({ href: "/people", locale });
}

export async function updatePersonAction(
	prevState: unknown,
	formData: FormData,
) {
	await requireAuth();
	const t = await getTranslations();

	const submission = parseWithZod(formData, { schema: personSchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	if (!submission.value.id) {
		return submission.reply({
			formErrors: ["Person ID is required for update"],
		});
	}

	try {
		// Process the interests field from comma-separated string to array
		const interests = submission.value.interests
			? submission.value.interests
					.split(",")
					.map((i) => i.trim())
					.filter(Boolean)
			: [];

		// Process birthday to Date if provided
		const birthday = submission.value.birthday
			? new Date(submission.value.birthday)
			: null;

		await updatePerson(submission.value.id, {
			name: submission.value.name,
			nickname: submission.value.nickname || null,
			birthday,
			howWeMet: submission.value.howWeMet || null,
			interests,
			notes: submission.value.notes || null,
		});

		// Revalidate the people cache
		revalidateTag("people");
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.updateFailed")],
		});
	}

	const locale = await getLocale();
	redirect({ href: "/people", locale });
}

export async function deletePersonAction(
	prevState: unknown,
	formData: FormData,
) {
	await requireAuth();
	const t = await getTranslations();

	const submission = parseWithZod(formData, { schema: deletePersonSchema });

	if (submission.status !== "success") {
		return submission.reply();
	}

	try {
		await deletePerson(submission.value.id);

		// Revalidate the people cache
		revalidateTag("people");
	} catch (error) {
		Sentry.captureException(error);
		return submission.reply({
			formErrors: [t("error.deleteFailed")],
		});
	}

	const locale = await getLocale();
	redirect({ href: "/people", locale });
}

export async function createPersonWithoutRedirectAction(name: string): Promise<{
	success: boolean;
	error?: string;
	data?: { id: string; name: string };
}> {
	await requireAuth();
	const t = await getTranslations();
	try {
		const person = await createPerson({
			name,
			nickname: null,
			birthday: null,
			howWeMet: null,
			interests: [],
			notes: null,
		});
		return {
			success: true,
			data: {
				id: person.id,
				name: person.name,
			},
		};
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			error: t("error.createFailed"),
		};
	}
}
