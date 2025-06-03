import type { Meta, StoryObj } from '@storybook/react';
import NewPersonPage from './page';
import { expect, within } from '@storybook/test';
import { ensureLoggedIn } from '#lib/auth.mock.js';

const meta = {
  title: 'app/[locale]/People/new/page',
  component: NewPersonPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NewPersonPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('New Person')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Name *')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Nickname')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Birthday')).toBeInTheDocument();
    await expect(canvas.getByLabelText('How we met')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Interests')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Notes')).toBeInTheDocument();
  },
};
