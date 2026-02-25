"use server";

var __awaiter = (this && this.__awaiter) || ((thisArg, _arguments, P, generator) => {
    function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var __generator = (this && this.__generator) || ((thisArg, body) => {
    var _ = { label: 0, sent: () => { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return (v) => step([n, v]); }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePersonSuggestions = generatePersonSuggestions;
exports.resolveSuggestion = resolveSuggestion;
exports.getSuggestions = getSuggestions;
var cache_1 = require("next/cache");
var zod_1 = require("zod");
var auth_1 = require("#lib/auth");
var db_1 = require("#lib/db");
var llm_1 = require("#lib/llm");
// DB Accessors
function getUnprocessedConversations(personId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, (_a) => [2 /*return*/, db_1.db.conversation.findMany({
                    where: {
                        personId: personId,
                        userId: userId,
                        processedAt: null,
                    },
                    include: {
                        diaryEntry: true,
                    },
                    orderBy: { createdAt: "asc" },
                })]);
    });
}
// Schemas for AI generation
var suggestionSchema = zod_1.z.object({
    type: zod_1.z.enum(["UPDATE_FIELD", "ADD_RELATIONSHIP"]),
    targetField: zod_1.z
        .string()
        .nullable()
        .describe("Field to update if type is UPDATE_FIELD (e.g. 'interests', 'occupation')"),
    value: zod_1.z
        .string()
        .nullable()
        .describe("The suggested value. For lists (e.g. interests), use a comma-separated string."),
    relatedPersonId: zod_1.z
        .string()
        .nullable()
        .describe("The ID of the related person if type is ADD_RELATIONSHIP"),
    relationshipType: zod_1.z
        .string()
        .nullable()
        .describe("The relationship type if type is ADD_RELATIONSHIP (e.g. 'friend', 'spouse')"),
    reason: zod_1.z
        .string()
        .describe("Why this suggestion is being made based on the conversation."),
});
var suggestionsResponseSchema = zod_1.z.object({
    suggestions: zod_1.z.array(suggestionSchema),
});
function generatePersonSuggestions(personId) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, _a, person, conversations, allPeople, existingSuggestions, knownPeopleContext, conversationContext, personalContext, existingSuggestionsContext, systemPrompt, prompt, result, createdSuggestions, _loop_1, _i, _b, s, error_1;
        return __generator(this, (_c) => {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    userId = (_c.sent()).userId;
                    return [4 /*yield*/, Promise.all([
                            db_1.db.person.findUnique({ where: { id: personId, userId: userId } }),
                            getUnprocessedConversations(personId, userId),
                            db_1.db.person.findMany({
                                where: { userId: userId },
                                select: { id: true, name: true, nickname: true },
                            }),
                            db_1.db.suggestion.findMany({
                                where: {
                                    personId: personId,
                                    userId: userId,
                                    status: { in: ["PENDING", "ACCEPTED", "REJECTED"] },
                                },
                                select: {
                                    targetField: true,
                                    value: true,
                                    relatedPersonId: true,
                                    relationshipType: true,
                                },
                            }),
                        ])];
                case 2:
                    _a = _c.sent(), person = _a[0], conversations = _a[1], allPeople = _a[2], existingSuggestions = _a[3];
                    if (!person)
                        throw new Error("Person not found");
                    if (conversations.length === 0) {
                        return [2 /*return*/, []];
                    }
                    knownPeopleContext = allPeople
                        .map((p) => {
                        var str = "- ".concat(p.name, " (ID: ").concat(p.id, ")");
                        if (p.nickname)
                            str += " [Nickname: ".concat(p.nickname, "]");
                        return str;
                    })
                        .join("\n");
                    conversationContext = conversations
                        .map((c) => "Date: ".concat(c.diaryEntry.date.toISOString(), "\nContent: \"").concat(c.content, "\"\nFull Diary Entry Context: \"").concat(c.diaryEntry.content, "\""))
                        .join("\n\n---\n\n");
                    personalContext = JSON.stringify({
                        name: person.name,
                        interests: person.interests,
                        occupation: person.occupation,
                        nationality: person.nationality,
                        notes: person.notes,
                        birthday: person.birthday,
                    }, null, 2);
                    existingSuggestionsContext = JSON.stringify(existingSuggestions, null, 2);
                    systemPrompt = "You are an expert personal relationship assistant. \n  Your goal is to update a person's profile based on new conversations/notes recorded by the user.\n  \n  PEOPLE FORMAT:\n  The conversation content may reference people using the format \"[person:ID]\". \n  Use the \"KNOWN PEOPLE\" list below to match IDs to names/nicknames if needed for context.\n  \n  KNOWN PEOPLE IN DATABASE:\n  ".concat(knownPeopleContext, "\n  ");
                    prompt = "\n  SUBJECT PERSON:\n  ".concat(personalContext, "\n\n  EXISTING SUGGESTIONS (DO NOT DUPLICATE):\n  ").concat(existingSuggestionsContext, "\n\n  NEW CONVERSATIONS / NOTES:\n  ").concat(conversationContext, "\n\n  TASK:\n  Analyze the NEW CONVERSATIONS to find NEW information about the SUBJECT PERSON.\n  Generate suggestions to update their profile or add relationships.\n  \n  RULES:\n  1. **Strictly avoiding duplicates**: If a piece of info is already in \"SUBJECT PERSON\" or \"EXISTING SUGGESTIONS\", DO NOT suggest it again.\n  2. **Interests**: Suggest adding new interests. \n     - Set \"type\" to \"UPDATE_FIELD\".\n     - Set \"targetField\" to \"interests\".\n     - Set \"value\" to the interest string. If multiple, separate with commas (e.g. \"Hiking, Swimming\").\n  3. **Occupation/Nationality/Birthday/PhoneticName**: Suggest updates if new info contradicts or adds to empty fields.\n     - Set \"type\" to \"UPDATE_FIELD\".\n     - Set \"targetField\" to the field name.\n     - Set \"value\" to the new string value.\n  4. **Relationships**: Suggest adding relationships (e.g., \"wife Sarah\", \"brother John\"). \n     - Set \"type\" to \"ADD_RELATIONSHIP\".\n     - **CRITICAL**: You MUST try to match the related person to one of the \"KNOWN PEOPLE\".\n     - If you find a match, set \"relatedPersonId\" to their actual ID.\n     - If NO match found in KNOWN PEOPLE, do NOT make a suggestion (we only link to existing people for now).\n     - Set \"relationshipType\" to the relationship (e.g., \"friend\", \"spouse\").\n  5. **Logic**: inferred info is okay if confidence is high.\n  6. **Reason**: Provide a short reasoning string for every suggestion.\n\n  OUTPUT FORMAT:\n  Return a JSON object with a \"suggestions\" array.\n  ");
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 10, , 11]);
                    return [4 /*yield*/, (0, llm_1.generateJSON)(prompt, suggestionsResponseSchema, systemPrompt)];
                case 4:
                    result = _c.sent();
                    createdSuggestions = [];
                    _loop_1 = function (s) {
                        var finalRelatedPersonId, exists, suggestion;
                        return __generator(this, (_d) => {
                            switch (_d.label) {
                                case 0:
                                    finalRelatedPersonId = null;
                                    if (s.type === "ADD_RELATIONSHIP") {
                                        if (s.relatedPersonId) {
                                            exists = allPeople.find((p) => p.id === s.relatedPersonId);
                                            if (!exists) {
                                                console.warn("AI suggested non-existent person ID: ".concat(s.relatedPersonId));
                                                return [2 /*return*/, "continue"];
                                            }
                                            finalRelatedPersonId = s.relatedPersonId;
                                        }
                                        else {
                                            // Logic to skip if strictly enforcing IDs?
                                            // "If NO match found ... do NOT make a suggestion" rule should handle this, but double check.
                                            console.log("Skipping relationship suggestion without ID");
                                            return [2 /*return*/, "continue"];
                                        }
                                    }
                                    return [4 /*yield*/, db_1.db.suggestion.create({
                                            data: {
                                                personId: personId,
                                                userId: userId,
                                                type: s.type,
                                                targetField: s.targetField,
                                                value: s.value,
                                                reason: s.reason,
                                                relatedPersonId: finalRelatedPersonId,
                                                relationshipType: s.relationshipType,
                                                status: "PENDING",
                                            },
                                        })];
                                case 1:
                                    suggestion = _d.sent();
                                    createdSuggestions.push(suggestion);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _b = result.suggestions;
                    _c.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    s = _b[_i];
                    return [5 /*yield**/, _loop_1(s)];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: 
                // Mark conversations as processed
                return [4 /*yield*/, db_1.db.conversation.updateMany({
                        where: {
                            id: { in: conversations.map((c) => c.id) },
                        },
                        data: {
                            processedAt: new Date(),
                        },
                    })];
                case 9:
                    // Mark conversations as processed
                    _c.sent();
                    return [2 /*return*/, createdSuggestions];
                case 10:
                    error_1 = _c.sent();
                    console.error("Error generating suggestions:", error_1);
                    return [2 /*return*/, []];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function resolveSuggestion(suggestionId, accepted) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, suggestion, person, field, valueStr, newInterests, currentInterests_1, interestsToAdd, validFields, date, relatedPersonId, relationshipType, otherPerson;
        var _a;
        return __generator(this, (_b) => {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    userId = (_b.sent()).userId;
                    return [4 /*yield*/, db_1.db.suggestion.findUnique({
                            where: { id: suggestionId, userId: userId },
                            include: { person: true },
                        })];
                case 2:
                    suggestion = _b.sent();
                    if (!suggestion)
                        throw new Error("Suggestion not found");
                    if (accepted) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.db.suggestion.update({
                            where: { id: suggestionId },
                            data: { status: "REJECTED" },
                        })];
                case 3:
                    _b.sent();
                    (0, cache_1.revalidatePath)("/people/".concat(suggestion.personId));
                    return [2 /*return*/, { success: true }];
                case 4:
                    person = suggestion.person;
                    if (!(suggestion.type === "UPDATE_FIELD")) return [3 /*break*/, 12];
                    field = suggestion.targetField;
                    valueStr = suggestion.value;
                    if (!(field && valueStr)) return [3 /*break*/, 11];
                    if (!(field === "interests")) return [3 /*break*/, 7];
                    newInterests = valueStr
                        .split(",")
                        .map((i) => i.trim())
                        .filter(Boolean);
                    currentInterests_1 = person.interests || [];
                    interestsToAdd = newInterests.filter((i) => !currentInterests_1.includes(i));
                    if (!(interestsToAdd.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, db_1.db.person.update({
                            where: { id: person.id },
                            data: { interests: { push: interestsToAdd } },
                        })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 11];
                case 7:
                    validFields = [
                        "namePhonetic",
                        "nickname",
                        "nationality",
                        "occupation",
                        "howWeMet",
                        "notes",
                        "email",
                        "phoneNumber",
                        "website",
                    ];
                    if (!validFields.includes(field)) return [3 /*break*/, 9];
                    return [4 /*yield*/, db_1.db.person.update({
                            where: { id: person.id },
                            data: (_a = {}, _a[field] = valueStr, _a),
                        })];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 9:
                    if (!(field === "birthday")) return [3 /*break*/, 11];
                    date = new Date(valueStr);
                    if (Number.isNaN(date.getTime())) return [3 /*break*/, 11];
                    return [4 /*yield*/, db_1.db.person.update({
                            where: { id: person.id },
                            data: { birthday: date },
                        })];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 18];
                case 12:
                    if (!(suggestion.type === "ADD_RELATIONSHIP")) return [3 /*break*/, 18];
                    relatedPersonId = suggestion.relatedPersonId;
                    relationshipType = suggestion.relationshipType || "related";
                    if (!relatedPersonId) return [3 /*break*/, 17];
                    return [4 /*yield*/, db_1.db.person.findUnique({
                            where: { id: relatedPersonId, userId: userId },
                        })];
                case 13:
                    otherPerson = _b.sent();
                    if (!otherPerson) return [3 /*break*/, 15];
                    return [4 /*yield*/, db_1.db.relationship.create({
                            data: {
                                userId: userId,
                                fromPersonId: person.id,
                                toPersonId: otherPerson.id,
                                type: relationshipType,
                            },
                        })];
                case 14:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 15:
                    console.warn("Cannot apply relationship: Related Person ID '".concat(relatedPersonId, "' not found."));
                    _b.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    console.warn("Cannot apply relationship: Missing relatedPersonId in suggestion");
                    _b.label = 18;
                case 18: return [4 /*yield*/, db_1.db.suggestion.update({
                        where: { id: suggestionId },
                        data: { status: "ACCEPTED" },
                    })];
                case 19:
                    _b.sent();
                    (0, cache_1.revalidatePath)("/people/".concat(suggestion.personId));
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function getSuggestions(personId) {
    return __awaiter(this, void 0, void 0, function () {
        var userId;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    userId = (_a.sent()).userId;
                    return [2 /*return*/, db_1.db.suggestion.findMany({
                            where: { personId: personId, userId: userId, status: "PENDING" },
                            include: { relatedPerson: true },
                            orderBy: { createdAt: "desc" },
                        })];
            }
        });
    });
}
