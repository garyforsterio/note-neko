import { format } from "date-fns";
import { notFound } from "next/navigation";
import { getCreditsRemaining } from "#lib/credits";
import { getDiaryEntry, getPeople, getUserBillingInfo } from "#lib/dal";
import { getHistoricWeather } from "#lib/utils/weather";
import DiaryEntryPageClient from "./components/DiaryEntryPageClient";

interface DiaryEntryPageProps {
	params: Promise<{
		id: string;
		locale: string;
	}>;
	searchParams: Promise<{
		nextDay?: string;
		mode?: "edit";
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
	const [entry, allPeople, billing, { nextDay, mode }] = await Promise.all([
		getDiaryEntry((await params).id),
		getPeople(),
		getUserBillingInfo(),
		searchParams,
	]);
	const creditsRemaining = billing
		? getCreditsRemaining(billing.subscriptionStatus, billing.aiCreditsUsed)
		: 0;

	if (!entry) {
		notFound();
	}

	const location = entry.locations.length > 0 ? entry.locations[0] : null;
	const weather = location
		? await getHistoricWeather(location.lat, location.lng, new Date(entry.date))
		: null;

	const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";

	return (
		<div className="container mx-auto px-4 py-8">
			<DiaryEntryPageClient
				entry={entry}
				allPeople={allPeople}
				googleMapsApiKey={googleMapsApiKey}
				nextDay={nextDay}
				weather={weather}
				mode={mode}
				creditsRemaining={creditsRemaining}
			/>
		</div>
	);
}
