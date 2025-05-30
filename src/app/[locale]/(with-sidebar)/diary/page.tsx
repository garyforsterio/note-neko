import { getDiaryEntries, type DiaryEntryWithRelations } from '#lib/dal';
import { Link } from '#i18n/navigation';
import { format } from 'date-fns';
import { Pencil, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { renderMarkdown } from '#lib/markdown';

export default async function DiaryPage() {
  const t = await getTranslations();

  const entries = await getDiaryEntries();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('diary.title')}</h1>
        <Link
          href="/diary/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('diary.newEntry')}
        </Link>
      </div>

      <div className="space-y-6">
        {entries.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm">{t('diary.noEntries')}</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    href={`/diary/${entry.id}`}
                    className="text-xl font-semibold hover:text-blue-600"
                  >
                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </Link>
                  <p className="text-sm text-gray-500">
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
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>

              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(entry.content),
                  }}
                />
              </div>

              {entry.mentions.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t('diary.mentions')}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entry.mentions.map((mention) => (
                      <Link
                        key={mention.id}
                        href={`/people/${mention.person.id}`}
                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        {mention.person.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {entry.locations.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t('diary.locations')}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entry.locations.map((location) => (
                      <a
                        key={location.id}
                        href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        {location.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
