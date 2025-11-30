import { Link } from "#i18n/navigation";
import { getTranslations } from "#lib/i18n/server";
import PeopleSearch from "./PeopleSearch";

export default async function PageHeader() {
	const t = await getTranslations();

	return (
		<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
			<h1 className="text-4xl font-bold">{t("people.title")}</h1>
			<div className="flex items-center w-full sm:w-auto">
				<PeopleSearch />
				<Link
					href="/people/new"
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
				>
					{t("people.addPerson")}
				</Link>
			</div>
		</div>
	);
}
