import { format } from "date-fns";
import { History } from "lucide-react";
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
		<div className="flex flex-col gap-4 mb-8">
			<div className="flex justify-between items-center">
				<h1 className="text-4xl font-bold">{t("diary.title")}</h1>
				<div className="flex items-center gap-4">
					{missingCount > 0 && nextMissingDate && (
						<Link
							href={`/diary/new?date=${nextMissingDate}`}
							className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors flex items-center gap-2"
						>
							<History className="w-5 h-5" />
							{t("diary.catchUpMessage", { count: missingCount })}
						</Link>
					)}
					<ShareAllButton entries={entries} locale={locale} />
					<Link
						href="/diary/new"
						className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
					>
						{t("diary.newEntry")}
					</Link>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div>
					{(startDate || endDate) && (
						<div className="text-sm text-gray-600">
							{startDate && endDate
								? `${format(startDate, "MMM d")} - ${format(
										endDate,
										"MMM d, yyyy",
									)}`
								: startDate
									? format(startDate, "MMM d, yyyy")
									: endDate && format(endDate, "MMM d, yyyy")}
						</div>
					)}
				</div>
				<SortToggle />
			</div>
		</div>
	);
}
