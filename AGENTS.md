# Repository Guidelines

## Agent Operational Constraints

- **Do NOT run git commands.** The user manages version control manually. Do not run `git status`, `git add`, `git commit`, or any other git operations.

## Project Structure & Module Organization

Note Neko is a Next.js 15 App Router codebase; locale routes sit in `src/app/[locale]`. Shared server actions stay in `src/actions`, UI primitives in `src/components`, and stateful helpers in `src/contexts` + `src/hooks`. Cross-cutting utilities (Prisma, auth, i18n) live in `src/lib`, validation in `src/schema`, translations in `/messages`, and Prisma schema/migrations/seeds in `/prisma`. Static assets belong in `/public`, docs in `/docs`, and tests should live beside their targets (e.g., `src/lib/auth.test.ts`) while reusing `src/lib/test-setup.ts`.

## Build, Test, and Development Commands

- `pnpm dev` starts the Next.js dev server; `pnpm build && pnpm start` mirrors production.
- `pnpm test` runs Vitest, `pnpm test:unit` focuses on `vitest.unit.config.ts`, and `pnpm coverage` reports instrumentation.
- `pnpm lint` / `pnpm format` invoke Biome; `pnpm typecheck` runs `tsc --noEmit`.
- Database helpers: `pnpm prisma:generate`, `pnpm prisma:migrate-dev`, `pnpm prisma:seed`—each reads `.env.development` and expects the Postgres container from `docker-compose.yml`.

## Coding Style & Naming Conventions

Use TypeScript with tab indentation (Biome default) and path aliases such as `#lib/*`. Components and server actions use PascalCase, hooks use camelCase, and route segments remain kebab-case (`src/app/[locale]/people/page.tsx`). Favor Tailwind 4 utilities over custom CSS, keep copy in `/messages`, and let Biome (triggered via Lefthook) handle formatting and import order. Avoid inline variable mutation for calculations in render functions; extract logic to pure utility functions instead.

## Testing Guidelines

Vitest covers unit and integration tests; every feature needs a nearby `*.test.ts[x]` plus shared setup via `src/lib/test-setup.ts`. Prefer deterministic data builders so `pnpm coverage` remains meaningful on PRs touching business logic. Playwright specs can live under `tests/` for workflow coverage—note those runs in the PR body.

## Commit & Pull Request Guidelines

Commits follow Conventional Commits (`type(scope): summary`), enforced by `commitlint.config.js` through the Lefthook commit-msg hook. Keep diffs focused, reference issue IDs when applicable, and rely on the automated formatting hooks. Pull requests should include a succinct summary, screenshots, a test checklist (`pnpm test`, `pnpm prisma:migrate-dev`, etc.), and clear notes about env or schema updates.

## Environment & Security Notes

Copy `.env.example` to `.env.development`, keep secrets untracked, and ensure Dockerized Postgres (`docker-compose up -d`) is running before Prisma commands. Sentry configs (`sentry.edge.config.ts`, `sentry.server.config.ts`) must stay privacy-safe—avoid logging tokens or personal notes. Always read third-party keys from helpers in `src/lib`, never inline credentials.
