# Note Neko

![Note Neko](<./src/app//[locale]/(home)/hero-image.png>)

A personal life tracking application built with Next.js 15, featuring a daily diary, people profile management system, and location tracking.

## Features

- **Daily Diary**

  - Write and manage daily entries with markdown support
  - Preview markdown content in real-time
  - Mention people in diary entries using @ symbol
  - Automatic linking between diary entries and people profiles
  - Track locations for each diary entry

- **People Profiles**

  - Create and manage profiles for people you know
  - Track birthdays, how you met, interests, and additional notes
  - View all diary entries where a person is mentioned
  - Easy navigation between related content

- **Location Tracking**
  - Record and store locations for diary entries
  - View entries by location
  - Integration with mapping services

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Tailwind CSS 4
- MDX for markdown support
- Vitest + Playwright for testing
- Storybook 8 for component development
- Next-intl for internationalization

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the database:

   ```bash
   # Start PostgreSQL using Docker
   docker-compose up -d

   # Run database migrations
   pnpm prisma:setup
   ```

4. Copy `.env.example` to `.env` file in the root directory and populate content:

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

- Run tests:

  ```bash
  pnpm test
  ```

- Start Storybook:

  ```bash
  pnpm storybook
  ```

- Type checking:

  ```bash
  pnpm typecheck
  ```

- Linting:

  ```bash
  pnpm lint
  ```

- Generate Prisma client:
  ```bash
  pnpm prisma:generate
  ```

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: Authentication and user management
- **DiaryEntry**: Stores daily diary entries with markdown content
- **Person**: Stores people profiles with various details
- **DiaryMention**: Many-to-many relationship between DiaryEntry and Person
- **DiaryLocation**: Stores location information for diary entries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Requirements

- Node.js >= 22
- pnpm >= 8.15.2
- Docker (for local PostgreSQL)
