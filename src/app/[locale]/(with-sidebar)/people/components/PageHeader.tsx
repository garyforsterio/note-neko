'use client';

import { Link } from '#i18n/navigation';
import { useTranslations } from 'next-intl';

export default function PageHeader() {
  const t = useTranslations();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">{t('people.title')}</h1>
      <Link
        href="/people/new"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        {t('people.addPerson')}
      </Link>
    </div>
  );
}
