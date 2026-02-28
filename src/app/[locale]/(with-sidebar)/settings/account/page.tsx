import { getTranslations } from "next-intl/server";
import { requireAuth } from "#lib/auth";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.sections.account.title"),
	};
}

export default async function AccountSettingsPage() {
	await requireAuth();
	const t = await getTranslations("settings");

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					{t("sections.account.title")}
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-4">
						{t("sections.account.title")}
					</h2>
					<p className="text-gray-600 mb-6">
						{t("sections.account.description")}
					</p>

					<div className="text-center py-8 text-gray-500">
						<p>{t("comingSoon")}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
