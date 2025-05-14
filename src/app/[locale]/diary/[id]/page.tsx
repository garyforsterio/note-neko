import { getDiaryEntry, getDiaryEntries } from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Pencil, MapPin } from 'lucide-react';

interface DiaryEntryPageProps {
  params: {
    id: string;
  };
}

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const t = await getTranslations();
  const [entry, entries] = await Promise.all([
    getDiaryEntry(params.id),
    getDiaryEntries(),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {format(entry.date, 'MMMM d, yyyy')}
          </h1>
          <p className="text-gray-500">
            {t('diary.writtenOn', {
              date: format(entry.createdAt, 'MMMM d, yyyy'),
            })}
          </p>
        </div>
        <Link
          href={`/diary/${entry.id}/edit`}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title={t('diary.editEntry')}
        >
          <Pencil className="h-6 w-6" />
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{entry.content}</p>
        </div>

        {entry.mentions.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {t('diary.mentions')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.mentions.map((mention) => (
                <Link
                  key={mention.id}
                  href={`/people/${mention.person.id}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {mention.person.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {entry.locations.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {t('diary.locations')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.locations.map((location) => (
                <a
                  key={location.id}
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <MapPin className="h-4 w-4" />
                  {location.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
