import type { Meta, StoryObj } from '@storybook/react';
import Navigation from './Navigation';
import { within, expect } from '@storybook/test';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

// Sample entries for the calendar
const sampleEntries = [
  { id: '1', date: new Date('2024-03-01') },
  { id: '2', date: new Date('2024-03-15') },
  { id: '3', date: new Date('2024-03-20') },
];

export const Default: Story = {
  args: {
    entries: sampleEntries,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test desktop navigation links
    const diaryLink = await canvas.findByRole('link', { name: /diary/i });
    const peopleLink = await canvas.findByRole('link', { name: /people/i });

    // Verify links exist
    await expect(diaryLink).toBeInTheDocument();
    await expect(peopleLink).toBeInTheDocument();

    // Verify calendar is rendered when entries are provided
    const calendar = await canvas.findByRole('grid');
    await expect(calendar).toBeInTheDocument();
  },
};

export const WithoutEntries: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify navigation links still exist
    const diaryLink = await canvas.findByRole('link', { name: /diary/i });
    const peopleLink = await canvas.findByRole('link', { name: /people/i });

    await expect(diaryLink).toBeInTheDocument();
    await expect(peopleLink).toBeInTheDocument();

    // Verify calendar is not rendered when no entries are provided
    const calendar = canvas.queryByRole('grid');
    await expect(calendar).not.toBeInTheDocument();
  },
};

// Story to demonstrate mobile view
export const MobileView: Story = {
  args: {
    entries: sampleEntries,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test mobile navigation links
    const diaryLink = await canvas.findByRole('link', { name: /diary/i });
    const peopleLink = await canvas.findByRole('link', { name: /people/i });

    // Verify mobile navigation links exist
    await expect(diaryLink).toBeInTheDocument();
    await expect(peopleLink).toBeInTheDocument();

    // Verify mobile navigation has correct styling
    await expect(diaryLink.closest('nav')).toHaveClass('md:hidden');
  },
};

// Story to test active state
export const ActiveState: Story = {
  args: {
    entries: sampleEntries,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/diary',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test active state of Diary link
    const diaryLink = await canvas.findByRole('link', { name: /diary/i });
    await expect(diaryLink).toHaveClass('bg-gray-100');

    // Test inactive state of People link
    const peopleLink = await canvas.findByRole('link', { name: /people/i });
    await expect(peopleLink).not.toHaveClass('bg-gray-100');
  },
};
