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
exports.extractEntitiesFromText = extractEntitiesFromText;
var headers_1 = require("next/headers");
var server_1 = require("next-intl/server");
var zod_1 = require("zod");
var auth_1 = require("#lib/auth");
var dal_1 = require("#lib/dal");
var llm_1 = require("#lib/llm");
// Schema for extracted entities
var matchedPersonSchema = zod_1.z.object({
    name: zod_1.z.string(), // Full name from database
    mentionedAs: zod_1.z.string(), // How they were mentioned in text
    confidence: zod_1.z.number().min(0).max(1),
});
var newPersonSchema = zod_1.z.object({
    name: zod_1.z.string(), // Name as mentioned in text
    confidence: zod_1.z.number().min(0).max(1),
});
var extractedLocationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
});
var entityExtractionSchema = zod_1.z.object({
    matchedPeople: zod_1.z.array(matchedPersonSchema),
    newPeople: zod_1.z.array(newPersonSchema),
    locations: zod_1.z.array(extractedLocationSchema),
});
/**
 * Extract people and locations from diary text using AI
 */
function extractEntitiesFromText(text, userLat, userLng) {
    return __awaiter(this, void 0, void 0, function () {
        var existingPeople_1, peopleContext, systemPrompt, validated, matchedPeople, newPeople, processedPeople, processedLocations, error_1;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    if (!text.trim()) {
                        return [2 /*return*/, { people: [], locations: [] }];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    return [4 /*yield*/, (0, dal_1.getSimplePeopleList)()];
                case 3:
                    existingPeople_1 = _a.sent();
                    peopleContext = existingPeople_1.length > 0
                        ? "\n\n###EXISTING PEOPLE IN DATABASE###\n".concat(existingPeople_1
                            .map((p) => "- ".concat(p.name).concat(p.nickname ? " (nickname: ".concat(p.nickname, ")") : ""))
                            .join("\n"))
                        : "";
                    systemPrompt = "YOU ARE AN EXPERT AI ANALYST FOR DIARY ENTRIES. YOUR TASK IS TO EXTRACT PEOPLE AND LOCATIONS WITH HIGH PRECISION, FOCUSING ONLY ON REAL-WORLD INTERACTIONS AND VISITS.\n\n### STRICT FILTERING RULES (CRITICAL) ###\n\n1. **PHYSICAL PRESENCE ONLY**:\n   - ONLY extract locations where the author was *physically present* during the entry's timeframe.\n   - **MUST EXCLUDE** locations mentioned in:\n     - TV, movies, news, sports broadcasts (e.g., \"Watched the F1 in Abu Dhabi\" \u2192 IGNORE \"Abu Dhabi\").\n     - Books, dreams, thoughts, or future plans not yet realized.\n     - General references (e.g., \"The weather in London is bad\" \u2192 IGNORE \"London\" if user is not there).\n\n2. **PERSONAL CONNECTIONS ONLY**:\n   - ONLY extract people the author knows personally or interacted with directly.\n   - **MUST EXCLUDE** celebrities, athletes, or public figures mentioned in passing or viewed on screens.\n   - *Exception*: Extract them ONLY if the author explicitly describes a direct, two-way interaction (e.g., \"I shook hands with...\").\n\n3. **AMBIGUITY & NICKNAMES**:\n   - **PRIORITIZE NICKNAMES**: If a mentioned name matches multiple existing people (e.g. \"James\" matches \"James Smith\" and \"James Doe\"):\n     - **PREFER** the person who explicitly has that **nickname** listed in the database, as this implies a closer relationship.\n     - Example: If DB has \"James Smith (nickname: James)\" and \"James Doe\", and text says \"James\", map to \"James Smith\".\n\n4. **SPECIFICITY & FORMATTING**:\n   - **EXCLUDE** broad regions (\"Japan\", \"Europe\") and generic places (\"home\", \"work\", \"gym\", \"restaurant\").\n   - **EXTRACT** specific venues (\"Starbucks Shibuya\", \"Joe's Gym\").\n   - Keep compound names together (\"Disney Land Tokyo\" -> One location).\n\n### DATA STRUCTURE ###\n\n1. **matchedPeople**:\n   - People mentioned who match the \"EXISTING PEOPLE\" list below.\n   - Fields: \"name\" (from DB), \"mentionedAs\" (from text), \"confidence\" (0.9=exact, 0.7=likely).\n\n2. **newPeople**:\n   - Other personally known people mentioned.\n   - Fields: \"name\", \"confidence\".\n\n3. **locations**:\n   - Specific visited places.\n   - Fields: \"name\", \"confidence\".\n".concat(peopleContext);
                    return [4 /*yield*/, (0, llm_1.generateJSON)(text, entityExtractionSchema, systemPrompt)];
                case 4:
                    validated = _a.sent();
                    console.log("AI extracted entities:", validated);
                    matchedPeople = validated.matchedPeople.map((person) => {
                        var existingPerson = existingPeople_1.find((p) => p.name.toLowerCase() === person.name.toLowerCase());
                        return {
                            name: person.mentionedAs, // Use how they were mentioned
                            confidence: person.confidence,
                            existingPerson: existingPerson || undefined,
                        };
                    });
                    newPeople = validated.newPeople.map((person) => ({
                        name: person.name,
                        confidence: person.confidence,
                        existingPerson: undefined,
                    }));
                    processedPeople = __spreadArray(__spreadArray([], matchedPeople, true), newPeople, true);
                    return [4 /*yield*/, Promise.all(validated.locations.map((location) => __awaiter(this, void 0, void 0, function () {
                            var googlePlaceResult, headersList, latitude, longitude, country, locale, url, response, data, place, error_2;
                            var _a, _b;
                            return __generator(this, (_c) => {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 5, , 6]);
                                        // Check if we have the API key
                                        if (!process.env.GOOGLE_MAPS_API_KEY) {
                                            console.warn("Google Maps API key not configured, skipping location geocoding");
                                            return [2 /*return*/, {
                                                    name: location.name,
                                                    confidence: location.confidence,
                                                    googlePlaceResult: undefined,
                                                }];
                                        }
                                        return [4 /*yield*/, (0, headers_1.headers)()];
                                    case 1:
                                        headersList = _c.sent();
                                        latitude = userLat || headersList.get("x-vercel-ip-latitude");
                                        longitude = userLng || headersList.get("x-vercel-ip-longitude");
                                        country = headersList.get("x-vercel-ip-country");
                                        return [4 /*yield*/, (0, server_1.getLocale)()];
                                    case 2:
                                        locale = _c.sent();
                                        url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=".concat(encodeURIComponent(location.name), "&inputtype=textquery&fields=place_id,name,geometry&language=").concat(locale, "&key=").concat(process.env.GOOGLE_MAPS_API_KEY);
                                        // Add location bias if available
                                        if (latitude && longitude) {
                                            url += "&locationbias=circle:50000@".concat(latitude, ",").concat(longitude);
                                        }
                                        else if (country) {
                                            url += "&region=".concat(country.toLowerCase());
                                        }
                                        console.log("Geocoding request for:", location.name, {
                                            hasLocationBias: !!(latitude && longitude),
                                            hasRegion: !!country,
                                            language: locale,
                                        });
                                        return [4 /*yield*/, fetch(url)];
                                    case 3:
                                        response = _c.sent();
                                        // Check if the response is ok
                                        if (!response.ok) {
                                            console.error("Google Places API HTTP error:", response.status, response.statusText);
                                            return [2 /*return*/, {
                                                    name: location.name,
                                                    confidence: location.confidence,
                                                    googlePlaceResult: undefined,
                                                }];
                                        }
                                        return [4 /*yield*/, response.json()];
                                    case 4:
                                        data = (_c.sent());
                                        console.log("Geocoding response:", {
                                            status: data.status,
                                            candidatesCount: ((_a = data.candidates) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                            error: data.error_message,
                                        });
                                        if ((_b = data.candidates) === null || _b === void 0 ? void 0 : _b[0]) {
                                            place = data.candidates[0];
                                            googlePlaceResult = {
                                                placeId: place.place_id,
                                                name: place.name,
                                                lat: place.geometry.location.lat,
                                                lng: place.geometry.location.lng,
                                            };
                                            console.log("Found location match:", googlePlaceResult);
                                        }
                                        else {
                                            console.log("No location candidates found for:", location.name);
                                        }
                                        return [3 /*break*/, 6];
                                    case 5:
                                        error_2 = _c.sent();
                                        console.error("Error geocoding location:", error_2);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/, {
                                            name: location.name,
                                            confidence: location.confidence,
                                            googlePlaceResult: googlePlaceResult,
                                        }];
                                }
                            });
                        })))];
                case 5:
                    processedLocations = _a.sent();
                    console.log("Final processed results:", {
                        matchedPeopleCount: matchedPeople.length,
                        newPeopleCount: newPeople.length,
                        locationsCount: processedLocations.length,
                        matchedPeople: matchedPeople.map((p) => ({
                            name: p.name,
                            confidence: p.confidence,
                            hasExisting: !!p.existingPerson,
                        })),
                        newPeople: newPeople.map((p) => ({
                            name: p.name,
                            confidence: p.confidence,
                        })),
                        locations: processedLocations.map((l) => ({
                            name: l.name,
                            confidence: l.confidence,
                            hasGooglePlace: !!l.googlePlaceResult,
                        })),
                    });
                    return [2 /*return*/, {
                            people: processedPeople,
                            locations: processedLocations,
                        }];
                case 6:
                    error_1 = _a.sent();
                    console.error("Entity extraction error:", error_1);
                    throw new Error("Failed to extract entities from text");
                case 7: return [2 /*return*/];
            }
        });
    });
}
