# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests with Vitest
- `pnpm coverage` - Run tests with coverage
- `pnpm lint` - Lint code using Biome
- `pnpm format` - Format code using Biome
- `pnpm typecheck` - Run TypeScript type checking

### Database Commands
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate-dev` - Run migrations in development
- `pnpm prisma:migrate-deploy` - Deploy migrations to production
- `pnpm prisma:seed` - Seed database with test data

### Development Tools
- `pnpm storybook` - Start Storybook for component development
- `pnpm build-storybook` - Build Storybook

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and React 19
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest for unit tests, Playwright for E2E, Storybook for component testing
- **Authentication**: Custom JWT-based auth with refresh tokens
- **Internationalization**: next-intl for i18n support
- **Package Manager**: pnpm (required, uses workspaces)

### Project Structure
```
src/
├── actions/           # Server actions (use server directive)
├── app/              # Next.js App Router pages
│   ├── [locale]/     # Internationalized routes
│   │   ├── (home)/   # Home page group
│   │   ├── (with-sidebar)/ # Main app with sidebar
│   │   └── auth/     # Authentication pages
│   └── api/          # API routes
├── components/       # Reusable components
├── lib/              # Utility functions and configurations
├── hooks/            # Custom React hooks
└── messages/         # i18n translation files
```

### Key Architecture Principles

#### Server vs Client Components
- Default to Server Components for all new components
- Only use Client Components when interactivity is required
- Server Components: use `getTranslations` from `next-intl/server`
- Client Components: use `useTranslations` from `next-intl` and must have `'use client'` directive

#### Server Actions Pattern
- All server actions in `src/actions/*.ts` files
- Must use `'use server'` directive
- Must use `ActionState` type for return values
- Must use Zod for validation
- Must use `requireAuth` for protected actions
- Must revalidate affected paths after mutations

#### Form Handling
- Use `useActionState` hook for form state management
- Use form `action` prop to connect to server actions
- Handle loading states with `isPending`
- Display error messages from `ActionState`
- Never use `fetch()` in client components - always use server actions

#### Database Layer
- Uses Prisma with PostgreSQL
- Database connection in `src/lib/db.ts`
- Models: User, Person, DiaryEntry, DiaryMention, DiaryLocation, RefreshToken
- All operations should go through Prisma client

#### Authentication
- JWT-based authentication with refresh tokens
- `requireAuth` utility in `src/lib/auth.ts` for protected routes
- Tokens stored in httpOnly cookies
- Password hashing with bcryptjs

#### Import Mapping
- `#lib/db` - Database client (mocked in Storybook)
- `#lib/auth` - Authentication utilities (mocked in Storybook)
- `#lib/i18n/server` - Server-side i18n (mocked in Storybook)
- `#*` - General src imports

### Testing Requirements

#### Storybook Stories
- Create `.stories.tsx` file for each component
- Include at least Empty and WithData states
- Use async play functions for testing
- Mock authentication with `requireAuth.mockResolvedValue`
- Test UI elements, interactions, and accessibility
- Use `within()` for element queries and `expect()` for assertions
- Clean up test data after stories

#### Component Testing
- Use Vitest for unit tests
- Mock database operations
- Test both success and error states
- Verify form validation and submission

### Internationalization
- All user-facing strings must be internationalized
- Add new translation keys to all locale JSON files in `messages/` folder
- Server components: use `getTranslations` from `next-intl/server`
- Client components: use `useTranslations` from `next-intl`

### Code Quality
- Use Biome for linting and formatting (not ESLint/Prettier)
- TypeScript strict mode enabled
- Follow progressive enhancement patterns
- Ensure proper ARIA attributes for accessibility
- All components should have proper loading states

### URL and Parameter Conventions
- Use hyphen-case (kebab-case) for URL query parameters (e.g., `sort-order`, `page-size`)
- Maintain consistent parameter naming across the application

### Common Patterns
- Page components are Server Components that handle data fetching
- Form components are Client Components that use server actions
- Loading states handled via `loading.tsx` files and `isPending` state
- Error handling via `error.tsx` files and `ActionState` error messages
- Reusable UI components in `src/components/ui/`