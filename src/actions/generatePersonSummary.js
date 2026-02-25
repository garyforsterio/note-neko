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
exports.generatePersonSummary = generatePersonSummary;
var server_1 = require("next-intl/server");
var zod_1 = require("zod");
var auth_1 = require("#lib/auth");
var dal_1 = require("#lib/dal");
var llm_1 = require("#lib/llm");
var personSummarySchema = zod_1.z.object({
    summary: zod_1.z.string(),
    conversationTopics: zod_1.z.array(zod_1.z.string()),
    activitySuggestions: zod_1.z.array(zod_1.z.string()),
    suggestedInterests: zod_1.z.array(zod_1.z.string()),
    relationshipTips: zod_1.z.array(zod_1.z.string()),
});
/**
 * Generate an AI summary of a person based on their profile and diary mentions
 */
function generatePersonSummary(personId) {
    return __awaiter(this, void 0, void 0, function () {
        var person, hasProfileData, hasDiaryData, locale, profileContext, diaryContext, fullContext, systemPrompt, validated, error_1;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, dal_1.getPerson)(personId)];
                case 2:
                    person = _a.sent();
                    if (!person) {
                        throw new Error("Person not found");
                    }
                    hasProfileData = !!(person.howWeMet ||
                        person.interests.length > 0 ||
                        person.notes);
                    hasDiaryData = person.mentions.length > 0;
                    if (!hasProfileData && !hasDiaryData) {
                        return [2 /*return*/, {
                                summary: "Not enough information available to generate relationship-building suggestions.",
                                conversationTopics: [],
                                activitySuggestions: [],
                                suggestedInterests: [],
                                relationshipTips: [],
                            }];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 4:
                    locale = _a.sent();
                    profileContext = "\nProfile Information:\n- Name: ".concat(person.name).concat(person.nickname ? " (nickname: ".concat(person.nickname, ")") : "", "\n- Birthday: ").concat(person.birthday ? person.birthday.toDateString() : "Not specified", "\n- How we met: ").concat(person.howWeMet || "Not specified", "\n- Interests: ").concat(person.interests.length > 0 ? person.interests.join(", ") : "None specified", "\n- Notes: ").concat(person.notes || "None", "\n- Profile created: ").concat(person.createdAt.toDateString(), "\n");
                    diaryContext = person.mentions.length > 0
                        ? "\n\nDiary Entries (".concat(person.mentions.length, " mentions):\n").concat(person.mentions
                            .map((mention, index) => {
                            var entry = mention.diaryEntry;
                            return "\n".concat(index + 1, ". Date: ").concat(entry.date.toDateString(), "\n   Content: ").concat(entry.content, "\n   Other people mentioned: ").concat(entry.mentions
                                .filter((m) => m.personId !== person.id)
                                .map((m) => m.person.name)
                                .join(", ") || "None", "\n   Locations: ").concat(entry.locations.map((l) => l.name).join(", ") || "None");
                        })
                            .join("\n"), "\n")
                        : "\n\nDiary Entries: No mentions found in diary entries.";
                    fullContext = profileContext + diaryContext;
                    systemPrompt = "YOU ARE A RELATIONSHIP INSIGHTS ASSISTANT. YOUR ROLE IS TO ANALYZE A USER'S DIARY ENTRIES ABOUT SOMEONE THEY KNOW AND PROVIDE PERSONALIZED SUGGESTIONS TO STRENGTHEN THEIR RELATIONSHIP.\n\n###CONTEXT###\n\nThe user keeps a diary documenting their life and interactions with various people. You are analyzing:\n1. Profile information the user has recorded about a specific person\n2. Diary entries where the user mentioned spending time with or observing this person\n\nThe diary entries describe what THE USER did WITH this person, not what the person did independently. Your goal is to help the user deepen their connection based on past interactions.\n\n###INSTRUCTIONS###\n\nRETURN A JSON OBJECT WITH THIS EXACT FORMAT:\n\n{\n  \"summary\": string,\n  \"conversationTopics\": string[],\n  \"activitySuggestions\": string[],\n  \"suggestedInterests\": string[],\n  \"relationshipTips\": string[]\n}\n\n###OUTPUT SPECIFICATIONS###\n\n1. **summary** (2-3 sentences)\n   - Briefly describe this person's personality traits as observed by the user\n   - Note the current relationship dynamic and interaction patterns\n\n2. **conversationTopics** (1-2 items)\n   - Suggest natural conversation starters based on:\n     - Topics they've enjoyed discussing before\n     - Their known interests\n     - Follow-ups to previous interactions\n\n3. **activitySuggestions** (1-2 items)\n   - Recommend specific activities the user could do with this person\n   - Base on successful past experiences or complementary interests\n   - Keep practical and achievable\n\n4. **suggestedInterests** (1-2 items)\n   - New hobbies or interests this person might enjoy\n   - Short labels for display as chips (e.g., \"Photography\", \"Board games\")\n   - Based on their existing preferences\n\n5. **relationshipTips** (1-2 items)\n   - Actionable advice for the user to strengthen the connection\n   - Based on observed interaction patterns\n   - Specific to this individual relationship\n\n###ANALYSIS APPROACH###\n\n1. EXAMINE the diary entries to understand:\n   - How the user and this person typically spend time together\n   - What activities or topics create positive interactions\n   - The person's responses and preferences during past meetings\n\n2. IDENTIFY patterns:\n   - What does this person seem to enjoy?\n   - What conversation topics engage them?\n   - How do they prefer to connect?\n\n3. GENERATE suggestions that:\n   - Build on successful past interactions\n   - Match the person's communication style\n   - Fit the current relationship depth\n\n###GUIDELINES###\n\n- Keep all suggestions concise and actionable\n- Base recommendations on observed data, not assumptions\n- Match the relationship's current level (don't suggest intimate activities for acquaintances)\n- Write in ".concat(locale === "ja" ? "Japanese" : "English", "\n- Focus on what the USER can do to strengthen the connection\n\n###AVOID###\n\n- Generic suggestions without personal context\n- Misinterpreting diary entries as the person's independent actions\n- Overly ambitious or expensive suggestions\n- Lengthy explanations or descriptions\n- Suggestions inappropriate for the relationship level\n\n###EXAMPLE###\n\n**Input:**\n- Profile: Sarah, met at book club, likes mystery novels and coffee\n- Diary entries: \"Had coffee with Sarah, she recommended three new authors\" and \"Sarah and I discussed the latest book club pick for an hour after the meeting\"\n\n**Output:**\n{\n  \"summary\": \"Sarah is passionate about literature and enjoys deep discussions about books. Your conversations flow naturally when focused on reading and literary analysis.\",\n  \"conversationTopics\": [\"The authors she recently recommended\", \"Next book club selection\"],\n  \"activitySuggestions\": [\"Visit a local bookstore together\", \"Attend an author reading event\"],\n  \"suggestedInterests\": [\"Creative writing\", \"Literary podcasts\"],\n  \"relationshipTips\": [\"Ask for her book recommendations regularly\", \"Share interesting literary articles you find\"]\n}");
                    return [4 /*yield*/, (0, llm_1.generateJSON)(fullContext, personSummarySchema, systemPrompt)];
                case 5:
                    validated = _a.sent();
                    console.log("AI generated person summary available");
                    return [2 /*return*/, {
                            summary: validated.summary,
                            conversationTopics: validated.conversationTopics,
                            activitySuggestions: validated.activitySuggestions,
                            suggestedInterests: validated.suggestedInterests,
                            relationshipTips: validated.relationshipTips,
                        }];
                case 6:
                    error_1 = _a.sent();
                    console.error("Person summary generation error:", error_1);
                    throw new Error("Failed to generate person summary");
                case 7: return [2 /*return*/];
            }
        });
    });
}
