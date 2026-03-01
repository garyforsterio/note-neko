import { getTranslations } from "next-intl/server";
import { getUnreviewedDiaryEntries } from "#lib/dal";
import NotificationList from "./components/NotificationList";

export default async function NotificationsPage() {
	const t = await getTranslations("notifications");
	const unreviewedEntries = await getUnreviewedDiaryEntries();

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>

			{unreviewedEntries.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-gray-500 text-lg">{t("noNotifications")}</p>
				</div>
			) : (
				<NotificationList entries={unreviewedEntries} />
			)}
		</div>
	);
}
