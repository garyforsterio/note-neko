import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

// Replace ComponentName with your actual component
import ComponentName from "./ComponentName";

const meta = {
	title: "components/ComponentName",
	component: ComponentName,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		// Define your component's props here
		// Example:
		// label: { control: 'text' },
		// disabled: { control: 'boolean' },
	},
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		// Add default props here
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test component rendering
		await expect(canvas.getByRole("button")).toBeInTheDocument();
	},
};

export const WithCustomProps: Story = {
	args: {
		// Add custom props here
		// Example:
		// label: 'Custom Label',
		// disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test custom props
		await expect(canvas.getByText("Custom Label")).toBeInTheDocument();
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole("status")).toBeInTheDocument();
	},
};

export const Error: Story = {
	args: {
		error: "Something went wrong",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("Something went wrong")).toBeInTheDocument();
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button");
		await expect(button).toBeDisabled();
	},
};
