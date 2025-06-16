"use server";

import { redirect } from "#i18n/navigation";
import { requireAuth } from "#lib/auth";
import { createDiaryEntry, deleteDiaryEntry, updateDiaryEntry } from "#lib/dal";
import type { ActionState } from "./types";

import { z } from "zod";

const diaryLocationSchema = z.object({
	name: z.string().min(1, "Location name is required"),
	placeId: z.string().min(1, "Place ID is required"),
	lat: z.number(),
	lng: z.number(),
});

const diarySchema = z.object({
	content: z.string().min(1, "Content is required"),
	date: z.date(),
	mentions: z.array(z.string()),
	locations: z.array(diaryLocationSchema),
});

export async function createDiaryEntryAction(
	state: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();
	try {
		const data = {
			content: formData.get("content") as string,
			date: new Date(formData.get("date") as string),
			mentions: JSON.parse((formData.get("mentions") as string) || "[]"),
			locations: JSON.parse((formData.get("locations") as string) || "[]"),
		};

		const result = diarySchema.safeParse(data);
		if (!result.success) {
			return {
				success: false,
				error: result.error.errors.map((e) => e.message).join(", "),
			};
		}
		await createDiaryEntry(result.data);
	} catch (error) {
		console.error("Error creating diary entry:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to create diary entry",
		};
	}
	return redirect({
		href: "/diary",
		locale: "en",
	});
}

export async function updateDiaryEntryAction(
	state: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();
	try {
		const id = formData.get("id") as string;
		const data = {
			content: formData.get("content") as string,
			date: new Date(formData.get("date") as string),
			mentions: JSON.parse((formData.get("mentions") as string) || "[]"),
			locations: JSON.parse((formData.get("locations") as string) || "[]"),
		};

		const result = diarySchema.safeParse(data);
		if (!result.success) {
			return {
				success: false,
				error: result.error.errors.map((e) => e.message).join(", "),
			};
		}
		await updateDiaryEntry(id, result.data);
	} catch (error) {
		console.error("Error updating diary entry:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to update diary entry",
		};
	}
	return redirect({
		href: "/diary",
		locale: "en",
	});
}

export async function deleteDiaryEntryAction(
	state: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();
	const id = formData.get("id") as string;
	try {
		await deleteDiaryEntry(id);
		return { success: true };
	} catch (error) {
		console.error("Error deleting diary entry:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to delete diary entry",
		};
	}
}
