"use client";

import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronDown,
	History,
	Plus,
	X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import Calendar from "#components/Calendar";
import { Skeleton } from "#components/ui/skeleton";
import { Link, usePathname, useRouter } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { cn } from "#lib/utils";
import DiaryMap from "./DiaryMap";
import ShareAllButton from "./ShareAllButton";
import { SortToggle } from "./SortToggle";

interface DiaryHeaderProps {
	startDate?: Date;
	endDate?: Date;
	entries: DiaryEntryWithRelations[];
	allEntryIds: { id: string; date: Date }[];
	missingCount?: number;
	nextMissingDate?: string;
	googleMapsApiKey: string;
	isLoading?: boolean;
}

export function DiaryHeader({
	startDate,
	endDate,
	entries,
	allEntryIds,
	missingCount = 0,
	nextMissingDate,
	googleMapsApiKey,
	isLoading = false,
}: DiaryHeaderProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const calendarRef = useRef<HTMLDivElement>(null);
	const [tempDateRange, setTempDateRange] = useState<{
		start: Date | null;
		end: Date | null;
	}>({ start: startDate || null, end: endDate || null });

	// Close calendar on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node)
			) {
				setIsCalendarOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Reset temp range when calendar opens
	useEffect(() => {
		if (isCalendarOpen) {
			setTempDateRange({
				start: startDate || null,
				end: endDate || null,
			});
		}
	}, [isCalendarOpen, startDate, endDate]);

	const updateFilters = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams);
			for (const [key, value] of Object.entries(updates)) {
				if (value === null) {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}
			// Reset to page 1 on filter change
			if (!updates.page) {
				params.set("page", "1");
			}
			router.push(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const applyDateRange = () => {
		const formatLocalDate = (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		};

		updateFilters({
			"start-date": tempDateRange.start
				? formatLocalDate(tempDateRange.start)
				: null,
			"end-date": tempDateRange.end ? formatLocalDate(tempDateRange.end) : null,
		});
		setIsCalendarOpen(false);
	};

	const clearDateRange = (e: React.MouseEvent) => {
		e.stopPropagation();
		updateFilters({
			"start-date": null,
			"end-date": null,
		});
	};

	const pageSize = searchParams.get("page-size") || "10";

	// Deduplicate locations based on placeId or lat/lng to prevent duplicate keys in map
	const uniqueLocationsMap = new Map();
	entries
		.flatMap((entry) => entry.locations)
		.forEach((loc) => {
			const key = loc.placeId || `${loc.lat}-${loc.lng}`;
			if (!uniqueLocationsMap.has(key)) {
				uniqueLocationsMap.set(key, loc);
			}
		});
	const allLocations = Array.from(uniqueLocationsMap.values());

	return (
		<div className="flex flex-col gap-6 mb-6">
			{/* Top Row: Title & Primary Actions */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
				<div>
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
						{t("diary.title")}
					</h1>
				</div>

				<div className="flex items-center gap-3 w-full md:w-auto">
					{entries.length > 0 && (
						<div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm mr-2">
							<ShareAllButton entries={entries} locale={locale} />
						</div>
					)}

					<Link
						href="/diary/new"
						className="flex-1 md:flex-none justify-center bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium group"
					>
						<Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
						{t("diary.newEntry")}
					</Link>
				</div>
			</div>

			{(isLoading || (allLocations.length > 0 && googleMapsApiKey)) && (
				<div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm">
					{isLoading ? (
						<Skeleton className="w-full h-full" />
					) : (
						<DiaryMap
							apiKey={googleMapsApiKey}
							locations={allLocations}
							className="w-full h-full"
						/>
					)}
				</div>
			)}

			{/* Sticky Filter Bar */}
			<div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-gray-50/95 backdrop-blur-md border-b border-gray-200/50 transition-all">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center gap-2 flex-wrap">
						{/* Date Range Picker */}
						<div className="relative" ref={calendarRef}>
							<button
								type="button"
								onClick={() => setIsCalendarOpen(!isCalendarOpen)}
								className={cn(
									"flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
									startDate || endDate
										? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
										: "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm",
								)}
							>
								<CalendarIcon size={16} />
								<span>
									{startDate && endDate
										? `${format(startDate, "MMM d")} - ${format(
												endDate,
												"MMM d, yyyy",
											)}`
										: startDate
											? format(startDate, "MMM d, yyyy")
											: endDate
												? format(endDate, "MMM d, yyyy")
												: t("diary.selectDateRange")}
								</span>
								{(startDate || endDate) && (
									// biome-ignore lint/a11y/useSemanticElements: clear button nested inside parent button
									<span
										role="button"
										tabIndex={0}
										onClick={clearDateRange}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												clearDateRange(e as unknown as React.MouseEvent);
											}
										}}
										className="ml-1 p-0.5 hover:bg-blue-200 rounded-full cursor-pointer inline-flex"
									>
										<X size={14} />
									</span>
								)}
							</button>

							{/* Calendar Popover */}
							{isCalendarOpen && (
								<div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-auto min-w-[320px] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4">
									<Calendar
										entries={allEntryIds}
										onDateRangeChange={(start, end) => {
											setTempDateRange({ start, end });
										}}
									/>
									<div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
										<button
											type="button"
											onClick={() => setIsCalendarOpen(false)}
											className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
										>
											{t("common.cancel")}
										</button>
										<button
											type="button"
											onClick={applyDateRange}
											className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors shadow-sm cursor-pointer"
										>
											{t("diary.applyFilters")}
										</button>
									</div>
								</div>
							)}
						</div>

						<SortToggle />

						{/* Page Size Selector - Simple dropdown */}
						<div className="relative group">
							<select
								value={pageSize}
								onChange={(e) => updateFilters({ "page-size": e.target.value })}
								className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer"
							>
								{/* biome-ignore lint/style/noJsxLiterals: numeric values */}
								<option value="5">5 {t("diary.itemsPerPage")}</option>
								{/* biome-ignore lint/style/noJsxLiterals: numeric values */}
								<option value="10">10 {t("diary.itemsPerPage")}</option>
								{/* biome-ignore lint/style/noJsxLiterals: numeric values */}
								<option value="20">20 {t("diary.itemsPerPage")}</option>
								{/* biome-ignore lint/style/noJsxLiterals: numeric values */}
								<option value="50">50 {t("diary.itemsPerPage")}</option>
							</select>
							<ChevronDown
								className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
								size={14}
							/>
						</div>
					</div>

					{missingCount > 0 && nextMissingDate && (
						<Link
							href={`/diary/new?date=${nextMissingDate}`}
							className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200/50 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors shadow-sm"
						>
							<History size={16} />
							{t("diary.catchUpMessage", { count: missingCount })}
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
