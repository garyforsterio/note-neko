import { MapPin } from "lucide-react";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { getGoogleMapsUrl } from "#lib/utils/maps";

interface DiaryLocationsProps {
	locations: DiaryEntryWithRelations["locations"];
}

export async function DiaryLocations({ locations }: DiaryLocationsProps) {
	if (locations.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2">
			{locations.map((location) => (
				<a
					key={location.id}
					href={getGoogleMapsUrl(location.placeId, location.lat, location.lng)}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-100/50"
				>
					<MapPin size={14} className="opacity-70" />
					{location.name}
				</a>
			))}
		</div>
	);
}
