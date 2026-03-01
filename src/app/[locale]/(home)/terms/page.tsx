import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "#i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("terms");
	return {
		title: t("title"),
	};
}

export default async function TermsOfServicePage() {
	const t = await getTranslations("terms");

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
						{t("serviceDescription.title")}
					</h2>
					<p className="text-gray-700">{t("serviceDescription.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">{t("accounts.title")}</h2>
					<p className="text-gray-700">{t("accounts.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("userContent.title")}
					</h2>
					<p className="text-gray-700 mb-2">{t("userContent.ownership")}</p>
					<p className="text-gray-700 mb-2">{t("userContent.license")}</p>
					<p className="text-gray-700">{t("userContent.responsibility")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("aiProcessing.title")}
					</h2>
					<p className="text-gray-700 mb-4">{t("aiProcessing.description")}</p>
					<ul className="list-disc list-inside text-gray-700 space-y-2">
						<li>{t("aiProcessing.items.sent")}</li>
						<li>{t("aiProcessing.items.accuracy")}</li>
						<li>{t("aiProcessing.items.noTraining")}</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("acceptable.title")}
					</h2>
					<p className="text-gray-700 mb-4">{t("acceptable.description")}</p>
					<ul className="list-disc list-inside text-gray-700 space-y-2">
						<li>{t("acceptable.items.unauthorized")}</li>
						<li>{t("acceptable.items.interfere")}</li>
						<li>{t("acceptable.items.abuse")}</li>
						<li>{t("acceptable.items.scrape")}</li>
						<li>{t("acceptable.items.reverse")}</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("availability.title")}
					</h2>
					<p className="text-gray-700">{t("availability.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("liability.title")}
					</h2>
					<p className="text-gray-700">{t("liability.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("termination.title")}
					</h2>
					<p className="text-gray-700">{t("termination.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("changesToTerms.title")}
					</h2>
					<p className="text-gray-700">{t("changesToTerms.description")}</p>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">
						{t("governingLaw.title")}
					</h2>
					<p className="text-gray-700">{t("governingLaw.description")}</p>
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
