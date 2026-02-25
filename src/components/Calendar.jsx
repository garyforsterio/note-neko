"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Calendar;
var date_fns_1 = require("date-fns");
var navigation_1 = require("next/navigation");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var react_day_picker_1 = require("react-day-picker");
require("react-day-picker/style.css");
function Calendar(_a) {
    var entries = _a.entries, onDateRangeChange = _a.onDateRangeChange;
    var t = (0, next_intl_1.useTranslations)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var _b = (0, react_1.useState)(), range = _b[0], setRange = _b[1];
    var _c = (0, react_1.useState)(() => new Date()), month = _c[0], setMonth = _c[1];
    // Initialize selection from URL params
    (0, react_1.useEffect)(() => {
        var startDate = searchParams.get("start-date");
        var endDate = searchParams.get("end-date");
        // Parse dates as local dates to avoid timezone issues
        var parseLocalDate = (dateStr) => {
            var parts = dateStr.split("-").map(Number);
            if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
                throw new Error("Invalid date format: ".concat(dateStr));
            }
            var year = parts[0];
            var month = parts[1];
            var day = parts[2];
            if (year === undefined || month === undefined || day === undefined) {
                throw new Error("Invalid date parts: ".concat(dateStr));
            }
            return new Date(year, month - 1, day); // month is 0-indexed
        };
        try {
            if (startDate && endDate) {
                var start = parseLocalDate(startDate);
                var end = parseLocalDate(endDate);
                setRange({ from: start, to: end });
            }
            else if (startDate) {
                var start = parseLocalDate(startDate);
                setRange({ from: start, to: start });
            }
            else {
                setRange(undefined);
            }
        }
        catch (error) {
            console.warn("Invalid date format in URL params:", error);
            setRange(undefined);
        }
    }, [searchParams]);
    // Get dates that have entries
    var entriesMap = new Map();
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var dateStr = (0, date_fns_1.format)(new Date(entry.date), "yyyy-MM-dd");
        entriesMap.set(dateStr, true);
    }
    var handleRangeSelect = (newRange) => {
        var _a, _b;
        setRange(newRange);
        if (onDateRangeChange) {
            onDateRangeChange((_a = newRange === null || newRange === void 0 ? void 0 : newRange.from) !== null && _a !== void 0 ? _a : null, (_b = newRange === null || newRange === void 0 ? void 0 : newRange.to) !== null && _b !== void 0 ? _b : null);
        }
    };
    var defaultClassNames = (0, react_day_picker_1.getDefaultClassNames)();
    return (<div className="flex justify-center flex-col">
			<div className="mb-4 p-2 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-medium rounded text-center">
				{t("calendar.clickToSelectRange")}
			</div>

			<react_day_picker_1.DayPicker mode="range" selected={range} onSelect={handleRangeSelect} month={month} onMonthChange={setMonth} showOutsideDays modifiers={{
            hasEntry: (date) => entriesMap.has((0, date_fns_1.format)(date, "yyyy-MM-dd")),
        }} modifiersClassNames={{
            hasEntry: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-gray-400 after:rounded-full",
        }} classNames={{
            caption_label: "".concat(defaultClassNames.caption_label, " text-lg font-serif font-bold text-gray-900"),
            weekday: "text-center text-xs font-bold text-gray-400 uppercase py-2",
            day: "relative",
            day_button: "w-10 h-10 p-0 font-medium text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer",
            selected: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm",
            range_start: "bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-l-lg shadow-sm",
            range_end: "bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-r-lg shadow-sm",
            range_middle: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            today: "font-bold bg-gray-50 text-black",
            outside: "text-gray-300 opacity-50",
            disabled: "text-gray-200 cursor-not-allowed",
            hidden: "invisible",
        }}/>
		</div>);
}
