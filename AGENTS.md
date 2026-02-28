# Repository Guidelines

## Commands

### Development

- `pnpm dev` — start Next.js dev server (http://localhost:3000)
- `pnpm build && pnpm start` — production build + serve
- `pnpm typecheck` — run `tsc` (strict mode)
- `pnpm lint` — Biome lint with auto-fix (`pnpm biome lint --write ./src`)
- `pnpm format` — Biome format (`pnpm biome format --write ./src`)

### Testing

- `pnpm test` — run all unit tests (Vitest, `vitest.unit.config.ts`)
- `pnpm test src/path/to/file.test.ts` — run a single test file
- `pnpm test:watch` — Vitest in watch mode
- `pnpm test:e2e` — Playwright end-to-end tests
- `pnpm coverage` — Vitest with coverage report

### Database

Requires `.env.development`.

- `pnpm prisma:generate` — regenerate Prisma client (also runs on `pnpm install` via postinstall)
- `pnpm prisma:migrate-dev` — create/apply migrations in dev
- `pnpm prisma:migrate-dev --name migration_name` — named migration
- `pnpm prisma:seed` — seed dev database
- `pnpm prisma:migrate-deploy` — apply migrations to production (uses `.env.production`)

### Infrastructure

- `pnpm tf:check` — format + validate + lint all Terraform (`terraform/persistent`, `terraform/ephemeral`)
- `pnpm k8s:lint` — validate Kubernetes manifests in `k8s/base` and `k8s/overlays/prod`
- `pnpm infra:check` — run both `tf:check` and `k8s:lint`

## Architecture

Note Neko is a personal life-tracking app (diary, people profiles, location tracking) built with Next.js 15 App Router, React 19, PostgreSQL + Prisma, and Tailwind CSS 4. Detailed docs live in `docs/` (ARCHITECTURE.md, DATABASE.md, API.md, COMPONENTS.md, PROCESSES.md).

### Route Layout

All routes are under `src/app/[locale]/` with next-intl locale routing (en, ja):

- `(home)/` — public landing page
- `(with-sidebar)/` — authenticated app shell (requires JWT auth)
  - `diary/` — diary CRUD, entry list, detail, edit
  - `people/` — people profiles, detail, edit
  - `settings/` — user settings
- `auth/` — login, registration, password reset

### Server-First, No API Routes

**Never use API route handlers** (`app/api/*/route.ts`). All mutations go through Server Actions in `src/actions/`. Server Components are the default; use Client Components (`'use client'`) only when interactivity is required.

### Data Flow

1. **Server Actions** (`src/actions/*.ts`) — marked `'use server'`, validate with Conform + Zod (`parseWithZod`), call DAL, then `redirect()`
2. **Data Access Layer** (`src/lib/dal.ts`) — all DB reads/writes go through here. Read functions are wrapped in React `cache()` for request-level dedup. Every function calls `requireAuth()` to get `userId` and scopes queries.
3. **Database** (`src/lib/db.ts`) — singleton `PrismaClient` using `@prisma/adapter-pg` with a `pg` Pool. Prisma generates to `src/generated/prisma`.
4. **Auth** (`src/lib/auth.ts`) — JWT (1h) + refresh token (30d) in httpOnly cookies. `requireAuth()` validates tokens and redirects to `/auth/login` on failure. `validateTokens()` is cached per-request.

### AI Entity Extraction Pipeline

When a diary entry is created, `src/actions/extractEntities.ts` sends the text + existing people list to OpenRouter (Gemini 3 Flash via OpenAI SDK, configured in `src/lib/llm.ts`) to extract mentioned people and locations. Locations are geocoded via Google Maps Places API. Extracted entities are stored as `DiaryMention` and `DiaryLocation` records, and content is tagged with `[person:id]` / `[location:placeId]` markers.

### Key Database Models

See `prisma/schema.prisma`. Core models: `User`, `Person`, `DiaryEntry`, `DiaryMention` (junction), `DiaryLocation`, `Conversation`, `Suggestion`, `Relationship`, `RefreshToken`. All user-owned models cascade-delete from User. Prisma output goes to `src/generated/prisma`.

### Import Aliases

Defined in `package.json` `"imports"` (not `tsconfig.json` paths):

- `#lib/db` → `src/lib/db.ts`
- `#lib/auth` → `src/lib/auth.ts`
- `#lib/i18n/server` → `src/lib/i18n/server.ts`
- `#generated/prisma` → `src/generated/prisma/client.ts`
- `#actions/auth` → `src/actions/auth.ts`
- `#*` → `src/*` (general catch-all)

### Internationalization

- Locales: `en`, `ja` (defined in `src/i18n/routing.ts`)
- Server Components: `getTranslations()` from `next-intl/server`
- Client Components: `useTranslations()` from `next-intl`
- Navigation: use `Link`, `redirect`, `useRouter` from `src/i18n/navigation.ts` (locale-aware wrappers)
- Translation files: `messages/en.json`, `messages/ja.json` — all user-facing strings must be in both

### Form Handling

Forms use `@conform-to/react` + `@conform-to/zod`. Schemas live in `src/schema/`. Client components use `useFormState` with the server action, and `useForm` with `lastResult` for validation feedback.

## Coding Conventions

- **Formatter/Linter**: Biome (not ESLint/Prettier). Tab indentation, double quotes. Lefthook pre-commit hooks auto-format.
- **Naming**: PascalCase for components and server actions, camelCase for hooks, kebab-case for route segments and URL query params (e.g., `sort-order`, `page-size`).
- **Styling**: Tailwind CSS 4 utilities. Use `cn()` (clsx + tailwind-merge) for conditional classes.
- **String constants**: Extract constant-like string literals (URLs, config values, repeated strings) into named constants; never inline them.
- **External links**: Always include `rel="noopener noreferrer"` and `target="_blank"`.
- **Commits**: Conventional Commits (`type(scope): summary`), enforced by commitlint + Lefthook.

## Testing

- Vitest with `vitest.unit.config.ts`. Tests include `src/**/*.test.ts` files, co-located with source.
- Global setup in `src/lib/test-setup.ts` (mocks `JWT_SECRET`, `NODE_ENV`, `crypto.randomUUID`).
- Mock auth with `requireAuth.mockResolvedValue()`; mock DB operations via Vitest `vi.mock()`.
- Playwright E2E tests live under `tests/`.

## Documentation Requirements

When making code changes, update the relevant docs in `docs/`:

- `docs/ARCHITECTURE.md` — system design, request flows, caching
- `docs/DATABASE.md` — schema, relationships, query patterns
- `docs/API.md` — server actions, validation
- `docs/COMPONENTS.md` — component patterns, UI guidelines
- `docs/PROCESSES.md` — workflows, CI/CD, deployment

## CI

GitHub Actions (`.github/workflows/on-push.yml`) runs on every push: Biome check, typecheck, and unit tests. A separate workflow (`migrate-prod.yml`) auto-deploys Prisma migrations to production when `prisma/migrations/**` changes on `main`.

## Environment

Copy `.env.example` to `.env.development`. Key variables: `DATABASE_URL`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `GOOGLE_MAPS_API_KEY`, `SENTRY_AUTH_TOKEN`. Requires Node.js ≥22.14.0 and pnpm ≥10.11.0.
