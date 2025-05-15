import type { Meta, StoryObj } from '@storybook/react';
import People from './page';
import { initializeDB, db } from '#lib/db.mock.js';

const meta = {
  title: 'app/[locale]/People/page',
  component: People,
  async beforeEach() {
    // await db.person.create({
    //   data: {
    //     title: 'Module mocking in Storybook?',
    //     body: "Yup, that's a thing now! 🎉",
    //     createdBy: 'storybookjs',
    //   },
    // });
    // await db.note.create({
    //   /* another */
    // });
  },
} satisfies Meta<typeof People>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
  async play({ mount }) {
    initializeDB({});
    await mount();
  },
};

export const WithPeople: Story = {
  args: {},
  async play({ mount }) {
    initializeDB({});
    await mount();
  },
};

export const Paginated: Story = {
  args: {},
  async play({ mount }) {
    initializeDB({});
    await mount();
  },
};
