import { expect } from "@storybook/test";
import { within, userEvent, getByText } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import LocationMentionSheet from "./LocationMentionSheet";

const meta: Meta<typeof LocationMentionSheet> = {
	title: "Diary/LocationMentionSheet",
	component: LocationMentionSheet,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof LocationMentionSheet>;

const mockPredictions = [
	{
		name: "New York",
		placeId: "ChIJaXQRsBm3woAR3CUvk4bqwJs",
		lat: 40.7128,
		lng: -74.006,
		formattedAddress: "New York, NY, USA",
	},
	{
		name: "New York City Hall",
		placeId: "ChIJaXQRsBm3woAR3CUvk4bqwJs2",
		lat: 40.7127,
		lng: -74.0059,
		formattedAddress: "City Hall Park, New York, NY 10007, USA",
	},
];

export const Default: Story = {
	args: {
		isOpen: true,
		onClose: () => {},
		onLocationSelect: (location) => console.log("Selected location:", location),
		searchTerm: "",
		predictions: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check if the sheet is open
		await expect(canvas.getByText("Add location")).toBeInTheDocument();

		// Check if the search placeholder is visible
		await expect(canvas.getByText("Search for a location")).toBeInTheDocument();

		// Check if "No locations found" is displayed
		await expect(canvas.getByText("No locations found")).toBeInTheDocument();
	},
};

export const WithSearchResults: Story = {
	args: {
		isOpen: true,
		onClose: () => {},
		onLocationSelect: (location) => console.log("Selected location:", location),
		searchTerm: "New York",
		predictions: mockPredictions,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check if the search term is displayed
		await expect(canvas.getByText("New York")).toBeInTheDocument();

		// Check if predictions are displayed
		await expect(canvas.getByText("New York City Hall")).toBeInTheDocument();
		await expect(canvas.getByText("New York, NY, USA")).toBeInTheDocument();
		await expect(
			canvas.getByText("City Hall Park, New York, NY 10007, USA"),
		).toBeInTheDocument();

		// Check if first prediction has blue background
		const firstPrediction = canvas.getByText("New York").closest("div");
		await expect(firstPrediction).toHaveClass("bg-blue-50");

		// Test location selection
		const locationButton = canvas
			.getByText("New York City Hall")
			.closest("button");

		if (!locationButton) {
			throw new Error("Location button not found");
		}

		await userEvent.click(locationButton);
	},
};

export const NoResults: Story = {
	args: {
		isOpen: true,
		onClose: () => {},
		onLocationSelect: (location) => console.log("Selected location:", location),
		searchTerm: "Nonexistent City",
		predictions: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check if the search term is displayed
		await expect(canvas.getByText("Nonexistent City")).toBeInTheDocument();

		// Check if "No locations found" is displayed
		await expect(canvas.getByText("No locations found")).toBeInTheDocument();
	},
};

export const Closed: Story = {
	args: {
		isOpen: false,
		onClose: () => {},
		onLocationSelect: (location) => console.log("Selected location:", location),
		searchTerm: "",
		predictions: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check if the sheet is not visible
		await expect(canvas.queryByText("Add Location")).not.toBeInTheDocument();
	},
};
