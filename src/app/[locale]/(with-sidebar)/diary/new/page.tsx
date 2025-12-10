import { getUserProfile } from "#lib/dal";
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
	const _t = await getTranslations();
	const { date } = await searchParams;

	const user = await getUserProfile();

	let initialDefaultLocation = null;
	if (
		user?.defaultLocationPlaceId &&
		user?.defaultLocationName &&
		user?.defaultLocationLat !== null &&
		user?.defaultLocationLng !== null
	) {
		initialDefaultLocation = {
			placeId: user.defaultLocationPlaceId,
			name: user.defaultLocationName,
			lat: user.defaultLocationLat,
			lng: user.defaultLocationLng,
		};
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<DiaryForm
				initialDefaultLocation={initialDefaultLocation}
				initialDate={date}
			/>
		</div>
	);
}
