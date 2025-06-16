import { MapPin } from "lucide-react";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { getGoogleMapsUrl } from "#lib/utils/maps";

interface DiaryLocationsProps {
	locations: DiaryEntryWithRelations["locations"];
}

export async function DiaryLocations({ locations }: DiaryLocationsProps) {
	const t = await getTranslations();
	if (locations.length === 0) return null;

	return (
		<div className="mt-4 pt-4 border-t">
			<h3 className="text-sm font-medium text-gray-700 mb-2">
				{t("diary.locations")}:
			</h3>
			<div className="flex flex-wrap gap-2">
				{locations.map((location) => (
					<a
						key={location.id}
						href={getGoogleMapsUrl(
							location.placeId,
							location.lat,
							location.lng,
						)}
						target="_blank"
						rel="noopener noreferrer"
						className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
					>
						<MapPin className="h-3 w-3" />
						{location.name}
					</a>
				))}
			</div>
		</div>
	);
}
