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
exports.searchLocationsAction = searchLocationsAction;
var headers_1 = require("next/headers");
var server_1 = require("next-intl/server");
var auth_1 = require("#lib/auth");
function searchLocationsAction(query) {
    return __awaiter(this, void 0, void 0, function () {
        var headersList, latitude, longitude, country, locale, url, response, data, locations, error_1;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    if (!query.trim()) {
                        return [2 /*return*/, []];
                    }
                    if (!process.env.GOOGLE_MAPS_API_KEY) {
                        console.warn("Google Maps API key not configured, skipping location search");
                        return [2 /*return*/, []];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, (0, headers_1.headers)()];
                case 3:
                    headersList = _a.sent();
                    latitude = headersList.get("x-vercel-ip-latitude");
                    longitude = headersList.get("x-vercel-ip-longitude");
                    country = headersList.get("x-vercel-ip-country");
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 4:
                    locale = _a.sent();
                    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=".concat(encodeURIComponent(query.trim()), "&fields=place_id,name,geometry&language=").concat(locale, "&key=").concat(process.env.GOOGLE_MAPS_API_KEY);
                    // Add location bias if available
                    if (latitude && longitude) {
                        url += "&locationbias=circle:50000@".concat(latitude, ",").concat(longitude);
                    }
                    else if (country) {
                        url += "&region=".concat(country.toLowerCase());
                    }
                    console.log("Location search request:", query, {
                        latitude: latitude,
                        longitude: longitude,
                        country: country,
                        locale: locale,
                    });
                    return [4 /*yield*/, fetch(url)];
                case 5:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Google Places API HTTP error:", response.status, response.statusText);
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, response.json()];
                case 6:
                    data = (_a.sent());
                    if (data.status !== "OK") {
                        console.error("Google Places API error:", data.status);
                        return [2 /*return*/, []];
                    }
                    locations = data.results.map((result) => ({
                        name: result.name,
                        placeId: result.place_id,
                        lat: result.geometry.location.lat,
                        lng: result.geometry.location.lng,
                    }));
                    console.log("Found ".concat(locations.length, " locations for query: ").concat(query));
                    return [2 /*return*/, locations];
                case 7:
                    error_1 = _a.sent();
                    console.error("Error searching locations:", error_1);
                    return [2 /*return*/, []];
                case 8: return [2 /*return*/];
            }
        });
    });
}
