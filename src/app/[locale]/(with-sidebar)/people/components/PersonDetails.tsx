import { getTranslations } from '#lib/i18n/server';
import { format } from 'date-fns';

interface Person {
  nickname: string | null;
  birthday: Date | null;
  howWeMet: string | null;
}

interface PersonDetailsProps {
  person: Person;
}

export default async function PersonDetails({ person }: PersonDetailsProps) {
  const t = await getTranslations();
  return (
    <>
      {person.nickname && (
        <p className="text-gray-600 mb-2">
          {t('people.nickname')}: {person.nickname}
        </p>
      )}

      {person.birthday && (
        <p className="text-gray-600 mb-2">
          {t('people.birthday')}: {format(person.birthday, 'MMMM d, yyyy')}
        </p>
      )}

      {person.howWeMet && (
        <p className="text-gray-600 mb-2">
          {t('people.howWeMet')}: {person.howWeMet}
        </p>
      )}
    </>
  );
}
