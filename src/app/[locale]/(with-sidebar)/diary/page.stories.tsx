import type { Meta, StoryObj } from '@storybook/react';
import DiaryPage from './page';
import { db } from '#lib/db.mock';
import { expect, within } from '@storybook/test';

const meta = {
  title: 'app/[locale]/Diary/page',
  component: DiaryPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DiaryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Diary')).toBeInTheDocument();
    const link = canvas.getByText('New Entry');
    await expect(link).toBeInTheDocument();
    await expect(link).toHaveAttribute('href', '/en/diary/new');
    await expect(canvas.getByText('No diary entries yet')).toBeInTheDocument();
  },
};

export const WithEntries: Story = {
  async play({ mount, canvasElement }) {
    // Setup test data
    await db.user.create({
      data: {
        id: 'test-user-id',
        email: 'test@test.com',
        passwordHash: 'test',
      },
    });

    // Create a test entry
    await db.diaryEntry.create({
      data: {
        date: new Date(),
        content: '# Test Entry\n\nThis is a test entry.',
        user: {
          connect: {
            id: 'test-user-id',
          },
        },
      },
    });

    await mount();
    const canvas = within(canvasElement);

    // Test entry is displayed
    await expect(canvas.getByText('Test Entry')).toBeInTheDocument();
    await expect(canvas.getByText('This is a test entry.')).toBeInTheDocument();

    // Test edit link
    const editLink = canvas.getByTitle('Edit Entry');
    await expect(editLink).toBeInTheDocument();
  },
};

export const WithMentionsAndLocations: Story = {
  async play({ mount, canvasElement }) {
    // Setup test data
    await db.user.create({
      data: {
        id: 'test-user-id',
        email: 'test@test.com',
        passwordHash: 'test',
      },
    });

    // Create a test person
    const person = await db.person.create({
      data: {
        name: 'John Doe',
        user: {
          connect: {
            id: 'test-user-id',
          },
        },
      },
    });

    // Create a test entry with mentions and locations
    await db.diaryEntry.create({
      data: {
        date: new Date(),
        content: '# Test Entry\n\nMet with @John Doe at the park.',
        user: {
          connect: {
            id: 'test-user-id',
          },
        },
        mentions: {
          create: {
            person: {
              connect: {
                id: person.id,
              },
            },
          },
        },
        locations: {
          create: [
            {
              name: 'Central Park',
              lat: 40.7829,
              lng: -73.9654,
              placeId: 'test-place-id',
            },
          ],
        },
      },
    });

    await mount();
    const canvas = within(canvasElement);

    // Test entry content
    await expect(canvas.getByText('Test Entry')).toBeInTheDocument();

    // Test mention
    const mentionLink = canvas.getByText('John Doe');
    await expect(mentionLink).toBeInTheDocument();
    await expect(mentionLink).toHaveAttribute(
      'href',
      '/en/people/' + person.id
    );

    // Test location
    const locationLink = canvas.getByText('Central Park');
    await expect(locationLink).toBeInTheDocument();
    await expect(locationLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=40.7829,-73.9654'
    );
  },
};
