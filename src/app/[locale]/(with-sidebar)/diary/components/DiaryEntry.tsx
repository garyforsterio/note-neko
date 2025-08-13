import { format } from "date-fns";
import { Pencil } from "lucide-react";
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

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex justify-between items-start mb-4">
				<div>
					<Link
						href={`/diary/${entry.id}`}
						className="text-xl font-semibold hover:text-blue-600"
					>
						{format(new Date(entry.date), "MMMM d, yyyy")}
					</Link>
					<p className="text-sm text-gray-500">
						{t("diary.writtenOn", {
							date: format(entry.createdAt, "MMMM d, yyyy"),
						})}
					</p>
				</div>
				<div className="flex gap-2">
					<Link
						href={`/diary/${entry.id}/edit`}
						className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
						title={t("diary.editEntry")}
					>
						<Pencil className="h-4 w-4" />
					</Link>
					<ShareButton entry={entry} locale={locale} />
					<DeleteButton id={entry.id} />
				</div>
			</div>

			<div className="prose max-w-none">
				<DiaryContent
					content={entry.content}
					people={entry.mentions.map((m) => m.person)}
					locations={entry.locations}
					locale={locale}
				/>
			</div>

			<DiaryMentions mentions={entry.mentions} />
			<DiaryLocations locations={entry.locations} />
		</div>
	);
}
