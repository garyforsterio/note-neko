import en from '../messages/en.json';
import ja from '../messages/ja.json';

const messagesByLocale: Record<string, any> = { en, ja };

const nextIntl = {
  defaultLocale: 'en',
  messagesByLocale,
};

export default nextIntl;
