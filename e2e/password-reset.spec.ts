import { expect, test } from "@playwright/test";
import { PrismaClient } from "../src/generated/prisma/client.js";

const db = new PrismaClient({
	accelerateUrl: process.env.DATABASE_URL,
});

test.describe("Password Reset", () => {
	const timestamp = Date.now();
	const email = `e2e_reset_${timestamp}@example.com`;
	const originalPassword = "Password123!";
	const newPassword = "NewPassword456!";

	test.afterAll(async () => {
		await db.user.deleteMany({ where: { email } });
		await db.$disconnect();
	});

	test("should allow a user to reset their password", async ({ page }) => {
		// Step 1: Sign up a new user
		await page.goto("/en/auth/signup");
		await page.getByLabel("Email address").fill(email);
		await page.getByLabel("Password", { exact: true }).fill(originalPassword);
		await page.getByLabel("Confirm password").fill(originalPassword);
		await page.getByRole("button", { name: "Sign up" }).click();

		// Wait for redirect to login page
		await expect(
			page.getByRole("heading", { name: "Sign in to your account" }),
		).toBeVisible({ timeout: 10000 });

		// Step 2: Navigate to forgot password page
		await page.getByRole("link", { name: "Forgot your password?" }).click();
		await expect(
			page.getByRole("heading", { name: "Reset your password" }),
		).toBeVisible();

		// Step 3: Submit email for password reset
		await page.getByLabel("Email address").fill(email);
		await page.getByRole("button", { name: "Send reset link" }).click();

		// Wait for success message
		await expect(
			page.getByText("If an account exists with that email"),
		).toBeVisible({ timeout: 10000 });

		// Step 4: Query the database for the reset token (bypassing email)
		const user = await db.user.findUniqueOrThrow({
			where: { email },
			select: { resetToken: true },
		});
		expect(user.resetToken).toBeTruthy();

		// Step 5: Navigate to reset password page with token
		await page.goto(`/en/auth/reset-password?token=${user.resetToken}`);
		await expect(
			page.getByRole("heading", { name: "Set new password" }),
		).toBeVisible();

		// Step 6: Submit new password
		await page.getByLabel("New password", { exact: true }).fill(newPassword);
		await page.getByLabel("Confirm new password").fill(newPassword);
		await page.getByRole("button", { name: "Reset password" }).click();

		// Step 7: Should redirect to login with reset success message
		await expect(
			page.getByRole("heading", { name: "Sign in to your account" }),
		).toBeVisible({ timeout: 10000 });
		await expect(page.getByText("Your password has been reset")).toBeVisible();

		// Step 8: Log in with the new password
		await page.getByLabel("Email address").fill(email);
		await page.getByLabel("Password", { exact: true }).fill(newPassword);
		await page.getByRole("button", { name: "Sign in" }).click();

		// Verify we're in the app
		await expect(page).toHaveURL(/.*diary/);
	});
});
