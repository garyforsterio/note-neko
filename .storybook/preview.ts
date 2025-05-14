import type { Preview } from '@storybook/react';
import '../src/app/[locale]/globals.css';
import { withThemeByClassName } from '@storybook/addon-themes';
import nextIntl from './next-intl';

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
};

export default preview;
