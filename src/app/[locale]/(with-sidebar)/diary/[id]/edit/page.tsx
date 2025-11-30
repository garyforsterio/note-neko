import { notFound } from "next/navigation";
import { getDiaryEntry, getPeople } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import DiaryEditForm from "../../components/DiaryEditForm";

interface DiaryEditPageProps {
	params: Promise<{
		id: string;
		locale: string;
	}>;
}

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("diary.editEntry"),
	};
}

export default async function DiaryEditPage({ params }: DiaryEditPageProps) {
	const t = await getTranslations();
	const [entry, allPeople] = await Promise.all([
		getDiaryEntry((await params).id),
		getPeople(),
	]);

	if (!entry) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">{t("diary.editEntry")}</h1>
			<DiaryEditForm entry={entry} allPeople={allPeople} />
		</div>
	);
}
