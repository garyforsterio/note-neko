import type { Preview } from '@storybook/react';
import '../src/app/[locale]/globals.css';
import { withThemeByClassName } from '@storybook/addon-themes';
import nextIntl from './next-intl';
import * as MockDate from 'mockdate';
import { userEvent } from '@storybook/test';
import { initializeDB } from '#lib/db.mock';
import { getTranslations } from '#lib/i18n/server.mock';
import { useTranslations } from 'next-intl';

export const decorators = [
  withThemeByClassName({
    themes: {
      light: '',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        autoplay: true,
      },
    },
    nextIntl,
  },
  initialGlobals: {
    locale: 'en',
    locales: {
      en: { icon: '🇬🇧', title: 'English', right: 'EN' },
      ja: { icon: '🇯🇵', title: '日本語', right: 'JA' },
    },
  },
  tags: ['autodocs'],
  async beforeEach({ context, parameters, globals }) {
    // mock backend translations with useTranslations https://github.com/amannn/next-intl/discussions/771
    getTranslations.mockImplementation(useTranslations as any);
    context.userEvent = userEvent.setup({
      // When running vitest in browser mode, the pointer events are not correctly simulated.
      // This can be related to this [known issue](https://github.com/microsoft/playwright/issues/12821).
      // The bug also appears not only in chromium, but also in webkit.
      // We use`{ pointerEventsCheck: 0 }` to disable the pointer events check.
      pointerEventsCheck: 0,
    });

    // Fixed dates for consistent screenshots
    MockDate.set('2024-04-18T12:24:02Z');
    // reset the database to avoid hanging state between stories
    initializeDB();
  },
};

export default preview;
