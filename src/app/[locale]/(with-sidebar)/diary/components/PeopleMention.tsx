import { useTranslations } from 'next-intl';
import { Link } from '#i18n/navigation';
import ActionSheet from '#components/ActionSheet';
import CreatePersonModal from './CreatePersonModal';
import { useState } from 'react';

interface Person {
  id: string;
  name: string;
  birthday: Date | null;
  howWeMet: string | null;
  interests: string[];
}

interface PeopleMentionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (person: { id: string; name: string }) => void;
  people: Person[];
  searchTerm: string;
}

export default function PeopleMention({
  isOpen,
  onClose,
  onSelect,
  people,
  searchTerm,
}: PeopleMentionProps) {
  const t = useTranslations();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ActionSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t('people.mention')}
      >
        {filteredPeople.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {t('people.noPeople')}
          </div>
        ) : (
          <div className="overflow-y-auto">
            {filteredPeople.map((person, index) => (
              <div
                key={person.id}
                className={`border-b last:border-b-0 ${
                  index === 0 ? 'bg-blue-50' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/people/${person.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {person.name}
                    </Link>
                    <button
                      onClick={() => {
                        onSelect(person);
                        onClose();
                      }}
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
        )}
      </ActionSheet>

      {showCreateModal && (
        <CreatePersonModal
          onClose={() => setShowCreateModal(false)}
          onPersonCreated={(person) => {
            onSelect(person);
            onClose();
          }}
        />
      )}
    </>
  );
}
