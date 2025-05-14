# Life Tracker

A personal life tracking application built with Next.js 15, featuring a daily diary and people profile management system.

## Features

- **Daily Diary**

  - Write and manage daily entries with markdown support
  - Preview markdown content in real-time
  - Mention people in diary entries using @ symbol
  - Automatic linking between diary entries and people profiles

- **People Profiles**
  - Create and manage profiles for people you know
  - Track birthdays, how you met, interests, and additional notes
  - View all diary entries where a person is mentioned
  - Easy navigation between related content

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Tailwind CSS
- MDX for markdown support
- Jest + React Testing Library

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
   npx prisma migrate dev
   ```

4. Create a `.env` file in the root directory with the following content:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/life_tracker?schema=public"
   ```

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

- Generate Prisma client:
  ```bash
  pnpm exec prisma generate
  ```

## Database Schema

The application uses PostgreSQL with the following main models:

- **DiaryEntry**: Stores daily diary entries with markdown content
- **Person**: Stores people profiles with various details
- Many-to-many relationship between DiaryEntry and Person for mentions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
