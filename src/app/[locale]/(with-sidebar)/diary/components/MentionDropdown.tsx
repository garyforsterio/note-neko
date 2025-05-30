import { useState } from 'react';
import { Link } from '#i18n/navigation';
import { useTranslations } from 'next-intl';
import CreatePersonModal from './CreatePersonModal';

interface Person {
  id: string;
  name: string;
  birthday: Date | null;
  howWeMet: string | null;
  interests: string[];
}

interface MentionDropdownProps {
  searchTerm: string;
  onSelect: (person: { id: string; name: string }) => void;
  people: Person[];
}

export default function MentionDropdown({
  searchTerm,
  onSelect,
  people,
}: MentionDropdownProps) {
  const t = useTranslations();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredPeople.length === 0) {
    return (
      <>
        <div className="p-4 text-center text-gray-500">
          {t('people.noPeople')}
        </div>
        <div className="p-4 border-t">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            {t('people.addPerson')}
          </button>
        </div>
        {showCreateModal && (
          <CreatePersonModal
            onClose={() => setShowCreateModal(false)}
            onPersonCreated={onSelect}
          />
        )}
      </>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
      {filteredPeople.map((person) => (
        <div key={person.id} className="border-b last:border-b-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/people/${person.id}`}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {person.name}
              </Link>
              <button
                onClick={() => onSelect(person)}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {t('diary.mentions')}
              </button>
            </div>
            {person.birthday && (
              <div className="text-sm text-gray-500">
                {t('people.birthday')}:{' '}
                {new Date(person.birthday).toLocaleDateString()}
              </div>
            )}
            {person.howWeMet && (
              <div className="text-sm text-gray-500 mt-1">
                {t('people.howWeMet')}: {person.howWeMet}
              </div>
            )}
            {person.interests && person.interests.length > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                {t('people.interests')}: {person.interests.join(', ')}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
