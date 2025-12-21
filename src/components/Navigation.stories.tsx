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

export const Default: Story = {
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

		// Test active state of Diary link (Mobile)
		const diaryLink = await canvas.findByRole("link", { name: /diary/i });
		// In mobile view, active state is text-gray-900
		await expect(diaryLink).toHaveClass("text-gray-900");

		// Test inactive state of People link
		const peopleLink = await canvas.findByRole("link", { name: /people/i });
		// In mobile view, inactive state is text-gray-400
		await expect(peopleLink).toHaveClass("text-gray-400");
	},
};
