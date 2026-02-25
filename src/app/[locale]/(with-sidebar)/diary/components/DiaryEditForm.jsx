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
exports.default = DiaryEditForm;
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var react_day_picker_1 = require("react-day-picker");
var diary_1 = require("#actions/diary");
var RefineEditor_1 = require("#components/diary/RefineEditor");
var RewriteEditor_1 = require("#components/diary/RewriteEditor");
var use_toast_1 = require("#hooks/use-toast");
var navigation_2 = require("#i18n/navigation");
require("react-day-picker/style.css");
var DiaryMap_1 = require("./DiaryMap");
function DiaryEditForm(_a) {
    var _b;
    var entry = _a.entry, allPeople = _a.allPeople, googleMapsApiKey = _a.googleMapsApiKey, onCancel = _a.onCancel;
    var t = (0, next_intl_1.useTranslations)();
    var router = (0, navigation_2.useRouter)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var toast = (0, use_toast_1.useToast)().toast;
    var _c = (0, react_1.useTransition)(), isPending = _c[0], startTransition = _c[1];
    var formRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)("refine"), mode = _d[0], setMode = _d[1];
    var _e = (0, react_1.useState)(entry.content), content = _e[0], setContent = _e[1];
    // Initialize date from entry.date
    var _f = (0, react_1.useState)(entry.date ? new Date(entry.date) : new Date()), selectedDate = _f[0], setSelectedDate = _f[1];
    var _g = (0, react_1.useState)(false), isCalendarOpen = _g[0], setIsCalendarOpen = _g[1];
    var _h = (0, react_1.useState)(entry.mentions.map((m) => m.person)), people = _h[0], setPeople = _h[1];
    var _j = (0, react_1.useState)(entry.locations.map((loc) => ({
        name: loc.name,
        placeId: loc.placeId,
        lat: loc.lat,
        lng: loc.lng,
    }))), locations = _j[0], setLocations = _j[1];
    var nextDayParam = searchParams.get("nextDay");
    var handleDateSelect = (date) => {
        if (date) {
            setSelectedDate(date);
            setIsCalendarOpen(false);
        }
    };
    var handleSave = (nextDay) => {
        startTransition(() => __awaiter(this, void 0, void 0, function () {
            var formData, result, _error_1;
            var _a, _b;
            return __generator(this, (_c) => {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        formData = new FormData(formRef.current || undefined);
                        formData.append("id", entry.id);
                        formData.append("content", content);
                        formData.append("date", selectedDate.toISOString());
                        // Add people and locations
                        formData.append("peopleIds", JSON.stringify(people.map((p) => p.id)));
                        formData.append("locations", JSON.stringify(locations));
                        return [4 /*yield*/, (0, diary_1.updateDiaryEntryAction)(undefined, formData)];
                    case 1:
                        result = _c.sent();
                        if ((result === null || result === void 0 ? void 0 : result.status) === "error") {
                            toast({
                                variant: "destructive",
                                title: t("error.updateFailed"),
                                description: ((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b[0]) || t("error.generic"),
                            });
                        }
                        else {
                            toast({
                                title: t("diary.saved"),
                                description: t("diary.entrySaved"),
                            });
                            if (onCancel) {
                                router.refresh();
                                onCancel();
                            }
                            else if (nextDay) {
                                router.push("/diary/new?date=".concat(nextDay));
                            }
                            else {
                                router.push("/diary");
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        _error_1 = _c.sent();
                        toast({
                            variant: "destructive",
                            title: t("error.updateFailed"),
                            description: t("error.generic"),
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }));
    };
    // Determine location display string from the *first* location if available
    var locationDisplayString = locations.length > 0 ? (_b = locations[0]) === null || _b === void 0 ? void 0 : _b.name : null;
    return (<div className="space-y-6 max-w-4xl mx-auto">
			{/* Unified Card Container (Form) */}
			<form ref={formRef} className="bg-white rounded-2xl shadow-sm border border-gray-100" onSubmit={(e) => e.preventDefault()} // Prevent default submission, handled by handleSave
    >
				{/* Map - Media Header Style */}
				{locations.length > 0 && googleMapsApiKey && (<div className="h-[250px] w-full relative group rounded-t-2xl overflow-hidden">
						<DiaryMap_1.default apiKey={googleMapsApiKey} locations={locations} className="w-full h-full"/>
						{/* Overlay gradient */}
						<div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"/>

						{/* Overlay to indicate this is the location context */}
						<div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium text-gray-600 border border-gray-100/50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<lucide_react_1.MapPin size={12} className="text-blue-500"/>
							<span>{t("diary.entryLocation")}</span>
						</div>
					</div>)}

				<div className="p-6 md:p-8 space-y-8">
					{/* Header Section (Date & Weather) */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6 border-gray-100">
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
								<lucide_react_1.MapPin size={14} className={locations.length > 0 ? "text-blue-500" : "text-gray-400"}/>
								{locationDisplayString ? (<div className="flex items-center gap-2">
										<span className="text-gray-600 font-medium">
											{locationDisplayString}
											{locations.length > 1 && " +".concat(locations.length - 1, " more")}
										</span>
									</div>) : (<span className="text-gray-400 italic">
										{t("diary.noLocation")}
									</span>)}
							</div>
						</div>

						<div className="flex gap-6 text-gray-400 py-4 md:py-0 select-none">
							<div className="flex flex-col items-center gap-1">
								<div className="flex items-center gap-2 text-gray-500">
									<lucide_react_1.CloudSun size={18}/>
									<span className="font-semibold text-lg">--°C</span>
								</div>
								<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400">
									Weather
								</span>
							</div>
							<div className="w-px bg-gray-200 h-10 self-center"/>
							<div className="flex flex-col items-center gap-1">
								<div className="flex items-center gap-2 text-gray-500">
									<lucide_react_1.Sunrise size={18}/>
									<span className="font-semibold text-lg">--:--</span>
								</div>
								<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400">
									Sunrise
								</span>
							</div>
							<div className="w-px bg-gray-200 h-10 self-center"/>
							<div className="flex flex-col items-center gap-1">
								<div className="flex items-center gap-2 text-gray-500">
									<lucide_react_1.Moon size={18}/>
									<span className="font-semibold text-lg">--%</span>
								</div>
								<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400">
									Moon
								</span>
							</div>
						</div>
					</div>

					{/* Editor Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex bg-gray-100 p-1 rounded-lg">
								<button type="button" onClick={() => setMode("refine")} className={"px-4 py-1.5 text-sm font-medium rounded-md transition-all ".concat(mode === "refine"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700")}>
									{t("diary.refineMode")}
								</button>
								<button type="button" onClick={() => setMode("rewrite")} className={"px-4 py-1.5 text-sm font-medium rounded-md transition-all ".concat(mode === "rewrite"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700")}>
									{t("diary.rewriteMode")}
								</button>
							</div>
							<span className="text-xs text-gray-400">
								{mode === "refine"
            ? t("diary.refineModeHelp")
            : t("diary.rewriteModeHelp")}
							</span>
						</div>

						{/* Editor - Single Column */}
						<div className="relative min-h-[200px]">
							{mode === "refine" ? (<RefineEditor_1.default content={content} people={people} locations={locations} allPeople={allPeople} onChange={setContent} onEntitiesChange={(newPeople, newLocations) => {
                setPeople(newPeople);
                setLocations(newLocations);
            }}/>) : (<RewriteEditor_1.default content={content} onChange={setContent}/>)}
						</div>
					</div>

					{/* Person Insights Section - Unified */}
					{people.length > 0 && (<div className="border-t border-gray-100 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="flex items-center justify-between mb-4">
								<h3 className="flex items-center gap-2 font-semibold text-gray-900">
									<lucide_react_1.Sparkles className="w-5 h-5 text-purple-500"/>
									{t("diary.insights.title")}
								</h3>
								<span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
									{t("diary.insights.aiPowered")}
								</span>
							</div>

							<p className="text-sm text-gray-500 mb-4">
								{t("diary.insights.description")}
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{people.map((person) => {
                var _a, _b;
                return (<div key={person.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500">
										<div className="flex items-center gap-2 mb-3">
											<div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
												<lucide_react_1.User className="w-4 h-4 text-indigo-600"/>
											</div>
											<div className="overflow-hidden">
												<p className="font-medium text-gray-900 truncate">
													{person.name}
												</p>
												{person.nickname && (<p className="text-xs text-gray-500 truncate">
														{person.nickname}
													</p>)}
											</div>
										</div>

										<textarea name={"person-context-".concat(person.id)} defaultValue={((_b = (_a = entry.conversations) === null || _a === void 0 ? void 0 : _a.find((c) => c.personId === person.id)) === null || _b === void 0 ? void 0 : _b.content) || ""} placeholder={t("diary.insights.placeholder")} rows={3} className="w-full p-0 text-sm text-gray-700 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none placeholder:text-gray-300"/>
									</div>);
            })}
							</div>
						</div>)}
				</div>

				{/* Actions (Footer of Card) */}
				<div className="bg-white p-6 flex justify-end gap-4 border-t border-gray-100">
					{onCancel ? (<button type="button" onClick={onCancel} className="px-6 py-2.5 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer">
							{t("common.cancel")}
						</button>) : (<navigation_2.Link href={"/diary/".concat(entry.id)} className="px-6 py-2.5 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer">
							{t("common.cancel")}
						</navigation_2.Link>)}
					<button type="button" onClick={() => handleSave()} disabled={isPending} className="px-8 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
						{isPending && (<lucide_react_1.LoaderCircle className="animate-spin h-4 w-4 text-white"/>)}
						{isPending ? t("common.saving") : t("common.save")}
					</button>
					{nextDayParam && (<button type="button" onClick={() => handleSave(nextDayParam)} disabled={isPending} className="px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
							{t("diary.nextDayEntry")}
							<lucide_react_1.ArrowRight className="w-4 h-4"/>
						</button>)}
				</div>
			</form>
		</div>);
}
