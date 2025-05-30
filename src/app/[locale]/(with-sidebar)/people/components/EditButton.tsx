'use client';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '#lib/utils';
import { Link } from '#i18n/navigation';

interface EditButtonProps {
  personId: string;
  size?: 'small' | 'normal';
}

export default function EditButton({ personId, size }: EditButtonProps) {
  const t = useTranslations();

  return (
    <Link
      href={`/people/${personId}/edit`}
      className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
      title={t('people.editProfile')}
    >
      <Pencil className={cn(size === 'small' ? 'h-4 w-4' : 'h-6 w-6')} />
    </Link>
  );
}
