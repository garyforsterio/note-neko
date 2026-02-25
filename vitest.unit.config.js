"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        environment: "node",
        setupFiles: ["./src/lib/test-setup.ts"],
        include: ["src/**/*.test.ts"],
        exclude: ["src/**/*.stories.tsx"],
    },
});
