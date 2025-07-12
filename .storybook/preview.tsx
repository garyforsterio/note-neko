import type { Preview } from "@storybook/react";
import "../src/app/[locale]/globals.css";
import { userEvent } from "@storybook/test";
import * as MockDate from "mockdate";
import { useTranslations } from "next-intl";
import { requireAuth } from "#lib/auth.mock.js";
import { initializeDB } from "#lib/db.mock";
import { getTranslations } from "#lib/i18n/server.mock";
import { i18NDecorator } from "./decorators/i18n";
import { rscDecorator } from "./decorators/rsc";
export const decorators = [];

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
	},
	globalTypes: {
		locale: {
			description: "Internationalization locale",
			toolbar: {
				icon: "globe",
				items: [
					{ value: "en", right: "🇬🇧", title: "English" },
					{ value: "ja", right: "🇯🇵", title: "日本語" },
				],
			},
		},
	},
	initialGlobals: {
		locale: "en",
	},
	decorators: [rscDecorator, i18NDecorator],
	tags: ["autodocs"],
	async beforeEach({ context, parameters, globals }) {
		// mock backend translations with useTranslations https://github.com/amannn/next-intl/discussions/771
		getTranslations.mockImplementation(
			useTranslations as unknown as typeof getTranslations,
		);

		context.userEvent = userEvent.setup({
			// When running vitest in browser mode, the pointer events are not correctly simulated.
			// This can be related to this [known issue](https://github.com/microsoft/playwright/issues/12821).
			// The bug also appears not only in chromium, but also in webkit.
			// We use`{ pointerEventsCheck: 0 }` to disable the pointer events check.
			pointerEventsCheck: 0,
		});

		// Fixed dates for consistent screenshots
		MockDate.set("2024-03-18T12:24:02Z");
		// reset the database to avoid hanging state between stories
		initializeDB();

		requireAuth.mockResolvedValue({
			userId: "test-user-id",
			wasRefreshed: false,
		});
	},
};

export default preview;
