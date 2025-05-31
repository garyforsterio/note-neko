import { fn } from '@storybook/test';

import * as actual from './server';

export const getTranslations = fn(actual.getTranslations).mockName(
  'getTranslations'
);
