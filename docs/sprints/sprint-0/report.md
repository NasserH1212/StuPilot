# Sprint 0 completion report

- **Date:** 2026-08-07 (Asia/Riyadh)
- **Scope:** Repository and engineering foundation only
- **Status:** Implementation complete; awaiting owner review

## 1. Repository baseline

The pre-change repository root was `C:/Users/Hasib/Documents/StudentHub-AI` on `master`, with no commits and all 35 existing files untracked. It contained approved/historical Markdown documentation plus four files under the disposable `research-prototype/`; it contained no package manifest, lockfile, production application, generated assets, credentials, or conflict markers. The identity search confirmed StudentHub AI and found no CreateCV project. See [baseline-report.md](baseline-report.md).

## 2. Files created and modified

Sprint 0 added:

- root runtime/package/format/lint/Next/Vitest/Playwright/Prisma/Compose configuration;
- `app/` locale routes, layouts, state boundaries, global CSS, and reserved `/api/v1` documentation;
- `src/modules/foundation/` domain/application/presentation/transport seams;
- `src/shared/` configuration, localization, validation, time, errors, and observability seams;
- `src/infrastructure/` Prisma implementation and empty provider boundary;
- one technical Prisma schema/migration plus a manual recovery reference;
- scripts for boundaries, secrets, Prisma test targeting, Prisma generation, and deterministic E2E server control;
- 10 test source/setup files across unit, component, accessibility, PostgreSQL integration, and browser E2E;
- one GitHub Actions workflow with PostgreSQL 18.4;
- 15 ADRs, six engineering guides, the baseline, and this report;
- framework-generated `AGENTS.md` and `CLAUDE.md`, which Next.js 16.3 regenerates to require use of its installed documentation.

The root README was updated from blueprint-review status to Sprint 0 setup/scope/status. Approved and historical documents and all four `research-prototype/` files were preserved; none was used as production source.

Generated `src/generated/`, `.next/`, test reports, browser binaries, local environments, and temporary PostgreSQL files are ignored. `next-env.d.ts` is framework-generated/ignored per the installed Next.js guidance; `npm run typecheck` runs `next typegen` first.

## 3. Packages installed and rationale

Every direct package is exactly pinned; transitive resolution is locked by `package-lock.json`.

| Package                                                        |                          Version | Reason                                                                                                      |
| -------------------------------------------------------------- | -------------------------------: | ----------------------------------------------------------------------------------------------------------- |
| `next`                                                         |                           16.3.0 | Supported App Router framework, server rendering, proxy, route/error/metadata conventions                   |
| `react`, `react-dom`                                           |                           19.2.8 | Supported UI/runtime peers for Next.js                                                                      |
| `zod`                                                          |                            4.4.3 | Typed public/server/test environment validation                                                             |
| `@prisma/client`                                               |                            7.9.1 | Generated, typed database client isolated in infrastructure                                                 |
| `@prisma/adapter-pg`                                           |                            7.9.1 | Required Prisma 7 direct PostgreSQL adapter                                                                 |
| `pg`                                                           |                           8.22.0 | PostgreSQL wire driver used by the adapter                                                                  |
| `prisma`                                                       |                            7.9.1 | Schema validation, client generation, and migration CLI                                                     |
| `typescript`                                                   |                            6.0.3 | Strict compiler compatible with the current tool API ecosystem                                              |
| `eslint`, `eslint-config-next`                                 |                   9.39.5, 16.3.0 | Next/React/TypeScript lint policy; ESLint 9 matches current plugin peers                                    |
| `prettier`                                                     |                            3.9.6 | Deterministic formatting                                                                                    |
| `vitest`, `vite`, `jsdom`                                      |            4.1.10, 8.2.1, 29.1.1 | Unit/component/integration runner, transform pipeline, browser-like DOM; JSDOM 29 supports local Node 24.14 |
| `@testing-library/react`, `@testing-library/jest-dom`          |                    16.3.2, 7.0.0 | Accessible component queries and DOM assertions                                                             |
| `@playwright/test`                                             |                           1.62.1 | Real Chromium E2E/responsive/keyboard/hydration tests                                                       |
| `axe-core`                                                     |                           4.13.0 | Component and real-browser accessibility rules                                                              |
| `dotenv`                                                       |                           17.4.2 | Local ignored environment loading for Prisma scripts                                                        |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/pg` | 24.13.3, 19.2.18, 19.2.4, 8.20.4 | Type declarations matched to runtime packages                                                               |

No auth, provider, analytics, font, UI-system, storage, queue, payment, email, AI, or production SDK was installed.

## 4. Runtime and package-manager policy

Node 24 LTS is required (`>=24 <25`); local verification used Node 24.14.0 and official sources showed newer security patches within the same LTS line. npm 11 is required and `packageManager` records npm 11.9.0. CI uses Node 24 and `npm ci`. Direct versions are exact; upgrades review official release/peer/runtime compatibility. TypeScript 7.0 and ESLint 10 were evaluated but held until the surrounding tool APIs/plugin peers support them completely. See ADR 0003.

## 5. Application structure

The production app lives at the repository root. `app/` only composes routes/special files; module presentation/transport depend on application/domain; infrastructure implements application-owned ports. The executable checker prevents UI/transport database access, domain framework/provider access, infrastructure-to-delivery imports, and all prototype imports. `/api/v1` is reserved but has no handler.

## 6. Localization foundation

- `/` redirects to Arabic `/ar`.
- `/ar` emits `lang="ar" dir="rtl"`; `/en` emits `lang="en" dir="ltr"` in the first HTML response.
- Unsupported locale segments return a safe 404 with Arabic fallback document direction.
- Typed dictionaries, localized metadata/alternate links, logical CSS, mixed-direction isolation, and same-destination language switching are present.
- E2E captured console errors and found no direction/hydration mismatch.

There is no locale cookie, browser negotiation, account preference, or large product-copy catalog.

## 7. Styling and accessibility foundation

Plain global CSS and custom-property tokens were chosen over Tailwind, CSS-in-JS, and a UI library. The neutral shell includes mobile-first layout, 320px support, desktop layout, system typography, WCAG-oriented contrast, 44px controls, visible focus, skip link, semantic header/nav/main/footer, reduced motion, logical properties, loading, error, not-found, and a self-styled global error document. No external font or prototype design was reused.

## 8. Database and migration spike

PostgreSQL and Prisma are compatible and accepted for the foundation:

- Prisma 7.9.1 generated its client under ignored `src/generated/`.
- The reviewed `20260807000000_foundation_health_check` migration created one underscored technical table only.
- A portable PostgreSQL 18.4 server, downloaded from the PostgreSQL project's linked EDB binary distribution, ran temporarily on loopback port 55433 because Docker/PostgreSQL/WSL were absent locally.
- `migrate deploy` applied the migration and `migrate status` reported the schema current.
- Four real integration tests proved connection/migration evidence, generated-client repository use, transaction rollback, and deterministic isolation/cleanup.
- Final technical-table row count was zero.
- The recovery SQL was applied after the migration in a separate `studenthub_recovery_test` database and verified the table absent; that disposable database was dropped.
- The server was stopped and the verified 1.30 GB ignored runtime (21,804 files, no reparse points) was removed.

No product, account, academic, or authorization table exists. Development/test Compose services remain separate, and no production database credential exists.

## 9. Testing tools and tests created

| Suite                    | Result                                         |
| ------------------------ | ---------------------------------------------- |
| Unit                     | 4 files, 14 tests passed                       |
| Component                | 2 files, 5 tests passed                        |
| Component axe            | 1 file, 2 tests passed                         |
| PostgreSQL integration   | 1 file, 4 tests passed against PostgreSQL 18.4 |
| Chromium E2E/browser axe | 1 file, 7 tests passed                         |

Coverage is limited to foundation behavior: render, locales/direction/fallback, environment validation, Sunday seam, boundary negative cases, route states, 320px/desktop, keyboard/focus, hydration, accessibility, migration/client/transaction/isolation. No future feature is pretended.

## 10. CI configuration

`.github/workflows/ci.yml` performs clean install, client generation, format, lint, architecture, type, unit, component, component axe, secret scan, audit, reviewed migration deployment to an isolated PostgreSQL 18.4 service, integration tests, production build, Chromium installation, and E2E. It uses fake CI-local database credentials, read-only repository permissions, no production secret, and no outbound product communication.

The workflow file is configured and locally equivalent commands passed. It cannot be claimed as executed by GitHub Actions until the repository has a remote commit/push.

## 11. ADRs created

ADRs 0001–0015 cover repository structure, modular monolith, runtime/package manager, locale routing, CSS/tokens, PostgreSQL/Prisma, migrations, testing, environment/secrets, provider adapters, hosting evaluation, managed-auth evaluation, UUIDv4/native storage, Sunday/time-zone baseline, and prototype isolation. Hosting and managed authentication remain `Proposed`; no vendor is selected or integrated.

## 12. Commands actually run

Successful implementation/verification commands included:

```text
node --version
npm.cmd --version
npm.cmd view <packages/compatibility metadata>
npm.cmd install --ignore-scripts --no-audit
npm.cmd ci --ignore-scripts --no-audit
npm.cmd run db:generate
npm.cmd run format
npm.cmd run format:check
npm.cmd run lint
npm.cmd run boundaries
npm.cmd run typecheck
npm.cmd run test:unit
npm.cmd run test:component
npm.cmd run test:a11y
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run secrets:scan
npm.cmd run audit
npm.cmd run db:test:migrate
npm.cmd run db:test:status
npm.cmd run test:integration
postgres --version
pg_isready / createdb / psql migration and recovery checks / dropdb / pg_ctl stop
git status --short --branch
git diff review and repository inventory commands
```

Notable resolved attempts:

- The first registry query/install attempts were sandbox/time limited; approved network reruns completed.
- Prisma generation initially could not fetch its schema engine in the restricted sandbox; the approved network rerun generated successfully.
- `initdb` could not create a Windows restricted token inside the sandbox; the exact workspace-local command reran with approval and succeeded.
- Playwright's built-in managed server completed all seven tests but hung during Windows teardown twice. A direct child-process runner replaced it; the final command exited 0 with 7/7.

## 13. Exact test and build results

- Clean install: `npm ci` added 593 locked packages; exit 0.
- Prisma generation: client 7.9.1 generated; exit 0.
- Format check: passed.
- ESLint: passed with zero warnings after cleanup.
- Boundary check: passed.
- Typecheck: Next type generation + strict TypeScript passed.
- Unit: 14/14 passed.
- Component: 5/5 passed.
- Component accessibility: 2/2 passed.
- PostgreSQL migration: 1/1 migration applied; status current.
- PostgreSQL integration: 4/4 passed.
- Next production build: compiled, typed, and generated all routes successfully.
- E2E/browser accessibility: 7/7 passed; final runner exit 0.
- Secret scan: passed (134 files inspected).
- npm audit: zero vulnerabilities.

## 14. Security or dependency findings

The secret scanner found no private key, common cloud/API token, or forbidden committed local environment/key file. `npm audit --audit-level=high` reported `0 vulnerabilities`. Security headers disable MIME sniffing, framing, camera, microphone, geolocation, and payment permissions and set a strict-origin referrer policy.

ESLint 10 was incompatible with peer ranges of Next's current import/React/a11y plugin chain and was replaced by ESLint 9.39.5. JSDOM 30 required Node 24.15 while the local runtime was 24.14, so compatible JSDOM 29.1.1 was selected. These are compatibility decisions, not unresolved advisories.

## 15. Known limitations

- GitHub-hosted CI has not run because no remote commit/push was authorized.
- Local browser automation covers Chromium; Firefox/WebKit, screen-reader, zoom/reflow, Windows high-contrast, and device/browser matrices are future gates.
- The local Node 24.14 runtime should be updated to the latest Node 24 security patch, though it met all selected package ranges except the intentionally avoided JSDOM 30.
- Managed hosting, database, authentication, email, and observability vendors remain unselected.
- The repository began with no commit, so there is no conventional baseline diff and every owner/source file remains untracked until an initial commit is approved.
- The technical table exists only to prove compatibility and provides no application health endpoint.

## 16. Sprint 0 acceptance criteria not met

All executable/product-scope criteria are met locally. One source-control wording criterion remains literal rather than technical: `package-lock.json` exists and reproduced a clean install, but the repository still has no initial Git commit. No commit was created because all pre-existing owner documentation and the prototype were already untracked at baseline. The owner should approve the complete initial snapshot (or direct its commit composition) before Sprint 1.

GitHub Actions execution and production deployment are not Sprint 0 local acceptance claims; deployment is expressly unauthorized.

## 17. Git status

Branch remains `master` with no commits. All baseline files and Sprint 0 files are untracked; ignored dependency/build/generated/test/local runtime files do not appear. No existing file was deleted. Because no baseline commit exists, `git diff` is empty by Git design; content review used the baseline inventory, full file inventory, executable checks, status, and targeted inspections.

## 18. Recommended Sprint 1 entry decision

**Conditional GO after owner review and an approved initial repository commit; do not start Sprint 1 yet.**

The engineering foundation, localization contract, Prisma/PostgreSQL spike, tests, CI definition, security checks, and documentation are ready. Before authentication work, the owner should:

1. review/accept this report and initial repository snapshot;
2. update local Node within the Node 24 LTS line;
3. resolve ADR 0012's managed-auth evidence gate and explicitly authorize Sprint 1;
4. keep hosting/database vendor selection and deployment separate unless explicitly authorized.

No authentication, onboarding, academic function, reminder, production integration, deployment, or AI work was started.
