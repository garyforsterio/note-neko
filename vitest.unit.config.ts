import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		setupFiles: ["./src/lib/test-setup.ts"],
		include: ["src/**/*.test.ts"],
		exclude: ["src/**/*.stories.tsx"],
	},
});
