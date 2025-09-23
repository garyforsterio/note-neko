import { getTranslations } from "next-intl/server";
import { requireAuth } from "#lib/auth";

export default async function SocialSettingsPage() {
	await requireAuth();
	const t = await getTranslations("social");

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					{t("sections.profile.title")}
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-4">
						{t("sections.profile.title")}
					</h2>
					<p className="text-gray-600 mb-6">
						{t("sections.profile.description")}
					</p>

					<div className="text-center py-8 text-gray-500">
						<p>Social settings coming soon...</p>
					</div>
				</div>
			</div>
		</div>
	);
}
