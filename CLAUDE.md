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
- **Database**: PostgreSQL with Prisma ORM (using Accelerate for edge optimization)
- **Styling**: Tailwind CSS 4
- **Forms**: @conform-to with Zod validation
- **Testing**: Vitest for unit tests, Playwright for browser testing, Storybook for component testing
- **Authentication**: Custom JWT-based auth with refresh tokens
- **Internationalization**: next-intl for i18n support
- **Error Tracking**: Sentry integration
- **Package Manager**: pnpm (required)

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
│   ├── auth.ts      # JWT authentication
│   ├── dal.ts       # Data access layer with caching
│   └── db.ts        # Prisma client
├── hooks/            # Custom React hooks
├── schema/           # Zod validation schemas
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
- Use Conform and Zod for form validation
- Must use `requireAuth` for protected actions
- Return pattern:
  ```typescript
  const submission = parseWithZod(formData, { schema })
  if (submission.status !== 'success') {
    return submission.reply()
  }
  // perform action
  redirect('/path')
  ```

#### Form Handling
- Use `@conform-to/react` for form state management
- Use `parseWithZod` for server-side validation
- Create schemas in `src/schema/*.ts`
- Handle validation errors with `submission.reply()`
- Use `redirect()` after successful mutations
- Never use `fetch()` in client components - always use server actions

#### Data Access Layer
- Cached database operations in `src/lib/dal.ts`
- Use `unstable_cache` with proper cache tags
- Revalidate specific tags after mutations
- Example cache tags: `diaries`, `diary:${id}`, `people`, `person:${id}`

#### Database Layer
- Uses Prisma with PostgreSQL (Accelerate for edge)
- Database connection in `src/lib/db.ts`
- Models: User, Person, DiaryEntry, DiaryMention, DiaryLocation, RefreshToken
- All operations should go through Prisma client

#### Authentication
- JWT-based authentication with refresh tokens
- `requireAuth` utility in `src/lib/auth.ts` for protected routes
- Tokens stored in httpOnly cookies
- Password hashing with bcryptjs
- Token expiry: JWT (1 hour), Refresh (30 days)

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

### Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (Prisma Accelerate format)
- `JWT_SECRET` - Secret for JWT signing
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API for location features
- `SENTRY_AUTH_TOKEN` - Sentry authentication token
- `VERCEL_OIDC_TOKEN` - Vercel deployment token

### Internationalization
- All user-facing strings must be internationalized
- Add new translation keys to all locale JSON files in `messages/` folder
- Server components: use `getTranslations` from `next-intl/server`
- Client components: use `useTranslations` from `next-intl`
- Supported locales: English (en), Japanese (ja)

### Code Quality
- Use Biome for linting and formatting (not ESLint/Prettier)
- Tab indentation, double quotes for JavaScript strings
- TypeScript strict mode enabled
- Follow progressive enhancement patterns
- Ensure proper ARIA attributes for accessibility
- All components should have proper loading states
- Conventional commits enforced with commitlint

### URL and Parameter Conventions
- Use hyphen-case (kebab-case) for URL query parameters (e.g., `sort-order`, `page-size`)
- Maintain consistent parameter naming across the application

### Common Patterns
- Page components are Server Components that handle data fetching
- Form components are Client Components that use server actions
- Loading states handled via `loading.tsx` files
- Error handling via `error.tsx` files
- Form validation schemas in `src/schema/` directory
- Cached data operations in `src/lib/dal.ts`
- Reusable UI components in `src/components/ui/`

### External Integrations
- Google Places API for location autocomplete in diary entries
- Dicebear avatars for user profile images
- Sentry for error tracking and monitoring
- Vercel Analytics and Speed Insights