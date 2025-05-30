import React from 'react';
import { getTranslations } from 'next-intl/server';
import { InteractiveComponent } from './InteractiveComponent';

export default async function Page() {
  const t = await getTranslations();

  return (
    <div>
      <h1>{t('page.title')}</h1>
      <InteractiveComponent />
    </div>
  );
}
