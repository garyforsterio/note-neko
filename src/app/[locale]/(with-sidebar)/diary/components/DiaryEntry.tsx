import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Moon, Sunrise } from "lucide-react";
import { getLocale } from "next-intl/server";
import { DiaryContent } from "#components/DiaryContent";
import { Link } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { getHistoricWeather, getWeatherIcon } from "#lib/utils/weather";
import DeleteButton from "./DeleteButton";
import { DiaryLocations } from "./DiaryLocations";
import { DiaryMentions } from "./DiaryMentions";
import ShareButton from "./ShareButton";

interface DiaryEntryProps {
	entry: DiaryEntryWithRelations;
}

export async function DiaryEntry({ entry }: DiaryEntryProps) {
	const t = await getTranslations();
	const locale = await getLocale();
	const date = new Date(entry.date);

	const location = entry.locations.length > 0 ? entry.locations[0] : null;
	const weather = location
		? await getHistoricWeather(location.lat, location.lng, date)
		: null;

	const WeatherIcon = getWeatherIcon(weather?.weatherCode ?? null);

	return (
		<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
				<div>
					<Link href={`/diary/${entry.id}`} className="group">
						<h2 className="text-4xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
							{format(date, "EEEE")}
						</h2>
					</Link>
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
						{entry.locations.length > 0 ? (
							<div className="flex items-center gap-2">
								<span className="text-gray-600 font-medium">
									{entry.locations[0]?.name}
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

				<div className="flex justify-around text-gray-400 items-center py-4 md:py-0 select-none w-full md:w-auto md:gap-6">
					<div className="flex flex-col items-center gap-1">
						<div className="flex flex-col items-center gap-0.5 text-gray-500">
							<WeatherIcon size={18} />
							<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
								{weather?.temperatureMax && weather?.temperatureMin
									? `${weather.temperatureMin}°C / ${weather.temperatureMax}°C`
									: "--°C"}
							</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
							{t("diary.weatherLabel")}
						</span>
					</div>
					<div className="hidden md:block w-px bg-gray-200 h-10 self-center" />
					<div className="flex flex-col items-center gap-1">
						<div className="flex flex-col items-center gap-0.5 text-gray-500">
							<Sunrise size={18} />
							<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
								{weather?.sunrise && weather?.sunset
									? `${weather.sunrise} - ${weather.sunset}`
									: "--:--"}
							</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
							{t("diary.sunLabel")}
						</span>
					</div>
					<div className="hidden md:block w-px bg-gray-200 h-10 self-center" />
					<div className="flex flex-col items-center gap-1">
						<div className="flex flex-col items-center gap-0.5 text-gray-500">
							<Moon size={18} />
							<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
								{weather ? `${Math.round(weather.moonPhase * 100)}%` : "--%"}
							</span>
						</div>
						<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
							{t("diary.moonLabel")}
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

			{/* Footer/Actions Section */}
			<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
				<div className="flex flex-col gap-3 w-full sm:w-auto">
					<DiaryMentions
						mentions={entry.mentions}
						conversations={entry.conversations}
					/>
					<DiaryLocations locations={entry.locations} />
				</div>

				<div className="flex items-center gap-1 shrink-0">
					<ShareButton entry={entry} locale={locale} />
					<DeleteButton id={entry.id} />
				</div>
			</div>
		</div>
	);
}
