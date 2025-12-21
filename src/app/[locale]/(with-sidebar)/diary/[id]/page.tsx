import { format } from "date-fns";
import { notFound } from "next/navigation";
import { getDiaryEntry, getPeople } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import DiaryEntryPageClient from "./components/DiaryEntryPageClient";

interface DiaryEntryPageProps {
	params: Promise<{
		id: string;
		locale: string;
	}>;
	searchParams: Promise<{
		nextDay?: string;
	}>;
}

export async function generateMetadata({ params }: DiaryEntryPageProps) {
	const { id } = await params;
	const entry = await getDiaryEntry(id);

	if (!entry) {
		return {};
	}

	return {
		title: format(new Date(entry.date), "MMMM d, yyyy"),
	};
}

export default async function DiaryEntryPage({
	params,
	searchParams,
}: DiaryEntryPageProps) {
	const [entry, allPeople, { nextDay }] = await Promise.all([
		getDiaryEntry((await params).id),
		getPeople(),
		searchParams,
	]);

	if (!entry) {
		notFound();
	}

	const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";

	return (
		<div className="container mx-auto px-4 py-8">
			<DiaryEntryPageClient
				entry={entry}
				allPeople={allPeople}
				googleMapsApiKey={googleMapsApiKey}
				nextDay={nextDay}
			/>
		</div>
	);
}
