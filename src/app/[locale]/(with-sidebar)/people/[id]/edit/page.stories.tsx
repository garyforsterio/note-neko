import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { db } from "#lib/db.mock";
import EditPersonPage from "./page";

const meta = {
	title: "app/[locale]/People/[id]/edit/page",
	component: EditPersonPage,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			navigation: {
				pathname: "/en/people/123/edit",
			},
		},
	},
} satisfies Meta<typeof EditPersonPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithExistingData: Story = {
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

		// Create a test person with all details
		await db.person.create({
			data: {
				id: "123",
				name: "John Doe",
				nickname: "Johnny",
				birthday: new Date("1990-01-01"),
				howWeMet: "Met at a conference",
				interests: ["Programming", "Reading"],
				notes: "Great friend and mentor",
				user: {
					connect: {
						id: "test-user-id",
					},
				},
			},
		});

		await mount();
		const canvas = within(canvasElement);

		// Test form elements with pre-filled data
		await expect(canvas.getByText("Edit profile")).toBeInTheDocument();

		const nameInput = canvas.getByLabelText("Name *");
		await expect(nameInput).toBeInTheDocument();
		await expect(nameInput).toHaveValue("John Doe");

		const nicknameInput = canvas.getByLabelText("Nickname");
		await expect(nicknameInput).toBeInTheDocument();
		await expect(nicknameInput).toHaveValue("Johnny");

		const birthdayInput = canvas.getByLabelText("Birthday");
		await expect(birthdayInput).toBeInTheDocument();
		await expect(birthdayInput).toHaveValue("1990-01-01");

		const howWeMetInput = canvas.getByLabelText("How we met");
		await expect(howWeMetInput).toBeInTheDocument();
		await expect(howWeMetInput).toHaveValue("Met at a conference");

		const interestsInput = canvas.getByLabelText("Interests");
		await expect(interestsInput).toBeInTheDocument();
		await expect(interestsInput).toHaveValue("Programming, Reading");

		const notesInput = canvas.getByLabelText("Notes");
		await expect(notesInput).toBeInTheDocument();
		await expect(notesInput).toHaveValue("Great friend and mentor");
	},
};
