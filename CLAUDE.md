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

## Architecture Overview

For detailed architecture, database schema, API documentation, component patterns, and development processes, see the following documentation files:

- **[Architecture](docs/ARCHITECTURE.md)** - System design, tech stack, request flows, caching strategy
- **[Database](docs/DATABASE.md)** - Schema documentation, relationships, query patterns
- **[API](docs/API.md)** - Server actions, API routes, authentication details
- **[Components](docs/COMPONENTS.md)** - Component patterns, UI guidelines, accessibility
- **[Processes](docs/PROCESSES.md)** - Development workflows, testing, deployment

### Quick Reference

**Tech Stack**: Next.js 15, React 19, PostgreSQL, Prisma ORM, Tailwind CSS 4, pnpm

**Key Principles**:

- Default to Server Components
- Use Server Actions for mutations
- Cached data access layer
- JWT authentication with refresh tokens

### Import Mapping

- `#lib/db` - Database client
- `#lib/auth` - Authentication utilities
- `#lib/i18n/server` - Server-side i18n
- `#*` - General src imports

### Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string (Prisma Accelerate format)
- `JWT_SECRET` - Secret for JWT signing
- `OPENROUTER_API_KEY` - OpenAI API key for AI entity extraction from diary text
- `GOOGLE_MAPS_API_KEY` - Google Maps API key for server-side location geocoding (must not have referer restrictions)
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

### Documentation Requirements

**CRITICAL: Documentation updates are MANDATORY for ALL code changes**

When making any changes to the codebase you MUST:

- Update relevant documentation files to reflect current design, architecture, and processes
- Keep documentation succinct and well-organized
- NEVER complete a task without checking if documentation needs updates
- Documentation is organized in the following files:
  - **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and architecture changes
  - **[docs/DATABASE.md](docs/DATABASE.md)** - Database schema and model changes
  - **[docs/API.md](docs/API.md)** - API endpoints and server actions
  - **[docs/COMPONENTS.md](docs/COMPONENTS.md)** - Component patterns and UI guidelines
  - **[docs/PROCESSES.md](docs/PROCESSES.md)** - Development workflows and processes
- Create new documentation files as needed for major features or subsystems

### External Integrations

- Google Places API for location autocomplete in diary entries
- Dicebear avatars for user profile images
- Sentry for error tracking and monitoring
- Vercel Analytics and Speed Insights
