/**
 * Shared Zod schemas for people forms and server actions
 */

import { z } from "zod";

export const personSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	namePhonetic: z.string().optional(),
	nickname: z.string().optional(),
	nationality: z.string().optional(),
	occupation: z.string().optional(),
	email: z.string().email().optional().or(z.literal("")),
	phoneNumber: z.string().optional(),
	website: z.string().optional(),
	birthday: z
		.string()
		.optional()
		.transform((val) => {
			// Transform empty string to undefined
			if (!val || val === "") return undefined;
			// Return the date string as-is for the form
			return val;
		}),
	howWeMet: z
		.string()
		.optional()
		.transform((val) => {
			// Transform empty string to undefined
			if (!val || val === "") return undefined;
			return val;
		}),
	interests: z
		.string()
		.optional()
		.transform((val) => {
			// Transform empty string to undefined
			if (!val || val === "") return undefined;
			return val;
		}),
	notes: z
		.string()
		.optional()
		.transform((val) => {
			// Transform empty string to undefined
			if (!val || val === "") return undefined;
			return val;
		}),
});

export const deletePersonSchema = z.object({
	id: z.string().min(1, "Person ID is required"),
});
