
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
// Mock environment variables
vitest_1.vi.stubEnv("JWT_SECRET", "test-secret-key");
vitest_1.vi.stubEnv("NODE_ENV", "test");
// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
    value: {
        randomUUID: vitest_1.vi.fn(() => "mock-uuid"),
    },
});
