"use client";

import { getFormProps, getTextareaProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { format, parseISO } from "date-fns";
import {
	Calendar as CalendarIcon,
	CloudSun,
	LoaderCircle,
	MapPin,
	Moon,
	Sunrise,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { createDiaryEntryAction } from "#actions/diary";
import type { LocationResult } from "#actions/locations";
import ErrorMessage from "#components/ErrorMessage";
import { useUserLocation } from "#hooks/useUserLocation";
import { Link, useRouter } from "#i18n/navigation";
import { getNextDayString } from "#lib/utils/diary";
import { diaryEntrySchema } from "#schema/diary";
import "react-day-picker/style.css";

function getLocalDateString(date: Date) {
	const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	const formattedDate = localDate.toISOString().split("T")[0];
	return formattedDate;
}

interface DiaryFormProps {
	initialDefaultLocation: LocationResult | null;
	initialDate?: string;
}

export default function DiaryForm({
	initialDefaultLocation,
	initialDate,
}: DiaryFormProps) {
	const t = useTranslations();
	const router = useRouter();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [selectedDate, setSelectedDate] = useState<Date>(
		initialDate ? parseISO(initialDate) : new Date(),
	);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const { location: browserGeolocation, requestLocation } = useUserLocation();

	let locationToSubmit: {
		latitude: number;
		longitude: number;
		placeId?: string;
		name?: string;
	} | null = null;
	let locationDisplayString: string | null = null;

	if (browserGeolocation) {
		locationToSubmit = {
			latitude: browserGeolocation.latitude,
			longitude: browserGeolocation.longitude,
		};
		locationDisplayString = t("diary.currentBrowserLocation");
	} else if (initialDefaultLocation) {
		locationToSubmit = {
			latitude: initialDefaultLocation.lat,
			longitude: initialDefaultLocation.lng,
			placeId: initialDefaultLocation.placeId,
			name: initialDefaultLocation.name,
		};
		locationDisplayString = t("diary.defaultLocation", {
			locationName: initialDefaultLocation.name,
		});
	}

	const [lastResult, action, isPending] = useActionState(
		createDiaryEntryAction,
		undefined,
	);

	const [form, fields] = useForm({
		lastResult,
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: diaryEntrySchema });
		},
		constraint: getZodConstraint(diaryEntrySchema),
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
		defaultValue: {
			date: initialDate || getLocalDateString(new Date()),
		},
	});

	const nextDayStr = initialDate ? getNextDayString(initialDate) : undefined;

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setSelectedDate(date);
			setIsCalendarOpen(false);
		}
	};

	return (
		<form
			className="space-y-6 max-w-4xl mx-auto"
			{...getFormProps(form)}
			action={action}
		>
			<ErrorMessage errors={form.errors} />
			{nextDayStr && <input type="hidden" name="nextDay" value={nextDayStr} />}

			<input
				type="hidden"
				name={fields.date.name}
				value={format(selectedDate, "yyyy-MM-dd")}
				id={fields.date.id}
			/>

			{locationToSubmit && (
				<input
					type="hidden"
					name="locationData"
					value={JSON.stringify(locationToSubmit)}
				/>
			)}

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
									role="presentation"
									aria-hidden="true"
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
							className={browserGeolocation ? "text-blue-500" : "text-gray-400"}
						/>
						{locationDisplayString ? (
							<div className="flex items-center gap-2">
								<span className="text-gray-600 font-medium">
									{locationDisplayString}
								</span>
								<Link
									href="/settings/profile"
									target="_blank"
									className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
								>
									Edit
								</Link>
							</div>
						) : (
							<button
								type="button"
								onClick={requestLocation}
								className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-600 transition-all cursor-pointer"
							>
								{t("diary.enableBrowserLocation")}
							</button>
						)}

						{!browserGeolocation && !initialDefaultLocation && (
							<Link
								href="/settings/profile"
								className="text-gray-400 hover:text-gray-600 text-xs ml-2"
							>
								({t("settings.navigation.profile")})
							</Link>
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

			<div>
				<label htmlFor={fields.content.id} className="sr-only">
					{t("diary.content")}
				</label>
				<textarea
					{...getTextareaProps(fields.content)}
					ref={textareaRef}
					rows={12}
					// biome-ignore lint/a11y/noAutofocus: only field
					autoFocus
					className="w-full p-6 text-lg text-gray-700 bg-gray-50/50 border-0 rounded-xl focus:outline-none focus:ring-0 focus:bg-white transition-colors placeholder:text-gray-300 resize-none shadow-inner"
					placeholder={t("diary.contentPlaceholder")}
				/>
				<div className="mt-3 flex items-center justify-between text-xs text-gray-400 px-2">
					<p>{t("diary.aiProcessingNote")}</p>
					<span className="opacity-50">{format(selectedDate, "yyyy")}</span>
				</div>
			</div>

			<div className="flex justify-end space-x-4 pt-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="px-6 py-2.5 text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
					disabled={isPending}
				>
					{t("common.cancel")}
				</button>
				<button
					type="submit"
					disabled={isPending || !form.valid}
					className="px-8 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
				>
					{isPending && (
						<LoaderCircle className="animate-spin h-4 w-4 text-white" />
					)}
					{isPending ? t("diary.analyzing") : t("common.create")}
				</button>
			</div>
		</form>
	);
}
