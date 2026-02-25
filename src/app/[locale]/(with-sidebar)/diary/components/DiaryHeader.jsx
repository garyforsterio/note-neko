"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryHeader = DiaryHeader;
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var Calendar_1 = require("#components/Calendar");
var skeleton_1 = require("#components/ui/skeleton");
var navigation_2 = require("#i18n/navigation");
var utils_1 = require("#lib/utils");
var DiaryMap_1 = require("./DiaryMap");
var ShareAllButton_1 = require("./ShareAllButton");
var SortToggle_1 = require("./SortToggle");
function DiaryHeader(_a) {
    var startDate = _a.startDate, endDate = _a.endDate, entries = _a.entries, allEntryIds = _a.allEntryIds, _b = _a.missingCount, missingCount = _b === void 0 ? 0 : _b, nextMissingDate = _a.nextMissingDate, googleMapsApiKey = _a.googleMapsApiKey, _c = _a.isLoading, isLoading = _c === void 0 ? false : _c;
    var t = (0, next_intl_1.useTranslations)();
    var locale = (0, next_intl_1.useLocale)();
    var router = (0, navigation_2.useRouter)();
    var pathname = (0, navigation_2.usePathname)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var _d = (0, react_1.useState)(false), isCalendarOpen = _d[0], setIsCalendarOpen = _d[1];
    var calendarRef = (0, react_1.useRef)(null);
    var _e = (0, react_1.useState)({ start: startDate || null, end: endDate || null }), tempDateRange = _e[0], setTempDateRange = _e[1];
    // Close calendar on outside click
    (0, react_1.useEffect)(() => {
        function handleClickOutside(event) {
            if (calendarRef.current &&
                !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // Reset temp range when calendar opens
    (0, react_1.useEffect)(() => {
        if (isCalendarOpen) {
            setTempDateRange({
                start: startDate || null,
                end: endDate || null,
            });
        }
    }, [isCalendarOpen, startDate, endDate]);
    var updateFilters = (0, react_1.useCallback)((updates) => {
        var params = new URLSearchParams(searchParams);
        for (var _i = 0, _a = Object.entries(updates); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === null) {
                params.delete(key);
            }
            else {
                params.set(key, value);
            }
        }
        // Reset to page 1 on filter change
        if (!updates.page) {
            params.set("page", "1");
        }
        router.push("".concat(pathname, "?").concat(params.toString()));
    }, [pathname, router, searchParams]);
    var applyDateRange = () => {
        var formatLocalDate = (date) => {
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, "0");
            var day = String(date.getDate()).padStart(2, "0");
            return "".concat(year, "-").concat(month, "-").concat(day);
        };
        updateFilters({
            "start-date": tempDateRange.start
                ? formatLocalDate(tempDateRange.start)
                : null,
            "end-date": tempDateRange.end ? formatLocalDate(tempDateRange.end) : null,
        });
        setIsCalendarOpen(false);
    };
    var clearDateRange = (e) => {
        e.stopPropagation();
        updateFilters({
            "start-date": null,
            "end-date": null,
        });
    };
    var pageSize = searchParams.get("page-size") || "10";
    // Deduplicate locations based on placeId or lat/lng to prevent duplicate keys in map
    var uniqueLocationsMap = new Map();
    entries
        .flatMap((entry) => entry.locations)
        .forEach((loc) => {
        var key = loc.placeId || "".concat(loc.lat, "-").concat(loc.lng);
        if (!uniqueLocationsMap.has(key)) {
            uniqueLocationsMap.set(key, loc);
        }
    });
    var allLocations = Array.from(uniqueLocationsMap.values());
    return (<div className="flex flex-col gap-6 mb-6">
			{/* Top Row: Title & Primary Actions */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
				<div>
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
						{t("diary.title")}
					</h1>
					<p className="text-gray-500 mt-1">
						{t("home.features.dailyDiary.description").split(".")[0]}
					</p>
				</div>

				<div className="flex items-center gap-3 w-full md:w-auto">
					{entries.length > 0 && (<div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm mr-2">
							<ShareAllButton_1.default entries={entries} locale={locale}/>
						</div>)}

					<navigation_2.Link href="/diary/new" className="flex-1 md:flex-none justify-center bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium group">
						<lucide_react_1.Plus className="w-4 h-4 group-hover:scale-110 transition-transform"/>
						{t("diary.newEntry")}
					</navigation_2.Link>
				</div>
			</div>

			{(isLoading || (allLocations.length > 0 && googleMapsApiKey)) && (<div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm">
					{isLoading ? (<skeleton_1.Skeleton className="w-full h-full"/>) : (<DiaryMap_1.default apiKey={googleMapsApiKey} locations={allLocations} className="w-full h-full"/>)}
				</div>)}

			{/* Sticky Filter Bar */}
			<div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-gray-50/95 backdrop-blur-md border-b border-gray-200/50 transition-all">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center gap-2 flex-wrap">
						{/* Date Range Picker */}
						<div className="relative" ref={calendarRef}>
							<button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className={(0, utils_1.cn)("flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border", startDate || endDate
            ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm")}>
								<lucide_react_1.Calendar size={16}/>
								<span>
									{startDate && endDate
            ? "".concat((0, date_fns_1.format)(startDate, "MMM d"), " - ").concat((0, date_fns_1.format)(endDate, "MMM d, yyyy"))
            : startDate
                ? (0, date_fns_1.format)(startDate, "MMM d, yyyy")
                : endDate
                    ? (0, date_fns_1.format)(endDate, "MMM d, yyyy")
                    : t("diary.selectDateRange")}
								</span>
								{(startDate || endDate) && (
        // biome-ignore lint/a11y/useSemanticElements: clear button nested inside parent button
        <span role="button" tabIndex={0} onClick={clearDateRange} onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    clearDateRange(e);
                }
            }} className="ml-1 p-0.5 hover:bg-blue-200 rounded-full cursor-pointer inline-flex">
										<lucide_react_1.X size={14}/>
									</span>)}
							</button>

							{/* Calendar Popover */}
							{isCalendarOpen && (<div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-auto min-w-[320px] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4">
									<Calendar_1.default entries={allEntryIds} onDateRangeChange={(start, end) => {
                setTempDateRange({ start: start, end: end });
            }}/>
									<div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
										<button type="button" onClick={() => setIsCalendarOpen(false)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
											{t("common.cancel")}
										</button>
										<button type="button" onClick={applyDateRange} className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors shadow-sm cursor-pointer">
											{t("diary.applyFilters")}
										</button>
									</div>
								</div>)}
						</div>

						<SortToggle_1.SortToggle />

						{/* Page Size Selector - Simple dropdown */}
						<div className="relative group">
							<select value={pageSize} onChange={(e) => updateFilters({ "page-size": e.target.value })} className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer">
								<option value="5">5 {t("diary.itemsPerPage")}</option>
								<option value="10">10 {t("diary.itemsPerPage")}</option>
								<option value="20">20 {t("diary.itemsPerPage")}</option>
								<option value="50">50 {t("diary.itemsPerPage")}</option>
							</select>
							<lucide_react_1.ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14}/>
						</div>
					</div>

					{missingCount > 0 && nextMissingDate && (<navigation_2.Link href={"/diary/new?date=".concat(nextMissingDate)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200/50 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors shadow-sm">
							<lucide_react_1.History size={16}/>
							{t("diary.catchUpMessage", { count: missingCount })}
						</navigation_2.Link>)}
				</div>
			</div>
		</div>);
}
