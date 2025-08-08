import { notFound } from "next/navigation";
import { getDiaryEntry } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import DiaryForm from "../../components/DiaryForm";

interface EditDiaryEntryPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditDiaryEntryPage({
	params,
}: EditDiaryEntryPageProps) {
	const t = await getTranslations();
	const entry = await getDiaryEntry((await params).id);

	if (!entry) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">{t("diary.editEntry")}</h1>
			<DiaryForm entry={entry} />
		</div>
	);
}
