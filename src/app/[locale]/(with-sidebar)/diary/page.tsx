import { getDiaryEntries, type DiaryEntryWithRelations } from '#lib/dal';
import { Link } from '#i18n/navigation';
import { format } from 'date-fns';
import { Pencil, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTranslations } from '#lib/i18n/server';
import { renderMarkdown } from '#lib/markdown';
import DeleteButton from './components/DeleteButton';
import { getGoogleMapsUrl } from '#lib/utils/maps';

interface PageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default async function DiaryPage({ searchParams }: PageProps) {
  const t = await getTranslations();

  const { page, pageSize, startDate, endDate } = await searchParams;

  const parsedPage = page ? Number(page) : 1;
  const parsedPageSize = pageSize ? Number(pageSize) : 10;
  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;

  const { entries, total } = await getDiaryEntries({
    page: parsedPage,
    pageSize: parsedPageSize,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
  });

  const totalPages = Math.ceil(total / parsedPageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">{t('diary.title')}</h1>
          <Link
            href="/diary/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('diary.newEntry')}
          </Link>
        </div>

        {(parsedStartDate || parsedEndDate) && (
          <div className="text-sm text-gray-600">
            {parsedStartDate && parsedEndDate
              ? `${format(parsedStartDate, 'MMM d')} - ${format(
                  parsedEndDate,
                  'MMM d, yyyy'
                )}`
              : parsedStartDate
              ? format(parsedStartDate, 'MMM d, yyyy')
              : format(parsedEndDate!, 'MMM d, yyyy')}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {entries.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm">{t('diary.noEntries')}</p>
          </div>
        ) : (
          entries.map(async (entry) => (
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
                <div className="flex gap-2">
                  <Link
                    href={`/diary/${entry.id}/edit`}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title={t('diary.editEntry')}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteButton id={entry.id} />
                </div>
              </div>

              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: await renderMarkdown(
                      entry.content,
                      entry.mentions.map((m) => m.person),
                      entry.locations
                    ),
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
                        href={getGoogleMapsUrl(
                          location.placeId,
                          location.lat,
                          location.lng
                        )}
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

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <Link
            href={`/diary?page=${parsedPage - 1}&pageSize=${parsedPageSize}${
              parsedStartDate
                ? `&startDate=${parsedStartDate.toISOString().split('T')[0]}`
                : ''
            }${
              parsedEndDate
                ? `&endDate=${parsedEndDate.toISOString().split('T')[0]}`
                : ''
            }`}
            className={`p-2 rounded-md ${
              parsedPage > 1
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-disabled={parsedPage <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <span className="text-sm text-gray-600">
            {t('diary.pageInfo', { page: parsedPage, totalPages })}
          </span>

          <Link
            href={`/diary?page=${parsedPage + 1}&pageSize=${parsedPageSize}${
              parsedStartDate
                ? `&startDate=${parsedStartDate.toISOString().split('T')[0]}`
                : ''
            }${
              parsedEndDate
                ? `&endDate=${parsedEndDate.toISOString().split('T')[0]}`
                : ''
            }`}
            className={`p-2 rounded-md ${
              parsedPage < totalPages
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-disabled={parsedPage >= totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
