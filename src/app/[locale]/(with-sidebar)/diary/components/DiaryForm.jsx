"use client";

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
exports.default = DiaryForm;
var react_1 = require("@conform-to/react");
var zod_1 = require("@conform-to/zod");
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_2 = require("react");
var react_day_picker_1 = require("react-day-picker");
var diary_1 = require("#actions/diary");
var ErrorMessage_1 = require("#components/ErrorMessage");
var useUserLocation_1 = require("#hooks/useUserLocation");
var navigation_1 = require("#i18n/navigation");
var diary_2 = require("#lib/utils/diary");
var diary_3 = require("#schema/diary");
var WeatherWidget_1 = require("./WeatherWidget");
require("react-day-picker/style.css");
function getLocalDateString(date) {
    var localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    var formattedDate = localDate.toISOString().split("T")[0];
    return formattedDate;
}
function DiaryForm(_a) {
    var initialDefaultLocation = _a.initialDefaultLocation, initialDate = _a.initialDate;
    var t = (0, next_intl_1.useTranslations)();
    var router = (0, navigation_1.useRouter)();
    var textareaRef = (0, react_2.useRef)(null);
    var _b = (0, react_2.useState)(initialDate ? (0, date_fns_1.parseISO)(initialDate) : new Date()), selectedDate = _b[0], setSelectedDate = _b[1];
    var _c = (0, react_2.useState)(false), isCalendarOpen = _c[0], setIsCalendarOpen = _c[1];
    var _d = (0, react_2.useState)(null), weather = _d[0], setWeather = _d[1];
    var _e = (0, useUserLocation_1.useUserLocation)(), browserGeolocation = _e.location, requestLocation = _e.requestLocation;
    var locationToSubmit = (0, react_2.useMemo)(() => {
        if (browserGeolocation) {
            return {
                latitude: browserGeolocation.latitude,
                longitude: browserGeolocation.longitude,
            };
        }
        if (initialDefaultLocation) {
            return {
                latitude: initialDefaultLocation.lat,
                longitude: initialDefaultLocation.lng,
                placeId: initialDefaultLocation.placeId,
                name: initialDefaultLocation.name,
            };
        }
        return null;
    }, [browserGeolocation, initialDefaultLocation]);
    var locationDisplayString = (0, react_2.useMemo)(() => {
        if (browserGeolocation) {
            return t("diary.currentBrowserLocation");
        }
        if (initialDefaultLocation) {
            return t("diary.defaultLocation", {
                locationName: initialDefaultLocation.name,
            });
        }
        return null;
    }, [browserGeolocation, initialDefaultLocation, t]);
    var _f = (0, react_2.useActionState)(diary_1.createDiaryEntryAction, undefined), lastResult = _f[0], action = _f[1], isPending = _f[2];
    var _g = (0, react_1.useForm)({
        lastResult: lastResult,
        onValidate: (_a) => {
            var formData = _a.formData;
            return (0, zod_1.parseWithZod)(formData, { schema: diary_3.diaryEntrySchema });
        },
        constraint: (0, zod_1.getZodConstraint)(diary_3.diaryEntrySchema),
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        defaultValue: {
            date: initialDate || getLocalDateString(new Date()),
        },
    }), form = _g[0], fields = _g[1];
    var nextDayStr = initialDate ? (0, diary_2.getNextDayString)(initialDate) : undefined;
    // Fetch weather data when date or location changes
    (0, react_2.useEffect)(() => {
        var fetchWeather = () => __awaiter(this, void 0, void 0, function () {
            var weatherData;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        if (!locationToSubmit) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, diary_1.getWeatherAction)(locationToSubmit.latitude, locationToSubmit.longitude, selectedDate)];
                    case 1:
                        weatherData = _a.sent();
                        setWeather(weatherData);
                        return [3 /*break*/, 3];
                    case 2:
                        setWeather(null);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
        fetchWeather();
    }, [selectedDate, locationToSubmit]);
    var handleDateSelect = (date) => {
        if (date) {
            setSelectedDate(date);
            setIsCalendarOpen(false);
        }
    };
    return (<form className="space-y-6 max-w-4xl mx-auto" {...(0, react_1.getFormProps)(form)} action={action}>
			<ErrorMessage_1.default errors={form.errors}/>
			{nextDayStr && <input type="hidden" name="nextDay" value={nextDayStr}/>}

			<input type="hidden" name={fields.date.name} value={(0, date_fns_1.format)(selectedDate, "yyyy-MM-dd")} id={fields.date.id}/>

			{locationToSubmit && (<input type="hidden" name="locationData" value={JSON.stringify(locationToSubmit)}/>)}

			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
				<div>
					<h2 className="text-4xl font-bold text-gray-900 tracking-tight">
						{(0, date_fns_1.format)(selectedDate, "EEEE")}
					</h2>
					<div className="flex items-center gap-3 mt-2 relative">
						<span className="text-xl text-gray-500 font-medium">
							{(0, date_fns_1.format)(selectedDate, "d MMMM yyyy")}
						</span>
						<button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer" aria-label="Change date">
							<lucide_react_1.Calendar size={20}/>
						</button>

						{isCalendarOpen && (<>
								<div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)} onKeyUp={(event) => {
                if (event.key === "Escape") {
                    setIsCalendarOpen(false);
                }
            }} role="presentation" aria-hidden="true"/>
								<div className="absolute top-full left-0 mt-4 z-50 bg-white border border-gray-100 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
									<react_day_picker_1.DayPicker mode="single" selected={selectedDate} onSelect={handleDateSelect} showOutsideDays classNames={{
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-gray-900",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent hover:opacity-100 border border-gray-200 hover:bg-gray-50 p-0 opacity-50 rounded-md transition-all flex items-center justify-center cursor-pointer",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors cursor-pointer",
                day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white !rounded-md",
                day_today: "bg-gray-100 text-gray-900 font-bold",
                day_outside: "text-gray-300 opacity-50",
                day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
                day_hidden: "invisible",
            }}/>
								</div>
							</>)}
					</div>

					<div className="flex items-center gap-2 mt-3 text-sm h-6">
						<lucide_react_1.MapPin size={14} className={browserGeolocation ? "text-blue-500" : "text-gray-400"}/>
						{locationDisplayString ? (<div className="flex items-center gap-2">
								<span className="text-gray-600 font-medium">
									{locationDisplayString}
								</span>
								<navigation_1.Link href="/settings/profile" target="_blank" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full transition-colors cursor-pointer">
									Edit
								</navigation_1.Link>
							</div>) : (<button type="button" onClick={requestLocation} className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-600 transition-all cursor-pointer">
								{t("diary.enableBrowserLocation")}
							</button>)}

						{!browserGeolocation && !initialDefaultLocation && (<navigation_1.Link href="/settings/profile" className="text-gray-400 hover:text-gray-600 text-xs ml-2">
								({t("settings.navigation.profile")})
							</navigation_1.Link>)}
					</div>
				</div>

				<WeatherWidget_1.WeatherWidget weather={weather}/>
			</div>

			<div>
				<label htmlFor={fields.content.id} className="sr-only">
					{t("diary.content")}
				</label>
				<textarea {...(0, react_1.getTextareaProps)(fields.content)} ref={textareaRef} rows={12} 
    // biome-ignore lint/a11y/noAutofocus: only field
    autoFocus className="w-full p-6 text-lg text-gray-700 bg-gray-50/50 border-0 rounded-xl focus:outline-none focus:ring-0 focus:bg-white transition-colors placeholder:text-gray-300 resize-none shadow-inner" placeholder={t("diary.contentPlaceholder")}/>
				<div className="mt-3 flex items-center justify-between text-xs text-gray-400 px-2">
					<p>{t("diary.aiProcessingNote")}</p>
					<span className="opacity-50">{(0, date_fns_1.format)(selectedDate, "yyyy")}</span>
				</div>
			</div>

			<div className="flex justify-end space-x-4 pt-4">
				<button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer" disabled={isPending}>
					{t("common.cancel")}
				</button>
				<button type="submit" disabled={isPending || !form.valid} className="px-8 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
					{isPending && (<lucide_react_1.LoaderCircle className="animate-spin h-4 w-4 text-white"/>)}
					{isPending ? t("diary.analyzing") : t("common.create")}
				</button>
			</div>
		</form>);
}
