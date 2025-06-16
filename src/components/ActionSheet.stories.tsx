import type { Meta, StoryObj } from "@storybook/react";
import ActionSheet from "./ActionSheet";

const meta: Meta<typeof ActionSheet> = {
	title: "Components/ActionSheet",
	component: ActionSheet,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof ActionSheet>;

export const Default: Story = {
	args: {
		isOpen: true,
		onClose: () => {},
		title: "Action Sheet",
		children: (
			<div className="p-4">
				<p>This is the content of the action sheet.</p>
			</div>
		),
	},
};

export const WithLongContent: Story = {
	args: {
		isOpen: true,
		onClose: () => {},
		title: "Action Sheet with Long Content",
		children: (
			<div className="p-4">
				{Array.from({ length: 20 }).map((_, i) => (
					<p key={i.toString()} className="mb-4">
						This is paragraph {i + 1} of a long content.
					</p>
				))}
			</div>
		),
	},
};

export const Closed: Story = {
	args: {
		isOpen: false,
		onClose: () => {},
		title: "Closed Action Sheet",
		children: (
			<div className="p-4">
				<p>This content should not be visible.</p>
			</div>
		),
	},
};
