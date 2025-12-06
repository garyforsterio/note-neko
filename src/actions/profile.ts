"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { requireAuth } from "#lib/auth";
import { updateUserDefaultLocation } from "#lib/dal";

const defaultLocationSchema = z.object({
	placeId: z.string().min(1, "Place ID is required"),
	name: z.string().min(1, "Location name is required"),
	lat: z.number(),
	lng: z.number(),
});

type DefaultLocationData = z.infer<typeof defaultLocationSchema>;

export async function updateDefaultLocationAction(
	data: DefaultLocationData | null,
) {
	await requireAuth();
	const t = await getTranslations("settings.profile");

	if (!data) {
		return { success: false, message: t("failedToSaveDefaultLocation") };
	}

	try {
		// Validate incoming data
		const validatedData = defaultLocationSchema.parse(data);

		await updateUserDefaultLocation(validatedData);
		return { success: true, message: t("defaultLocationSaved") };
	} catch (error) {
		console.error("Error updating default location:", error);
		if (error instanceof z.ZodError) {
			return { success: false, message: t("invalidLocationData") };
		}
		return { success: false, message: t("failedToSaveDefaultLocation") };
	}
}
