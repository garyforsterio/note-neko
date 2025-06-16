"use server";

import { z } from "zod";
import { redirect } from "#i18n/navigation";
import { requireAuth } from "#lib/auth";
import {
	type PersonData,
	createPerson,
	deletePerson,
	updatePerson,
} from "#lib/dal";
import type { ActionState } from "./types";

const personSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	nickname: z.string().optional(),
	birthday: z.string().optional(),
	howWeMet: z.string().optional(),
	interests: z.array(z.string()),
	notes: z.string().optional(),
});

function getPersonFormFormData(formData: FormData): PersonData {
	const data = Object.fromEntries(formData);
	return {
		...data,
		interests: (data.interests as string)
			.split(",")
			.map((i) => i.trim())
			.filter(Boolean),
	} as PersonData;
}

export async function createPersonAction(
	state: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();
	try {
		const data = getPersonFormFormData(formData);
		const result = personSchema.safeParse(data);
		if (!result.success) {
			return {
				success: false,
				error: result.error.errors.map((e) => e.message).join(", "),
			};
		}
		await createPerson({ ...result.data });
	} catch (error) {
		console.error("Error creating person:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create person",
		};
	}
	return redirect({
		href: "/people",
		locale: "en",
	});
}

export async function updatePersonAction(
	state: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();
	try {
		const data = getPersonFormFormData(formData);
		const result = personSchema.safeParse(data);
		if (!result.success) {
			return {
				success: false,
				error: result.error.errors.map((e) => e.message).join(", "),
			};
		}

		await updatePerson(result.data.id as string, { ...result.data });
	} catch (error) {
		console.error("Error updating person:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update person",
		};
	}
	return redirect({
		href: "/people",
		locale: "en",
	});
}

export async function deletePersonAction(
	state: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();
	const id = formData.get("id") as string;
	try {
		await requireAuth();
		await deletePerson(id);
	} catch (error) {
		console.error("Error deleting person:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete person",
		};
	}
	return redirect({
		href: "/people",
		locale: "en",
	});
}

export async function createPersonWithoutRedirectAction(
	name: string,
): Promise<ActionState & { data?: { id: string; name: string } }> {
	await requireAuth();
	try {
		const result = personSchema.safeParse({
			name,
			interests: [],
		});
		if (!result.success) {
			return {
				success: false,
				error: result.error.errors.map((e) => e.message).join(", "),
			};
		}
		const person = await createPerson({ ...result.data });
		return {
			success: true,
			data: {
				id: person.id,
				name: person.name,
			},
		};
	} catch (error) {
		console.error("Error creating person:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create person",
		};
	}
}
