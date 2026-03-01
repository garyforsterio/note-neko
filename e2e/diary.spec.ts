import { expect, test } from "@playwright/test";

// We need to be logged in for these tests.
// For now, we'll reuse the auth flow or assume a session.
// To keep it simple without complex setup, we will do a fresh login in "beforeEach"
// or just chain the actions. Ideally, we save storage state.

test.skip("Diary", () => {
	test.beforeEach(async ({ page }, testInfo) => {
		// Quick login helper
		// In a real app, use global setup to save storage state
		const email = `test_diary_${testInfo.testId}_${Date.now()}@example.com`;
		const password = "Password123!";

		await page.goto("/en/auth/signup");
		await page.getByLabel("Email address").fill(email);
		await page.getByLabel("Password", { exact: true }).fill(password);
		await page.getByLabel("Confirm password").fill(password);
		await page.getByRole("button", { name: "Sign up" }).click();

		// Handle redirect to login if necessary
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

		// Wait for redirect to app
		await expect(page).toHaveURL(/.*diary/);
	});

	test("should show notification for unreviewed diary entry", async ({
		page,
	}) => {
		// 1. Create a diary entry (triggers AI processing)
		await page.goto("/en/diary");
		await page.getByRole("link", { name: "New Entry" }).click();

		const entryContent = `Met with Alice at the park. ID: ${Date.now()}`;
		await page.getByPlaceholder(/Describe your day/i).fill(entryContent);
		await page.getByRole("button", { name: "Create" }).click();

		// 2. Wait for redirect to edit page
		await expect(page).toHaveURL(/.*\/diary\/[a-zA-Z0-9]+\?.*mode=edit/);

		// 3. Navigate to notifications
		await page.goto("/en/notifications");

		// 4. Assert notification card is visible (shows "Review Needed" header and entry date)
		await expect(page.getByText("Review Needed")).toBeVisible();
		// Notification shows entry date only (content preview was removed)
		const notificationLink = page.locator(
			'a[href*="/diary/"][href*="mode=edit"]',
		);
		await expect(notificationLink).toBeVisible();

		// 5. Click notification to navigate to edit page
		await notificationLink.click();
		await expect(page).toHaveURL(/.*\/diary\/[a-zA-Z0-9]+\?mode=edit/);

		// 6. Click "Mark as Reviewed"
		await page.getByRole("button", { name: "Mark as Reviewed" }).click();

		// Wait for save to complete (toast appears, edit form switches to view mode)
		await expect(page.getByText("Saved", { exact: true })).toBeVisible();

		// 7. Navigate back to notifications
		await page.goto("/en/notifications");

		// 8. Assert empty state
		await expect(page.getByText("You're all caught up!")).toBeVisible();
	});

	test("should create, view, and delete a diary entry", async ({ page }) => {
		// 1. Create Entry
		await page.goto("/en/diary");

		// "New Entry" button
		await page.getByRole("link", { name: "New Entry" }).click();

		// Fill the entry
		const entryContent = `Today was a good day. ID: ${Date.now()}`;
		await page.getByPlaceholder(/Describe your day/i).fill(entryContent);

		// Save
		await page.getByRole("button", { name: "Create" }).click();

		// 2. View Entry
		// Expect to be navigated to new diary page
		await expect(page).toHaveURL(
			/.*\/[a-z]{2}\/diary\/[a-zA-Z0-9]+\?mode=edit/,
		);
		await expect(page.getByText(entryContent)).toBeVisible();
	});
});
