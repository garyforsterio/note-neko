import { format } from "date-fns";
import { Calendar, History, Plus } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Link } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import ShareAllButton from "./ShareAllButton";
import { SortToggle } from "./SortToggle";

interface DiaryHeaderProps {
	startDate?: Date;
	endDate?: Date;
	entries: DiaryEntryWithRelations[];
	missingCount?: number;
	nextMissingDate?: string;
}

export async function DiaryHeader({
	startDate,
	endDate,
	entries,
	missingCount = 0,
	nextMissingDate,
}: DiaryHeaderProps) {
	const t = await getTranslations();
	const locale = await getLocale();

	return (
		<div className="flex flex-col gap-6 mb-10">
			{/* Top Row: Title & Primary Actions */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
						{t("diary.title")}
					</h1>
					<p className="text-gray-500 mt-1">
						{t("home.features.dailyDiary.description").split(".")[0]}
					</p>
				</div>

				<div className="flex items-center gap-3 w-full md:w-auto">
					<div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm mr-2">
						<ShareAllButton entries={entries} locale={locale} />
					</div>

					<Link
						href="/diary/new"
						className="flex-1 md:flex-none justify-center bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium group"
					>
						<Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
						{t("diary.newEntry")}
					</Link>
				</div>
			</div>

			{/* Second Row: Filters, Sort & Notifications */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
				<div className="flex items-center gap-3">
					{(startDate || endDate) && (
						<div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100">
							<Calendar size={14} />
							<span>
								{startDate && endDate
									? `${format(startDate, "MMM d")} - ${format(
											endDate,
											"MMM d, yyyy",
										)}`
									: startDate
										? format(startDate, "MMM d, yyyy")
										: endDate && format(endDate, "MMM d, yyyy")}
							</span>
							<Link
								href="/diary"
								className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
								title={t("diary.clearDateRange")}
							>
								{/* Simple clear 'x' implies link to base /diary */}
								<span className="sr-only">{t("diary.clearDateRange")}</span>
								<svg
									className="w-3 h-3"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</Link>
						</div>
					)}
					<SortToggle />
				</div>

				{missingCount > 0 && nextMissingDate && (
					<Link
						href={`/diary/new?date=${nextMissingDate}`}
						className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200/50 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors"
					>
						<History size={16} />
						{t("diary.catchUpMessage", { count: missingCount })}
					</Link>
				)}
			</div>
		</div>
	);
}
