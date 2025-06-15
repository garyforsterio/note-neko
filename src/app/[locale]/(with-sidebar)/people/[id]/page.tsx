import { getPerson } from '#lib/dal';
import { getTranslations } from '#lib/i18n/server';
import { notFound } from 'next/navigation';
import { Link } from '#i18n/navigation';
import { format } from 'date-fns';
import DeleteButton from '../components/DeleteButton';
import { renderMarkdown } from '#lib/markdown';
import EditButton from '../components/EditButton';
import Markdown from 'react-markdown';

interface PersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const t = await getTranslations();
  const person = await getPerson((await params).id);

  if (!person) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
          <div className="text-gray-500">
            {t('people.addedOn', {
              date: format(person.createdAt, 'MMMM d, yyyy'),
            })}
          </div>
        </div>
        <div className="flex">
          <DeleteButton personId={person.id} personName={person.name} />
          <EditButton personId={person.id} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {person.birthday && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">
              {t('people.birthday')}
            </h2>
            <p className="text-gray-600">
              {format(person.birthday, 'MMMM d, yyyy')}
            </p>
          </div>
        )}

        {person.howWeMet && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">
              {t('people.howWeMet')}
            </h2>
            <p className="text-gray-600">{person.howWeMet}</p>
          </div>
        )}

        {person.interests.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              {t('people.interests')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {person.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {person.notes && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">{t('people.notes')}</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{person.notes}</p>
          </div>
        )}
      </div>

      {person.mentions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('people.mentionedIn')}</h2>
          <div className="space-y-4">
            {person.mentions.map(async (mention) => (
              <div
                key={mention.diaryEntry.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <Link
                    href={`/diary/${mention.diaryEntry.id}`}
                    className="text-lg font-semibold hover:text-blue-600"
                  >
                    {format(mention.diaryEntry.date, 'MMMM d, yyyy')}
                  </Link>
                </div>
                <Markdown>
                  {renderMarkdown(
                    mention.diaryEntry.content,
                    mention.diaryEntry.mentions.map((m) => m.person),
                    mention.diaryEntry.locations
                  )}
                </Markdown>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
