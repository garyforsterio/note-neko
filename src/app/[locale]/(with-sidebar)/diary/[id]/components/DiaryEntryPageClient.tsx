"use client";

import type { Person } from "@prisma/client";
import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	CloudSun,
	MapPin,
	Moon,
	Pencil,
	Sunrise,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DiaryContent } from "#components/DiaryContent";
import { useRouter } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import DeleteButton from "../../components/DeleteButton";
import DiaryEditForm from "../../components/DiaryEditForm";
import { DiaryLocations } from "../../components/DiaryLocations";
import DiaryMap from "../../components/DiaryMap";
import { DiaryMentions } from "../../components/DiaryMentions";
import ShareButton from "../../components/ShareButton";

interface DiaryEntryPageClientProps {
	entry: DiaryEntryWithRelations;
	allPeople: Person[];
	googleMapsApiKey: string;
}

export default function DiaryEntryPageClient({
	entry,
	allPeople,
	googleMapsApiKey,
}: DiaryEntryPageClientProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const date = new Date(entry.date);
	// Use optional chaining for safe access
	const locationDisplayString =
		entry.locations.length > 0 ? entry.locations[0]?.name : null;

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
		<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow max-w-4xl mx-auto">
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

				<div className="flex gap-6 text-gray-400 py-4 md:py-0 select-none">
					{/* Weather widgets placeholder */}
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
	);
}
