'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { someAction } from '#app/actions/someAction';
import { ActionState } from '#app/actions/types';
import ErrorMessage from '#app/components/ErrorMessage';

export function ComponentName() {
  const t = useTranslations();
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    someAction,
    {}
  );

  return (
    <form action={action}>
      <ErrorMessage message={state.error} />
      {/* Form fields */}
      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        aria-label={t('form.submit')}
      >
        {isPending ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  );
}
