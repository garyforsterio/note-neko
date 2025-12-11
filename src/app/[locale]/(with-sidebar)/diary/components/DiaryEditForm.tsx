"use client";

import type { Person, Prisma } from "@prisma/client";
import { format, parseISO } from "date-fns";
import {
	ArrowRight,
	Calendar as CalendarIcon,
	CloudSun,
	LoaderCircle,
	MapPin,
	Moon,
	Sunrise,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { DayPicker } from "react-day-picker";
import { updateDiaryEntryAction } from "#actions/diary";
import RefineEditor from "#components/diary/RefineEditor";
import RewriteEditor from "#components/diary/RewriteEditor";
import { useToast } from "#hooks/use-toast";
import { Link, useRouter } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import "react-day-picker/style.css";
import DiaryMap from "./DiaryMap";

interface DiaryEditFormProps {
	entry: DiaryEntryWithRelations;
	allPeople: Person[];
	googleMapsApiKey: string;
	onCancel?: () => void;
}

export default function DiaryEditForm({
	entry,
	allPeople,
	googleMapsApiKey,
	onCancel,
}: DiaryEditFormProps) {
	const t = useTranslations();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const [mode, setMode] = useState<"refine" | "rewrite">("refine");
	const [content, setContent] = useState(entry.content);
	// Initialize date from entry.date
	const [selectedDate, setSelectedDate] = useState<Date>(
		entry.date ? new Date(entry.date) : new Date(),
	);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const [people, setPeople] = useState(entry.mentions.map((m) => m.person));
	const [locations, setLocations] = useState<
		Prisma.DiaryLocationCreateWithoutDiaryEntryInput[]
	>(
		entry.locations.map((loc) => ({
			name: loc.name,
			placeId: loc.placeId,
			lat: loc.lat,
			lng: loc.lng,
		})),
	);

	const nextDayParam = searchParams.get("nextDay");

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setSelectedDate(date);
			setIsCalendarOpen(false);
		}
	};

	const handleSave = (nextDay?: string) => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append("id", entry.id);
				formData.append("content", content);
				formData.append("date", selectedDate.toISOString());

				// Add people and locations
				formData.append("peopleIds", JSON.stringify(people.map((p) => p.id)));
				formData.append("locations", JSON.stringify(locations));

				const result = await updateDiaryEntryAction(undefined, formData);

				if (result?.status === "error") {
					toast({
						variant: "destructive",
						title: t("error.updateFailed"),
						description: result.error?.content?.[0] || t("error.generic"),
					});
				} else {
					toast({
						title: t("diary.saved"),
						description: t("diary.entrySaved"),
					});
					if (onCancel) {
						router.refresh();
						onCancel();
					} else if (nextDay) {
						router.push(`/diary/new?date=${nextDay}`);
					} else {
						router.push("/diary");
					}
				}
			} catch (_error) {
				toast({
					variant: "destructive",
					title: t("error.updateFailed"),
					description: t("error.generic"),
				});
			}
		});
	};

	// Determine location display string from the *first* location if available
	const locationDisplayString =
		locations.length > 0 ? locations[0]?.name : null;

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			{/* Header Section (Date & Weather) */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
				<div>
					<h2 className="text-4xl font-bold text-gray-900 tracking-tight">
						{format(selectedDate, "EEEE")}
					</h2>
					<div className="flex items-center gap-3 mt-2 relative">
						<span className="text-xl text-gray-500 font-medium">
							{format(selectedDate, "d MMMM yyyy")}
						</span>
						<button
							type="button"
							onClick={() => setIsCalendarOpen(!isCalendarOpen)}
							className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
							aria-label="Change date"
						>
							<CalendarIcon size={20} />
						</button>

						{isCalendarOpen && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={() => setIsCalendarOpen(false)}
									onKeyUp={(event) => {
										if (event.key === "Escape") {
											setIsCalendarOpen(false);
										}
									}}
								/>
								<div className="absolute top-full left-0 mt-4 z-50 bg-white border border-gray-100 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
									<DayPicker
										mode="single"
										selected={selectedDate}
										onSelect={handleDateSelect}
										showOutsideDays
										classNames={{
											caption: "flex justify-center pt-1 relative items-center",
											caption_label: "text-sm font-medium text-gray-900",
											nav: "space-x-1 flex items-center",
											nav_button:
												"h-7 w-7 bg-transparent hover:opacity-100 border border-gray-200 hover:bg-gray-50 p-0 opacity-50 rounded-md transition-all flex items-center justify-center cursor-pointer",
											nav_button_previous: "absolute left-1",
											nav_button_next: "absolute right-1",
											table: "w-full border-collapse space-y-1",
											head_row: "flex",
											head_cell:
												"text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
											row: "flex w-full mt-2",
											cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
											day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors cursor-pointer",
											day_selected:
												"bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white !rounded-md",
											day_today: "bg-gray-100 text-gray-900 font-bold",
											day_outside: "text-gray-300 opacity-50",
											day_disabled:
												"text-gray-300 opacity-50 cursor-not-allowed",
											day_hidden: "invisible",
										}}
									/>
								</div>
							</>
						)}
					</div>

					<div className="flex items-center gap-2 mt-3 text-sm h-6">
						<MapPin
							size={14}
							className={
								locations.length > 0 ? "text-blue-500" : "text-gray-400"
							}
						/>
						{locationDisplayString ? (
							<div className="flex items-center gap-2">
								<span className="text-gray-600 font-medium">
									{locationDisplayString}
									{locations.length > 1 && ` +${locations.length - 1} more`}
								</span>
							</div>
						) : (
							<span className="text-gray-400 italic">
								{t("diary.noLocation")}
							</span>
						)}
					</div>
				</div>

				<div className="flex gap-6 text-gray-400 py-4 md:py-0 select-none">
					<div className="flex flex-col items-center gap-1">
						<div className="flex items-center gap-2 text-gray-500">
							<CloudSun size={18} />
							<span className="font-semibold text-lg">--°C</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400">
							Weather
						</span>
					</div>
					<div className="w-px bg-gray-200 h-10 self-center" />
					<div className="flex flex-col items-center gap-1">
						<div className="flex items-center gap-2 text-gray-500">
							<Sunrise size={18} />
							<span className="font-semibold text-lg">--:--</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400">
							Sunrise
						</span>
					</div>
					<div className="w-px bg-gray-200 h-10 self-center" />
					<div className="flex flex-col items-center gap-1">
						<div className="flex items-center gap-2 text-gray-500">
							<Moon size={18} />
							<span className="font-semibold text-lg">--%</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400">
							Moon
						</span>
					</div>
				</div>
			</div>

			{/* Mode Toggle & Editor */}
			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex bg-gray-100 p-1 rounded-lg">
						<button
							type="button"
							onClick={() => setMode("refine")}
							className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
								mode === "refine"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{t("diary.refineMode")}
						</button>
						<button
							type="button"
							onClick={() => setMode("rewrite")}
							className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
								mode === "rewrite"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
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
				<div className="relative">
					{mode === "refine" ? (
						<RefineEditor
							content={content}
							people={people}
							locations={locations}
							allPeople={allPeople}
							onChange={setContent}
							onEntitiesChange={(newPeople, newLocations) => {
								setPeople(newPeople);
								setLocations(newLocations);
							}}
						/>
					) : (
						<RewriteEditor content={content} onChange={setContent} />
					)}
				</div>

				{/* Map - Below Editor */}
				{locations.length > 0 && googleMapsApiKey && (
					<div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm mt-8">
						<DiaryMap
							apiKey={googleMapsApiKey}
							locations={locations}
							className="w-full h-full"
						/>
					</div>
				)}
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-4 pt-8 border-t border-gray-100 mt-8">
				{onCancel ? (
					<button
						type="button"
						onClick={onCancel}
						className="px-6 py-2.5 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
					>
						{t("common.cancel")}
					</button>
				) : (
					<Link
						href={`/diary/${entry.id}`}
						className="px-6 py-2.5 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
					>
						{t("common.cancel")}
					</Link>
				)}
				<button
					type="button"
					onClick={() => handleSave()}
					disabled={isPending}
					className="px-8 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
				>
					{isPending && (
						<LoaderCircle className="animate-spin h-4 w-4 text-white" />
					)}
					{isPending ? t("common.saving") : t("common.save")}
				</button>
				{nextDayParam && (
					<button
						type="button"
						onClick={() => handleSave(nextDayParam)}
						disabled={isPending}
						className="px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{t("diary.nextDayEntry")}
						<ArrowRight className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	);
}
