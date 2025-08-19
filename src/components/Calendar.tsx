"use client";

import { format, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
	type DateRange,
	DayPicker,
	getDefaultClassNames,
} from "react-day-picker";
import type { getAllDiaryIds } from "#lib/dal";
import "react-day-picker/style.css";

interface CalendarProps {
	entries: ReturnType<typeof getAllDiaryIds>;
	onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export default function Calendar({
	entries: entriesPromise,
	onDateRangeChange,
}: CalendarProps) {
	const t = useTranslations();
	const entries = use(entriesPromise);
	const searchParams = useSearchParams();
	const [range, setRange] = useState<DateRange | undefined>();
	const [month, setMonth] = useState<Date>(() => new Date());

	// Initialize selection from URL params
	useEffect(() => {
		const startDate = searchParams.get("start-date");
		const endDate = searchParams.get("end-date");

		// Parse dates as local dates to avoid timezone issues
		const parseLocalDate = (dateStr: string) => {
			const parts = dateStr.split("-").map(Number);
			if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
				throw new Error(`Invalid date format: ${dateStr}`);
			}
			const year = parts[0];
			const month = parts[1];
			const day = parts[2];
			if (year === undefined || month === undefined || day === undefined) {
				throw new Error(`Invalid date parts: ${dateStr}`);
			}
			return new Date(year, month - 1, day); // month is 0-indexed
		};

		try {
			if (startDate && endDate) {
				const start = parseLocalDate(startDate);
				const end = parseLocalDate(endDate);
				setRange({ from: start, to: end });
			} else if (startDate) {
				const start = parseLocalDate(startDate);
				setRange({ from: start, to: start });
			} else {
				setRange(undefined);
			}
		} catch (error) {
			// If date parsing fails, clear the range
			console.warn("Invalid date format in URL params:", error);
			setRange(undefined);
		}
	}, [searchParams]);

	// Get dates that have entries
	const entriesMap = new Map<string, boolean>();
	for (const entry of entries) {
		const dateStr = format(new Date(entry.date), "yyyy-MM-dd");
		entriesMap.set(dateStr, true);
	}

	const handleRangeSelect = (newRange: DateRange | undefined) => {
		setRange(newRange);

		if (newRange?.from && newRange?.to && onDateRangeChange) {
			onDateRangeChange(newRange.from, newRange.to);
		} else if (newRange?.from && !newRange?.to && onDateRangeChange) {
			// When only one date is selected, treat it as a single-day range
			onDateRangeChange(newRange.from, newRange.from);
		} else if (!newRange && onDateRangeChange) {
			onDateRangeChange(null, null);
		}
	};

	const defaultClassNames = getDefaultClassNames();

	return (
		<div className="flex justify-center flex-col">
			{!range && (
				<div className="mb-4 p-2 bg-blue-50 text-blue-700 text-sm rounded-md text-center">
					{t("calendar.clickToSelectRange")}
				</div>
			)}

			<DayPicker
				mode="range"
				selected={range}
				onSelect={handleRangeSelect}
				month={month}
				onMonthChange={setMonth}
				showOutsideDays
				modifiers={{
					hasEntry: (date) => entriesMap.has(format(date, "yyyy-MM-dd")),
				}}
				modifiersClassNames={{
					hasEntry: "has-entry",
				}}
				classNames={{
					caption_label: `${defaultClassNames.caption_label} text-lg font-semibold`,
					weekday: "text-center text-sm font-medium text-gray-500 py-2",
					day: "relative",
					day_button:
						"w-10 h-10 p-0 font-normal text-sm hover:bg-gray-100 rounded-lg transition-colors cursor-pointer",
					selected: "bg-blue-600 text-white hover:bg-blue-700",
					range_start: "bg-blue-600 text-white hover:bg-blue-700 rounded-l-lg",
					range_end: "bg-blue-600 text-white hover:bg-blue-700 rounded-r-lg",
					range_middle: "bg-blue-100 text-gray-900 hover:bg-blue-200",
					today: "font-bold bg-blue-50",
					outside: "text-gray-300",
					disabled: "text-gray-300 cursor-not-allowed",
					hidden: "invisible",
				}}
			/>
		</div>
	);
}
