import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";
import { storybookNextJsPlugin } from "@storybook/experimental-nextjs-vite/vite-plugin";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [storybookNextJsPlugin(), storybookTest()],
	publicDir: "./public",
	test: {
		browser: {
			enabled: true,
			provider: "playwright",
			headless: true,
			screenshotFailures: false,
			instances: [
				{
					browser: "chromium",
				},
			],
		},
		isolate: false,
		setupFiles: ["./.storybook/vitest.setup.ts"],
		coverage: {
			provider: "v8",
		},
	},
});
