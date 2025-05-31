import { Decorator } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import en from '../../messages/en.json';
import ja from '../../messages/ja.json';

const messagesByLocale: Record<string, any> = { en, ja };

export const i18NDecorator: Decorator<object> = (
  Story,
  { globals, parameters }
) => {
  return (
    <NextIntlClientProvider
      locale={globals.locale}
      messages={messagesByLocale[globals.locale]}
    >
      <Story />
    </NextIntlClientProvider>
  );
};
