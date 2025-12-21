"use client";

import type { Person } from "@prisma/client";
import { format } from "date-fns";
import {
	ArrowRight,
	Calendar as CalendarIcon,
	MapPin,
	Moon,
	Pencil,
	Sunrise,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DiaryContent } from "#components/DiaryContent";
import { Link, useRouter } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { type WeatherInfo, getWeatherIcon } from "#lib/utils/weather";
import DeleteButton from "../../components/DeleteButton";
import DiaryEditForm from "../../components/DiaryEditForm";
import DiaryMap from "../../components/DiaryMap";
import { DiaryMentions } from "../../components/DiaryMentions";
import ShareButton from "../../components/ShareButton";

interface DiaryEntryPageClientProps {
	entry: DiaryEntryWithRelations;
	allPeople: Person[];
	googleMapsApiKey: string;
	nextDay?: string;
	weather?: WeatherInfo | null;
}

export default function DiaryEntryPageClient({
	entry,
	allPeople,
	googleMapsApiKey,
	nextDay,
	weather,
}: DiaryEntryPageClientProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const date = new Date(entry.date);
	// Use optional chaining for safe access
	const locationDisplayString =
		entry.locations.length > 0 ? entry.locations[0]?.name : null;

	const WeatherIcon = getWeatherIcon(weather?.weatherCode ?? null);

	if (isEditing) {
		return (
			<DiaryEditForm
				entry={entry}
				allPeople={allPeople}
				googleMapsApiKey={googleMapsApiKey}
				onCancel={() => {
					setIsEditing(false);
					router.refresh(); // Refresh data in case changes were saved
				}}
			/>
		);
	}

	return (
		<>
			{nextDay && (
				<div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 mb-6 max-w-4xl mx-auto">
					<div>
						<h3 className="text-lg font-semibold text-blue-900 mb-1">
							{t("diary.catchUpTitle")}
						</h3>
						<p className="text-blue-700 text-sm">
							{t("diary.catchUpDescription", {
								date: format(new Date(nextDay), "MMMM d"),
							})}
						</p>
					</div>
					<Link
						href={`/diary/new?date=${nextDay}`}
						className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2 whitespace-nowrap"
					>
						{t("diary.nextDayEntry")}
						<ArrowRight size={16} />
					</Link>
				</div>
			)}
			<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow max-w-4xl mx-auto">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
					<div>
						<h2 className="text-4xl font-bold text-gray-900 tracking-tight">
							{format(date, "EEEE")}
						</h2>
						<div className="flex items-center gap-3 mt-2 relative">
							<span className="text-xl text-gray-500 font-medium">
								{format(date, "d MMMM yyyy")}
							</span>
							<div className="p-2 bg-gray-50 rounded-full text-gray-400">
								<CalendarIcon size={20} />
							</div>
						</div>

						<div className="flex items-center gap-2 mt-3 text-sm h-6">
							<MapPin
								size={14}
								className={
									entry.locations.length > 0 ? "text-blue-500" : "text-gray-400"
								}
							/>
							{locationDisplayString ? (
								<div className="flex items-center gap-2">
									<span className="text-gray-600 font-medium">
										{locationDisplayString}
										{entry.locations.length > 1 &&
											` +${entry.locations.length - 1} more`}
									</span>
								</div>
							) : (
								<span className="text-gray-600 font-medium">
									{t("diary.unknownLocation")}
								</span>
							)}
						</div>
					</div>

					<div className="flex justify-around items-center py-4 md:py-0 select-none w-full md:w-auto">
						{/* Weather widgets placeholder */}
						<div className="flex flex-col items-center gap-1">
							<div className="flex flex-col items-center gap-0.5">
								<WeatherIcon size={18} />
								<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
									{weather?.temperatureMax && weather?.temperatureMin
										? `${weather.temperatureMin}°C / ${weather.temperatureMax}°C`
										: "--°C"}
								</span>
							</div>
							<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
								Weather
							</span>
						</div>
						<div className="hidden md:block w-px bg-gray-200 h-10 self-center" />
						<div className="flex flex-col items-center gap-1">
							<div className="flex flex-col items-center gap-0.5">
								<Sunrise size={18} />
								<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
									{weather?.sunrise && weather?.sunset
										? `${weather.sunrise} - ${weather.sunset}`
										: "--:--"}
								</span>
							</div>
							<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
								Sun
							</span>
						</div>
						<div className="hidden md:block w-px bg-gray-200 h-10 self-center" />
						<div className="flex flex-col items-center gap-1">
							<div className="flex flex-col items-center gap-0.5">
								<Moon size={18} />
								<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
									{weather ? `${Math.round(weather.moonPhase * 100)}%` : "--%"}
								</span>
							</div>
							<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
								Moon
							</span>
						</div>
					</div>
				</div>

				{/* Content Section */}
				<div className="prose max-w-none text-lg text-gray-700 leading-relaxed mb-8">
					<DiaryContent
						content={entry.content}
						people={entry.mentions.map((m) => m.person)}
						locations={entry.locations}
						locale={locale}
					/>
				</div>

				{/* Map Section for View Mode */}
				{entry.locations.length > 0 && googleMapsApiKey && (
					<div className="h-[300px] w-full mb-8 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
						<DiaryMap
							apiKey={googleMapsApiKey}
							locations={entry.locations}
							className="w-full h-full"
						/>
					</div>
				)}

				{/* Footer/Actions Section */}
				<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
					<div className="flex flex-col gap-3 w-full sm:w-auto">
						<DiaryMentions mentions={entry.mentions} />
						{/* DiaryLocations redundant with map but kept for list view if needed */}
						{/* <DiaryLocations locations={entry.locations} /> */}
					</div>

					<div className="flex items-center gap-1 shrink-0">
						<button
							type="button"
							onClick={() => setIsEditing(true)}
							className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
							title={t("common.edit")}
						>
							<Pencil className="h-4 w-4" />
						</button>
						<ShareButton entry={entry} locale={locale} />
						<DeleteButton id={entry.id} />
					</div>
				</div>
			</div>
		</>
	);
}
