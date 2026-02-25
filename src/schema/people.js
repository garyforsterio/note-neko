
/**
 * Shared Zod schemas for people forms and server actions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePersonSchema = exports.personSchema = void 0;
var zod_1 = require("zod");
exports.personSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Name is required"),
    namePhonetic: zod_1.z.string().optional(),
    nickname: zod_1.z.string().optional(),
    nationality: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    phoneNumber: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    birthday: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        // Transform empty string to undefined
        if (!val || val === "")
            return undefined;
        // Return the date string as-is for the form
        return val;
    }),
    howWeMet: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        // Transform empty string to undefined
        if (!val || val === "")
            return undefined;
        return val;
    }),
    interests: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        // Transform empty string to undefined
        if (!val || val === "")
            return undefined;
        return val;
    }),
    notes: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        // Transform empty string to undefined
        if (!val || val === "")
            return undefined;
        return val;
    }),
});
exports.deletePersonSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Person ID is required"),
});
