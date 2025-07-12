import { setProjectAnnotations } from "@storybook/experimental-nextjs-vite";
import { beforeAll } from "vitest";
import { vi } from "vitest";
import * as previewAnnotations from "./preview";

// Mock environment variables
vi.stubEnv("JWT_SECRET", "test-secret-key");
vi.stubEnv("NODE_ENV", "test");

const annotations = setProjectAnnotations([previewAnnotations]);

// Run Storybook's beforeAll hook
beforeAll(annotations.beforeAll);
