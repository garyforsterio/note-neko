import { getTranslations } from "next-intl/server";
import { SignOutButton } from "#components/SignOutButton";
import { Link } from "#i18n/navigation";
import { requireAuth } from "#lib/auth";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.title"),
	};
}

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
						<Link
							href="/settings/profile"
							className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
						>
							<h3 className="font-medium mb-2">
								{t("sections.profile.title")}
							</h3>
							<p className="text-sm text-gray-600">
								{t("sections.profile.description")}
							</p>
						</Link>

						<Link
							href="/settings/social"
							className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
						>
							<h3 className="font-medium mb-2">{t("sections.social.title")}</h3>
							<p className="text-sm text-gray-600">
								{t("sections.social.description")}
							</p>
						</Link>

						<Link
							href="/settings/privacy"
							className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
						>
							<h3 className="font-medium mb-2">
								{t("sections.privacy.title")}
							</h3>
							<p className="text-sm text-gray-600">
								{t("sections.privacy.description")}
							</p>
						</Link>

						<Link
							href="/settings/account"
							className="p-4 border rounded-lg hover:bg-gray-50 transition-colors block"
						>
							<h3 className="font-medium mb-2">
								{t("sections.account.title")}
							</h3>
							<p className="text-sm text-gray-600">
								{t("sections.account.description")}
							</p>
						</Link>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<SignOutButton />
					</div>
				</div>
			</div>
		</div>
	);
}
