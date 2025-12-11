import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import Navigation from "./Navigation";

const meta: Meta<typeof Navigation> = {
	title: "Components/Navigation",
	component: Navigation,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const WithoutEntries: Story = {
	args: {
		entries: Promise.resolve([]),
	},
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const diaryLink = await canvas.findByRole("link", { name: /diary/i });
		const peopleLink = await canvas.findByRole("link", { name: /people/i });

		await expect(diaryLink).toBeInTheDocument();
		await expect(peopleLink).toBeInTheDocument();
	},
};

// Story to test active state
export const ActiveState: Story = {
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
		nextjs: {
			navigation: {
				pathname: "/diary",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test active state of Diary link
		const diaryLink = await canvas.findByRole("link", { name: /diary/i });
		await expect(diaryLink).toHaveClass("text-blue-600");

		// Test inactive state of People link
		const peopleLink = await canvas.findByRole("link", { name: /people/i });
		await expect(peopleLink).not.toHaveClass("bg-gray-100");
	},
};
