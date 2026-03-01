import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "#i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("privacy");
	return {
		title: t("title"),
	};
}

export default async function PrivacyPolicyPage() {
	const t = await getTranslations("privacy");

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-3xl mx-auto px-4 py-16">
				<Link
					href="/"
					className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
				>
					{t("backLink")}
				</Link>

				<h1 className="text-4xl font-bold mt-4 mb-2">{t("title")}</h1>
				<p className="text-gray-500 mb-8">{t("lastUpdated")}</p>
				<p className="text-gray-700 mb-8">{t("intro")}</p>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("dataCollection.title")}
					</h2>

					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("dataCollection.accountInfo.title")}
							</h3>
							<p className="text-gray-700">
								{t("dataCollection.accountInfo.description")}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("dataCollection.diaryContent.title")}
							</h3>
							<p className="text-gray-700">
								{t("dataCollection.diaryContent.description")}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("dataCollection.extractedData.title")}
							</h3>
							<p className="text-gray-700">
								{t("dataCollection.extractedData.description")}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("dataCollection.locationData.title")}
							</h3>
							<p className="text-gray-700">
								{t("dataCollection.locationData.description")}
							</p>
						</div>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("thirdParty.title")}
					</h2>
					<p className="text-gray-700 mb-4">{t("thirdParty.description")}</p>

					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("thirdParty.openrouter.title")}
							</h3>
							<p className="text-gray-700">
								{t("thirdParty.openrouter.description")}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("thirdParty.googleMaps.title")}
							</h3>
							<p className="text-gray-700">
								{t("thirdParty.googleMaps.description")}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("thirdParty.sentry.title")}
							</h3>
							<p className="text-gray-700">
								{t("thirdParty.sentry.description")}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-medium mb-1">
								{t("thirdParty.vercel.title")}
							</h3>
							<p className="text-gray-700">
								{t("thirdParty.vercel.description")}
							</p>
						</div>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("noTraining.title")}
					</h2>
					<p className="text-gray-700">{t("noTraining.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("dataOwnership.title")}
					</h2>
					<p className="text-gray-700">{t("dataOwnership.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("dataSecurity.title")}
					</h2>
					<p className="text-gray-700">{t("dataSecurity.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">{t("cookies.title")}</h2>
					<p className="text-gray-700">{t("cookies.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("retention.title")}
					</h2>
					<p className="text-gray-700">{t("retention.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">{t("children.title")}</h2>
					<p className="text-gray-700">{t("children.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">{t("changes.title")}</h2>
					<p className="text-gray-700">{t("changes.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
					<p className="text-gray-700">{t("contact.description")}</p>
					<p className="text-gray-700 mt-2">
						<a
							href={`mailto:${t("contact.email")}`}
							className="text-blue-600 hover:underline"
						>
							{t("contact.email")}
						</a>
					</p>
				</section>
			</div>
		</div>
	);
}
