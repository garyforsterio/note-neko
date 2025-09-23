import { getTranslations } from "next-intl/server";
import { requireAuth } from "#lib/auth";

export default async function SettingsPage() {
	await requireAuth();
	const t = await getTranslations("settings");

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold mb-4">{t("welcome.title")}</h2>
					<p className="text-gray-600 mb-6">{t("welcome.description")}</p>

					<div className="grid gap-4">
						<div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
							<h3 className="font-medium mb-2">
								{t("sections.profile.title")}
							</h3>
							<p className="text-sm text-gray-600">
								{t("sections.profile.description")}
							</p>
						</div>

						<div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
							<h3 className="font-medium mb-2">{t("sections.social.title")}</h3>
							<p className="text-sm text-gray-600">
								{t("sections.social.description")}
							</p>
						</div>

						<div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
							<h3 className="font-medium mb-2">
								{t("sections.account.title")}
							</h3>
							<p className="text-sm text-gray-600">
								{t("sections.account.description")}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
