
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
exports.DiaryEntry = DiaryEntry;
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var server_1 = require("next-intl/server");
var DiaryContent_1 = require("#components/DiaryContent");
var navigation_1 = require("#i18n/navigation");
var server_2 = require("#lib/i18n/server");
var weather_1 = require("#lib/utils/weather");
var DeleteButton_1 = require("./DeleteButton");
var DiaryLocations_1 = require("./DiaryLocations");
var DiaryMentions_1 = require("./DiaryMentions");
var ShareButton_1 = require("./ShareButton");
function DiaryEntry(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var t, locale, date, location, weather, _c, WeatherIcon;
        var _d, _e;
        var entry = _b.entry;
        return __generator(this, (_f) => {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 1:
                    t = _f.sent();
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 2:
                    locale = _f.sent();
                    date = new Date(entry.date);
                    location = entry.locations.length > 0 ? entry.locations[0] : null;
                    if (!location) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, weather_1.getHistoricWeather)(location.lat, location.lng, date)];
                case 3:
                    _c = _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = null;
                    _f.label = 5;
                case 5:
                    weather = _c;
                    WeatherIcon = (0, weather_1.getWeatherIcon)((_d = weather === null || weather === void 0 ? void 0 : weather.weatherCode) !== null && _d !== void 0 ? _d : null);
                    return [2 /*return*/, (<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
				<div>
					<navigation_1.Link href={"/diary/".concat(entry.id)} className="group">
						<h2 className="text-4xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
							{(0, date_fns_1.format)(date, "EEEE")}
						</h2>
					</navigation_1.Link>
					<div className="flex items-center gap-3 mt-2 relative">
						<span className="text-xl text-gray-500 font-medium">
							{(0, date_fns_1.format)(date, "d MMMM yyyy")}
						</span>
						<div className="p-2 bg-gray-50 rounded-full text-gray-400">
							<lucide_react_1.Calendar size={20}/>
						</div>
					</div>

					<div className="flex items-center gap-2 mt-3 text-sm h-6">
						<lucide_react_1.MapPin size={14} className={entry.locations.length > 0 ? "text-blue-500" : "text-gray-400"}/>
						{entry.locations.length > 0 ? (<div className="flex items-center gap-2">
								<span className="text-gray-600 font-medium">
									{(_e = entry.locations[0]) === null || _e === void 0 ? void 0 : _e.name}
									{entry.locations.length > 1 &&
                                    " +".concat(entry.locations.length - 1, " more")}
								</span>
							</div>) : (<span className="text-gray-600 font-medium">
								{t("diary.unknownLocation")}
							</span>)}
					</div>
				</div>

				<div className="flex justify-around text-gray-400 items-center py-4 md:py-0 select-none w-full md:w-auto md:gap-6">
					<div className="flex flex-col items-center gap-1">
						<div className="flex flex-col items-center gap-0.5 text-gray-500">
							<WeatherIcon size={18}/>
							<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
								{(weather === null || weather === void 0 ? void 0 : weather.temperatureMax) && (weather === null || weather === void 0 ? void 0 : weather.temperatureMin)
                                ? "".concat(weather.temperatureMin, "\u00B0C / ").concat(weather.temperatureMax, "\u00B0C")
                                : "--°C"}
							</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
							Weather
						</span>
					</div>
					<div className="hidden md:block w-px bg-gray-200 h-10 self-center"/>
					<div className="flex flex-col items-center gap-1">
						<div className="flex flex-col items-center gap-0.5 text-gray-500">
							<lucide_react_1.Sunrise size={18}/>
							<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
								{(weather === null || weather === void 0 ? void 0 : weather.sunrise) && (weather === null || weather === void 0 ? void 0 : weather.sunset)
                                ? "".concat(weather.sunrise, " - ").concat(weather.sunset)
                                : "--:--"}
							</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
							Sun
						</span>
					</div>
					<div className="hidden md:block w-px bg-gray-200 h-10 self-center"/>
					<div className="flex flex-col items-center gap-1">
						<div className="flex flex-col items-center gap-0.5 text-gray-500">
							<lucide_react_1.Moon size={18}/>
							<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
								{weather ? "".concat(Math.round(weather.moonPhase * 100), "%") : "--%"}
							</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
							Moon
						</span>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="prose max-w-none text-lg text-gray-700 leading-relaxed mb-8">
				<DiaryContent_1.DiaryContent content={entry.content} people={entry.mentions.map((m) => m.person)} locations={entry.locations} locale={locale}/>
			</div>

			{/* Footer/Actions Section */}
			<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
				<div className="flex flex-col gap-3 w-full sm:w-auto">
					<DiaryMentions_1.DiaryMentions mentions={entry.mentions} conversations={entry.conversations}/>
					<DiaryLocations_1.DiaryLocations locations={entry.locations}/>
				</div>

				<div className="flex items-center gap-1 shrink-0">
					<ShareButton_1.default entry={entry} locale={locale}/>
					<DeleteButton_1.default id={entry.id}/>
				</div>
			</div>
		</div>)];
            }
        });
    });
}
