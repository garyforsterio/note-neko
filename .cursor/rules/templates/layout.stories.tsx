import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { requireAuth } from "#lib/auth.mock.js";

// Replace LayoutName with your actual layout component
import LayoutName from "./layout";

const meta = {
	title: "app/[locale]/path/to/layout",
	component: LayoutName,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
		},
	},
	async beforeEach() {
		requireAuth.mockResolvedValue({
			id: "test-user-id",
			email: "test@test.com",
		});
	},
} satisfies Meta<typeof LayoutName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test layout structure
		await expect(canvas.getByRole("navigation")).toBeInTheDocument();
		await expect(canvas.getByRole("main")).toBeInTheDocument();

		// Test navigation links
		const homeLink = canvas.getByRole("link", { name: /home/i });
		await expect(homeLink).toBeInTheDocument();
		await expect(homeLink).toHaveAttribute("href", "/en");

		// Test user menu if present
		const userMenu = canvas.getByRole("button", { name: /user menu/i });
		await expect(userMenu).toBeInTheDocument();
	},
};

export const WithActiveRoute: Story = {
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/en/active-route",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test active route highlighting
		const activeLink = canvas.getByRole("link", { name: /active route/i });
		await expect(activeLink).toHaveAttribute("aria-current", "page");
	},
};

export const Loading: Story = {
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/en",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole("status")).toBeInTheDocument();
	},
};

export const Error: Story = {
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/en",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("Something went wrong")).toBeInTheDocument();
	},
};
