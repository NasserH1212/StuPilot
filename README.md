# StudentHub AI

StudentHub AI is an Arabic-first, bilingual academic organization product for university students. The production foundation is mobile-first, supports Arabic/RTL and English/LTR equally, and remains independent of any university, country platform, SIS, or LMS.

## Active phase

**Sprint 0 closed and committed; Sprint 1 awaits authentication-provider approval.**

The repository currently contains a tested application shell and engineering foundation only. It does not contain accounts, authentication, onboarding, terms, courses, schedules, academic items, Today, This Week, calendar behavior, reminders, AI, integrations, or production deployment.

## Prerequisites

- Node.js 24 LTS (`>=24 <25`)
- npm 11
- Docker Desktop or another reachable PostgreSQL server for database tests
- Git

On Windows PowerShell installations that block the `npm.ps1` shim, use `npm.cmd` in place of `npm` in every command below.

## Install and run

```bash
npm ci
npm run db:generate
npm run dev
```

Open:

- `http://localhost:3000/` — redirects to Arabic;
- `http://localhost:3000/ar` — Arabic/RTL shell;
- `http://localhost:3000/en` — English/LTR shell;
- `http://localhost:3000/ar/workspace` or `/en/workspace` — application placeholder with no auth or product behavior.

No external font, analytics script, provider SDK, or production credential is required.

## PostgreSQL locally

The supplied Compose file creates separate development and test databases with local-only credentials:

```bash
docker compose up -d postgres-dev postgres-test
```

Copy `.env.example` to `.env.local`, then run:

```bash
npm run db:generate
npm run db:migrate:dev
npm run db:test:migrate
npm run test:integration
```

`prisma db push` is not an approved migration workflow. See [the database migration guide](docs/engineering/database-migrations.md).

## Test and verify

```bash
npm run format:check
npm run lint
npm run boundaries
npm run typecheck
npm run test:unit
npm run test:component
npm run test:a11y
npm run db:test:migrate
npm run test:integration
npm run build
npm run test:e2e
npm run secrets:scan
npm run audit
```

Playwright requires its Chromium binary once per machine:

```bash
npx playwright install chromium
```

`npm run test:e2e` tests the existing production build, so run `npm run build` first. Local equivalents and expected prerequisites are detailed in [the testing guide](docs/engineering/testing.md).

## Production architecture

The application is a Next.js App Router + React + strict TypeScript modular monolith. PostgreSQL and Prisma are isolated under infrastructure, feature layers point toward application/domain code, external providers are behind application-owned interfaces, and `/api/v1` is reserved without an implemented endpoint.

Start with:

- [Architecture overview](docs/engineering/architecture.md)
- [Architecture decision records](docs/adr/README.md)
- [Local setup](docs/engineering/local-setup.md)
- [Environment guide](docs/engineering/environment.md)
- [Testing guide](docs/engineering/testing.md)
- [Contribution workflow](docs/engineering/contributing.md)
- [Sprint 0 report](docs/sprints/sprint-0/report.md)
- [Approved product blueprint](docs/product/README.md)

## What is implemented

- independent Next.js production shell at the repository root;
- Arabic default route and first-response RTL document;
- English route and first-response LTR document;
- localized metadata, dictionaries, bidi isolation, and safe unsupported-locale handling;
- neutral public and application-placeholder shells;
- responsive 320px/desktop layout, semantic landmarks, skip link, focus, reduced motion, loading, error, and not-found states;
- typed environment validation with public/server/test separation;
- enforced modular boundaries and provider-neutral seams;
- one technical-only PostgreSQL/Prisma migration and real integration proof;
- unit, component, accessibility, integration, E2E, secret-scan, audit, and CI foundations.

## Deliberately not implemented

Sprint 1 and all product behavior remain outside this repository phase: registration, login, accounts, onboarding, academic terms, courses, schedules, assignments, projects, exams, Today, This Week, calendars, reminders, files, community, payments, analytics, advertising, session replay, AI, queues, Redis, production vendors, deployment, and production credentials.

## Historical research and prototype

The cancelled research program remains historical and non-blocking under `docs/research/` and `docs/archive/research/`. It contains no participant findings.

`research-prototype/` is a disposable historical prototype. It is excluded from production tooling and is prohibited from being imported, copied, adapted, or reused as production code or as the production design system. An executable boundary test enforces the import prohibition.
