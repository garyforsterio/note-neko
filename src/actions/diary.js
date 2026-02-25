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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiaryEntryAction = createDiaryEntryAction;
exports.updateDiaryEntryAction = updateDiaryEntryAction;
exports.deleteDiaryEntryAction = deleteDiaryEntryAction;
exports.getWeatherAction = getWeatherAction;
var zod_1 = require("@conform-to/zod");
var Sentry = require("@sentry/nextjs");
var server_1 = require("next-intl/server");
var zod_2 = require("zod");
var extractEntities_1 = require("#actions/extractEntities");
var navigation_1 = require("#i18n/navigation");
var auth_1 = require("#lib/auth");
var dal_1 = require("#lib/dal");
var server_2 = require("#lib/i18n/server");
var diary_1 = require("#lib/utils/diary");
var weather_1 = require("#lib/utils/weather");
var diary_2 = require("#schema/diary");
/**
 * Escape special regex characters in a string
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}
var LocationDataSchema = zod_2.z
    .object({
    latitude: zod_2.z.coerce.number(),
    longitude: zod_2.z.coerce.number(),
    placeId: zod_2.z.string().optional(),
    name: zod_2.z.string().optional(),
})
    .partial(); // All fields are optional at the top level for flexibility
function createDiaryEntryAction(_prevState, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, locale, submission, entryId, newEntry, locationDataJson, locationData, parsed, userLatForBias, userLngForBias, extractedEntities, mentions, newlyCreatedPeople, _i, _a, person, newPerson, locations, processedContent, entitiesToReplace, _b, _c, person, _d, newlyCreatedPeople_1, newPerson, _e, _f, location_1, _g, entitiesToReplace_1, entity, regex, error_1, nextDay, nextDayParam;
        return __generator(this, (_h) => {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 2:
                    t = _h.sent();
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 3:
                    locale = _h.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: diary_2.diaryEntrySchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    _h.label = 4;
                case 4:
                    _h.trys.push([4, 13, , 14]);
                    return [4 /*yield*/, (0, dal_1.createDiaryEntry)({
                            content: submission.value.content,
                            date: submission.value.date,
                            mentions: [], // Will be populated after AI processing
                            locations: [],
                        })];
                case 5:
                    newEntry = _h.sent();
                    entryId = newEntry.id;
                    locationDataJson = formData.get("locationData");
                    locationData = void 0;
                    if (typeof locationDataJson === "string" && locationDataJson.length > 0) {
                        try {
                            parsed = LocationDataSchema.safeParse(JSON.parse(locationDataJson));
                            if (parsed.success) {
                                locationData = parsed.data;
                            }
                        }
                        catch (error) {
                            console.error("Failed to parse locationData JSON string:", error);
                        }
                    }
                    userLatForBias = void 0;
                    userLngForBias = void 0;
                    if ((locationData === null || locationData === void 0 ? void 0 : locationData.latitude) !== undefined &&
                        (locationData === null || locationData === void 0 ? void 0 : locationData.longitude) !== undefined) {
                        // If only lat/lng is available (e.g., browser geo), use for AI biasing
                        userLatForBias = locationData.latitude;
                        userLngForBias = locationData.longitude;
                    }
                    return [4 /*yield*/, (0, extractEntities_1.extractEntitiesFromText)(submission.value.content, userLatForBias, userLngForBias)];
                case 6:
                    extractedEntities = _h.sent();
                    mentions = [];
                    newlyCreatedPeople = [];
                    _i = 0, _a = extractedEntities.people;
                    _h.label = 7;
                case 7:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    person = _a[_i];
                    if (!person.existingPerson) return [3 /*break*/, 8];
                    // Use existing person
                    mentions.push(person.existingPerson.id);
                    return [3 /*break*/, 10];
                case 8:
                    if (!(person.confidence > 0.7)) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, dal_1.createPerson)({ name: person.name })];
                case 9:
                    newPerson = _h.sent();
                    mentions.push(newPerson.id);
                    // Track newly created people for linking
                    newlyCreatedPeople.push({ name: person.name, id: newPerson.id });
                    _h.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 7];
                case 11:
                    locations = extractedEntities.locations
                        .filter((location) => location.googlePlaceResult && location.confidence > 0.6)
                        .map((location) => location.googlePlaceResult)
                        .filter((place) => place !== undefined)
                        .map((place) => ({
                        name: place.name,
                        placeId: place.placeId,
                        lat: place.lat,
                        lng: place.lng,
                    }));
                    processedContent = submission.value.content;
                    entitiesToReplace = [];
                    // Add person references for matched people
                    for (_b = 0, _c = extractedEntities.people; _b < _c.length; _b++) {
                        person = _c[_b];
                        if (person.existingPerson) {
                            entitiesToReplace.push({
                                searchText: person.name,
                                replacement: "[person:".concat(person.existingPerson.id, "]"),
                                type: "person",
                            });
                        }
                    }
                    // Add person references for newly created people
                    for (_d = 0, newlyCreatedPeople_1 = newlyCreatedPeople; _d < newlyCreatedPeople_1.length; _d++) {
                        newPerson = newlyCreatedPeople_1[_d];
                        entitiesToReplace.push({
                            searchText: newPerson.name,
                            replacement: "[person:".concat(newPerson.id, "]"),
                            type: "person",
                        });
                    }
                    // Add location references for locations with Google Places data
                    for (_e = 0, _f = extractedEntities.locations; _e < _f.length; _e++) {
                        location_1 = _f[_e];
                        if (location_1.googlePlaceResult) {
                            entitiesToReplace.push({
                                searchText: location_1.name,
                                replacement: "[location:".concat(location_1.googlePlaceResult.placeId, "]"),
                                type: "location",
                            });
                        }
                    }
                    // Sort by length (longest first) to prevent nested replacements
                    entitiesToReplace.sort((a, b) => b.searchText.length - a.searchText.length);
                    // Replace each entity, ensuring we don't replace inside existing references
                    for (_g = 0, entitiesToReplace_1 = entitiesToReplace; _g < entitiesToReplace_1.length; _g++) {
                        entity = entitiesToReplace_1[_g];
                        regex = new RegExp("(?<!\\[)\\b".concat(escapeRegex(entity.searchText), "\\b(?!:)"), "gi");
                        processedContent = processedContent.replace(regex, entity.replacement);
                    }
                    // Update the diary entry with processed content and entities
                    return [4 /*yield*/, (0, dal_1.updateDiaryEntry)(entryId, {
                            content: processedContent,
                            mentions: mentions,
                            locations: locations,
                            date: submission.value.date, // Preserve the original date
                        })];
                case 12:
                    // Update the diary entry with processed content and entities
                    _h.sent();
                    return [3 /*break*/, 14];
                case 13:
                    error_1 = _h.sent();
                    Sentry.captureException(error_1);
                    return [2 /*return*/, submission.reply({
                            formErrors: [t("error.createFailed")],
                        })];
                case 14:
                    nextDay = formData.get("nextDay");
                    nextDayParam = nextDay === (0, diary_1.getNextDayString)((0, diary_1.getDateString)(submission.value.date))
                        ? "?nextDay=".concat(nextDay)
                        : "";
                    // Redirect to edit page to allow user to validate extractions
                    // This is outside the try-catch because redirect() throws an error to signal the redirect
                    (0, navigation_1.redirect)({
                        href: "/diary/".concat(entryId).concat(nextDayParam).concat(nextDayParam ? "&" : "?", "mode=edit"),
                        locale: locale,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function updateDiaryEntryAction(_prevState, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, submission, peopleIdsJson, locationsJson, providedPeopleIds, providedLocations, content, personReferences, locationReferences, referencedPersonIds_1, referencedLocationPlaceIds_1, finalPeopleIds, finalLocations, successReply, personContexts, updateEntryId_1, _i, _a, _b, key, value, personId, e_1, error_2;
        return __generator(this, (_c) => {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 2:
                    t = _c.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: diary_2.diaryEntrySchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    if (!submission.value.id) {
                        return [2 /*return*/, submission.reply({
                                formErrors: ["Diary entry ID is required for update"],
                            })];
                    }
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 9, , 10]);
                    peopleIdsJson = formData.get("peopleIds");
                    locationsJson = formData.get("locations");
                    providedPeopleIds = peopleIdsJson ? JSON.parse(peopleIdsJson) : [];
                    providedLocations = locationsJson ? JSON.parse(locationsJson) : [];
                    content = submission.value.content;
                    personReferences = __spreadArray([], content.matchAll(/\[person:([^\]]+)\]/g), true);
                    locationReferences = __spreadArray([], content.matchAll(/\[location:([^\]]+)\]/g), true);
                    referencedPersonIds_1 = personReferences.map((match) => match[1]);
                    referencedLocationPlaceIds_1 = locationReferences.map((match) => match[1]);
                    finalPeopleIds = providedPeopleIds.filter((id) => referencedPersonIds_1.includes(id));
                    finalLocations = providedLocations.filter((location) => referencedLocationPlaceIds_1.includes(location.placeId));
                    // Update diary entry with only referenced entities
                    return [4 /*yield*/, (0, dal_1.updateDiaryEntry)(submission.value.id, {
                            content: submission.value.content,
                            date: submission.value.date,
                            mentions: finalPeopleIds,
                            locations: finalLocations,
                        })];
                case 4:
                    // Update diary entry with only referenced entities
                    _c.sent();
                    successReply = submission.reply({
                        formErrors: [],
                    });
                    personContexts = {};
                    updateEntryId_1 = submission.value.id;
                    for (_i = 0, _a = formData.entries(); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        if (key.startsWith("person-context-") &&
                            typeof value === "string" &&
                            value.trim()) {
                            personId = key.replace("person-context-", "");
                            personContexts[personId] = value.trim();
                        }
                    }
                    if (!(Object.keys(personContexts).length > 0)) return [3 /*break*/, 8];
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, Promise.all(Object.entries(personContexts).map((_a) => {
                            var personId = _a[0], context = _a[1];
                            return (0, dal_1.createConversation)({
                                diaryEntryId: updateEntryId_1, // ID is guaranteed here by validation above
                                personId: personId,
                                content: context,
                            });
                        }))];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _c.sent();
                    console.error("Error creating conversations", e_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, successReply];
                case 9:
                    error_2 = _c.sent();
                    Sentry.captureException(error_2);
                    return [2 /*return*/, submission.reply({
                            formErrors: [t("error.updateFailed")],
                        })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function deleteDiaryEntryAction(_prevState, formData) {
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
                    submission = (0, zod_1.parseWithZod)(formData, { schema: diary_2.deleteDiaryEntrySchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, dal_1.deleteDiaryEntry)(submission.value.id)];
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
                    (0, navigation_1.redirect)({ href: "/diary", locale: locale });
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetch weather data for a given location and date.
 * This server action allows client components to fetch weather data.
 */
function getWeatherAction(lat, lng, date) {
    return __awaiter(this, void 0, void 0, function () {
        var error_4;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, weather_1.getHistoricWeather)(lat, lng, date)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_4 = _a.sent();
                    Sentry.captureException(error_4);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
