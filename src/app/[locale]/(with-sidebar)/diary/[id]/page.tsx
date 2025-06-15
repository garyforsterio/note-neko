import { getDiaryEntry } from '#lib/dal';
import { Link } from '#i18n/navigation';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import { getTranslations } from '#lib/i18n/server';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '#lib/markdown';
import DeleteButton from '../components/DeleteButton';
import { getGoogleMapsUrl } from '#lib/utils/maps';
import Markdown from 'react-markdown';
interface DiaryEntryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const t = await getTranslations();
  const entry = await getDiaryEntry((await params).id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {format(new Date(entry.date), 'MMMM d, yyyy')}
        </h1>
        <div className="flex space-x-4">
          <Link
            href={`/diary/${entry.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('common.edit')}
          </Link>
          <DeleteButton id={entry.id} />
          <Link
            href="/diary"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('common.back')}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="prose max-w-none">
          <Markdown>
            {renderMarkdown(
              entry.content,
              entry.mentions.map((m) => m.person),
              entry.locations
            )}
          </Markdown>
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
                  href={getGoogleMapsUrl(
                    location.placeId,
                    location.lat,
                    location.lng
                  )}
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
