# Sprint 0M production multi-platform transition report

- **Report date:** 2026-08-08 (Asia/Riyadh)
- **Owner approval recorded:** 2026-08-09 — Nasser Al-Tamimi
- **Scope:** repository/branch audit and production web + native architecture decision package
- **Implementation status:** **VERIFIED — documentation only; no product/runtime implementation was performed**
- **Decision status:** **OWNER-APPROVED — D01–D16 govern sequencing and constraints; operational readiness remains gated**

## Executive outcome

**OWNER-APPROVED — adopt the gated staged transition (Option D).** Keep the verified Next.js modular monolith at the repository root while production authentication, internal identity, `/api/v1`, and the first academic contract are proved. Immediately before native application implementation, move the web application to `apps/web` in one behavior-neutral npm-workspaces change. Create the Expo/React Native application in a following change only after parity passes.

**OWNER-APPROVED direction — retain the backend inside Next.js for the MVP.** Web Server Components/Actions and public `/api/v1` Route Handlers call the same application services. Native uses only the versioned HTTPS API. Extract a backend service or worker only when a measured requirement justifies it.

**OWNER-APPROVED — do not merge, rebase, cherry-pick, or copy `spike/supabase-auth-runtime` wholesale.** Preserve it temporarily as immutable audit evidence. Reuse only separately reviewed concepts through fresh production implementation from the approved baseline; delete it only after replacement production evidence and explicit owner authorization.

**OWNER-APPROVED next phase — Phase 1 evidence-gated Supabase Auth qualification.** Supabase is the primary candidate, not the production-selected provider. Qualification requires real isolated hosted non-production behavior, synthetic users, real browser/server and callback/recovery evidence, current privacy/regional/lifecycle/cost review, and signed-native evidence. External resources remain **BLOCKED** until the operator/account, MFA/recovery, budget/expiry, secret, synthetic-data, and cleanup controls are recorded.

## Package index

| Artifact                                                                               | Purpose                                                                                                                           | Status                                         |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Repository and branch audit](repository-and-branch-audit.md)                          | Git safety, current readiness, main/spike comparison, commit/file salvage map, drift, source-ref disposition                      | **VERIFIED audit / PROPOSED disposition**      |
| [Repository strategy](../../decisions/production-multiplatform-repository-strategy.md) | Explicit Option D selection, rejected alternatives, exact transition gate, target layout, backend placement                       | **OWNER-APPROVED / evidence-gated**            |
| [Production architecture](../../engineering/production-multiplatform-architecture.md)  | Web/API/native boundaries, auth/identity, contracts, data/time, offline/cache, design, mobile/store, operations, testing, sources | **PROPOSED with VERIFIED baseline/research**   |
| [Transition plan](transition-plan.md)                                                  | Phased sequence, entry/exit tests, deployment/rollback, first vertical slice                                                      | **OWNER-APPROVED sequence / gated execution**  |
| [Risk register](risk-register.md)                                                      | P0–P3 risks, controls, contingencies, accountable roles, phase blockers                                                           | **ACTIVE**                                     |
| [Owner decisions](owner-decisions.md)                                                  | Canonical dated D01–D16 owner record, constraints, unresolved evidence, and next phase                                            | **OWNER-APPROVED**                             |
| This report                                                                            | Executive handoff, coverage, validation, limitations, and next action                                                             | **VERIFIED summary / PROPOSED recommendation** |

## Verified repository findings

- **VERIFIED** — the audit began on clean `main` at `80c9974e25e3e981d4712823c6d325f62f7148ac` with no untracked files, no configured remote, and one worktree.
- **VERIFIED** — `spike/supabase-auth-runtime` is five commits ahead at `dd3af22dbc1821a6c0557d08b1d06ba73f3cce5b`; its merge base is the audited main commit.
- **VERIFIED** — the planning branch was created from that exact main commit. Neither source branch needed checkout, reset, merge, rebase, deletion, or modification.
- **VERIFIED** — current production source is a root Next.js 16.3/React 19.2/strict TypeScript modular-monolith foundation with PostgreSQL/Prisma, Arabic/RTL and English/LTR shells, boundary enforcement, and layered tests.
- **VERIFIED** — there is no implemented authentication, account/product schema, public API Route Handler, mobile app, provider, shared staging/production environment, deployment, backup, observability service, store identity, or production credential.
- **VERIFIED** — the spike changes 77 files and combines dependencies, provider integration, schema/migration, runtime, web UI, tests, and documentation. Its provider-free checks are useful, but PostgreSQL integration was skipped and no live provider/browser/native lifecycle was proved.

## Key architecture decisions

| Topic            | Direction                                                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository       | **PROPOSED** — Option D staged npm workspace transition after identity/API/first academic contract, before native implementation.                                          |
| Backend          | **PROPOSED** — Next.js modular backend for MVP; no separate service without measured trigger.                                                                              |
| Web transport    | **PROPOSED** — Server Components call services directly; Server Actions are web mutation adapters, not mobile APIs.                                                        |
| Native transport | **PROPOSED** — HTTPS `/api/v1` Route Handlers with stable schemas, problem codes, auth, idempotency, pagination, and compatibility.                                        |
| Identity         | **PROPOSED** — StudentHub UUID owns domain data; opaque provider key + subject authenticates; no email auto-merge.                                                         |
| Sessions         | **PROPOSED** — secure browser cookie and native bearer/renewal flow differ at the edge, then resolve to the same internal user.                                            |
| Data             | **PROPOSED** — PostgreSQL system of record; `date` for all-day, `timestamptz` for instants, IANA zone for civil intent; expand/contract migrations.                        |
| Offline          | **PROPOSED** — online-first with bounded read cache; no offline mutation queue in initial MVP.                                                                             |
| Sharing          | **PROPOSED** — contracts, semantic tokens, and proven locale resources only; no shared web/native UI, Prisma, provider, or server internals.                               |
| Native           | **PROPOSED** — Expo/React Native/Expo Router, exact stable versions selected at implementation gate; signed development builds for real capability tests.                  |
| Reminders        | **PROPOSED** — backend schedule, best-effort minimal push, background work only for opportunistic reconciliation.                                                          |
| Release          | **PROPOSED** — organization-owned accounts/signing, separate environments, privacy/delete/export, restore/monitoring evidence, internal/closed then staged public rollout. |

## Why authentication comes before mobile

1. **VERIFIED** — native currently has no server contract or credible session path.
2. **INFERRED** — building mobile screens against mocks would freeze guessed auth/error/time behavior and move risk into rework.
3. **PROPOSED** — prove provider evidence -> internal identity -> `/api/v1/session` in the root app first.
4. **PROPOSED** — prove one authenticated academic read/write API slice next.
5. **PROPOSED** — only then move topology and create a native client that consumes real supported contracts.

This ordering does not require every web feature to be complete. It requires only enough server truth to prevent the native application from inventing it.

## First vertical slice

**PROPOSED acceptance journey:** authenticate -> establish/select term -> establish/select course -> create/update an academic item -> view it in Today/This Week -> confirm the same authorized state on web and native.

The slice includes:

- **PROPOSED** — browser and signed-native identity mapping to the same internal UUID;
- **PROPOSED** — cross-account isolation, validation, stable errors, idempotent create, stale-update conflict, and retry behavior;
- **PROPOSED** — all-day/instant/time-zone/week correctness;
- **PROPOSED** — Arabic/RTL and English/LTR;
- **PROPOSED** — accessible loading, empty, error, form, and conflict experiences;
- **PROPOSED** — online-first stale/cache state and complete user-scoped cache clearing on sign-out/account switch;
- **PROPOSED** — compatible old-client fixtures before any store-distributed API change.

AI, SIS/LMS integrations, files, community, payments, analytics/ads, general offline writes, and full reminder delivery are **PROPOSED non-goals** for this slice unless the owner changes D14/D08.

## Spike disposition summary

| Classification     | Representative contents                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RETAIN CONCEPT** | internal user/provider separation, application-owned errors/ports, layered authorization, safe redirects, threat-model questions, identity/boundary/accessibility test ideas, honest evidence reporting |
| **ADAPT LATER**    | identity types/services, fresh schema, PostgreSQL repository, web forms/Actions, route guards, CSS/localization, central composition                                                                    |
| **DEFER**          | Supabase SDK/adapters/callbacks and provider contract tests until an auth provider is selected and current live evidence exists                                                                         |
| **DISCARD**        | evaluation-mode unavailable gateway, vendor enum in domain/schema, unexecuted spike migration as production history, fake/evaluation E2E pass claims                                                    |

**PROPOSED** — no whole spike commit is safe to cherry-pick because each commit either establishes provider assumptions, mixes multiple implementation layers, or validates a non-production evaluation path.

## Research outcome

- **VERIFIED** — installed Next.js 16.3 documentation was read before the blueprint. It supports Route Handlers as public transports, direct Server Component data access, and treating Server Actions as web mutation entry points.
- **VERIFIED, point-in-time** — Expo's 2026-08-08 compatibility table lists SDK 57 with React Native 0.86 and minimum Node 22.13.x. The package deliberately does not select that version; the latest stable compatible set is selected when native implementation begins.
- **VERIFIED, time-sensitive** — starting 2026-08-31 Google Play generally requires new apps/updates to target Android 16/API 36+. Apple and Google both require privacy disclosure; account-creation apps need deletion flows, with Google also requiring a public web deletion resource.
- **VERIFIED** — Expo documents OS-protected SecureStore behavior and limitations, system-controlled background work, development-build requirements for push, and non-guaranteed delivery. Those constraints directly shaped the session/cache/reminder design.
- **VERIFIED** — PostgreSQL/Prisma primary sources support explicit date/instant semantics, controlled committed migrations, production `migrate deploy`, conflict-aware transactions, and tested backup/restore rather than backup configuration alone.

Full links, exact claims, access date, and uncertainty are recorded in the [architecture research table](../../engineering/production-multiplatform-architecture.md#primary-source-research-record).

## Requirement coverage

| Requested area                                                          | Coverage                                                                                                         |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Repository/branch safety and clean-state audit                          | **VERIFIED** — audit safety snapshot and final validation procedure                                              |
| Main vs spike history, commit/file salvage                              | **VERIFIED** — commit-level and detailed file-group classifications                                              |
| One topology choice, rejected alternatives, exact timing                | **PROPOSED** — selected Option D with seven-entry gate and rollback                                              |
| Backend/API/Server Action boundary                                      | **PROPOSED** — one application layer, direct web server access, versioned native HTTP transport                  |
| Auth/identity/browser/native sessions                                   | **OWNER-APPROVED principles / BLOCKED evidence** — Supabase candidate; no final provider or implementation proof |
| Shared types/domain/UI                                                  | **PROPOSED** — narrow share/do-not-share policy and target packages                                              |
| PostgreSQL/migrations/time/lifecycle/concurrency/backup                 | **PROPOSED / NOT VERIFIED operationally** — explicit rules, tests, and restore targets                           |
| Offline/cache/sync/conflicts                                            | **PROPOSED** — online-first initial scope; offline mutation design deferred with trigger                         |
| Design/tokens/theme/RTL/localization/accessibility                      | **PROPOSED** — semantic sharing and platform-specific implementation/matrices                                    |
| Expo/native compatibility, SecureStore, links, notifications/background | **VERIFIED research / PROPOSED design** — no version/package selected or installed                               |
| EAS/signing/store/privacy/release                                       | **VERIFIED research / BLOCKED accounts** — custody, policy, and phased release gates                             |
| Transition phases, tests, deployment, rollback, vertical slice          | **PROPOSED** — Phases 0M–7 and definition of done                                                                |
| Risks and owner decisions                                               | **ACTIVE / OWNER-APPROVED** — 28 risks remain active; D01–D16 have dated outcomes                                |
| Secret and docs-only scope                                              | **VERIFIED** — the initial package scan passed; commit `8fac8d9` contains exactly eight documentation files.     |

## Initial planning package validation record — 2026-08-08

The table below records the validation of the initial planning package committed as `8fac8d9`. The 2026-08-09 owner-approval follow-up receives its own final Git handoff checks; this historical evidence is not rewritten to describe that later diff.

| Check                     | Result                                                                                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Required artifacts        | **VERIFIED** — all seven required documents exist; together they contain 1493 added documentation lines in the staged diff, including the README index update and one removed README status line.                                                                                                               |
| Evidence classification   | **VERIFIED** — every required document contains explicit `VERIFIED`, `PROPOSED`, `INFERRED`, `NOT VERIFIED`, or `BLOCKED` labels; the automated count found 735 label occurrences across the seven files.                                                                                                       |
| Repository format         | **VERIFIED** — `npm run format:check` passed for the complete repository after the new Markdown was formatted with the existing Prettier configuration.                                                                                                                                                         |
| Local Markdown targets    | **VERIFIED** — all 26 relative link targets across the seven documents and updated README resolved locally. External-link reachability is represented by the primary-source research, not this filesystem check.                                                                                                |
| Whitespace/patch validity | **VERIFIED** — `git diff --cached --check` passed.                                                                                                                                                                                                                                                              |
| Secret scan               | **VERIFIED** — `npm run secrets:scan` passed with 145 files inspected.                                                                                                                                                                                                                                          |
| Changed-file scope        | **VERIFIED** — the cached change contains exactly `README.md` plus the seven required Markdown files: eight documentation files, 1,493 insertions, and one deletion. No product, dependency, lockfile, schema/migration, test, CI, runtime configuration, generated, credential, or prototype file is included. |
| Source refs               | **VERIFIED** — `main` remained `80c9974e25e3e981d4712823c6d325f62f7148ac`; `spike/supabase-auth-runtime` remained `dd3af22dbc1821a6c0557d08b1d06ba73f3cce5b`; their merge base remained the main object.                                                                                                        |
| Branch                    | **VERIFIED** — validation ran on `planning/production-multiplatform-transition`, created from the audited main object.                                                                                                                                                                                          |

**VERIFIED — no application build or product test was rerun** because the candidate diff is Markdown-only and the repository format/secret/cached-diff gates directly cover the changed surface. Post-commit cleanliness and the commit ID are necessarily checked after the report content is frozen and are reported in the Git handoff.

## Limitations and non-claims

- **NOT VERIFIED** — no real auth provider, email flow, hosted PostgreSQL, app signing, native build, device, push, store, production deployment, backup restore, or telemetry system was exercised.
- **OWNER-APPROVED direction** — Saudi Arabia and university students aged 18+ define the initial launch scope. **NOT VERIFIED** — legal/PDPL compliance, residency suitability, store classification, service levels, and provider cost require current qualified/operational review.
- **NOT VERIFIED** — point-in-time framework/store research may change; every implementation/submission gate requires current official revalidation.
- **VERIFIED** — no service/account/credential/deployment/push/mobile implementation was authorized or performed by this planning package.

## Recommended next action

**OWNER-APPROVED — execute only Phase 1: evidence-gated Supabase Auth qualification and operational preflight.** First record its operator/account, recovery, budget/expiry, secret, synthetic-data, regional/privacy, and cleanup controls. Then evaluate real isolated hosted non-production browser/server, callback/recovery, lifecycle, cost, and signed-native behavior. Do not start product authentication, a schema/migration, workspace move, mobile scaffold, deployment, or fallback-provider evaluation unless the stated gate authorizes it.
