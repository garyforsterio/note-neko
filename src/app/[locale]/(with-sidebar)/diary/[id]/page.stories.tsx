import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { db } from "#lib/db.mock";
import DiaryEntryPage from "./page";

const meta = {
	title: "app/[locale]/Diary/[id]/page",
	component: DiaryEntryPage,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			navigation: {
				pathname: "/en/diary/123",
			},
		},
	},
} satisfies Meta<typeof DiaryEntryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMentionsAndLocations: Story = {
	args: {
		params: Promise.resolve({ id: "123" }),
	},
	async play({ mount, canvasElement }) {
		// Setup test data
		await db.user.create({
			data: {
				id: "test-user-id",
				email: "test@test.com",
				passwordHash: "test",
			},
		});

		// Create a test person
		const person = await db.person.create({
			data: {
				name: "John Doe",
				user: {
					connect: {
						id: "test-user-id",
					},
				},
			},
		});

		// Create a test entry with mentions and locations
		const entry = await db.diaryEntry.create({
			data: {
				id: "123",
				date: new Date(),
				content: "# Test Entry\n\nMet with @John Doe at the park.",
				user: {
					connect: {
						id: "test-user-id",
					},
				},
				mentions: {
					create: {
						person: {
							connect: {
								id: person.id,
							},
						},
					},
				},
				locations: {
					create: [
						{
							name: "Central Park",
							lat: 40.7829,
							lng: -73.9654,
							placeId: "test-place-id",
						},
					],
				},
			},
		});

		await mount();
		const canvas = within(canvasElement);

		// Test entry content
		await expect(canvas.getByText("Test Entry")).toBeInTheDocument();
		await expect(
			canvas.getByText("Met with @John Doe at the park."),
		).toBeInTheDocument();

		// Test navigation buttons
		const editButton = canvas.getByText("Edit");
		await expect(editButton).toBeInTheDocument();
		await expect(editButton).toHaveAttribute("href", "/en/diary/123/edit");

		const backButton = canvas.getByText("Back");
		await expect(backButton).toBeInTheDocument();
		await expect(backButton).toHaveAttribute("href", "/en/diary");

		// Test mention
		const mentionLink = canvas.getByText("John Doe");
		await expect(mentionLink).toBeInTheDocument();
		await expect(mentionLink).toHaveAttribute(
			"href",
			`/en/people/${person.id}`,
		);

		// Test location
		const locationLink = canvas.getByText("Central Park");
		await expect(locationLink).toBeInTheDocument();
		await expect(locationLink).toHaveAttribute(
			"href",
			"https://www.google.com/maps/search/?api=1&query=40.7829,-73.9654",
		);
	},
};
