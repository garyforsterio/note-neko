import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "#lib/googleMaps";

interface LocationPrediction {
	name: string;
	placeId: string;
	lat: number;
	lng: number;
	formattedAddress?: string;
}

export function useGooglePlaces(searchTerm: string, isActive: boolean) {
	const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
	const placeRef = useRef<google.maps.PlacesLibrary>(null);

	useEffect(() => {
		const initializeGoogleMaps = async () => {
			try {
				await loadGoogleMapsScript();
				if (!placeRef.current) {
					const library = (await window.google.maps.importLibrary(
						"places",
					)) as google.maps.PlacesLibrary;
					placeRef.current = library;
				}
			} catch (error) {
				console.error("Error loading Google Maps:", error);
			}
		};

		initializeGoogleMaps();
	}, []);

	useEffect(() => {
		const searchPlaces = async () => {
			if (searchTerm && placeRef.current && isActive) {
				try {
					const { places } = await placeRef.current.Place.searchByText({
						textQuery: searchTerm,
						fields: ["displayName", "id", "location", "formattedAddress"],
					});

					const formattedPredictions = places.map((place) => {
						return {
							name: place.displayName ?? searchTerm,
							placeId: place.id,
							lat: place.location?.lat() ?? 0,
							lng: place.location?.lng() ?? 0,
							formattedAddress: place.formattedAddress ?? "",
						};
					});
					setPredictions(formattedPredictions);
				} catch (error) {
					console.error("Error searching places:", error);
					setPredictions([]);
				}
			} else if (!isActive) {
				setPredictions([]);
			}
		};

		searchPlaces();
	}, [searchTerm, isActive]);

	return predictions;
}
