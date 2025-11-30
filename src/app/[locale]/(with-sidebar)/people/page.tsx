import { getPeople } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import PageHeader from "./components/PageHeader";
import PersonCard from "./components/PersonCard";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("people.title"),
	};
}

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PeoplePage(props: Props) {
	const t = await getTranslations();
	const searchParams = await props.searchParams;
	const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
	const people = await getPeople(query);

	return (
		<div className="container mx-auto px-4 py-8">
			<PageHeader />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{people.length === 0 ? (
					<div className="bg-white p-6 rounded-lg shadow-md">
						<p className="text-gray-500 text-sm">
							{query ? t("common.noResults") : t("people.noPeople")}
						</p>
					</div>
				) : (
					people.map((person) => <PersonCard key={person.id} person={person} />)
				)}
			</div>
		</div>
	);
}
