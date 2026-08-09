# Owner decisions

- **Original decision package:** 2026-08-08 (Asia/Riyadh)
- **Owner approval date:** 2026-08-09 (Asia/Riyadh)
- **Accountable Project Owner:** Nasser Al-Tamimi
- **Status:** **OWNER-APPROVED — D01 through D16 are recorded below; implementation and operational evidence gates remain enforceable**
- **Purpose:** canonical, dated record of the owner decisions governing the production web/native transition

## Record authority and interpretation

**VERIFIED — owner declaration:** Nasser Al-Tamimi supplied the D01–D16 decisions recorded in this document on 2026-08-09. This commit records that direction; it does not infer completion of any implementation or operational gate.

Labels retain their evidence meaning:

- **OWNER-APPROVED** — the accountable owner selected the stated direction or principle.
- **VERIFIED** — observed repository/evidence fact, including the dated owner declaration.
- **PROPOSED** — deliberately provisional detail that still needs its stated review or decision.
- **BLOCKED** — work cannot proceed past the named gate without evidence or separate authority.
- **NOT VERIFIED** — no executed repository/environment/account evidence supports the claim yet.
- **INFERRED** — a conclusion drawn from verified evidence that still needs validation.

Approval of direction is not proof of readiness. In particular:

- **NOT VERIFIED** — no authentication provider is accepted for production.
- **NOT VERIFIED** — no provider, hosting, managed database, telemetry, Expo, Apple, Google Play, domain, signing, or store account has been created or inspected by this documentation step.
- **NOT VERIFIED** — no production host, region, database, backup, restore, deployment, mobile application, signed build, privacy/legal compliance, or real-user environment exists.
- **BLOCKED** — production or real-user work remains subject to the provider, privacy, regional, account, credential, backup, restore, observability, store, and release gates below.
- **OWNER-APPROVED** — Phase 1 provider qualification is the single next phase. It must follow [transition-plan.md](transition-plan.md) and does not authorize a workspace move, product auth implementation, identity migration, mobile scaffold, deployment, production account, or real personal data.

## Approval-recording safety baseline

- **VERIFIED** — this approval task started on clean `planning/production-multiplatform-transition` at `8fac8d9f8393725b962c6d2322ed6856c8c47688`.
- **VERIFIED** — the planning branch was the repository's only worktree; no Git remote was configured.
- **VERIFIED** — `main` remained `80c9974e25e3e981d4712823c6d325f62f7148ac` and `spike/supabase-auth-runtime` remained `dd3af22dbc1821a6c0557d08b1d06ba73f3cce5b` at the edit boundary.
- **VERIFIED** — no uncommitted file existed before this documentation-only approval recording began.

## Decision summary

| ID  | Decision                                         | Recorded owner direction                                                                                          | Status after approval                                               |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| D01 | Repository topology and timing                   | Option D: root through auth/identity/API/first-contract stability; behavior-neutral workspaces before mobile      | **OWNER-APPROVED**                                                  |
| D02 | Authentication provider and evaluation authority | Evidence-gated managed auth; Supabase primary candidate, not production-selected                                  | **OWNER-APPROVED direction / BLOCKED final selection**              |
| D03 | Internal identity and account lifecycle          | Internal UUID ownership, opaque provider identity, no email auto-merge, explicit fail-closed states               | **OWNER-APPROVED; deletion grace remains PROPOSED**                 |
| D04 | Hosting, PostgreSQL, and operational boundary    | One Next.js web/API deployment, managed PostgreSQL, no unmeasured service/worker                                  | **OWNER-APPROVED direction / BLOCKED vendor-region selection**      |
| D05 | Mobile identifiers and account ownership         | Organization-controlled, MFA-protected, recoverable identities                                                    | **OWNER-APPROVED principle / DEFERRED exact accounts and IDs**      |
| D06 | Build and signing custody                        | Evaluate EAS; owner-controlled, least-privilege, recoverable credentials outside Git                              | **OWNER-APPROVED direction / BLOCKED custody decision**             |
| D07 | Privacy, export, retention, and deletion         | Saudi Arabia, 18+, minimal approved data, consistent export/deletion                                              | **OWNER-APPROVED direction / BLOCKED policy and qualified review**  |
| D08 | Reminders and push                               | Intended product scope after academic stability; backend schedule and best-effort minimal push                    | **OWNER-APPROVED direction / DEFERRED implementation**              |
| D09 | Offline scope                                    | Online-first, bounded read cache, no initial offline writes/database                                              | **OWNER-APPROVED**                                                  |
| D10 | Calendar, week, and time-zone semantics          | Sunday, Asia/Riyadh default, user-selectable IANA zone before broad launch, explicit civil/instant rules          | **OWNER-APPROVED**                                                  |
| D11 | Design, RTL, theme, and accessibility            | Original premium system; semantic tokens, separate UI, Arabic first-class, light/dark/system, accessibility gates | **OWNER-APPROVED direction / BLOCKED final brand decision**         |
| D12 | Observability, backup, and incidents             | Privacy-safe telemetry/runbooks; RPO <=15m and RTO <=4h planning targets; restore proof                           | **OWNER-APPROVED direction / BLOCKED vendor and operational proof** |
| D13 | Release policy                                   | Saudi Arabia, 18+, internal -> TestFlight/closed -> small phased public rollout                                   | **OWNER-APPROVED direction / BLOCKED public-release evidence**      |
| D14 | First cross-platform vertical slice              | Auth -> term -> course -> academic item -> Today/This Week -> matching web/native state                           | **OWNER-APPROVED**                                                  |
| D15 | Authentication spike disposition                 | Preserve immutable evidence; no merge/rebase/cherry-pick/wholesale copy; explicit deletion approval later         | **OWNER-APPROVED**                                                  |
| D16 | API/native compatibility                         | Current + previous GA version, minimum 90 days, additive v1, explicit breaking-version path                       | **OWNER-APPROVED**                                                  |

## D01 — repository topology and timing

**OWNER-APPROVED — Option D.**

- Keep the verified root Next.js application until real authentication, internal identity, `/api/v1`, and the first academic contract are stable.
- Then perform one behavior-neutral npm-workspaces transition, moving web to `apps/web`.
- Create `apps/mobile` only after workspace parity passes.

**BLOCKED:** no repository move or mobile scaffold begins before the exact entry/parity gates in the repository strategy pass.

## D02 — authentication provider and evaluation authority

**OWNER-APPROVED direction — evidence-gated managed authentication selection.**

- Supabase Auth is the primary production candidate; it is **NOT VERIFIED** and not accepted for production.
- Qualification must use a real, isolated, hosted non-production provider environment, real server-side session behavior, real callback/recovery flows, and synthetic users only.
- Fake authentication, an evaluation-mode success adapter, provider-free claims, and real personal data are prohibited as qualification evidence.
- Final provider selection requires current technical, privacy, regional, lifecycle, cost, browser, and signed-native evidence.
- A fallback provider may be evaluated only if Supabase fails a documented gate.

**BLOCKED — before the first external mutation in Phase 1:** record the owner-controlled evaluation account/operator, MFA/recovery control, synthetic-data rule, budget/expiry, secret custody, and regional/privacy evaluation criteria.

**INFERRED sequencing note:** signed-native qualification evidence may require a narrowly scoped, non-production auth harness and provisional development identifier. It is not `apps/mobile`, must contain no product feature, and requires separate scoped authorization before creation. Exact production mobile identifiers/accounts remain deferred under D05.

## D03 — internal identity and account lifecycle

**OWNER-APPROVED:**

- StudentHub AI owns a server-generated internal UUID.
- Academic data references only the internal user ID.
- Authentication identities use an opaque provider key and provider subject.
- Accounts are never merged automatically by email.
- Email/password registration requires verified email.
- MVP exposes no general multi-provider identity linking.
- Account states support active, disabled, and deletion-pending.
- Disabled and deletion-pending states fail closed.

**PROPOSED — subject to final privacy/legal policy:** account deletion has a 30-day cancellation grace period.

**BLOCKED:** duplicate-account recovery, administrative recovery authority, final deletion execution/retention behavior, and any future identity-linking ceremony need explicit security/privacy design before implementation.

## D04 — hosting, PostgreSQL, and operational boundary

**OWNER-APPROVED direction:**

- Keep the web application and `/api/v1` in one Next.js deployment for the MVP.
- Keep PostgreSQL as the authoritative system of record.
- Select a managed PostgreSQL provider and region using current latency, residency, backup, recovery, cost, and privacy evidence.
- Do not create a separate backend service or worker until a measured requirement justifies it.
- Initial planning targets are RPO no greater than 15 minutes and RTO no greater than 4 hours.

**NOT VERIFIED / BLOCKED:** this documentation approval selects no production host, database provider, region, connection strategy, backup service, or deployment.

## D05 — mobile identifiers and account ownership

**OWNER-APPROVED principle:** production Apple, Google Play, Expo, domain, bundle, and application identities must be project/organization controlled, MFA protected, recoverable, and not dependent on one personal account.

**DEFERRED / BLOCKED:** exact identifiers and accounts remain intentionally deferred until the native-foundation gate. Do not scaffold `apps/mobile` before D01 workspace parity.

## D06 — build and signing custody

**OWNER-APPROVED direction:**

- Evaluate EAS Build as the initial native build candidate.
- Signing accounts and credentials must be owner controlled, MFA protected, least privilege, inventoried, recoverable, and excluded from Git.

**BLOCKED:** the exact managed-versus-customer credential custody model remains a later security decision. No signing credential or build account exists by implication.

## D07 — privacy, export, retention, and deletion

**OWNER-APPROVED direction:**

- Initial launch territory is Saudi Arabia.
- Initial intended account eligibility is university students aged 18 or older.
- Collect only approved account, security, settings, and academic organization data.
- Provide consistent authenticated export and deletion capabilities on web and native.
- Provide the public web deletion-request resource required for store readiness.
- The deletion cancellation grace is **PROPOSED** as 30 days, subject to final privacy/legal policy.
- Define separate purpose-bound retention periods for active data, security records, operational logs, idempotency records, support data, and backups before real-user staging.
- Do not claim legal or Saudi Personal Data Protection Law compliance without qualified review.

**BLOCKED:** real-user staging and public account creation require the approved privacy notice, data inventory, retention schedule, export/deletion behavior, responsible contacts, and qualified review appropriate to launch scope.

## D08 — reminders and push

**OWNER-APPROVED direction:**

- Reminders remain part of the intended product.
- Push implementation is deferred until the first academic slice is stable.
- The backend owns reminder schedules.
- Push delivery is best effort and contains minimal non-sensitive information.
- No notification dependency belongs in the first identity/API implementation phase.

**DEFERRED / BLOCKED:** provider path, permission copy, quiet hours, delivery policy, token lifecycle, disclosures, and device proof receive a later decision and evidence gate.

## D09 — offline scope

**OWNER-APPROVED:**

- The MVP is online-first with a bounded user-scoped read cache and preserved recoverable form input.
- There is no general offline mutation queue, silent last-write-wins behavior, or local academic database in the initial MVP.
- Future offline editing requires a separate owner and architecture decision.

## D10 — calendar, week, and time-zone semantics

**OWNER-APPROVED:**

- Sunday is the default week start.
- `Asia/Riyadh` is the default onboarding time zone.
- Users must be able to select a valid IANA time zone before broad launch.
- All-day academic dates remain civil dates.
- Instants use `timestamptz`.
- Named time-zone and recurrence intent are stored separately where required.
- Today/This Week responses expose the effective time zone and week boundaries.

**BLOCKED:** the academic contract still needs explicit travel/change behavior, recurrence ambiguity policy, and boundary tests before it freezes.

## D11 — design, theme, RTL, and accessibility

**OWNER-APPROVED direction:**

- Create an original, premium StudentHub AI design system.
- Do not copy the historical research prototype or a marketplace template.
- Share semantic design tokens and product intent across web and native, but do not share DOM/native UI components initially.
- Arabic/RTL is first-class and English/LTR has equal functional coverage.
- Support light, dark, and system appearance.
- Require WCAG 2.2 AA intent, keyboard/manual web checks, VoiceOver/TalkBack checks, scalable text, reduced motion, contrast, logical order, and platform-appropriate interaction patterns.

**BLOCKED:** exact brand fonts, logo, and final visual tokens require a dedicated design decision before public UI acceptance.

## D12 — observability, backups, and incident ownership

**OWNER-APPROVED direction:**

- Use privacy-safe structured logs, metrics, traces, request IDs, alerts, and tested runbooks.
- Never record credentials, tokens, cookies, academic free text, email contents, or notification contents.
- Initial recovery planning targets are RPO <=15 minutes and RTO <=4 hours.
- Require isolated restore evidence before public launch.

**NOT VERIFIED / BLOCKED:** telemetry and managed database vendors, on-call operators, alert channels, retention, backup/PITR, restore performance, and runbook execution remain unselected/unproved.

## D13 — release policy

**OWNER-APPROVED direction:**

- Saudi Arabia first.
- Begin with internal development distribution, then TestFlight and Google Play closed testing using controlled data, then a small phased public rollout.
- Public release requires current privacy, deletion, support, store-policy, backup, monitoring, signing, and operational evidence.
- Initial eligibility is 18+ unless a later qualified decision changes it.

**BLOCKED:** no store listing, tester program, public release, or compliance claim is authorized by this record alone.

## D14 — first cross-platform vertical slice

**OWNER-APPROVED journey:**

```text
authenticate
  -> establish/select an academic term
  -> establish/select a course
  -> create or update one academic item
  -> view the same item in Today and This Week
  -> confirm the same authorized state on web and native
```

**OWNER-APPROVED acceptance:**

- internal identity and strict cross-account isolation;
- Arabic/English and RTL/LTR;
- idempotent create and stale-update conflict handling;
- correct date, time-zone, and week boundaries;
- accessible loading, empty, validation, error, and conflict states;
- complete cache clearing on sign-out or account switch;
- one versioned `/api/v1` contract used by native;
- matching authorized state across web and native.

**OWNER-APPROVED non-goals:** AI, SIS/LMS integrations, files, community, payments, ads, analytics profiling, general offline writes, collaboration, and push implementation.

## D15 — authentication spike disposition

**OWNER-APPROVED:**

- Preserve `spike/supabase-auth-runtime` temporarily as immutable audit evidence.
- Do not merge, rebase, cherry-pick, or copy it wholesale.
- Reuse only separately reviewed concepts through fresh production implementation from the approved baseline.
- Delete the branch only after replacement production evidence is committed and the owner provides explicit authorization.

**VERIFIED at approval recording:** the spike ref remained `dd3af22dbc1821a6c0557d08b1d06ba73f3cce5b` and no other worktree checked it out.

## D16 — API and native-client compatibility

**OWNER-APPROVED:**

- Support the current and immediately previous generally available native application version.
- Use a minimum compatibility time floor of 90 days unless a documented security or data-integrity emergency requires otherwise.
- Additive behavior remains in `/api/v1`.
- Breaking behavior requires a new major API path or an explicit compatibility adapter.
- Force updates require documented owner authorization and a security/data-integrity reason.

## Phase authorization and remaining gates

### Closed decision gate

**VERIFIED — Phase 0M owner-decision gate:** D01–D16 now have dated owner outcomes. Option D, the first vertical slice, spike preservation, and the API compatibility window are no longer awaiting owner choice.

### Single next phase

**OWNER-APPROVED direction — Phase 1: evidence-gated Supabase Auth qualification and operational preflight.**

The phase evaluates Supabase as the primary candidate using real isolated hosted non-production behavior and synthetic users. It records current browser/server, callback/recovery, lifecycle, privacy, regional, cost, and signed-native evidence. A fallback provider is considered only after a documented Supabase gate fails.

Before external resources or credentials are created, the Phase 1 work record must name the operator/account authority, organization ownership/recovery, budget/expiry, secret handling, synthetic-data boundary, and evidence retention/cleanup plan. **BLOCKED** until those controls are recorded.

### Not authorized yet

- **BLOCKED** — production provider acceptance or product authentication implementation;
- **BLOCKED** — user/identity schema or migration;
- **BLOCKED** — web/API deployment or production hosting/database selection;
- **BLOCKED** — workspace conversion or `apps/mobile` creation;
- **BLOCKED** — real personal data, real-user staging, legal/PDPL compliance claims, store accounts/listings, signing credentials, push, or public release;
- **BLOCKED** — merge, rebase, cherry-pick, wholesale copy, or deletion of the authentication spike.

## Change control

A later change to D01–D16 must identify the decision ID, accountable owner, date, replacement text, reason, affected phases, migration/rollback impact, and evidence link. Do not silently rewrite owner direction or historical execution evidence.

## Approval-recording validation

- **VERIFIED** — the repository-wide Prettier check passed after formatting the edited Markdown with the existing configuration.
- **VERIFIED** — all 27 local Markdown targets across the seven changed/index documents resolved.
- **VERIFIED** — the repository secret scan passed with 145 files inspected.
- **VERIFIED** — `git diff --check` passed.
- **VERIFIED** — the candidate change contains exactly seven documentation files: the README plus six active transition/decision documents. No product source, dependency, lockfile, schema/migration, test, CI, runtime configuration, prototype, generated, account, or credential file is included.
- **VERIFIED** — the D01–D16 structure check found exactly sixteen decision sections and all required owner constraints.
- **VERIFIED** — no application build or product test was run because the changed surface is documentation-only.
