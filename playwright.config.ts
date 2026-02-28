import path from "node:path";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./e2e",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	expect: {
		timeout: 10_000,
	},
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.BASE_URL || "http://localhost:3000",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",

		/* Bypass Vercel deployment protection when running against preview deployments */
		...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET && {
			extraHTTPHeaders: {
				"x-vercel-protection-bypass":
					process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
				"x-vercel-set-bypass-cookie": "true",
			},
		}),
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 7"] },
		},
	],

	/* Run your local dev server before starting the tests (skipped when BASE_URL is set) */
	webServer: process.env.BASE_URL
		? undefined
		: {
				command: "pnpm dev",
				url: "http://localhost:3000",
				reuseExistingServer: !process.env.CI,
			},
});
