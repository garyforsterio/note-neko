import { Link } from '#i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTranslations } from '#lib/i18n/server';

interface DiaryPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startDate?: Date;
  endDate?: Date;
}

export async function DiaryPagination({
  currentPage,
  totalPages,
  pageSize,
  startDate,
  endDate,
}: DiaryPaginationProps) {
  const t = await getTranslations();
  if (totalPages <= 1) return null;

  const getPaginationUrl = (page: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (startDate) {
      params.append('startDate', startDate.toISOString().split('T')[0]!);
    }
    if (endDate) {
      params.append('endDate', endDate.toISOString().split('T')[0]!);
    }

    return `/diary?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <Link
        href={getPaginationUrl(currentPage - 1)}
        className={`p-2 rounded-md ${
          currentPage > 1
            ? 'text-gray-600 hover:bg-gray-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <span className="text-sm text-gray-600">
        {t('diary.pageInfo', { page: currentPage, totalPages })}
      </span>

      <Link
        href={getPaginationUrl(currentPage + 1)}
        className={`p-2 rounded-md ${
          currentPage < totalPages
            ? 'text-gray-600 hover:bg-gray-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
