import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					storybookTest({
						configDir: path.join(dirname, ".storybook"),
						// The --no-open flag will skip the automatic opening of a browser
						storybookScript: "pnpm storybook --no-open",
					}),
				],
				test: {
					name: "storybook",
					// Enable browser mode
					browser: {
						enabled: true,
						provider: playwright({}),
						headless: true,
						instances: [{ browser: "chromium" }],
					},
					setupFiles: ["./.storybook/vitest.setup.ts"],
				},
			},
		],
	},
});
