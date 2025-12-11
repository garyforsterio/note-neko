"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	type DateRange,
	DayPicker,
	getDefaultClassNames,
} from "react-day-picker";
import "react-day-picker/style.css";

interface CalendarProps {
	entries: { id: string; date: Date | string }[];
	onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export default function Calendar({
	entries,
	onDateRangeChange,
}: CalendarProps) {
	const t = useTranslations();
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
		if (onDateRangeChange) {
			onDateRangeChange(newRange?.from ?? null, newRange?.to ?? null);
		}
	};

	const defaultClassNames = getDefaultClassNames();

	return (
		<div className="flex justify-center flex-col">
			<div className="mb-4 p-2 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-medium rounded text-center">
				{t("calendar.clickToSelectRange")}
			</div>

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
					hasEntry:
						"relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-gray-400 after:rounded-full",
				}}
				classNames={{
					caption_label: `${defaultClassNames.caption_label} text-lg font-serif font-bold text-gray-900`,
					weekday: "text-center text-xs font-bold text-gray-400 uppercase py-2",
					day: "relative",
					day_button:
						"w-10 h-10 p-0 font-medium text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer",
					selected: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm",
					range_start:
						"bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-l-lg shadow-sm",
					range_end:
						"bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-r-lg shadow-sm",
					range_middle: "bg-gray-100 text-gray-900 hover:bg-gray-200",
					today: "font-bold bg-gray-50 text-black",
					outside: "text-gray-300 opacity-50",
					disabled: "text-gray-200 cursor-not-allowed",
					hidden: "invisible",
				}}
			/>
		</div>
	);
}
