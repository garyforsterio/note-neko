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
exports.createPersonAction = createPersonAction;
exports.updatePersonAction = updatePersonAction;
exports.deletePersonAction = deletePersonAction;
exports.createPersonWithoutRedirectAction = createPersonWithoutRedirectAction;
var zod_1 = require("@conform-to/zod");
var Sentry = require("@sentry/nextjs");
var server_1 = require("next-intl/server");
var navigation_1 = require("#i18n/navigation");
var auth_1 = require("#lib/auth");
var dal_1 = require("#lib/dal");
var server_2 = require("#lib/i18n/server");
var people_1 = require("#schema/people");
function createPersonAction(_prevState, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, submission, interests, birthday, error_1, locale;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 2:
                    t = _a.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: people_1.personSchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    interests = submission.value.interests
                        ? submission.value.interests
                            .split(",")
                            .map((i) => i.trim())
                            .filter(Boolean)
                        : [];
                    birthday = submission.value.birthday
                        ? new Date(submission.value.birthday)
                        : null;
                    return [4 /*yield*/, (0, dal_1.createPerson)({
                            name: submission.value.name,
                            namePhonetic: submission.value.namePhonetic || null,
                            nickname: submission.value.nickname || null,
                            nationality: submission.value.nationality || null,
                            occupation: submission.value.occupation || null,
                            email: submission.value.email || null,
                            phoneNumber: submission.value.phoneNumber || null,
                            website: submission.value.website || null,
                            birthday: birthday,
                            howWeMet: submission.value.howWeMet || null,
                            interests: interests,
                            notes: submission.value.notes || null,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    Sentry.captureException(error_1);
                    return [2 /*return*/, submission.reply({
                            formErrors: [t("error.createFailed")],
                        })];
                case 6: return [4 /*yield*/, (0, server_1.getLocale)()];
                case 7:
                    locale = _a.sent();
                    (0, navigation_1.redirect)({ href: "/people", locale: locale });
                    return [2 /*return*/];
            }
        });
    });
}
function updatePersonAction(_prevState, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, submission, interests, birthday, error_2, locale;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 2:
                    t = _a.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: people_1.personSchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    if (!submission.value.id) {
                        return [2 /*return*/, submission.reply({
                                formErrors: ["Person ID is required for update"],
                            })];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    interests = submission.value.interests
                        ? submission.value.interests
                            .split(",")
                            .map((i) => i.trim())
                            .filter(Boolean)
                        : [];
                    birthday = submission.value.birthday
                        ? new Date(submission.value.birthday)
                        : null;
                    return [4 /*yield*/, (0, dal_1.updatePerson)(submission.value.id, {
                            name: submission.value.name,
                            namePhonetic: submission.value.namePhonetic || null,
                            nickname: submission.value.nickname || null,
                            nationality: submission.value.nationality || null,
                            occupation: submission.value.occupation || null,
                            email: submission.value.email || null,
                            phoneNumber: submission.value.phoneNumber || null,
                            website: submission.value.website || null,
                            birthday: birthday,
                            howWeMet: submission.value.howWeMet || null,
                            interests: interests,
                            notes: submission.value.notes || null,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    Sentry.captureException(error_2);
                    return [2 /*return*/, submission.reply({
                            formErrors: [t("error.updateFailed")],
                        })];
                case 6: return [4 /*yield*/, (0, server_1.getLocale)()];
                case 7:
                    locale = _a.sent();
                    (0, navigation_1.redirect)({ href: "/people", locale: locale });
                    return [2 /*return*/];
            }
        });
    });
}
function deletePersonAction(_prevState, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, submission, error_3, locale;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 2:
                    t = _a.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: people_1.deletePersonSchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, dal_1.deletePerson)(submission.value.id)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    Sentry.captureException(error_3);
                    return [2 /*return*/, submission.reply({
                            formErrors: [t("error.deleteFailed")],
                        })];
                case 6: return [4 /*yield*/, (0, server_1.getLocale)()];
                case 7:
                    locale = _a.sent();
                    (0, navigation_1.redirect)({ href: "/people", locale: locale });
                    return [2 /*return*/];
            }
        });
    });
}
function createPersonWithoutRedirectAction(name) {
    return __awaiter(this, void 0, void 0, function () {
        var t, person, error_4;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 2:
                    t = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, dal_1.createPerson)({
                            name: name,
                            namePhonetic: null,
                            nickname: null,
                            nationality: null,
                            occupation: null,
                            email: null,
                            phoneNumber: null,
                            address: null,
                            website: null,
                            birthday: null,
                            howWeMet: null,
                            interests: [],
                            notes: null,
                        })];
                case 4:
                    person = _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            data: {
                                id: person.id,
                                name: person.name,
                            },
                        }];
                case 5:
                    error_4 = _a.sent();
                    Sentry.captureException(error_4);
                    return [2 /*return*/, {
                            success: false,
                            error: t("error.createFailed"),
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
