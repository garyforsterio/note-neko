/**
 * Shared Zod schemas for diary forms and server actions
 */

import { z } from "zod";

export const diaryEntrySchema = z.object({
	id: z.string().optional(),
	content: z.string().min(1, "Content is required"),
	date: z
		.string()
		.min(1, "Date is required")
		.transform((val) => new Date(val)),
});

export const deleteDiaryEntrySchema = z.object({
	id: z.string().min(1, "Diary entry ID is required"),
});
