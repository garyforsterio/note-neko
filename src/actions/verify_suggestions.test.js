
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
var vitest_1 = require("vitest");
// Skip integration tests if DATABASE_URL is not set
var skipIntegrationTests = !process.env.DATABASE_URL;
// Dynamic import to avoid PrismaClient initialization errors when DATABASE_URL is not set
var db = (skipIntegrationTests
    ? { db: null }
    : await Promise.resolve().then(() => require("#lib/db"))).db;
var _a = skipIntegrationTests
    ? {
        generatePersonSuggestions: null,
        resolveSuggestion: null,
    }
    : await Promise.resolve().then(() => require("./suggestions")), generatePersonSuggestions = _a.generatePersonSuggestions, resolveSuggestion = _a.resolveSuggestion;
var TEST_USER_ID = "test-user-".concat(Date.now());
// Mock requireAuth
vitest_1.vi.mock("#lib/auth", () => ({
    requireAuth: () => __awaiter(void 0, void 0, void 0, function () { return __generator(this, (_a) => [2 /*return*/, ({ userId: TEST_USER_ID })]); }),
}));
// Mock revalidatePath to avoid next cache errors
vitest_1.vi.mock("next/cache", () => ({
    revalidatePath: vitest_1.vi.fn(),
}));
// Mock LLM to return deterministic result
vitest_1.vi.mock("#lib/llm", () => ({
    generateJSON: () => __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, (_a) => [2 /*return*/, ({
                    suggestions: [
                        {
                            type: "ADD_RELATIONSHIP",
                            relatedPersonId: "person-b-id",
                            relationshipType: "friend",
                            reasoning: "They said they became friends.",
                        },
                    ],
                })]);
    }),
}));
vitest_1.describe.skipIf(skipIntegrationTests)("Suggestions Logic", () => {
    var userId = TEST_USER_ID;
    var userEmail = "test-".concat(Date.now(), "@example.com");
    var personAId;
    var personBId;
    (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function () {
        var personA, personB, diary;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: 
                // Setup
                // Create User
                return [4 /*yield*/, db.user.upsert({
                        where: { id: userId },
                        update: {},
                        create: { id: userId, email: userEmail, passwordHash: "hash" },
                    })];
                case 1:
                    // Setup
                    // Create User
                    _a.sent();
                    return [4 /*yield*/, db.person.create({
                            data: { userId: userId, name: "Person A" },
                        })];
                case 2:
                    personA = _a.sent();
                    personAId = personA.id;
                    return [4 /*yield*/, db.person.upsert({
                            where: { id: "person-b-id" },
                            update: { userId: userId, name: "Person B" },
                            create: { id: "person-b-id", userId: userId, name: "Person B" },
                        })];
                case 3:
                    personB = _a.sent();
                    personBId = personB.id;
                    return [4 /*yield*/, db.diaryEntry.create({
                            data: { userId: userId, content: "Met [person:".concat(personBId, "]"), date: new Date() },
                        })];
                case 4:
                    diary = _a.sent();
                    return [4 /*yield*/, db.conversation.create({
                            data: {
                                userId: userId,
                                diaryEntryId: diary.id,
                                personId: personAId,
                                content: "Met [person:".concat(personBId, "]"),
                            },
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: 
                // Cleanup
                return [4 /*yield*/, db.relationship.deleteMany({ where: { userId: userId } })];
                case 1:
                    // Cleanup
                    _a.sent();
                    return [4 /*yield*/, db.suggestion.deleteMany({ where: { userId: userId } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.conversation.deleteMany({ where: { userId: userId } })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.diaryEntry.deleteMany({ where: { userId: userId } })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.person.deleteMany({ where: { userId: userId } })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.user.delete({ where: { id: userId } }).catch(() => { })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }));
    (0, vitest_1.it)("should generate suggestions with relatedPersonId", () => __awaiter(void 0, void 0, void 0, function () {
        var suggestions;
        var _a, _b, _c;
        return __generator(this, (_d) => {
            switch (_d.label) {
                case 0: return [4 /*yield*/, generatePersonSuggestions(personAId)];
                case 1:
                    suggestions = _d.sent();
                    (0, vitest_1.expect)(suggestions).toHaveLength(1);
                    (0, vitest_1.expect)((_a = suggestions[0]) === null || _a === void 0 ? void 0 : _a.type).toBe("ADD_RELATIONSHIP");
                    (0, vitest_1.expect)((_b = suggestions[0]) === null || _b === void 0 ? void 0 : _b.relatedPersonId).toBe(personBId);
                    (0, vitest_1.expect)((_c = suggestions[0]) === null || _c === void 0 ? void 0 : _c.status).toBe("PENDING");
                    return [2 /*return*/];
            }
        });
    }));
    (0, vitest_1.it)("should resolve suggestion and create relationship", () => __awaiter(void 0, void 0, void 0, function () {
        var suggestions, suggestion, rel, updatedSuggestion;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generatePersonSuggestions(personAId)];
                case 1:
                    suggestions = _a.sent();
                    suggestion = suggestions[0];
                    if (!suggestion)
                        throw new Error("No suggestion found");
                    return [4 /*yield*/, resolveSuggestion(suggestion.id, true)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.relationship.findFirst({
                            where: { fromPersonId: personAId, toPersonId: personBId },
                        })];
                case 3:
                    rel = _a.sent();
                    (0, vitest_1.expect)(rel).toBeDefined();
                    (0, vitest_1.expect)(rel === null || rel === void 0 ? void 0 : rel.type).toBe("friend");
                    return [4 /*yield*/, db.suggestion.findUnique({
                            where: { id: suggestion.id },
                        })];
                case 4:
                    updatedSuggestion = _a.sent();
                    (0, vitest_1.expect)(updatedSuggestion === null || updatedSuggestion === void 0 ? void 0 : updatedSuggestion.status).toBe("ACCEPTED");
                    return [2 /*return*/];
            }
        });
    }));
});
