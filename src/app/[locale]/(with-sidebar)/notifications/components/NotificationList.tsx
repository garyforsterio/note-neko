import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "#i18n/navigation";
import type { getUnreviewedDiaryEntries } from "#lib/dal";

interface NotificationListProps {
	entries: Awaited<ReturnType<typeof getUnreviewedDiaryEntries>>;
}

export default async function NotificationList({
	entries,
}: NotificationListProps) {
	const t = await getTranslations("notifications");

	return (
		<div>
			<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
				{t("reviewNeeded")}
			</h2>
			<p className="text-sm text-gray-400 mb-4">{t("reviewDescription")}</p>
			<div className="space-y-3">
				{entries.map((entry) => {
					const preview = entry.content
						.replace(/\[(person|location):[^\]]+\]/g, "")
						.slice(0, 120);

					return (
						<Link
							key={entry.id}
							href={`/diary/${entry.id}?mode=edit`}
							className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-purple-100 transition-all duration-200"
						>
							<div className="flex items-center gap-3">
								<Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
								<span className="text-sm font-medium text-gray-900">
									{format(new Date(entry.date), "MMMM d, yyyy")}
								</span>
							</div>
							{preview && (
								<p className="text-sm text-gray-400 mt-1.5 truncate ml-7">
									{preview}
								</p>
							)}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
