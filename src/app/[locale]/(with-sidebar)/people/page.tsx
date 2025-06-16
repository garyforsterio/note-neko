import { getPeople } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import PersonCard from "./components/PersonCard";
import PageHeader from "./components/PageHeader";

export default async function PeoplePage() {
	const t = await getTranslations();
	const people = await getPeople();

	return (
		<div className="container mx-auto px-4 py-8">
			<PageHeader />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{people.length === 0 ? (
					<div className="bg-white p-6 rounded-lg shadow-md">
						<p className="text-gray-500 text-sm">{t("people.noPeople")}</p>
					</div>
				) : (
					people.map((person) => <PersonCard key={person.id} person={person} />)
				)}
			</div>
		</div>
	);
}
