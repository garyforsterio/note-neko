import { fn } from "@storybook/test";

import * as actual from "./auth";

export const requireAuth = fn(actual.requireAuth).mockName("requireAuth");

export const createUserSession = fn(actual.createUserSession).mockName(
	"createUserSession",
);

export const deleteUserSession = fn(actual.deleteUserSession).mockName(
	"deleteUserSession",
);
