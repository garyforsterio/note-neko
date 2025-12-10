import { getPeople } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import PageHeader from "./components/PageHeader";
import PersonList from "./components/PersonList";

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

			{people.length === 0 ? (
				<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
					<p className="text-gray-500">
						{query ? t("common.noResults") : t("people.noPeople")}
					</p>
				</div>
			) : (
				<PersonList people={people} />
			)}
		</div>
	);
}
