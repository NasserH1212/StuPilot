# Testing guide

## Test layers

| Layer          | Command                    | What it proves                                                                                  |
| -------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| Format         | `npm run format:check`     | Tracked foundation files match Prettier                                                         |
| Lint           | `npm run lint`             | Next.js, React, TypeScript, accessibility-oriented lint rules                                   |
| Boundaries     | `npm run boundaries`       | Dependency direction and prototype isolation                                                    |
| Types          | `npm run typecheck`        | Strict TypeScript including generated Prisma types                                              |
| Unit           | `npm run test:unit`        | Locales, fallback, env validation, time default, boundary negatives                             |
| Component      | `npm run test:component`   | Arabic/English shells and route states                                                          |
| Component a11y | `npm run test:a11y`        | axe structural rules in JSDOM                                                                   |
| Database       | `npm run test:integration` | Real PostgreSQL connection, migration evidence, generated client, transaction rollback, cleanup |
| Build          | `npm run build`            | Optimized Next.js production compilation                                                        |
| Browser        | `npm run test:e2e`         | First response, hydration, 404, 320px/desktop, keyboard, browser axe                            |
| Secrets        | `npm run secrets:scan`     | Common tokens/private keys and forbidden local credential files                                 |
| Dependencies   | `npm run audit`            | npm high/critical production dependency advisories                                              |

## Fast local loop

```bash
npm run format:check
npm run lint
npm run boundaries
npm run typecheck
npm test
```

`npm test` runs unit, component, and component accessibility suites. It deliberately does not hide the PostgreSQL or browser prerequisites.

## PostgreSQL integration

Start `postgres-test`, configure `TEST_DATABASE_URL`, then:

```bash
npm run db:generate
npm run db:test:migrate
npm run db:test:status
npm run test:integration
```

The runner refuses a URL whose database name does not contain `test` and refuses a test URL equal to `DATABASE_URL`. The migration command uses `migrate deploy`, not schema push. A missing URL causes the test file to skip for developer convenience, but a skip does **not** satisfy Sprint acceptance or CI.

Integration cleanup targets only markers with the test prefix; it does not reset/drop a database. CI provides a fresh PostgreSQL 18.4 service per job.

## Browser and accessibility

Install Chromium once:

```bash
npx playwright install chromium
```

Build current code and test it:

```bash
npm run build
npm run test:e2e
```

The runner controls a loopback `next start` child and exits cleanly on Windows/CI. JSDOM axe does not run color-contrast canvas analysis reliably; the real browser suite runs axe and fails serious/critical violations. Manual screen-reader, zoom, high-contrast, and full browser/OS coverage are future journey gates, not claimed by Sprint 0.

## CI equivalence

`.github/workflows/ci.yml` runs a clean install, Prisma generation, every static/unit/component/a11y/security check, real PostgreSQL migration/integration, production build, Chromium installation, and E2E. It has no production secrets and sends no messages.

## Adding tests

- Test observable behavior and real invariants, not implementation trivia.
- Put pure logic in `tests/unit`, rendered components in `tests/component`, axe-only structural checks in `tests/accessibility`, database behavior in `tests/integration`, and user/browser contracts in `tests/e2e`.
- Do not invent tests for an unimplemented feature.
- Never mock PostgreSQL when the purpose is to verify constraints, migrations, transactions, or isolation.
