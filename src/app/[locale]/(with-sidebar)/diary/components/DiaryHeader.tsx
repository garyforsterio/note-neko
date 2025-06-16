import { format } from "date-fns";
import { Link } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import ShareAllButton from "./ShareAllButton";

interface DiaryHeaderProps {
	startDate?: Date;
	endDate?: Date;
	entries: DiaryEntryWithRelations[];
}

export async function DiaryHeader({
	startDate,
	endDate,
	entries,
}: DiaryHeaderProps) {
	const t = await getTranslations();

	return (
		<div className="flex flex-col gap-4 mb-8">
			<div className="flex justify-between items-center">
				<h1 className="text-4xl font-bold">{t("diary.title")}</h1>
				<div className="flex items-center gap-4">
					<ShareAllButton
						startDate={startDate}
						endDate={endDate}
						entries={entries}
					/>
					<Link
						href="/diary/new"
						className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
					>
						{t("diary.newEntry")}
					</Link>
				</div>
			</div>

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
	);
}
