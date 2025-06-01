import type { Meta, StoryObj } from '@storybook/react';
import PeopleMention from './PeopleMention';

const meta: Meta<typeof PeopleMention> = {
  title: 'Diary/PeopleMention',
  component: PeopleMention,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PeopleMention>;

const mockPeople = [
  {
    id: '1',
    name: 'John Doe',
    birthday: new Date('1990-01-01'),
    howWeMet: 'At a conference',
    interests: ['Programming', 'Reading'],
  },
  {
    id: '2',
    name: 'Jane Smith',
    birthday: new Date('1992-05-15'),
    howWeMet: 'Through mutual friends',
    interests: ['Photography', 'Travel'],
  },
  {
    id: '3',
    name: 'Bob Johnson',
    birthday: null,
    howWeMet: null,
    interests: [],
  },
];

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSelect: (person) => console.log('Selected person:', person),
    people: mockPeople,
    searchTerm: '',
  },
};

export const WithSearchTerm: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSelect: (person) => console.log('Selected person:', person),
    people: mockPeople,
    searchTerm: 'John',
  },
};

export const NoResults: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSelect: (person) => console.log('Selected person:', person),
    people: mockPeople,
    searchTerm: 'xyz',
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onSelect: (person) => console.log('Selected person:', person),
    people: mockPeople,
    searchTerm: '',
  },
};
