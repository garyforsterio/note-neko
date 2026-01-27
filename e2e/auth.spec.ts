import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
	// Use a unique email for each run to avoid conflicts if backend doesn't clean up
	// In a real env, we'd use a seed script or test DB reset.
	const timestamp = Date.now();
	const email = `e2e_user_${timestamp}@example.com`;
	const password = "Password123!";

	test("should allow a user to sign up and log in", async ({ page }) => {
		await page.goto("/en/auth/signup");

		// Check for sign up form
		await expect(
			page.getByRole("heading", { name: "Create your account" }),
		).toBeVisible();

		// Fill sign up
		await page.getByLabel("Email address").fill(email);
		await page.getByLabel("Password", { exact: true }).fill(password);
		await page.getByLabel("Confirm password").fill(password);

		// Submit
		await page.getByRole("button", { name: "Sign up" }).click();

		// After sign up, we expect to be redirected or logged in.
		// If redirected to login (some flows do that), we login.
		// But usually modern apps log you in directly.
		// Let's check if we are redirected to login page by checking for "Sign in" heading

		try {
			await expect(
				page.getByRole("heading", { name: "Sign in to your account" }),
			).toBeVisible({ timeout: 5000 });
			// If we see sign in, then fill it
			await page.getByLabel("Email address").fill(email);
			await page.getByLabel("Password", { exact: true }).fill(password);
			await page.getByRole("button", { name: "Sign in" }).click();
		} catch (_e) {
			// If not redirected to login, assume we are logged in
		}

		// Verify we are inside the app
		// We can check for "Diary" in navigation or header
		await expect(page).toHaveURL(/.*diary/);
		await expect(
			page.getByText(
				"Capture your thoughts, feelings, and the moments that matter",
			),
		).toBeVisible();
	});
});
