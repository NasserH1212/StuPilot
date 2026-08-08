# Production multi-platform transition plan

- **Plan date:** 2026-08-08 (Asia/Riyadh)
- **Status:** **PROPOSED — no implementation is authorized by this document**
- **Strategy:** retain the root Next.js modular monolith through identity/API stabilization; convert to npm workspaces immediately before native implementation
- **Target outcome:** one production vertical slice works in Arabic and English on web, iOS, and Android against the same authorized backend and PostgreSQL data

## Outcome and critical path

**PROPOSED — first cross-platform vertical slice:** a student authenticates, creates or selects an academic term and course, creates or updates one academic item, sees it in a time-zone-correct agenda, and observes the same authorized state from the other client. Completion/edit conflict behavior, sign-out, cache clearing, Arabic/RTL, English/LTR, and accessible error/loading states are part of acceptance.

```text
Owner decisions
  -> real auth + internal identity
    -> versioned API spine
      -> first web/API academic slice
        -> behavior-neutral workspace move
          -> signed native foundation
            -> cross-platform vertical slice
              -> reminders/store production readiness
```

- **PROPOSED** — authentication and identity resolution precede mobile feature development.
- **PROPOSED** — API behavior precedes mobile screens that depend on it.
- **PROPOSED** — repository conversion follows stable contracts and precedes creation of native features.
- **PROPOSED** — reminders and background delivery follow server-authoritative academic data; they do not block the first CRUD/agenda slice unless the owner explicitly includes them in MVP.

## Global rules

1. **PROPOSED** — each phase starts only after its entry evidence is captured and owner blockers are resolved.
2. **PROPOSED** — each implementation change has one dominant concern: product behavior, schema, provider, topology, or release configuration. Avoid mixed migration/restructure/feature commits.
3. **PROPOSED** — no spike commit is merged or cherry-picked wholesale; selected concepts are re-authored from `main` with current tests.
4. **PROPOSED** — application/domain policy remains transport-independent; Server Actions and Route Handlers are adapters.
5. **PROPOSED** — database and API changes are backward-compatible for supported native versions.
6. **PROPOSED** — production accounts, credentials, signing keys, and environments are created only by named owners through approved stores/secret managers, never committed.
7. **PROPOSED** — a phase exit needs executed evidence, not configuration or prose alone.

## Phase overview

| Phase | Purpose                                 | Earliest topology              | Exit result                                                                                 |
| ----- | --------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| 0M    | Accept decisions and establish controls | Root Next.js                   | Approved decisions, owners, scope, and source-branch disposition                            |
| 1     | Provider and operational preflight      | Root Next.js                   | Selected auth/session approach and usable isolated staging resources                        |
| 2     | Production identity and API spine       | Root Next.js                   | Real browser/native credential validation maps to one internal user; API conventions proven |
| 3     | First academic service slice            | Root Next.js                   | Web and `/api/v1` read/write the same authorized PostgreSQL aggregate                       |
| 4     | Repository topology transition          | npm workspaces, web only       | `apps/web` behavior and checks match pre-move baseline                                      |
| 5     | Native foundation                       | npm workspaces + `apps/mobile` | Signed development builds authenticate and call `/api/v1` safely                            |
| 6     | Cross-platform vertical slice           | Target topology                | Web/iOS/Android complete the same academic journey                                          |
| 7     | Reminders and production release        | Target topology                | Operational, privacy, restore, store, staged rollout, and support gates pass                |

## Phase 0M — owner acceptance and control plane

### Entry

- **VERIFIED** — `main` and the auth spike were audited from a clean worktree.
- **VERIFIED** — the planning branch contains documentation only at the time this plan is authored.

### Work

1. **PROPOSED** — owner reviews and accepts, amends, or rejects the selected Option D repository strategy.
2. **PROPOSED** — resolve decisions D01-D16 in [owner-decisions.md](owner-decisions.md) at their stated deadlines; decisions can be staged rather than all completed immediately.
3. **PROPOSED** — approve the first vertical slice and explicit non-goals.
4. **PROPOSED** — decide whether the spike branch remains as historical evidence or is deleted later; do not merge it.
5. **PROPOSED** — assign accountable engineering, product/privacy, and release/signing owners even if one person holds multiple roles.
6. **PROPOSED** — record a decision-change process and evidence location.

### Exit evidence

- **BLOCKED** until D01 (topology), D02 (auth evaluation authority), D03 (identity lifecycle), D14 (vertical slice), and D15 (spike disposition) have named outcomes.
- **PROPOSED** — approved record identifies who may create external resources and who holds recovery authority.

### Rollback/stop

**PROPOSED** — this phase is documentation-only. If the direction is rejected, replace the proposed decisions with a new record; do not reinterpret the current package as approval.

## Phase 1 — provider and operational preflight

### Entry

- **VERIFIED** — Phase 0M decisions required for evaluation are approved.
- **PROPOSED** — evaluation budget, data region constraints, account owner, and expiry date are known.

### Work

1. **PROPOSED** — evaluate current auth candidates against browser SSR/cookies, native Authorization Code + PKCE or supported secure native flow, token validation, email verification/recovery, session revocation, account deletion, export, MFA/passkeys roadmap, rate limits, auditability, regional/data-processing terms, cost, and exit/export capability.
2. **PROPOSED** — create separate staging auth/database resources through owner-controlled accounts; enable MFA and recovery contacts.
3. **PROPOSED** — prove callback allowlists for web plus development native identifiers without production credentials.
4. **PROPOSED** — select web/API hosting and PostgreSQL region only to the extent required for latency, connection, migration, secret, backup, and restore proof. Do not deploy production.
5. **PROPOSED** — prepare privacy data-flow inventory for provider SDKs and planned academic data.
6. **PROPOSED** — write the auth decision, threat model, provider exit plan, and credential custody plan.

### Required tests

- **PROPOSED** — real staging registration/sign-in, applicable verification, refresh/expiry, logout/local-vs-global revocation, recovery, invalid/expired/replayed callback, provider outage, rate limit, duplicate subject race, and account deletion/export capability.
- **PROPOSED** — browser and signed native-development flow proof; mock-only or Expo Go proof is insufficient.
- **PROPOSED** — no email/account enumeration in public errors or timing within the practical threat model.

### Exit evidence

- **VERIFIED** — selected provider decision with current primary-source evidence and explicit rejected options.
- **VERIFIED** — isolated staging resources work; secrets are in approved stores; no secret appears in Git or client-visible config.
- **VERIFIED** — browser/native session diagrams and internal identity contract are approved.
- **VERIFIED** — provider limitations and outage/recovery behaviors are recorded.

### Rollback/stop

- **PROPOSED** — delete or disable evaluation resources and credentials if no provider passes.
- **BLOCKED** — do not implement Phase 2 against an unavailable/fake gateway or evaluation-mode switch.

## Phase 2 — production identity and `/api/v1` spine

### Entry

- **VERIFIED** — Phase 1 provider and staging gates pass.
- **VERIFIED** — identity lifecycle, linking, email, retention, and deletion semantics are owner-approved.
- **VERIFIED** — pre-change schema backup/restore and migration environment are available.

### Work

1. **PROPOSED** — author provider-neutral identity/domain/application ports from `main`; use opaque provider keys and internal UUID ownership.
2. **PROPOSED** — add a fresh reviewed users/identity schema and migration. Do not copy or edit the spike migration.
3. **PROPOSED** — implement one production provider adapter and composition path with fail-closed configuration.
4. **PROPOSED** — implement secure browser session flow and native-token validation/mapping as separate transport concerns.
5. **PROPOSED** — add `/api/v1/session`, request IDs, problem envelope, schema validation, auth context, safe logging, rate/body limits, and version policy.
6. **PROPOSED** — implement account sign-out/revocation, recovery, export/deletion foundations required by the approved lifecycle.
7. **PROPOSED** — add web auth UI only after real provider behavior is known; retain Arabic/English and accessibility standards.

### Required tests

- **PROPOSED** — real PostgreSQL migration/status/rollback-or-roll-forward evidence and concurrent first-login proof with no orphan/duplicate user.
- **PROPOSED** — live provider contract tests for browser and signed native development build.
- **PROPOSED** — negative auth/authorization, CSRF for cookie mutations, callback state/PKCE/replay, safe redirect, token audience/issuer/expiry, revocation, rate, body-size, and redaction tests.
- **PROPOSED** — schema fixture and generated-description drift check for `/api/v1/session` and problem responses.

### Exit evidence

- **VERIFIED** — the same provider identity consistently resolves to one internal UUID through browser and native credential paths.
- **VERIFIED** — no domain table references provider subject/email as owner.
- **VERIFIED** — protected data access fails closed when provider/database/configuration is unavailable.
- **VERIFIED** — all existing main checks plus new identity/API suites pass.

### Deployment and rollback

- **PROPOSED** — deploy additive schema first, then compatible server behavior, then web UI. No mobile release exists yet.
- **PROPOSED** — rollback application behavior without dropping new identity data. Use roll-forward for applied schema unless the reviewed recovery plan proves safe reversal.
- **PROPOSED** — retain a provider disable/maintenance response that is secure and honest, not a fake authenticated mode.

## Phase 3 — first academic service and web/API slice

### Entry

- **VERIFIED** — Phase 2 identity/API exit passes in staging.
- **VERIFIED** — the owner approves term/course/item/time-zone/week-start semantics and the first journey.

### Work

1. **PROPOSED** — model terms, courses, academic items, completion state, and agenda projection with internal user ownership.
2. **PROPOSED** — create reviewed migrations using all-day `date`, instant `timestamptz`, and separate IANA zone/civil recurrence where required.
3. **PROPOSED** — implement application commands/queries once; connect web Server Components/Actions and `/api/v1` Route Handlers as adapters.
4. **PROPOSED** — implement cursor/filter, idempotency, resource version/conflict, error, and authorization conventions needed by this slice.
5. **PROPOSED** — publish fixtures/machine-readable contract and a small transport-independent contracts package only if both server and planned client will consume it after the workspace move.
6. **PROPOSED** — implement Arabic/English web journey and accessible empty/loading/error/conflict states.

### Required tests

- **PROPOSED** — cross-account isolation, guessed IDs, nested ownership, deletion/cascade, duplicate idempotency, concurrent edit, pagination stability, DST/non-DST zones, midnight/week boundary, Arabic/Latin bidi, and safe errors.
- **PROPOSED** — browser-to-database and API-to-database integration tests use the same real PostgreSQL schema.
- **PROPOSED** — replay contract fixtures representing the planned mobile client; reject server/contract drift.

### Exit evidence

- **VERIFIED** — web and direct API clients perform the approved academic read/write journey against staging.
- **VERIFIED** — server-side web code calls application services directly rather than self-fetching Route Handlers.
- **VERIFIED** — versioning/support policy and first contract are stable enough to support an installed client.
- **VERIFIED** — all pre-move commands and web route snapshots are captured for Phase 4 parity.

### Deployment and rollback

- **PROPOSED** — use additive migrations, deploy server/API, then web. Preserve old representation until all deployed code is compatible.
- **PROPOSED** — disable the new UI/API capability through an approved server-side flag only if it does not bypass schema/auth invariants; otherwise roll back the application and roll forward data repair.

## Phase 4 — behavior-neutral npm workspace conversion

### Entry

- **VERIFIED** — every exact gate in the repository strategy is satisfied.
- **VERIFIED** — current build/test/migration scripts, ignored/generated paths, route inventory, bundle behavior, and deployment roots have a captured baseline.
- **VERIFIED** — no unrelated feature, provider, schema, or dependency upgrade is included.

### Work

1. **PROPOSED** — create a private root npm workspace configuration with one lockfile.
2. **PROPOSED** — move the complete Next.js app/tooling/runtime into `apps/web`, preserving Git history where practical.
3. **PROPOSED** — update path aliases, Prisma schema/client output, scripts, Compose paths, Next/Vitest/Playwright/ESLint/Prettier/TypeScript configuration, boundary/secret checks, CI caches/artifacts, and deployment root documentation.
4. **PROPOSED** — create only shared packages already justified by two consumers or a frozen contract. Do not add `apps/mobile` product code in this change.
5. **PROPOSED** — strengthen the boundary checker so contracts/tokens remain platform-neutral and prototype imports remain prohibited.

### Parity gate

- **PROPOSED** — clean `npm ci`, generation, format, lint, boundaries, typecheck, all web/server tests, real PostgreSQL migration/integration, production build, E2E/accessibility, secret scan, and audit match or exceed the captured baseline.
- **PROPOSED** — route inventory, Arabic/English first response, auth cookies/callbacks, `/api/v1`, Prisma migrations, generated artifacts, and deployment-root smoke tests show no behavior change.
- **PROPOSED** — a clean clone/CI checkout proves there is no dependency on old root paths.

### Rollback

- **PROPOSED** — because this phase has no behavior/schema/provider change, revert the complete workspace conversion if parity fails. Do not merge a transitional dual-root state.

## Phase 5 — native foundation

### Entry

- **VERIFIED** — Phase 4 parity is green on the target workspace layout.
- **VERIFIED** — exact stable Expo/React Native/Node/toolchain versions and supported OS versions are recorded from current official compatibility data.
- **VERIFIED** — organization-owned Apple/Google/Expo accounts, application identifiers, signing custody, staging API origin, deep-link domain, privacy owner, and build profiles are approved.

### Work

1. **PROPOSED** — create `apps/mobile` with Expo Router in its own implementation change.
2. **PROPOSED** — add environment-safe typed configuration, API client, request/problem mapping, query cache, secure credential adapter, auth lifecycle, navigation, theme/token mapping, localization, RTL, and accessibility foundation.
3. **PROPOSED** — configure development/preview/production variants, Universal/App Links, custom scheme fallback if required, and signed development builds.
4. **PROPOSED** — implement sign-in, callback, session restore/expiry, logout/revocation, and `/api/v1/session`; no academic feature yet.
5. **PROPOSED** — set up native unit/component/device smoke, dependency/secret/license checks, build artifact retention, and release/version identifiers.

### Exit evidence

- **VERIFIED** — signed iOS and Android development builds authenticate through the selected real staging provider and call the same `/api/v1` internal user context as web.
- **VERIFIED** — cold/warm callbacks, wrong/replayed links, offline/expired session, identity switch, and cache/credential clearing pass on real supported devices.
- **VERIFIED** — Arabic RTL and English LTR render correctly with VoiceOver/TalkBack and font scaling on representative devices.
- **VERIFIED** — no server secret or sensitive build artifact is present in source/binary-visible configuration.

### Rollback

- **PROPOSED** — native foundation is unreleased; remove or revert `apps/mobile` without changing the stable API/web path. Revoke test signing/push/provider credentials if compromised.

## Phase 6 — cross-platform vertical slice

### Entry

- **VERIFIED** — native foundation and Phase 3 API contract gates pass.
- **VERIFIED** — the approved slice and offline behavior are unchanged or formally revised.

### Work

1. **PROPOSED** — implement native term/course/item/agenda screens against `/api/v1`; do not duplicate server policy.
2. **PROPOSED** — implement bounded cache/stale/error/retry behavior and optimistic UI only where idempotency/version conflicts make it safe.
3. **PROPOSED** — complete shared semantic token and localization-resource extraction only for proven duplication.
4. **PROPOSED** — add cross-client journey fixtures and supported-version contract replay.
5. **PROPOSED** — instrument safe client/server correlation and release health.

### Exit evidence

- **VERIFIED** — create/update on web appears correctly on native and vice versa; unauthorized cross-account access fails in both.
- **VERIFIED** — conflict, retry, network loss, stale cache, sign-out/account switch, time-zone/week boundaries, and data deletion behavior pass.
- **VERIFIED** — web browser and native device accessibility/RTL matrices pass with recorded evidence.
- **VERIFIED** — candidate backend remains compatible with the previous supported native build fixture.

### Rollout and rollback

- **PROPOSED** — release through internal/TestFlight/closed testing first. Backend changes remain additive and support both old/new clients.
- **PROPOSED** — stop native rollout on crash/auth/data-integrity/error thresholds. Roll back server only to a version compatible with already installed clients; otherwise forward-fix behind a safe capability gate.

## Phase 7 — reminders, operations, and store production

### Entry

- **VERIFIED** — the cross-platform vertical slice is stable in test distribution.
- **VERIFIED** — owner has approved reminders, privacy/retention, territories, ratings, support, SLO, RPO/RTO, and public-launch scope.

### Work

1. **PROPOSED** — add backend-owned reminder scheduling and installation registry; select Expo Push Service or direct APNs/FCM through a vendor/data review.
2. **PROPOSED** — use background work only for opportunistic sync, never exact reminder time.
3. **PROPOSED** — finish public privacy policy, Data safety/App Privacy declarations, in-app and public-web account deletion paths, export, permissions copy, support URL, and store metadata.
4. **PROPOSED** — prove signing recovery, backup/PITR restore, migration recovery, provider outage, alert/runbook ownership, incident handling, and client support/version telemetry.
5. **PROPOSED** — run TestFlight/closed testing, staged/phased public rollout, and post-release monitoring with explicit stop conditions.

### Production exit evidence

- **VERIFIED** — current store target/toolchain/policy checks pass on the actual artifacts.
- **VERIFIED** — disclosures match actual first- and third-party data behavior.
- **VERIFIED** — restore exercise meets approved RPO/RTO; on-call/runbooks and credential recovery are tested.
- **VERIFIED** — push permission denial, token invalidation, delivery failure, time-zone/quiet-hour changes, and notification tap deep links degrade safely.
- **VERIFIED** — no P0/P1 risk in the [risk register](risk-register.md) lacks an accepted mitigation/contingency owner.

## Deployment order after native clients exist

For a normal backward-compatible change:

1. **PROPOSED** — add/expand database schema and backfill safely.
2. **PROPOSED** — deploy backend that supports old and new representations/contracts.
3. **PROPOSED** — deploy web, which can be rolled back quickly.
4. **PROPOSED** — submit native build and use staged/phased rollout.
5. **PROPOSED** — observe supported-version adoption and error/data metrics.
6. **PROPOSED** — contract/remove old behavior only after the owner-approved support window.

For a security emergency, **PROPOSED** — revoke credentials/capabilities server-side, return a safe minimum-version response if necessary, preserve export/deletion/support access, and document the exceptional break. “Force update” is not a routine migration tool.

## Definition of done for the transition program

The transition is complete only when:

- **VERIFIED** — web, iOS, and Android use the same production identity and authorized academic data model;
- **VERIFIED** — native uses versioned HTTPS APIs and web transports reuse the same application services;
- **VERIFIED** — repository/workspace boundaries, one lockfile, CI, builds, deployments, and ownership are documented and enforced;
- **VERIFIED** — Arabic/RTL, English/LTR, accessibility, time, offline/cache, deep link, and lifecycle behavior pass their matrices;
- **VERIFIED** — privacy, deletion/export, signing, backups/restore, observability, incident response, and store requirements are operationally proved;
- **VERIFIED** — supported-client compatibility and rollback are exercised, not assumed;
- **VERIFIED** — reports distinguish executed evidence from proposals and unknowns.
