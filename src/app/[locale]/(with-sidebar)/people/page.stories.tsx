import type { Meta, StoryObj } from "@storybook/react";
import People from "./page";
import { db } from "#lib/db.mock";
import { expect, within } from "@storybook/test";
const meta = {
	title: "app/[locale]/People/page",
	component: People,
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof People>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("People")).toBeInTheDocument();
		const link = canvas.getByText("New Person");
		await expect(link).toBeInTheDocument();
		await expect(link).toHaveAttribute("href", "/en/people/new");
		await expect(canvas.queryByText("No people added yet")).toBeInTheDocument();
	},
};

export const WithPeople: Story = {
	async play({ mount, canvasElement }) {
		await db.user.create({
			data: {
				id: "test-user-id",
				email: "test@test.com",
				passwordHash: "test",
			},
		});
		await db.person.create({
			data: {
				name: "John Doe",
				interests: ["test"],
				user: {
					connect: {
						id: "test-user-id",
					},
				},
			},
		});
		await mount();
		const canvas = within(canvasElement);
		await expect(canvas.getByText("John Doe")).toBeInTheDocument();
	},
};
