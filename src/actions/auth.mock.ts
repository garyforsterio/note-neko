import { fn } from "@storybook/test";
import * as actual from "./auth";
export const signUp = fn(actual.signUp).mockName("signUp");
export const login = fn(actual.login).mockName("login");
export const logout = fn(actual.logout).mockName("logout");
export const requestPasswordReset = fn(actual.requestPasswordReset).mockName(
	"requestPasswordReset",
);
export const resetPassword = fn(actual.resetPassword).mockName("resetPassword");
