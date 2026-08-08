# Owner decisions

- **Prepared:** 2026-08-08 (Asia/Riyadh)
- **Status:** **BLOCKED — the choices below have recommendations but no owner acceptance**
- **Purpose:** identify the minimum decisions that materially change topology, security, privacy, product scope, cost, or release ownership

## How to use this record

For each decision, record the selected option, accountable owner, decision date, constraints, and evidence link. “Proceed” without those fields does not resolve a gate. A later change receives a new dated decision and migration/rollback impact review.

**PROPOSED response format:**

```text
Decision: Dxx
Selected option:
Accountable owner:
Decision date:
Constraints/expiry:
Evidence or follow-up:
```

## Decision summary

| ID  | Decision                                              | Recommended direction                                                                                  | Due before                         | Current status |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------- | -------------- |
| D01 | Repository topology and timing                        | Option D: root through contract stability, then behavior-neutral npm workspace move before native code | Any topology change                | **BLOCKED**    |
| D02 | Authentication provider and evaluation authority      | Evidence-gated selection proving browser and signed-native flows; no provider assumed                  | Auth implementation                | **BLOCKED**    |
| D03 | Internal identity, linking, and account lifecycle     | Internal UUID + opaque provider identities; no email auto-merge; explicit lifecycle                    | Identity schema/migration          | **BLOCKED**    |
| D04 | Web/API hosting, PostgreSQL region, and operations    | Co-deploy Next.js web/API; managed PostgreSQL near users; prove connection/backup/restore              | Shared staging                     | **BLOCKED**    |
| D05 | Mobile identifiers and store-account ownership        | Organization-owned stable IDs/accounts with separate non-production variants                           | Native project creation            | **BLOCKED**    |
| D06 | Build/signing credential custody                      | EAS as initial build candidate; owner-controlled accounts, least privilege, recovery drill             | Signed native builds               | **BLOCKED**    |
| D07 | Privacy, retention, export, and deletion              | Data-class inventory and minimal retention; in-app + public-web deletion; tested export                | Accounts/store testing             | **BLOCKED**    |
| D08 | Reminder and push scope                               | Backend-owned schedule; best-effort minimal push; defer from first slice unless essential              | Notification implementation        | **BLOCKED**    |
| D09 | Offline scope                                         | Online-first MVP with bounded read cache; no offline mutation queue initially                          | Native academic slice              | **BLOCKED**    |
| D10 | Calendar, week, and time-zone semantics               | Preserve all-day/civil intent; Sunday/Asia-Riyadh default pending override/travel decision             | Academic contract freeze           | **BLOCKED**    |
| D11 | Design system, theme, font, RTL, accessibility        | Share semantic tokens, not UI; native components; AA/native assistive-tech gate                        | Native UI foundation               | **BLOCKED**    |
| D12 | Observability, service levels, and incident ownership | Safe telemetry + named alerts/runbooks; proposed RPO <=15m, RTO <=4h                                   | Production-like staging            | **BLOCKED**    |
| D13 | Release scope, territories, age/support policy        | Limited test distribution first; public scope only after privacy/operations evidence                   | Store listing/submission           | **BLOCKED**    |
| D14 | First cross-platform vertical slice                   | Auth + term/course + one academic item + agenda + cross-client consistency                             | Academic implementation            | **BLOCKED**    |
| D15 | Auth spike disposition                                | Preserve temporarily as evidence; merge/cherry-pick nothing; delete only by later approval             | Auth implementation/branch cleanup | **BLOCKED**    |
| D16 | API/client compatibility window                       | Support current and prior GA native version, plus time floor; measure before removal                   | First native store release         | **BLOCKED**    |

## D01 — repository topology and timing

**Decision needed:** accept Option D, choose another audited option, or revise its entry gate.

**PROPOSED recommendation:** keep the root Next.js app through real auth, `/api/v1`, and the first academic contract. Then make one behavior-neutral move to npm workspaces/`apps/web`; create `apps/mobile` only after parity passes.

**Why:**

- **VERIFIED** — current root foundation works and `/api/v1` does not.
- **INFERRED** — moving now creates broad path churn without retiring identity/API risk.
- **INFERRED** — waiting until after mobile feature code exists would create a more complex move and unclear shared-package rules.

**Alternatives:** immediate workspaces (faster target shape, higher current regression/speculation risk); permanent root plus ad-hoc mobile (lower move cost, higher long-term tooling/boundary ambiguity); separate repositories (strong isolation, high coordination/contract drift).

**Default if unanswered:** **BLOCKED** — no repository move and no mobile project creation.

## D02 — authentication provider and evaluation authority

**Decision needed:** authorize a bounded provider evaluation, identify candidate(s), account owner, budget/region/privacy constraints, and who makes the final selection.

**PROPOSED recommendation:** select only after real isolated staging proof covers SSR browser cookie flow, signed-native secure flow, server token/session validation, verification/recovery, refresh/expiry, logout/revocation, deletion/export, rate limits/outage, data region/terms, cost, and provider exit.

**VERIFIED:** neither `main` nor the spike proves a live provider. Supabase-specific code on the spike is compatibility evidence only.

**Alternatives:** managed auth candidate(s), self-hosted auth, or delay accounts. Self-hosting increases security/operations responsibility and is not recommended without a verified requirement that managed options cannot satisfy.

**Default if unanswered:** **BLOCKED** — no auth dependency, schema, UI, provider account, or credential creation.

## D03 — internal identity, linking, and account lifecycle

**Decisions needed:**

- whether one user may link multiple provider identities and how reauthentication proves the link;
- whether verified email is required and whether it is contact-only or sign-in policy;
- duplicate-account recovery without automatic email merge;
- active/disabled/suspended/deletion-pending states and who can set them;
- deletion grace, cancellation, provider revocation, retained audit evidence, and recovery support;
- locale/time-zone defaults versus required onboarding choices.

**PROPOSED recommendation:** stable StudentHub UUID owns all data; `(provider_key, provider_subject)` uniquely authenticates; email never auto-merges; linking requires authenticated proof of both sides or an owner-approved recovery process; default deny for disabled/deletion states.

**VERIFIED:** the spike's separate user/identity concept is useful, but its vendor enum, lifecycle enum, default zone, and migration are unapproved/unexecuted.

**Default if unanswered:** **BLOCKED** — no identity migration.

## D04 — hosting, PostgreSQL region, and operational boundary

**Decisions needed:** web/API host, managed PostgreSQL candidate/region, staging/production account ownership, connection/pooling approach, data residency, RPO/RTO budget, and whether a worker is needed for reminders.

**PROPOSED recommendation:** keep web and `/api/v1` in the same Next.js deployment for MVP; choose managed PostgreSQL in a region that meets user latency/residency and supports tested encrypted backup/PITR; add a separate worker only for measured scheduled/queue needs.

**VERIFIED:** no host, managed database, region, deployment, backup, or restore is selected. Earlier Vercel prose is recommendation, not implementation fact.

**Alternative:** separate backend now. Reject unless an extraction trigger—scaling, persistent workloads, team boundary, regional/compliance isolation—is demonstrated.

**Default if unanswered:** local-only development; **BLOCKED** for shared staging and production.

## D05 — mobile identifiers and store-account ownership

**Decisions needed:** legal/organization display name, iOS bundle identifier, Android application ID, Expo organization/project ownership, Apple Developer and Google Play organization accounts, recovery contacts, development/preview variant identifiers, and domain ownership for Universal/App Links.

**PROPOSED recommendation:** stable reverse-domain production IDs owned by the organization; separate explicit non-production variants; two MFA-protected recovery-capable owners; no personal-only ownership.

**Why now:** identifiers, signing, push, deep links, provider callback allowlists, and store history become costly to change after distribution.

**Default if unanswered:** **BLOCKED** — do not scaffold a native project or reserve identifiers through an individual's account.

## D06 — build and signing credential custody

**Decisions needed:** EAS Build versus another reproducible build path; EAS-managed versus local/customer-managed credentials; Apple roles/certificates/profiles/APNs key ownership; Play App Signing and upload-key custody; rotation, recovery, offboarding, and emergency revocation.

**PROPOSED recommendation:** evaluate EAS Build first; use organization-owned platform accounts, least privilege, MFA, a credential inventory, protected secret storage, and a signed recovery drill. Play App Signing with a separate upload key is the default Android candidate. The exact managed/local custody choice needs an owner security review.

**VERIFIED:** no account, key, certificate, profile, or signed artifact exists in the repository evidence.

**Default if unanswered:** unsigned local experimentation only; **BLOCKED** for device auth/push/store builds.

## D07 — privacy, retention, export, and deletion

**Decisions needed:** data controller/contact, launch territories, applicable legal review, privacy policy owner/URL, each collected/shared data class and purpose, vendor/SDK subprocessors, retention periods, export format/SLA, deletion grace/exceptions, backup expiry, support verification, and audit/log handling.

**PROPOSED recommendation:** collect only account/security and approved academic data; inventory actual SDK/network behavior; keep short purpose-bound retention; provide authenticated in-app deletion and a public web request path; make export/deletion available consistently from web/native; disclose backup expiry honestly.

**VERIFIED:** Apple/Google store rules require privacy disclosures; account-creation apps require deletion capabilities, and Google requires a public web request resource in addition to in-app deletion.

**Default if unanswered:** **BLOCKED** — no public account creation or store submission.

## D08 — reminders and push scope

**Decisions needed:** whether reminders are in first public MVP; allowed item types; default-off/opt-in behavior; local versus push role; quiet hours; maximum frequency; time-zone travel behavior; notification contents; Expo Push Service versus direct APNs/FCM; operational support.

**PROPOSED recommendation:** defer reminders until the academic slice is stable unless product scope requires them. Backend owns schedule; push contains minimal non-sensitive context and is best effort; native fetches current data; background tasks only reconcile opportunistically.

**VERIFIED:** mobile OS/background and push delivery are not guaranteed. Exact device-time execution is an unsafe product promise.

**Default if unanswered:** no notifications or background task dependency; not a blocker for the first data slice, **BLOCKED** for reminder claims.

## D09 — offline scope

**Decisions needed:** whether users must read or edit while offline, maximum staleness, cache sensitivity/retention, conflict UX, and which actions can queue.

**PROPOSED recommendation:** online-first MVP with bounded user-scoped read cache and preserved unsent form input; no general offline mutation queue. Require a separate product/architecture decision before a local database/outbox.

**Tradeoff:** users need connectivity for confirmed changes, but identity, conflict, retry, and cross-account safety remain tractable. Full offline editing requires operation IDs, idempotency, version vectors/preconditions, queue visibility, migration, encryption/threat review, and user conflict resolution.

**Default if unanswered:** no persistent academic cache and no offline writes; **BLOCKED** only for features claiming offline support.

## D10 — calendar, week, and time-zone semantics

**Decisions needed:** Sunday week start globally or user-configurable; account versus term/course zone; travel behavior; all-day due-date meaning; inclusive/exclusive Today/This Week boundaries; recurrence/DST ambiguity and nonexistent times; locale calendar/number format; institution-import semantics.

**PROPOSED recommendation:** retain Sunday and `Asia/Riyadh` as onboarding defaults, allow an IANA user zone before broad launch, preserve all-day dates as civil dates, store instants as `timestamptz`, store named zone/recurrence intent separately, and return effective boundaries in agenda responses.

**VERIFIED:** current ADR 0014 provides a Sunday/Asia-Riyadh baseline but no product data or travel/override behavior.

**Default if unanswered:** **BLOCKED** — do not freeze academic/agenda API or migrations.

## D11 — design, theme, font, RTL, and accessibility

**Decisions needed:** approved brand/token source, light/dark/system behavior, Arabic and Latin fonts/licensing/bundling, theme override persistence, minimum supported font scale/orientation, accessibility acceptance owner, and screenshot/device matrix.

**PROPOSED recommendation:** derive semantic tokens from reviewed current web values, map them separately to CSS and React Native, share no UI components initially, use platform-native interaction patterns, and require WCAG 2.2 AA intent plus VoiceOver/TalkBack/manual web evidence.

**VERIFIED:** the current web foundation includes tokens and accessibility tests; it is not an approved native design system and the historical prototype is prohibited.

**Default if unanswered:** preserve neutral system typography/theme; **BLOCKED** for branded native UI and public visual acceptance, not API work.

## D12 — observability, service levels, backups, and incident ownership

**Decisions needed:** telemetry vendor(s), processing region, data/redaction/retention, SLOs, alert thresholds/channels, on-call owner, incident severity/communications, audit-event scope, RPO/RTO, backup/PITR provider, and exercise cadence.

**PROPOSED recommendation:** safe structured correlation across client/API/database/provider; no content/credential telemetry; named tested alerts/runbooks; planning RPO <=15 minutes and RTO <=4 hours; monthly isolated restore and pre-launch/quarterly recovery exercise.

**NOT VERIFIED:** the proposed targets may change with business cost/tolerance; no operational system exists.

**Default if unanswered:** **BLOCKED** for production-like staging with personal data and for public launch.

## D13 — release scope, territories, age, testing, and support

**Decisions needed:** initial territories, intended age group, institution independence claim, TestFlight/Play tester ownership, public versus limited launch, support/contact/status URLs, review account/data, staged rollout percentages/stop metrics, minimum OS/device matrix, and release approval role.

**PROPOSED recommendation:** start organization-internal, then TestFlight/closed testing with non-production data, then a small phased public rollout after privacy/operations gates. Recheck current store rules on the actual artifact.

**VERIFIED:** target API, toolchain, privacy, deletion, and metadata rules are mutable and cannot be frozen in this planning document.

**Default if unanswered:** internal development distribution only; **BLOCKED** for store submission.

## D14 — first cross-platform vertical slice

**Decision needed:** approve or reduce the exact journey and its non-goals.

**PROPOSED recommendation:**

```text
authenticate
  -> establish/select term
  -> establish/select course
  -> create or update one academic item
  -> view it in Today/This Week
  -> confirm same state on web and native
```

Acceptance includes internal identity, ownership isolation, idempotency/conflict behavior, Arabic/English, RTL/LTR, time-zone/week boundary, accessible loading/error/empty states, sign-out/account-switch cache clearing, and cross-client consistency.

**PROPOSED non-goals:** AI, SIS/LMS integration, files, community, payments, analytics/ads, full calendar import, team collaboration, general offline writes, and reminders unless D08 explicitly brings them in.

**Default if unanswered:** **BLOCKED** — no academic schema/API/UI implementation.

## D15 — auth spike branch disposition

**Decision needed:** how long to preserve `spike/supabase-auth-runtime` and who may delete it.

**PROPOSED recommendation:** keep the immutable branch temporarily as audit evidence; merge and cherry-pick nothing; use the salvage map during approved auth design; delete only after the production auth decision and replacement evidence are committed, with explicit owner authorization.

**VERIFIED:** no remote exists, so this local branch is currently the only named copy evidenced by the audit.

**Default if unanswered:** preserve the branch; do not merge or delete it.

## D16 — API and installed-client compatibility window

**Decisions needed:** number of supported GA native versions, minimum time window, emergency force-update authority, deprecation communication, telemetry threshold for removal, and how beta/internal builds are treated.

**PROPOSED recommendation:** support the current and immediately previous GA native version and a minimum time floor long enough for normal store rollout/review, with the exact duration selected before first release. Additive changes stay in v1; breaking changes use a new major path or compatibility adapter. Force update only for a documented security/data-integrity emergency.

**Tradeoff:** a wider window increases backend/contract test cost but protects users who cannot update promptly; a narrow window simplifies code but raises outage/support risk.

**Default if unanswered:** **BLOCKED** — no public native release and no removal of v1 behavior.

## Minimum approval set by phase

| Phase                        | Decisions that must be resolved                         |
| ---------------------------- | ------------------------------------------------------- |
| Auth evaluation              | D01, D02, D03, D04, D07, D12, D15                       |
| Identity/API implementation  | D02, D03, D04, D07, D10, D12, D16                       |
| Academic contract            | D10, D14, D16                                           |
| Workspace transition         | D01, D05, D06, D11, D14, D16                            |
| Native foundation            | D02, D03, D05, D06, D07, D11, D13, D16                  |
| Native academic slice        | D09, D10, D11, D14, D16                                 |
| Notifications/public release | D04–D13 and D16, with current store-policy revalidation |
