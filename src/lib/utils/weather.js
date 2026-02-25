
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
exports.getWeatherIcon = getWeatherIcon;
exports.getHistoricWeather = getHistoricWeather;
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
/**
 * Calculates the moon phase for a given date.
 * Returns a value between 0 and 1.
 * 0 = New Moon
 * 0.25 = First Quarter
 * 0.5 = Full Moon
 * 0.75 = Last Quarter
 */
function getMoonPhase(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 3) {
        year--;
        month += 12;
    }
    ++month;
    var c = 365.25 * year;
    var e = 30.6 * month;
    var jd = c + e + day - 694039.09; // jd is total days elapsed
    jd /= 29.5305882; // divide by the moon cycle
    var b = Math.floor(jd);
    jd -= b; // subtract integer part to leave fractional part
    return jd < 0 ? jd + 1 : jd; // Ensure positive 0-1
}
function getWeatherIcon(code) {
    if (code === null)
        return lucide_react_1.CloudSun; // Default
    switch (code) {
        case 0:
            return lucide_react_1.Sun;
        case 1:
        case 2:
            return lucide_react_1.CloudSun;
        case 3:
            return lucide_react_1.Cloud;
        case 45:
        case 48:
            return lucide_react_1.CloudFog;
        case 51:
        case 53:
        case 55:
            return lucide_react_1.CloudDrizzle;
        case 56:
        case 57:
            return lucide_react_1.CloudHail;
        case 61:
        case 63:
        case 65:
            return lucide_react_1.CloudRain;
        case 66:
        case 67:
            return lucide_react_1.CloudHail;
        case 71:
        case 73:
        case 75:
            return lucide_react_1.CloudSnow;
        case 77:
            return lucide_react_1.CloudSnow;
        case 80:
        case 81:
        case 82:
            return lucide_react_1.CloudRain;
        case 85:
        case 86:
            return lucide_react_1.CloudSnow;
        case 95:
        case 96:
        case 99:
            return lucide_react_1.CloudLightning;
        default:
            return lucide_react_1.CloudSun;
    }
}
function getHistoricWeather(lat, lng, date) {
    return __awaiter(this, void 0, void 0, function () {
        var dateStr, url, response, data, daily, getFirst, sunriseFull, sunsetFull, formatTime, error_1;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    dateStr = (0, date_fns_1.format)(date, "yyyy-MM-dd");
                    url = new URL("https://archive-api.open-meteo.com/v1/archive");
                    url.searchParams.append("latitude", lat.toString());
                    url.searchParams.append("longitude", lng.toString());
                    url.searchParams.append("start_date", dateStr);
                    url.searchParams.append("end_date", dateStr);
                    url.searchParams.append("daily", "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset");
                    url.searchParams.append("timezone", "auto");
                    return [4 /*yield*/, fetch(url.toString(), {
                            // Cache forever since historic data doesn't change
                            cache: "force-cache",
                            next: { tags: ["weather-".concat(lat, "-").concat(lng, "-").concat(dateStr)] },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Failed to fetch weather data: ".concat(response.status, " ").concat(response.statusText));
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
                        return [2 /*return*/, null];
                    }
                    daily = data.daily;
                    getFirst = (arr) => arr && arr.length > 0 && arr[0] !== undefined ? arr[0] : null;
                    sunriseFull = getFirst(daily.sunrise);
                    sunsetFull = getFirst(daily.sunset);
                    formatTime = (isoString) => {
                        var _a;
                        if (!isoString)
                            return null;
                        try {
                            var parts = isoString.split("T");
                            return (_a = parts[1]) !== null && _a !== void 0 ? _a : null;
                        }
                        catch (_e) {
                            return null;
                        }
                    };
                    return [2 /*return*/, {
                            temperatureMax: getFirst(daily.temperature_2m_max),
                            temperatureMin: getFirst(daily.temperature_2m_min),
                            weatherCode: getFirst(daily.weather_code),
                            sunrise: formatTime(sunriseFull),
                            sunset: formatTime(sunsetFull),
                            moonPhase: getMoonPhase(date),
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching weather:", error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
