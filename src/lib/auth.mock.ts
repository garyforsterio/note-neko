import { fn } from "@storybook/test";

import * as actual from "./auth";

export const requireAuth = fn(actual.requireAuth).mockName("requireAuth");

export const getCurrentUser = fn(actual.getCurrentUser).mockName(
	"getCurrentUser",
);
