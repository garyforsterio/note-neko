import { Link } from '#i18n/navigation';
import { format } from 'date-fns';
import { getTranslations } from '#lib/i18n/server';

interface DiaryHeaderProps {
  startDate?: Date;
  endDate?: Date;
}

export async function DiaryHeader({ startDate, endDate }: DiaryHeaderProps) {
  const t = await getTranslations();

  return (
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

      {(startDate || endDate) && (
        <div className="text-sm text-gray-600">
          {startDate && endDate
            ? `${format(startDate, 'MMM d')} - ${format(
                endDate,
                'MMM d, yyyy'
              )}`
            : startDate
            ? format(startDate, 'MMM d, yyyy')
            : format(endDate!, 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
}
