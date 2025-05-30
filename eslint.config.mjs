import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ['!.storybook'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          name: 'next/link',
          message: 'Please import from `@/i18n/navigation` instead.'
        },
        {
          name: 'next/navigation',
          importNames: ['redirect', 'permanentRedirect', 'useRouter', 'usePathname'],
          message: 'Please import from `@/i18n/navigation` instead.'
        }
      ]
    },
  },
]);
