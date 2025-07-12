import { vi } from "vitest";

// Mock environment variables
vi.stubEnv("JWT_SECRET", "test-secret-key");
vi.stubEnv("NODE_ENV", "test");

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
	value: {
		randomUUID: vi.fn(() => "mock-uuid"),
	},
});
