# Repository and branch audit

- **Audit date:** 2026-08-08 (Asia/Riyadh)
- **Repository:** `C:/Users/Hasib/Documents/StudentHub-AI`
- **Compared refs:** `main` and `spike/supabase-auth-runtime`
- **Purpose:** establish a safe, evidence-based baseline for the production web and native transition

## Evidence vocabulary

This package uses the following labels deliberately:

- **VERIFIED** — observed in the repository, Git objects, an executed check, installed framework documentation, or a cited primary source.
- **PROPOSED** — a recommendation that is not implemented or owner-approved.
- **INFERRED** — a conclusion drawn from verified evidence; it still needs validation.
- **NOT VERIFIED** — plausible or documented elsewhere, but not demonstrated in this repository or environment.
- **BLOCKED** — cannot proceed safely until a named decision, account, credential, environment, or proof exists.

The spike-salvage classifications are separate from evidence status:

- **RETAIN CONCEPT** — preserve the invariant or test idea, not necessarily the code.
- **ADAPT LATER** — rewrite from `main` after the prerequisite gate; do not cherry-pick now.
- **DEFER** — reconsider only after a provider, topology, or product decision makes it relevant.
- **DISCARD** — do not carry into the production path.

## Safety snapshot

| Check               | Result                                                                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Starting branch     | **VERIFIED** — `main` at `80c9974e25e3e981d4712823c6d325f62f7148ac`.                                                                                                                                                        |
| Starting worktree   | **VERIFIED** — clean (`git status --short --branch` showed only `## main`).                                                                                                                                                 |
| Planning branch     | **VERIFIED** — `planning/production-multiplatform-transition` was created from that exact `main` commit.                                                                                                                    |
| Spike ref           | **VERIFIED** — `spike/supabase-auth-runtime` at `dd3af22dbc1821a6c0557d08b1d06ba73f3cce5b`.                                                                                                                                 |
| Merge base          | **VERIFIED** — the merge base is the audited `main` commit; the spike is five commits ahead and has no divergent main-side commits.                                                                                         |
| Worktrees           | **VERIFIED** — only the primary worktree existed; the spike had no checked-out worktree whose uncommitted changes could be lost.                                                                                            |
| Remotes             | **VERIFIED** — no Git remote was configured. No fetch, push, pull, or deployment occurred.                                                                                                                                  |
| Untracked files     | **VERIFIED** — none at the audit boundary.                                                                                                                                                                                  |
| Ignored paths       | **VERIFIED** — expected generated/dependency/test paths were ignored: `.next/`, `node_modules/`, `src/generated/`, `test-results/`, `next-env.d.ts`, and `tsconfig.tsbuildinfo`.                                            |
| Sensitive filenames | **VERIFIED** — the only tracked environment template was `.env.example`; no runtime environment file, key, certificate, or credential artifact was found by the filename audit. Content scanning is repeated before commit. |

**VERIFIED — stop conditions were absent.** The repository was clean, the requested refs existed, the merge base was unambiguous, and creating a planning branch did not risk user changes. Branch object IDs will be checked again before handoff to prove that neither source ref moved.

## `main` inventory and readiness

| Area              | Evidence                                                                                                                                                                                     | Transition consequence                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime           | **VERIFIED** — Next.js 16.3.0, React 19.2.8, strict TypeScript 6, Node `>=24 <25`, and npm 11 are pinned.                                                                                    | **PROPOSED** — keep this runtime unchanged during the decision phase. Re-evaluate compatibility at the native implementation gate rather than pinning a future Expo SDK now. |
| Web application   | **VERIFIED** — a Next.js App Router application lives at the repository root. Arabic is the default, with `/ar` RTL and `/en` LTR routes plus a non-functional workspace shell.              | **PROPOSED** — preserve this path and behavior until the dedicated topology transition.                                                                                      |
| Backend           | **VERIFIED** — the application is a modular monolith. Application/domain layers are isolated from presentation, transport, infrastructure, and providers by an executable boundary check.    | **PROPOSED** — retain the modular monolith as the MVP backend and add public mobile-safe transports around application services.                                             |
| API               | **VERIFIED** — `/api/v1` is reserved by documentation only; it has no Route Handler, contract, authentication, error envelope, pagination, idempotency, or rate-limit implementation.        | **BLOCKED** — a native client must not start feature integration until a versioned API slice and compatibility tests exist.                                                  |
| Database          | **VERIFIED** — PostgreSQL/Prisma is wired through infrastructure. The only migration creates `_foundation_health_checks`; there are no users, identities, terms, courses, or academic items. | **PROPOSED** — introduce identity and academic migrations through reviewed expand/contract steps only.                                                                       |
| Authentication    | **VERIFIED** — no provider SDK, user schema, session, account UI, token validation, or authorization implementation exists on `main`. ADR 0012 is only an evaluation plan.                   | **BLOCKED** — owner selection plus live provider/database evidence is required before production auth work.                                                                  |
| Providers         | **VERIFIED** — the provider directory contains guidance, not an integration. No hosting, database, auth, email, push, analytics, or observability vendor is selected.                        | **PROPOSED** — keep provider-facing code behind application-owned ports and avoid provider types in public contracts.                                                        |
| Localization      | **VERIFIED** — typed Arabic/English dictionaries, first-response direction, logical CSS, bidi isolation, localized metadata, and invalid-locale handling are tested.                         | **PROPOSED** — share message identifiers and semantic tokens where useful; keep platform rendering and direction setup platform-specific.                                    |
| Design foundation | **VERIFIED** — CSS custom properties cover color, spacing, type, radius, shadow, focus, reduced motion, logical layout, and 44px controls. This is not yet a cross-platform design system.   | **PROPOSED** — extract reviewed semantic tokens later; do not treat CSS or the historical prototype as native components.                                                    |
| Tests             | **VERIFIED** — format, lint, boundaries, type, unit, component, accessibility, PostgreSQL integration, build, Chromium E2E, secrets, audit, and CI definitions exist.                        | **PROPOSED** — extend the matrix with API contract, auth-provider, migration race, native unit/component/device, deep-link, notification, and store-build gates.             |
| CI/deployment     | **VERIFIED** — CI is defined with a PostgreSQL service, but no remote exists and no GitHub-hosted run or production deployment is evidenced.                                                 | **NOT VERIFIED** — staging, production, backups, restore, monitoring, and store delivery remain unproved.                                                                    |
| Prototype         | **VERIFIED** — `research-prototype/` is explicitly excluded and cannot be imported by production code.                                                                                       | **PROPOSED** — keep that prohibition intact across any later workspace move.                                                                                                 |

### Current readiness verdict

- **VERIFIED — web foundation ready:** the shell, localization baseline, module boundaries, technical database proof, and local verification tooling provide a sound starting point.
- **VERIFIED — production service not ready:** accounts, authorization, product data, public APIs, operational providers, and deployment do not exist.
- **VERIFIED — native integration not ready:** no mobile application, stable API, native session contract, deep-link domain, signing identity, store account, privacy declaration, or device test evidence exists.
- **INFERRED — the critical path is identity and API stability, not repository movement.** A workspace conversion today would move files without retiring the primary product risks.

## Branch topology and change summary

```text
80c9974 main, planning branch point
   |
   +-- fa588b0 spike dependency/config preparation
       |
       +-- cad82a9 identity and Supabase-oriented runtime spike
           |
           +-- fdd4804 spike tests
               |
               +-- ffa67b0 spike decision documentation
                   |
                   +-- dd3af22 spike evidence report
```

- **VERIFIED** — `main..spike/supabase-auth-runtime` changes 77 files with 3,139 insertions and 69 deletions.
- **VERIFIED** — the spike combines dependency, runtime, schema, migration, UI, test, and documentation changes. It is not a separable production patch.
- **VERIFIED** — the spike report records strong provider-free local checks, but its four PostgreSQL integration tests were skipped because `TEST_DATABASE_URL` was absent.
- **NOT VERIFIED** — no Supabase project, provider credentials, SMTP/email delivery, hosted database, real browser cookie exchange, token revocation, password recovery, provider outage, or production environment was exercised.
- **PROPOSED** — do not merge the branch and do not cherry-pick any whole commit. Re-implement selected concepts from `main` after the relevant owner gates.

## Commit-level disposition

| Commit    | Classification     | Finding                                                                                                                                                                                                                         |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fa588b0` | **DEFER**          | **VERIFIED** — adds `@supabase/ssr`, `@supabase/supabase-js`, auth environment fields, and spike framing before a provider decision. Keep the compatibility research, but install no provider dependency until selection.       |
| `cad82a9` | **ADAPT LATER**    | **VERIFIED** — demonstrates identity ports, mapping, web flows, provider adapters, a schema, and route protection. Useful boundaries are mixed with Supabase-specific and evaluation-only behavior, so rewrite in gated slices. |
| `fdd4804` | **RETAIN CONCEPT** | **VERIFIED** — adds identity, redirect, adapter, boundary, component, accessibility, and E2E test ideas. Some tests validate fakes or unexecuted paths; retain the matrix, not its pass claims.                                 |
| `ffa67b0` | **RETAIN CONCEPT** | **VERIFIED** — captures threat-model and production-gate thinking. Provider-specific conclusions and historical status must be refreshed after selection.                                                                       |
| `dd3af22` | **RETAIN CONCEPT** | **VERIFIED** — preserves a useful record of what was and was not executed. It is evidence about a spike, not proof of production readiness.                                                                                     |

## File-level salvage map

| Spike file or group                                                                        | Disposition        | Safety, neutrality, and evidence required                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/modules/identity/domain/internal-user.ts`                                             | **ADAPT LATER**    | **VERIFIED** — an internal UUID separate from provider identity is the right invariant. Rewrite the domain after lifecycle and deletion semantics are approved; keep it free of Next.js, Prisma, Expo, and vendor types.                                                     |
| `src/modules/identity/application/ports/identity-link-repository.ts`                       | **ADAPT LATER**    | **VERIFIED** — the port expresses provider-subject lookup. Replace its named-vendor type with an opaque registered provider key and specify concurrency/error behavior.                                                                                                      |
| `src/modules/identity/application/resolve-current-user.ts`                                 | **ADAPT LATER**    | **VERIFIED** — resolve-or-create and reread-on-conflict is a useful sketch. It only has in-memory race proof; require a real PostgreSQL concurrent test, narrowly classified unique violations, bounded retries, and rollback evidence.                                      |
| `src/modules/identity/application/authentication-service.ts` and `authentication-error.ts` | **RETAIN CONCEPT** | **VERIFIED** — application-owned auth errors and orchestration reduce provider leakage. Adapt capabilities to browser and native session modes after provider selection.                                                                                                     |
| `src/modules/identity/application/ports/authentication-gateway.ts`                         | **ADAPT LATER**    | **VERIFIED** — a port is appropriate, but the provider union names vendors and the email/password surface assumes a provider flow. Define provider-neutral capabilities from the chosen browser/native flows.                                                                |
| `prisma/schema.prisma` identity additions                                                  | **ADAPT LATER**    | **VERIFIED** — `users` plus unique `(provider, provider_subject)` identities supports stable internal ownership. Replace the vendor enum, review lifecycle/default locale/time-zone semantics, indexes, deletion policy, and audit fields before generating a new migration. |
| `20260808000000_identity_spike` migration and rollback                                     | **DISCARD**        | **VERIFIED** — the migration was not run against PostgreSQL in the spike and encodes unapproved schema semantics. Never edit or apply it as production history; generate a fresh reviewed migration from the approved model.                                                 |
| Prisma identity repository and factory                                                     | **ADAPT LATER**    | **VERIFIED** — persistence isolation is useful. Correct client lifecycle/pooling, unique-constraint classification, transaction isolation, retry limits, and observability before use.                                                                                       |
| Supabase server client, session proxy, error mapping, and gateway                          | **DEFER**          | **VERIFIED** — these are provider-specific adapters. Re-evaluate against the selected provider's current official SSR/native guidance and real project tests; discard if another provider is selected.                                                                       |
| `unavailable-authentication-gateway.ts` and `AUTH_SPIKE_EVALUATION_MODE`                   | **DISCARD**        | **VERIFIED** — evaluation-mode behavior is not a production state. Retain fail-closed startup/runtime behavior without a fake operational mode.                                                                                                                              |
| `src/composition/authentication.ts`                                                        | **ADAPT LATER**    | **VERIFIED** — central composition is sound, but provider choice and client lifecycle must be production configuration, not spike branching.                                                                                                                                 |
| `auth-actions.ts`                                                                          | **ADAPT LATER**    | **VERIFIED** — validation and safe error mapping are useful for the web. Server Actions are a web transport and must never become the native API contract.                                                                                                                   |
| `require-current-user.ts`, proxy changes, and workspace guard                              | **RETAIN CONCEPT** | **VERIFIED** — optimistic routing plus secure data-layer authorization is the correct shape. Do not rely on proxy alone; validate access again at every protected service/Route Handler.                                                                                     |
| `safe-auth-redirect.ts`                                                                    | **RETAIN CONCEPT** | **VERIFIED** — allowlisted relative returns reduce open redirects. Generalize through explicit route policy and cover web/native callback allowlists separately.                                                                                                             |
| Auth callback route                                                                        | **DEFER**          | **VERIFIED** — the callback is tied to one provider and always routes exchanged codes toward password reset. Real confirmation/recovery/OAuth cases, state/PKCE, replay resistance, and deep-link fallbacks were not proved.                                                 |
| Registration/sign-in/recovery pages and auth presentation                                  | **ADAPT LATER**    | **VERIFIED** — bilingual accessible form patterns are useful web evidence. Copy and flows depend on owner policy and real provider behavior; native UI must be implemented natively.                                                                                         |
| Localization/CSS changes                                                                   | **ADAPT LATER**    | **VERIFIED** — additional auth messages and accessible state styles are reusable ideas. Integrate only alongside approved product flows and keep CSS out of mobile.                                                                                                          |
| Identity resolution/unit tests                                                             | **RETAIN CONCEPT** | **VERIFIED** — internal identity and concurrent resolution invariants deserve permanent tests. Replace in-memory-only race evidence with PostgreSQL integration and API contract coverage.                                                                                   |
| Adapter tests                                                                              | **DEFER**          | **VERIFIED** — fake responses test mapping shape, not compatibility with a live provider. Turn these into provider contract tests if that adapter is selected.                                                                                                               |
| Component and accessibility tests                                                          | **RETAIN CONCEPT** | **VERIFIED** — accessible form/state coverage should remain for web and gain separate native screen-reader/device evidence.                                                                                                                                                  |
| E2E auth changes                                                                           | **DISCARD**        | **VERIFIED** — evaluation-mode/fake-unavailable behavior does not prove registration, verification, session refresh, recovery, logout, or revocation. Replace with real provider-backed staging journeys.                                                                    |
| Threat model and provider gate documents                                                   | **RETAIN CONCEPT** | **VERIFIED** — the questions are valuable. Refresh them with provider-neutral multi-platform threats, current primary sources, accountable owners, and executed evidence.                                                                                                    |
| Sprint 1A reports                                                                          | **RETAIN CONCEPT** | **VERIFIED** — preserve on the spike as historical evidence. Do not present their provider-free pass counts as main-branch production acceptance.                                                                                                                            |

## Cross-branch drift and supersession

- **VERIFIED** — older product documents describe native apps as outside the original MVP. The owner's 2026-08-08 request changes future direction; this package supersedes topology and sequencing guidance only, not historical facts or previously executed evidence.
- **VERIFIED** — some earlier evaluation prose names Vercel as a recommendation, while ADR 0011 and the repository contain no selected host or deployment. Vendor selection remains **NOT VERIFIED**.
- **VERIFIED** — product architecture prose lists candidate `/api/v1` route families, while the repository implements none. Candidate routes are **PROPOSED**, not current capabilities.
- **VERIFIED** — historical reports predate the technical foundation migration. The current schema and migration directory are the source of truth for implemented database state.
- **PROPOSED** — active entry-point documentation should link to this package and state its precedence; historical records should remain intact.

## Branch disposition

1. **PROPOSED — keep `main` authoritative.** All production implementation should start from reviewed mainline state.
2. **PROPOSED — keep the spike unmerged.** It remains inspectable evidence until the owner accepts or rejects the salvage map.
3. **PROPOSED — cherry-pick nothing now.** Each future implementation slice should be newly authored from `main`, with the selected spike concept cited in its review notes.
4. **PROPOSED — delete no branch in this package.** Branch deletion is a separate owner action after historical evidence retention is decided.
5. **BLOCKED — auth implementation** until the owner selects a provider/flow and live validation resources exist.
6. **BLOCKED — mobile implementation** until the versioned API, identity mapping, first academic contract, topology gate, store ownership, and privacy baseline are approved.

## Audit commands and limitations

**VERIFIED** — the audit used read-only Git inventory/diff/log/show/worktree/status commands, repository file inspection, existing test/report evidence, and installed Next.js 16.3 documentation. No service, account, credential, database, package, schema, application source, CI, branch ref, or deployment target was modified during the audit.

**NOT VERIFIED** — GitHub branch protection, remote CI history, hosted environments, store-console state, legal compliance, vendor control planes, and real user/device behavior cannot be audited because no remote or account access was provided.
