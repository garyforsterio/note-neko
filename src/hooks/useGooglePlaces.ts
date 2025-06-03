import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '#lib/googleMaps';

declare global {
  interface Window {
    google: {
      maps: {
        importLibrary: (library: string) => Promise<any>;
      };
    };
    googleMapsLoaded: boolean;
  }
}

interface LocationPrediction {
  name: string;
  placeId: string;
  lat: number;
  lng: number;
  formattedAddress?: string;
}

export function useGooglePlaces(searchTerm: string, isActive: boolean) {
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const placeRef = useRef<any>(null);

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsScript();
        if (!placeRef.current) {
          const { Place } = await window.google.maps.importLibrary('places');
          placeRef.current = Place;
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeGoogleMaps();
  }, []);

  useEffect(() => {
    const searchPlaces = async () => {
      if (searchTerm && placeRef.current && isActive) {
        try {
          const { places } = await placeRef.current.searchByText({
            textQuery: searchTerm,
            fields: ['displayName', 'id', 'location', 'formattedAddress'],
          });

          const formattedPredictions = places.map((place: any) => {
            console.log(place.id, place.displayName, place.formattedAddress);
            return {
              name: place.displayName,
              placeId: place.id,
              lat: place.location.lat(),
              lng: place.location.lng(),
              formattedAddress: place.formattedAddress,
            };
          });
          setPredictions(formattedPredictions);
        } catch (error) {
          console.error('Error searching places:', error);
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
