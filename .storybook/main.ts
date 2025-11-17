import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@chromatic-com/storybook",
		"@storybook/addon-docs",
		"@storybook/addon-vitest",
	],
	framework: {
		name: "@storybook/nextjs-vite",
		options: {},
	},
	features: {
		experimentalRSC: true,
	},
	staticDirs: ["../public"],
};
export default config;
