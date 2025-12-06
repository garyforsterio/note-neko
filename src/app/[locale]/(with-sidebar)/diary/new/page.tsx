import { getTranslations } from "#lib/i18n/server";
import DiaryForm from "../components/DiaryForm";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("diary.newEntry"),
	};
}

interface PageProps {
	searchParams: Promise<{
		date?: string;
	}>;
}

export default async function NewDiaryEntryPage({ searchParams }: PageProps) {
	const t = await getTranslations();
	const { date } = await searchParams;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">{t("diary.newEntry")}</h1>
			<DiaryForm initialDate={date} />
		</div>
	);
}
