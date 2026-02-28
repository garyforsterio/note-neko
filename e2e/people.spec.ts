import { expect, test } from "@playwright/test";

test.describe("People", () => {
	test.beforeEach(async ({ page }) => {
		// Quick login helper
		const email = `test_people_${Date.now()}@example.com`;
		const password = "Password123!";

		await page.goto("/en/auth/signup");
		await page.getByLabel("Email address").fill(email);
		await page.getByLabel("Password", { exact: true }).fill(password);
		await page.getByLabel("Confirm password").fill(password);
		await page.getByRole("button", { name: "Sign up" }).click();

		// Handle redirect to login
		try {
			await expect(
				page.getByRole("heading", { name: "Sign in to your account" }),
			).toBeVisible({ timeout: 5000 });
			await page.getByLabel("Email address").fill(email);
			await page.getByLabel("Password", { exact: true }).fill(password);
			await page.getByRole("button", { name: "Sign in" }).click();
		} catch (_e) {
			// Already logged in
		}

		// Wait for redirect
		await expect(page).toHaveURL(/.*diary|dashboard/);
	});

	test("should create and view a person", async ({ page }) => {
		// Navigate to People
		await page.getByRole("link", { name: "People" }).click();
		await expect(page).toHaveURL(/.*people/);

		// Add Person
		await page.getByRole("link", { name: "New Person" }).click();
		await page.waitForURL(/.*people\/new/);

		const personName = `Alice ${Date.now()}`;
		await page.getByLabel("Name *").fill(personName);

		// Save
		await page.getByRole("button", { name: "Save" }).click();

		// Verify in list
		await expect(page.getByText(personName)).toBeVisible();

		// Click to view details
		await page.getByText(personName).click();
		await expect(page.getByRole("heading", { name: personName })).toBeVisible();
	});
});
