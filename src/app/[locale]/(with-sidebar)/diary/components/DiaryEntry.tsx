import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	CloudSun,
	MapPin,
	Moon,
	Pencil,
	Sunrise,
} from "lucide-react";
import { getLocale } from "next-intl/server";
import { DiaryContent } from "#components/DiaryContent";
import { Link } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
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

	return (
		<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
						<MapPin size={14} className="text-gray-400" />
						<span className="text-gray-600 font-medium">
							{t("diary.unknownLocation")}
						</span>
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
					<DiaryMentions mentions={entry.mentions} />
					<DiaryLocations locations={entry.locations} />
				</div>

				<div className="flex items-center gap-1 shrink-0">
					<Link
						href={`/diary/${entry.id}/edit`}
						className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
						title={t("diary.refineEntryTitle")}
					>
						<Pencil className="h-4 w-4" />
					</Link>
					<ShareButton entry={entry} locale={locale} />
					<DeleteButton id={entry.id} />
				</div>
			</div>
		</div>
	);
}
