import { getTranslations } from "next-intl/server";
import { getUserProfile } from "#lib/dal";
import { ProfileSettingsForm } from "./components/ProfileSettingsForm";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.sections.profile.title"),
	};
}

export default async function ProfileSettingsPage() {
	const t = await getTranslations("settings");

	const user = await getUserProfile();

	let initialDefaultLocation = null;
	if (
		user?.defaultLocationPlaceId &&
		user?.defaultLocationName &&
		user?.defaultLocationLat !== null && // Ensure these are not null
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
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					{t("sections.profile.title")}
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-4">
						{t("sections.profile.title")}
					</h2>
					<p className="text-gray-600 mb-6">
						{t("sections.profile.description")}
					</p>

					<ProfileSettingsForm
						initialDefaultLocation={initialDefaultLocation}
					/>
				</div>
			</div>
		</div>
	);
}
