import { getPeople } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import DiaryForm from "../components/DiaryForm";

export default async function NewDiaryEntryPage() {
	const t = await getTranslations();
	const people = await getPeople();

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">{t("diary.newEntry")}</h1>
			<DiaryForm people={people} />
		</div>
	);
}
