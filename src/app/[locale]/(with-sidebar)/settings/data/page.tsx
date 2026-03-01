import { getTranslations } from "next-intl/server";
import { requireAuth } from "#lib/auth";
import { getCreditsRemaining } from "#lib/credits";
import { getUnprocessedDiaryCount, getUserBillingInfo } from "#lib/dal";
import BulkProcessForm from "./components/BulkProcessForm";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.data.title"),
	};
}

export default async function DataSettingsPage() {
	await requireAuth();
	const t = await getTranslations("settings");
	const [unprocessedCount, billing] = await Promise.all([
		getUnprocessedDiaryCount(),
		getUserBillingInfo(),
	]);
	const creditsRemaining = billing
		? getCreditsRemaining(billing.subscriptionStatus, billing.aiCreditsUsed)
		: 0;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">{t("data.title")}</h1>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold mb-2">
						{t("data.bulkProcess")}
					</h2>
					<p className="text-gray-600 mb-4">
						{t("data.bulkProcessDescription")}
					</p>

					<BulkProcessForm
						initialCount={unprocessedCount}
						creditsRemaining={creditsRemaining}
					/>
				</div>
			</div>
		</div>
	);
}
