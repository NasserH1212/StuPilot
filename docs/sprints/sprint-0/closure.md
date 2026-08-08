# Sprint 0 closure record

- **Owner approval date:** 2026-08-08 (Asia/Riyadh)
- **Closure date:** 2026-08-08
- **Initial commit:** `e7f894b2f31ec538a54952cecd872481de7aa2ba`
- **Branch:** `main`
- **Sprint state:** Closed and committed; Sprint 1 is not authorized

## Repository and commit result

The owner approved the complete 133-file repository snapshot, including active product/engineering documentation, archived research, the isolated disposable research prototype, application foundation, migration, tests, CI, and configuration.

The repository began on `master` with zero commits. The branch was renamed to `main`, the reviewed 133-file set was staged, the staged secret scan passed, and the official local initial commit was created with the exact message:

```text
chore: establish StudentHub AI engineering foundation
```

Initial commit facts:

- hash: `e7f894b2f31ec538a54952cecd872481de7aa2ba`;
- files: 133;
- insertions: 24,454;
- Git object store immediately after the commit: approximately 743.77 KiB;
- branch: `main`;
- working tree: clean after the commit.

The final audit is recorded in [initial-commit-audit.md](initial-commit-audit.md). Dependencies, build output, generated Prisma client, test/browser output, environment files, local database/runtime data, and secrets were not committed.

## Committed-snapshot verification

Verification used clean temporary checkouts of committed files, not the original working directory. The first clean checkout exposed Windows CRLF conversion in 90 formatted files. The repository correction was documented and committed separately as `2407ebee021df5901a9415b56d6a3ac37521fa41` (`chore: enforce reproducible line endings`) by adding `.gitattributes` with LF normalization. A new committed checkout then passed formatting.

Local runtime for the verification was Node 24.14.0 with npm 11.9.0.

| Verification                                   | Result                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                       | Pass: 593 packages installed from the committed lockfile; 594 packages audited; zero vulnerabilities. The only source correction after this install was `.gitattributes`, so dependencies and lockfile were unchanged. A duplicate post-correction install attempt was stopped by local disk exhaustion. |
| Prisma client generation                       | Pass: Prisma 7.9.1 generated from the committed schema.                                                                                                                                                                                                                                                  |
| `npm run format:check`                         | Pass after the committed LF correction.                                                                                                                                                                                                                                                                  |
| `npm run lint`                                 | Pass.                                                                                                                                                                                                                                                                                                    |
| `npm run boundaries`                           | Pass, including production/prototype isolation.                                                                                                                                                                                                                                                          |
| `npm run typecheck`                            | Pass: Next type generation and strict TypeScript.                                                                                                                                                                                                                                                        |
| `npm run test:unit`                            | Pass: 14/14.                                                                                                                                                                                                                                                                                             |
| `npm run test:component`                       | Pass: 5/5.                                                                                                                                                                                                                                                                                               |
| `npm run test:a11y`                            | Pass: 2/2 component accessibility tests.                                                                                                                                                                                                                                                                 |
| `npm run build`                                | Pass in a committed checkout with a same-volume hard-link dependency copy; Next.js 16.3.0 production build completed.                                                                                                                                                                                    |
| `npm run test:e2e`                             | Pass: 7/7 Chromium E2E and browser accessibility tests.                                                                                                                                                                                                                                                  |
| `npm run secrets:scan`                         | Pass: 135 committed-checkout files inspected at the verification commit.                                                                                                                                                                                                                                 |
| `npm run audit`                                | Pass: zero vulnerabilities at `--audit-level=high`.                                                                                                                                                                                                                                                      |
| `DATABASE_URL=placeholder npx prisma validate` | Pass.                                                                                                                                                                                                                                                                                                    |

Docker was not installed, so this closure did not download another PostgreSQL runtime. Static verification confirmed:

- the Prisma datasource is PostgreSQL;
- the committed migration lock is PostgreSQL;
- the migration creates `_foundation_health_checks` and the recovery SQL drops that same table;
- the integration tests and migration runner require `TEST_DATABASE_URL`;
- Compose pins PostgreSQL 18;
- [the Sprint 0 completion report](report.md) records the already completed real PostgreSQL 18.4 migration and 4/4 integration-test evidence.

GitHub-hosted CI will repeat the real PostgreSQL service, migration, and integration tests only after a remote push is separately authorized.

## Temporary verification cleanup exception

The original temporary install checkout and the final hard-link verification checkout were removed after verification. One intermediate checkout remains at:

```text
C:\Users\Hasib\AppData\Local\Temp\studenthub-ai-sprint0-verify-2407ebe
```

Its `node_modules` entry is a directory junction to the workspace dependency directory. PowerShell raised an internal `NullReferenceException` while attempting to unlink that exact junction. Cleanup stopped immediately under the destructive-action safety policy; no stronger or alternate deletion primitive was attempted. This checkout is outside the repository, is not tracked, does not affect the clean working tree, and requires owner approval before an alternate unlink method is used.

## Node runtime policy

Official Node.js sources checked on 2026-08-08 identify **Node 24.18.1 (Krypton LTS)** as the current supported Node 24 patch, with npm 11.16.0 and maintenance through the end of April 2028.

The project remains correctly configured for the Node 24 major line:

- `.nvmrc`: `24`;
- `package.json`: Node `>=24.0.0 <25`, npm `>=11.0.0 <12`;
- CI: `node-version: 24`;
- exact direct dependency engine metadata: every declared range includes Node 24.18.1, or no engine restriction is declared.

No configuration version change was required. The evidence update was committed separately as `203c257350216f4b8ee7b4371e3d39e0e0a03e0f` with `chore: refresh Node 24 LTS runtime policy`. Clean-snapshot execution used local Node 24.14.0; dependency metadata supports 24.18.1, but that exact patch was not installed or executed during closure. The local machine should update within Node 24 before Sprint 1.

Official sources:

- [latest Node 24 release index](https://nodejs.org/download/release/latest-v24.x/) — accessed 2026-08-08;
- [Node 24 archive](https://nodejs.org/en/download/archive/v24) — accessed 2026-08-08;
- [Node 22-to-24 migration and support window](https://nodejs.org/en/blog/migrations/v22-to-v24) — accessed 2026-08-08.

## Authentication decision gate

[The Sprint 1 authentication provider evaluation](../../decisions/sprint-1-authentication-provider-evaluation.md) compares Clerk, Auth0, Supabase Auth, and Better Auth from current official sources.

It proposes Supabase Auth as the conditional primary choice and Better Auth as the application-owned fallback. ADR 0012 remains `Proposed`. The owner must approve a provider, Saudi privacy/data-region position, technical evaluation, cost envelope, and operational ownership before separately authorizing Sprint 1.

No provider was installed, configured, connected, or given credentials. Authentication has not started.

## External execution and authorization state

- GitHub-hosted CI has **not** run.
- No Git remote was configured.
- No commit was pushed.
- Nothing was deployed.
- No production account, credential, database, or service was created.
- Sprint 1 remains **not authorized**.

At closure, all repository changes described by this record are committed on `main`; the repository working tree is clean. The only cleanup exception is the disclosed external temporary checkout, which is not part of the Git worktree.
