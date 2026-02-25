
/**
 * Shared Zod schemas for diary forms and server actions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiaryEntrySchema = exports.diaryEntrySchema = void 0;
var zod_1 = require("zod");
exports.diaryEntrySchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    content: zod_1.z.string().min(1, "Content is required"),
    date: zod_1.z
        .string()
        .min(1, "Date is required")
        .transform((val) => new Date(val)),
});
exports.deleteDiaryEntrySchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Diary entry ID is required"),
});
