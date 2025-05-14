'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { loadGoogleMapsScript } from '@/lib/googleMaps';

interface LocationMentionProps {
  onLocationSelect: (location: {
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    google: any;
    googleMapsLoaded: boolean;
  }
}

export default function LocationMention({
  onLocationSelect,
  onClose,
}: LocationMentionProps) {
  const t = useTranslations();
  const [searchBox, setSearchBox] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        initializeSearchBox();
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });

    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const initializeSearchBox = () => {
    if (!inputRef.current) return;

    const searchBox = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['geocode', 'establishment'],
        fields: ['name', 'place_id', 'geometry'],
      }
    );

    searchBox.addListener('place_changed', () => {
      const place = searchBox.getPlace();
      if (place.geometry) {
        onLocationSelect({
          name: place.name,
          placeId: place.place_id,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        onClose();
      }
    });

    setSearchBox(searchBox);
  };

  return (
    <div className="absolute z-10 bg-white rounded-lg shadow-lg p-2 min-w-[200px]">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('diary.searchLocation')}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
