"use client";

import {
	APIProvider,
	AdvancedMarker,
	Map as GoogleMap,
	Pin,
	useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

interface DiaryLocation {
	lat: number;
	lng: number;
	name?: string;
	placeId?: string;
}

interface DiaryMapProps {
	apiKey: string;
	locations: DiaryLocation[];
	className?: string;
}

function MapContent({ locations }: { locations: DiaryLocation[] }) {
	const map = useMap();

	useEffect(() => {
		if (!map || locations.length === 0) return;

		const bounds = new google.maps.LatLngBounds();
		for (const loc of locations) {
			bounds.extend({ lat: loc.lat, lng: loc.lng });
		}

		if (locations.length === 1 && locations[0]) {
			map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
			map.setZoom(15);
		} else {
			map.fitBounds(bounds);
		}
	}, [map, locations]);

	return (
		<>
			{locations.map((loc, index) => (
				<AdvancedMarker
					key={loc.placeId || `${loc.lat}-${loc.lng}-${index}`}
					position={{ lat: loc.lat, lng: loc.lng }}
					title={loc.name}
				>
					<Pin
						background={"#2563EB"} // Blue-600
						borderColor={"#1D4ED8"} // Blue-700
						glyphColor={"white"}
					/>
				</AdvancedMarker>
			))}
		</>
	);
}

export default function DiaryMap({
	apiKey,
	locations,
	className,
}: DiaryMapProps) {
	if (!apiKey) return null;

	const defaultCenter = { lat: 0, lng: 0 };
	const center = locations.length > 0 ? locations[0] : defaultCenter;
	const zoom = locations.length > 0 ? 15 : 2;

	return (
		<div className={className}>
			<APIProvider apiKey={apiKey}>
				<GoogleMap
					defaultCenter={center}
					defaultZoom={zoom}
					mapId="DEMO_MAP_ID" // Required for AdvancedMarker
					className="w-full h-full rounded-xl overflow-hidden border border-gray-100 shadow-sm"
					disableDefaultUI={true}
					gestureHandling={"cooperative"}
					reuseMaps={true}
				>
					<MapContent locations={locations} />
				</GoogleMap>
			</APIProvider>
		</div>
	);
}
