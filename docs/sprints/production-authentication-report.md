# Production authentication foundation report

- **Date:** 2026-08-09
- **Starting branch:** `planning/production-multiplatform-transition`
- **Starting commit:** `39e8284b5f01a0219952b8ade8ef1bb0a948755a`
- **Implementation branch:** `feature/production-authentication`
- **Status:** Repository foundation implemented; hosted-provider and real-PostgreSQL acceptance remain evidence-gated

## Baseline integration

`main` started at `80c9974e25e3e981d4712823c6d325f62f7148ac`. Git proved that it was an exact ancestor of `planning/production-multiplatform-transition`, so `main` was fast-forwarded to `39e8284b5f01a0219952b8ade8ef1bb0a948755a` before the feature branch was created. The approved D01-D16 planning commits are therefore in production history.

`planning/production-multiplatform-transition` remains at `39e8284b5f01a0219952b8ade8ef1bb0a948755a`. `spike/supabase-auth-runtime` remains untouched at `dd3af22dbc1821a6c0557d08b1d06ba73f3cce5b`. No merge, rebase, cherry-pick, copy, rewrite, remote, push, deployment, or pull request involved the spike.

## Implemented foundation

- Arabic/RTL and English/LTR registration, verification-pending, explicit link confirmation, verified, sign-in, sign-out, recovery request, password reset, link-error, unavailable, and protected-workspace states.
- Application-owned authentication/provider and identity-repository ports with stable error codes; Supabase SDK usage is confined to infrastructure.
- Authoritative server-side provider validation plus internal account-state authorization for the workspace and `/api/v1/session`; proxy refresh is only an optimistic front gate.
- Exact workspace return-to allowlisting, account-enumeration-safe recovery/registration behavior, no-store private responses, hardened cookies, signed subject-bound recovery intent, and global provider sign-out request.
- Fail-closed behavior for absent, partial, invalid, or unavailable configuration. No fake user, session, success adapter, demo credential, or client-only authorization exists.

## Identity migration

Migration `20260809090000_production_identity_foundation` creates `users`, `auth_identities`, `user_account_state`, the unique `(provider, provider_subject)` constraint, restrictive ownership foreign key, and server-generated UUID defaults. The Prisma repository uses serializable transactions with unique-conflict/concurrency recovery. Verified email is a snapshot only and is never queried to resolve or merge ownership.

The matching recovery reference is `prisma/recovery/20260809090000_production_identity_foundation.rollback.sql`. It is explicitly destructive and is not an automated shared-environment rollback. Prisma schema validation passed and the generated SQL was reviewed against the committed migration; the committed migration intentionally adds nonblank provider/subject checks.

## Local verification evidence

| Verification                  | Result                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Lockfile install              | PASS - `npm ci --cache .npm --prefer-offline`, 603 packages installed                                                           |
| Formatting                    | PASS - all matched files                                                                                                        |
| ESLint                        | PASS - 0 errors                                                                                                                 |
| Architecture boundaries       | PASS - provider/prototype/layer rules                                                                                           |
| TypeScript / Next route types | PASS - 0 errors                                                                                                                 |
| Unit                          | PASS - 6 files, 22 tests                                                                                                        |
| Component                     | PASS - 3 files, 8 tests                                                                                                         |
| Component accessibility       | PASS - 2 files, 6 tests                                                                                                         |
| Prisma generate               | PASS - Prisma Client 7.9.1                                                                                                      |
| Prisma validate               | PASS - schema valid                                                                                                             |
| Production build              | PASS - Next.js 16.3.0, 25 generated pages across 14 dynamic route entries                                                       |
| Browser E2E                   | PASS - Chromium, 10 tests                                                                                                       |
| Secret scan                   | PASS - 2,961 files inspected                                                                                                    |
| Dependency audit              | PASS - 0 vulnerabilities                                                                                                        |
| PostgreSQL integration        | NOT RUN - 1 file / 6 tests skipped because no isolated `TEST_DATABASE_URL`, PostgreSQL service, Docker, or `psql` was available |

One over-parallelized local Vitest attempt exhausted worker startup capacity and ran zero tests. The three suites were immediately rerun serially to the passing counts above; it is not treated as product evidence or as a code failure.

## Provider evidence still required

- `NOT EXECUTED — real authorized provider environment required` - registration and actual verification email delivery.
- `NOT EXECUTED — real authorized provider environment required` - email verification token consumption, replay, expiry, and scanner behavior.
- `NOT EXECUTED — real authorized provider environment required` - sign-in cookie issuance, secure attributes, refresh, expiry, and server validation.
- `NOT EXECUTED — real authorized provider environment required` - recovery email delivery, recovery session, password update, and reused/expired recovery links.
- `NOT EXECUTED — real authorized provider environment required` - provider 429 mapping using real configured limits.
- `NOT EXECUTED — real authorized provider environment required` - provider outage/degraded response behavior.
- `NOT EXECUTED — real authorized provider environment required` - sign-out refresh-token revocation and post-sign-out workspace/API denial.
- `NOT EXECUTED — real authorized provider environment required` - hosted redirect allowlist rejection and production cookie behavior over HTTPS.

## Production blockers and next action

The provider is not production-accepted. The owner must choose the Supabase region after Saudi privacy/cross-border review, create or designate one owner-controlled hosted non-production project with MFA/recovery/budget/expiry/cleanup ownership, configure exact callback URLs and token-hash email templates, and provide only the documented public URL/publishable key plus private database and application-state values through ignored/approved secret channels. Use synthetic identities only.

Then Codex can apply the reviewed migrations to the isolated test database and execute the provider-backed matrix above. The exact configuration steps and values that must never be exposed are in [the authentication handoff](../engineering/authentication.md#owner-credential-handoff--minimum-actions).

No academic feature, mobile application, external account, paid resource, remote, push, deployment, or pull request was created in this phase.
