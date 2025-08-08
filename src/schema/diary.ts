/**
 * Shared Zod schemas for diary forms and server actions
 */

import { z } from "zod";

export const deleteDiaryEntrySchema = z.object({
	id: z.string().min(1, "Diary entry ID is required"),
});
