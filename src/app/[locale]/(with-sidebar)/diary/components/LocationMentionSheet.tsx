import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import ActionSheet from '#components/ActionSheet';

interface LocationMentionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: {
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }) => void;
  searchTerm: string;
  predictions: Array<{
    name: string;
    placeId: string;
    lat: number;
    lng: number;
    formattedAddress?: string;
  }>;
}

export default function LocationMentionSheet({
  isOpen,
  onClose,
  onLocationSelect,
  searchTerm,
  predictions,
}: LocationMentionSheetProps) {
  const t = useTranslations();

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('diary.addLocation')}
    >
      <div className="p-4">
        <div className="relative">
          <div className="flex items-center px-4 py-2 pl-10 border border-gray-300 rounded-md bg-gray-50">
            <MapPin className="absolute left-3 h-4 w-4 text-gray-400" />
            <span className="text-gray-500">
              {searchTerm || t('diary.searchLocation')}
            </span>
          </div>
        </div>
      </div>

      {predictions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          {t('diary.noLocationsFound')}
        </div>
      ) : (
        <div className="overflow-y-auto">
          {predictions.map((place, index) => (
            <div
              key={place.placeId}
              className={`border-b last:border-b-0 ${
                index === 0 ? 'bg-blue-50' : ''
              }`}
            >
              <button
                onClick={() => onLocationSelect(place)}
                className="w-full p-4 text-left hover:bg-gray-50"
              >
                <div className="font-medium text-gray-900">{place.name}</div>
                {place.formattedAddress && (
                  <div className="text-sm text-gray-500">
                    {place.formattedAddress}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </ActionSheet>
  );
}
