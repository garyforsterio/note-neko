import type { Meta, StoryObj } from "@storybook/react";
import NewDiaryEntryPage from "./page";
import { db } from "#lib/db.mock";
import { expect, within } from "@storybook/test";

const meta = {
	title: "app/[locale]/Diary/new/page",
	component: NewDiaryEntryPage,
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NewDiaryEntryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("New Entry")).toBeInTheDocument();
	},
};

export const WithPeople: Story = {
	async play({ mount, canvasElement }) {
		// Setup test data
		await db.user.create({
			data: {
				id: "test-user-id",
				email: "test@test.com",
				passwordHash: "test",
			},
		});

		// Create test people
		await db.person.create({
			data: {
				name: "John Doe",
				user: {
					connect: {
						id: "test-user-id",
					},
				},
			},
		});

		await mount();
		const canvas = within(canvasElement);

		// Test form elements
		await expect(canvas.getByText("New Entry")).toBeInTheDocument();
		await expect(canvas.getByLabelText("Date")).toBeInTheDocument();
		await expect(
			canvas.getByPlaceholderText("Write your diary entry here..."),
		).toBeInTheDocument();
	},
};
