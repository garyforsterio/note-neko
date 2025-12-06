"use client";

import { useTranslations } from "next-intl";
import type { LocationResult } from "#actions/locations";
import { useUserLocation } from "#hooks/useUserLocation";
import { Link } from "#i18n/navigation";

interface LocationInfoCardProps {
	initialDefaultLocation: LocationResult | null;
}

export function LocationInfoCard({
	initialDefaultLocation,
}: LocationInfoCardProps) {
	const t = useTranslations();
	const { location: browserGeolocation, requestLocation } = useUserLocation();

	// Determine the effective location to send to the server
	// Priority: Browser Geolocation > User Default Location
	let locationToSubmit: {
		latitude: number;
		longitude: number;
		placeId?: string;
		name?: string;
	} | null = null;
	let locationDisplayString: string | null = null;

	if (browserGeolocation) {
		locationToSubmit = {
			latitude: browserGeolocation.latitude,
			longitude: browserGeolocation.longitude,
		};
		locationDisplayString = t("diary.currentBrowserLocation");
	} else if (initialDefaultLocation) {
		locationToSubmit = {
			latitude: initialDefaultLocation.lat,
			longitude: initialDefaultLocation.lng,
			placeId: initialDefaultLocation.placeId, // Keep placeId for bias if available
			name: initialDefaultLocation.name,
		};
		locationDisplayString = t("diary.defaultLocation", {
			locationName: initialDefaultLocation.name,
		});
	}

	const hasLocation = !!locationToSubmit;

	return (
		<div className="space-y-4 mb-6">
			{/* Hidden Input for form submission */}
			{locationToSubmit && (
				<input
					type="hidden"
					name="locationData"
					value={JSON.stringify(locationToSubmit)}
				/>
			)}

			<div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
				<p className="mb-2">{t("diary.aiProcessingNote")}</p>
				{!browserGeolocation && (
					<div className="flex flex-col gap-1 text-blue-700 mb-2">
						<p>{t("diary.locationRecommendation")}</p>
						<div className="flex gap-2 items-center mt-1">
							<>
								<button
									type="button"
									onClick={requestLocation}
									className="text-blue-600 hover:text-blue-800 underline font-medium"
								>
									{t("diary.enableBrowserLocation")}
								</button>
								{!hasLocation && (
									<>
										<span>|</span>
										<Link
											href="/settings/profile"
											className="text-blue-600 hover:text-blue-800 underline font-medium"
										>
											{t("diary.defaultLocationTip")}
										</Link>
									</>
								)}
							</>
						</div>
					</div>
				)}
				{hasLocation && <div className="mb-2">{locationDisplayString}</div>}
			</div>

			<div className="p-4 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center min-h-[100px] text-gray-400">
				{hasLocation ? (
					<div className="flex items-center gap-2">🌤️</div>
				) : (
					<span>{t("diary.noWeatherLocation")}</span>
				)}
			</div>
		</div>
	);
}
