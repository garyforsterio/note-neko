import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { db } from '#lib/db.mock';

// Replace ComponentName with your actual component
import ComponentName from './page';

const meta = {
  title: 'app/[locale]/path/to/page',
  component: ComponentName,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test main heading
    await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Test navigation link if present
    const newLink = canvas.getByText('New Item');
    await expect(newLink).toBeInTheDocument();
    await expect(newLink).toHaveAttribute('href', '/en/path/to/new');

    // Test empty state message
    await expect(canvas.getByText('No items added yet')).toBeInTheDocument();
  },
};

export const WithData: Story = {
  async play({ mount, canvasElement }) {
    // Setup test data
    await db.user.create({
      data: {
        id: 'test-user-id',
        email: 'test@test.com',
        passwordHash: 'test',
      },
    });

    // Add your test data here
    await db.item.create({
      data: {
        name: 'Test Item',
        user: {
          connect: {
            id: 'test-user-id',
          },
        },
      },
    });

    await mount();
    const canvas = within(canvasElement);

    // Test data is displayed
    await expect(canvas.getByText('Test Item')).toBeInTheDocument();

    // Test interactive elements
    const editButton = canvas.getByRole('button', { name: /edit/i });
    await expect(editButton).toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en/path/to',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
  },
};

export const Error: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/en/path/to',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Something went wrong')).toBeInTheDocument();
  },
};
