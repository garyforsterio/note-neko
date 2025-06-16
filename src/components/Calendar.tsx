"use client";

import {
	eachDayOfInterval,
	endOfDay,
	endOfMonth,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	isWithinInterval,
	parseISO,
	startOfDay,
	startOfMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight, MousePointer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "#i18n/navigation";

interface CalendarProps {
	entries: {
		id: string;
		date: Date;
	}[];
	onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export default function Calendar({
	entries,
	onDateRangeChange,
}: CalendarProps) {
	const t = useTranslations();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectionStart, setSelectionStart] = useState<Date | null>(null);
	const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
	const [isSelecting, setIsSelecting] = useState(false);
	const [showTooltip, setShowTooltip] = useState(true);

	// Initialize selection from URL params
	useEffect(() => {
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		if (startDate) {
			// Parse the date string and set to UTC midnight
			const date = parseISO(startDate);
			setSelectionStart(
				new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
			);
		} else {
			setSelectionStart(null);
		}
		if (endDate) {
			const date = parseISO(endDate);
			setSelectionEnd(
				new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
			);
		} else {
			setSelectionEnd(null);
		}
	}, [searchParams]);

	// Hide tooltip after 5 seconds
	useEffect(() => {
		if (showTooltip) {
			const timer = setTimeout(() => {
				setShowTooltip(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [showTooltip]);

	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(currentMonth);
	const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

	const previousMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
		);
	};

	const nextMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
		);
	};

	const hasEntry = (date: Date) => {
		return entries.some((entry) => isSameDay(new Date(entry.date), date));
	};

	const isInSelection = (date: Date) => {
		if (!selectionStart || !selectionEnd) return false;
		return isWithinInterval(date, {
			start: startOfDay(selectionStart),
			end: endOfDay(selectionEnd),
		});
	};

	const handleMouseDown = (e: React.MouseEvent, date: Date) => {
		e.preventDefault(); // Prevent text selection
		if (!isSameMonth(date, currentMonth)) return;
		// Create UTC date at midnight
		const utcDate = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
		);
		setIsSelecting(true);
		setSelectionStart(utcDate);
		setSelectionEnd(utcDate);
		setShowTooltip(false);
	};

	const handleMouseEnter = (date: Date) => {
		if (!isSelecting || !selectionStart || !isSameMonth(date, currentMonth))
			return;
		// Create UTC date at midnight
		const utcDate = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
		);
		setSelectionEnd(utcDate);
	};

	const handleMouseUp = () => {
		setIsSelecting(false);
		if (selectionStart && selectionEnd && onDateRangeChange) {
			onDateRangeChange(selectionStart, selectionEnd);
		}
	};

	useEffect(() => {
		const handleGlobalMouseUp = () => {
			if (isSelecting) {
				setIsSelecting(false);
				if (selectionStart && selectionEnd && onDateRangeChange) {
					onDateRangeChange(selectionStart, selectionEnd);
				}
			}
		};

		window.addEventListener("mouseup", handleGlobalMouseUp);
		return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
	}, [isSelecting, selectionStart, selectionEnd, onDateRangeChange]);

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8 select-none">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold">
					{format(currentMonth, "MMMM yyyy")}
				</h2>
				<div className="flex space-x-2">
					<button
						type="button"
						onClick={previousMonth}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						title={t("calendar.previousMonth")}
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						type="button"
						onClick={nextMonth}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						title={t("calendar.nextMonth")}
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>

			{showTooltip && !selectionStart && !selectionEnd && (
				<div className="mb-4 p-2 bg-blue-50 text-blue-700 text-sm rounded-md flex items-center gap-2">
					<MousePointer className="h-4 w-4" />
					<span>{t("calendar.dragToSelect")}</span>
				</div>
			)}

			<div className="grid grid-cols-7 gap-2">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						key={day}
						className="text-center text-sm font-medium text-gray-500 py-2"
					>
						{day}
					</div>
				))}

				{days?.map((day) => {
					const entry = entries.find((e) => isSameDay(new Date(e.date), day));
					const isSelected = isInSelection(day);
					return (
						<div
							key={day.toString()}
							onMouseDown={(e) => handleMouseDown(e, day)}
							onMouseEnter={() => handleMouseEnter(day)}
							className={`
                relative aspect-square p-2 text-center rounded-lg min-w-0
                ${!isSameMonth(day, currentMonth) ? "text-gray-300" : ""}
                ${isToday(day) ? "bg-blue-50" : ""}
                ${hasEntry(day) ? "hover:bg-blue-100 cursor-pointer" : ""}
                ${isSelected ? "bg-blue-100" : ""}
                ${isSameMonth(day, currentMonth) ? "cursor-pointer" : ""}
                ${isSelecting ? "cursor-grab active:cursor-grabbing" : ""}
              `}
						>
							{entry ? (
								<Link
									href={`/diary/${entry.id}`}
									className="h-full w-full flex items-center justify-center"
									title={format(day, "MMMM d, yyyy")}
								>
									<span className="relative">
										{format(day, "d")}
										<span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
									</span>
								</Link>
							) : (
								<div className="h-full w-full flex items-center justify-center">
									{format(day, "d")}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
