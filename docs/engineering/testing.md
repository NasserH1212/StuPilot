# Testing guide

## Test layers

| Layer          | Command                    | What it proves                                                                                                                                                       |
| -------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format         | `npm run format:check`     | Tracked foundation files match Prettier                                                                                                                              |
| Lint           | `npm run lint`             | Next.js, React, TypeScript, accessibility-oriented lint rules                                                                                                        |
| Boundaries     | `npm run boundaries`       | Dependency direction, prototype isolation, and provider SDK isolation                                                                                                |
| Types          | `npm run typecheck`        | Strict TypeScript including generated Prisma types                                                                                                                   |
| Prisma schema  | `npm run db:validate`      | Prisma schema/config parse and generator compatibility                                                                                                               |
| Unit           | `npm run test:unit`        | Auth orchestration/security, locales, environment, time, and boundary negatives                                                                                      |
| Component      | `npm run test:component`   | Arabic/English auth forms, shells, and route states                                                                                                                  |
| Component a11y | `npm run test:a11y`        | axe structural rules for auth and shell UI in JSDOM                                                                                                                  |
| Database       | `npm run test:integration` | Migrations, generated client, transaction rollback, identity concurrency/no-email-merge, cleanup                                                                     |
| Build          | `npm run build`            | Optimized Next.js production compilation                                                                                                                             |
| Browser        | `npm run test:e2e`         | Fail-closed auth/API, callbacks, cache, first response, 320px, keyboard, browser axe; sign-in/onboarding/term/course flows when a test account is configured (below) |
| Secrets        | `npm run secrets:scan`     | Common tokens/private keys and forbidden local credential files                                                                                                      |
| Dependencies   | `npm run audit`            | npm high/critical production dependency advisories                                                                                                                   |

## Fast local loop

```bash
npm run format:check
npm run lint
npm run boundaries
npm run typecheck
npm run db:validate
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

Provider success paths are not mocked as production evidence. Real registration, email delivery, verification/recovery tokens, cookies, refresh, rate limits, outage behavior, and revocation require the owner-authorized hosted environment listed in [authentication.md](authentication.md#provider-evidence-still-required).

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

## Signed-in E2E flows

`tests/e2e/authenticated-flows.spec.ts` covers the flows that need a real,
already-verified session: sign in, onboarding (choosing University of
Hail), creating an academic term, and adding a course. It is opt-in and
local-only — it never runs in CI, because CI intentionally configures no
real auth provider (see `ci.yml`), and "provider success paths are not
mocked as production evidence" above applies here too: a fake session would
not be evidence the real sign-in flow works.

**Setup (one time):** register a real account through the app's own sign-up
form, click the real verification link Supabase emails you, then set in
`.env.local`:

```bash
E2E_TEST_ACCOUNT_EMAIL=your-test-account@example.com
E2E_TEST_ACCOUNT_PASSWORD=the-password-you-chose
```

Leaving either unset skips the whole suite (`test.skip`, not a failure) —
this matches `TEST_DATABASE_URL`'s "missing means skip" convention above.

This suite reuses one long-lived account rather than a fresh one per run,
because completing onboarding is one-way (there is no "reset onboarding"
action). The onboarding test checks which state the account is in and
either completes onboarding or confirms it was already done, so re-running
the suite stays meaningful without any manual reset step.

**A stronger alternative, not implemented here:** a global setup script
using the Supabase **service-role** key's admin API
(`auth.admin.createUser({ email_confirm: true })`) could provision a fresh,
pre-confirmed account before every run, giving full onboarding coverage on
every run instead of only the first. That key is far more sensitive than
anything else in this repo's env files — it bypasses email verification
entirely — and using it here needs an explicit decision from the project
owner, kept out of `.env.local` in a CI-only secret if adopted, never used
by the running application itself.

## CI equivalence

`.github/workflows/ci.yml` runs a clean install, Prisma generation, every static/unit/component/a11y/security check, real PostgreSQL migration/integration, production build, Chromium installation, and E2E. It has no production secrets and sends no messages.

## Adding tests

- Test observable behavior and real invariants, not implementation trivia.
- Put pure logic in `tests/unit`, rendered components in `tests/component`, axe-only structural checks in `tests/accessibility`, database behavior in `tests/integration`, and user/browser contracts in `tests/e2e`.
- Do not invent tests for an unimplemented feature.
- Never mock PostgreSQL when the purpose is to verify constraints, migrations, transactions, or isolation.
