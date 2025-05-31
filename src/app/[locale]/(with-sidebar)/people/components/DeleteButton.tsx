'use client';
import { Trash2 } from 'lucide-react';
import { deletePersonAction } from '#app/actions/people';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import ErrorMessage from '#app/components/ErrorMessage';
import { cn } from '#lib/utils';
import { ActionState } from '#app/actions/types';

interface DeleteButtonProps {
  personId: string;
  personName: string;
  size?: 'small' | 'normal';
}

export default function DeleteButton({
  personId,
  personName,
  size,
}: DeleteButtonProps) {
  const t = useTranslations();
  const [state, action, isLoading] = useActionState<ActionState, FormData>(
    deletePersonAction,
    {}
  );

  return (
    <form action={action}>
      <ErrorMessage message={state.error} />
      <input type="hidden" name="id" value={personId} />
      <button
        type="submit"
        aria-disabled={isLoading}
        className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
        title={t('people.deleteProfile')}
        aria-label={t('people.deleteProfile')}
        onClick={(e) => {
          if (!confirm(t('people.confirmDelete', { name: personName }))) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className={cn(size === 'small' ? 'h-4 w-4' : 'h-6 w-6')} />
      </button>
    </form>
  );
}
