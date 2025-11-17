// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: ["!.storybook"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					name: "next/link",
					message: "Please import from `@/i18n/navigation` instead.",
				},
				{
					name: "next/navigation",
					importNames: [
						"redirect",
						"permanentRedirect",
						"useRouter",
						"usePathname",
					],
					message: "Please import from `@/i18n/navigation` instead.",
				},
			],
		},
	},
	storybook.configs["flat/recommended"],
]);
