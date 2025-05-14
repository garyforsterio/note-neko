import type { Meta, StoryObj } from '@storybook/react';
import People from './page';

const meta = {
  title: 'app/[locale]/People/page',
  component: People,
} satisfies Meta<typeof People>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const WithPeople: Story = {
  args: {},
};

export const Paginated: Story = {
  args: {},
};
