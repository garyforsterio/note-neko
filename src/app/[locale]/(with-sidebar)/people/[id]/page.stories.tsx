import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { db } from "#lib/db.mock";
import PersonPage from "./page";

const meta = {
	title: "app/[locale]/People/[id]/page",
	component: PersonPage,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			navigation: {
				pathname: "/en/people/123",
			},
		},
	},
} satisfies Meta<typeof PersonPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAllDetails: Story = {
	args: {
		params: Promise.resolve({ id: "123", locale: "en" }),
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
		const person = await db.person.create({
			data: {
				id: "123",
				name: "John Doe",
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

		// Create a test diary entry that mentions the person
		await db.diaryEntry.create({
			data: {
				date: new Date(),
				content: "# Test Entry\n\nMet with @John Doe today.",
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
			},
		});

		await mount();
		const canvas = within(canvasElement);

		// Test person details
		await expect(canvas.getByText("John Doe")).toBeInTheDocument();
		await expect(canvas.getByText("January 1, 1990")).toBeInTheDocument();
		await expect(canvas.getByText("Met at a conference")).toBeInTheDocument();
		await expect(canvas.getByText("Programming")).toBeInTheDocument();
		await expect(canvas.getByText("Reading")).toBeInTheDocument();
		await expect(
			canvas.getByText("Great friend and mentor"),
		).toBeInTheDocument();

		// Test action buttons
		const editButton = canvas.getByLabelText("Edit profile");
		await expect(editButton).toBeInTheDocument();
		await expect(editButton).toHaveAttribute("href", "/en/people/123/edit");

		const deleteButton = canvas.getByLabelText("Delete profile");
		await expect(deleteButton).toBeInTheDocument();

		// Test mentions section
		await expect(canvas.getByText("Mentioned in")).toBeInTheDocument();
		await expect(canvas.getByText("Test Entry")).toBeInTheDocument();
	},
};

export const WithMinimalDetails: Story = {
	args: {
		params: Promise.resolve({ id: "123", locale: "en" }),
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

		// Create a test person with minimal details
		await db.person.create({
			data: {
				id: "123",
				name: "John Doe",
				interests: [],
				user: {
					connect: {
						id: "test-user-id",
					},
				},
			},
		});

		await mount();
		const canvas = within(canvasElement);

		// Test person details
		await expect(canvas.getByText("John Doe")).toBeInTheDocument();

		// Test that optional fields are not present
		await expect(canvas.queryByText("Birthday")).not.toBeInTheDocument();
		await expect(canvas.queryByText("How we met")).not.toBeInTheDocument();
		await expect(canvas.queryByText("Interests")).not.toBeInTheDocument();
		await expect(canvas.queryByText("Notes")).not.toBeInTheDocument();
		await expect(canvas.queryByText("Mentioned in")).not.toBeInTheDocument();
	},
};
