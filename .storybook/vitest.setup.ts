import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { vi } from "vitest";
import * as projectAnnotations from "./preview";

// Mock environment variables
vi.stubEnv("JWT_SECRET", "test-secret-key");
vi.stubEnv("NODE_ENV", "test");

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([projectAnnotations]);
