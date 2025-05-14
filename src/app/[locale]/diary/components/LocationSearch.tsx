'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { loadGoogleMapsScript } from '@/lib/googleMaps';

interface LocationSearchProps {
  onLocationSelect: (location: {
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }) => void;
  initialValue?: string;
}

declare global {
  interface Window {
    google: any;
    googleMapsLoaded: boolean;
  }
}

export default function LocationSearch({
  onLocationSelect,
  initialValue,
}: LocationSearchProps) {
  const t = useTranslations();
  const [searchBox, setSearchBox] = useState<any>(null);
  const [inputValue, setInputValue] = useState(initialValue || '');

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        initializeSearchBox();
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });
  }, []);

  const initializeSearchBox = () => {
    const input = document.getElementById(
      'location-search'
    ) as HTMLInputElement;
    const searchBox = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode', 'establishment'],
      fields: ['name', 'place_id', 'geometry'],
    });

    searchBox.addListener('place_changed', () => {
      const place = searchBox.getPlace();
      if (place.geometry) {
        onLocationSelect({
          name: place.name,
          placeId: place.place_id,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });

    setSearchBox(searchBox);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          id="location-search"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('diary.searchLocation')}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
