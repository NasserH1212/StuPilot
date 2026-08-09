# StuPilot — Development Roadmap and Controlled Sprints

**Deliverable:** 3I  
**Version:** 1.0  
**Date:** 5 August 2026  
**Status:** Approved sequence; Sprint 0 closed; Sprint 1 awaits authentication-provider approval

## 1. Roadmap rules

- A sprint begins only after the previous sprint's dependencies and definition of done are satisfied or explicitly re-planned.
- Every sprint produces a demonstrable vertical increment, tests, documentation, and no hidden out-of-scope infrastructure.
- Arabic/RTL, English/LTR, mobile, desktop, ownership, errors, and accessibility are continuous work—not Sprint 8 cleanup only.
- Expected paths are planning conventions, not files created by this deliverable.
- No participant research gate exists. Owner review, engineering evidence, security, legal/provider, and release gates still apply.
- Sprint 0 implementation began only after explicit owner approval of Deliverable 3 and is now closed.

## 2. Sequence overview

| Sprint | Outcome |
|---:|---|
| 0 | Repository, tooling, environments, CI, design/i18n/test foundation |
| 1 | Secure identity, sessions, internal user mapping, ownership framework |
| 2 | Onboarding, academic terms, courses |
| 3 | Recurring class schedules and occurrence overrides |
| 4 | Academic items and Quick Capture |
| 5 | Today and This Week projections |
| 6 | Calendar, completion/reopen, deadline/planned rescheduling integrity |
| 7 | In-app reminders and notification center |
| 8 | Settings, account controls, accessibility and bilingual polish |
| 9 | Security, full quality, migration/backup, deployment and production readiness |

Sprint numbers are dependency order, not calendar commitments. Duration depends on team, vendor decisions, and defect load.

## 3. Sprint 0 — Repository and engineering foundation

> **Closure note (2026-08-08):** Sprint 0 is closed and committed on `main`. The owner accepted the implemented foundation and its recorded exceptions; see the [closure record](../sprints/sprint-0/closure.md). The planned scope below is retained as the approved roadmap baseline.

**Goal:** establish a reproducible, secure production project without implementing academic features.

**Scope**

- Confirm supported versions and package manager; scaffold Next.js + TypeScript only after authorization.
- Establish modular directory boundaries, import rules, environment validation, formatting/lint/typecheck/build.
- Select i18n, accessible primitives, CSS/design tokens, ORM after compatibility spike, and test tools.
- Configure local/test PostgreSQL, migration workflow, synthetic seeds, CI, preview policy, secret scanning.
- Record ADRs for hosting, database, auth, email, observability, locale strategy, and UUID generation.

**Dependencies:** owner approval of Deliverable 3; budget, branch policy, vendor-evaluation authority, and initial region decisions.

**Expected paths/modules:** `app/[locale]/`, `src/modules/`, `src/shared/{config,i18n,time,validation}/`, `src/infrastructure/{db,observability}/`, ORM migrations, `tests/{unit,integration,e2e}/`, `docs/adr/`, and CI workflow files.

**Tests:** clean install/build; environment failure; locale/dir shell; test DB migration/seed; CI smoke; secret scan; 320px/desktop shell; basic accessibility.

**Risks:** framework/ORM/auth incompatibility, premature UI-library lock-in, secret leakage, preview emails reaching real addresses.

**Acceptance criteria:** reproducible setup with synthetic data; CI runs required checks; Arabic/English shells set `lang`/`dir` before hydration; lower environments cannot reach production; import boundaries are enforceable.

**Definition of done:** ADRs approved, lockfile and CI green, no critical dependency issue, no real credentials/data, Sprint 1 backlog traceable to PRD.

**Excluded:** real registration, academic features, public production deployment, analytics, files, AI.

## 4. Sprint 1 — Authentication and user ownership

**Goal:** securely create/recover/use an account, with a tested ownership boundary for every future domain action.

**Scope:** selected auth integration; registration, verification, login/logout/recovery and session lifecycle; internal users/profiles/auth identity mapping; idempotent provider events; protected route/API guards; owner-scoped repository contract; auth rate limits; localized messages; security audit events; two-user adversarial harness.

**Dependencies:** Sprint 0; auth vendor/data region/price; sender domain/test email mode; session/reset policy.

**Expected modules/files:** `identity`, profile shell, `audit-security`, auth adapter, `/api/v1/me`, auth routes/webhooks, user/profile/identity migrations.

**Tests:** auth lifecycle, enumeration, expired/reused recovery, cookie/session controls, webhook signature/replay, two-user access and mapping, provider outage, rate limits, Arabic/English/mobile/desktop E2E.

**Risks:** provider lock-in, experimental Arabic UI, account-linking errors, email deliverability, webhook races.

**Acceptance criteria:** verified account enters protected shell; logout/recovery/expiry are safe; internal UUID owns data; client cannot override owner; cross-user negative tests pass.

**Definition of done:** auth threat review complete; approved non-production email works; logs contain no secrets; no P0/P1.

**Excluded:** social login unless separately approved, student MFA, university SSO, impersonation, academic data.

## 5. Sprint 2 — Academic terms and courses

**Goal:** finish onboarding and build the minimum academic structure.

**Scope:** locale/time-zone onboarding; optional university/major; resumable progress; term create/edit/activate/archive/restore; course create/edit/archive/restore and enrollment; active-term switcher; first-value empty states.

**Dependencies:** Sprint 1; week-start default; term/course archive and retention rules.

**Expected modules/files:** `profile-settings`, `academic-terms`, `courses`; onboarding routes; term/course APIs; migrations and synthetic seeds.

**Tests:** optionality, term date/single-active constraints, duplicates, archive/history, ownership CRUD/linkage, onboarding resume, locale/time-zone, bilingual responsive E2E.

**Risks:** excessive onboarding, active/archive confusion, accidental cascade, hidden university-catalog assumption.

**Acceptance criteria:** user reaches Today after term/course or deliberate course skip; single-active invariant survives concurrency; archive preserves history; optional fields can remain empty.

**Definition of done:** migrations pass; all empty/error/conflict states; ownership matrix green; accessibility/RTL reviewed.

**Excluded:** course sharing/catalog, instructors, grades, LMS/SIS import, institutional calendar.

## 6. Sprint 3 — Recurring schedules

**Goal:** create a trustworthy weekly schedule and separate occurrence edits from series edits.

**Scope:** weekly series form; bounded occurrence expansion; list/calendar inspection; modify/cancel one occurrence; edit/archive series with affected-scope preview; overlap warning; concurrency and DST rules.

**Dependencies:** Sprint 2; recurrence representation; time-library spike; owner decision on series effective-date behavior.

**Expected modules/files:** `class-schedules`, shared `time`, series/override migrations, APIs/use cases, recurrence UI.

**Tests:** bounds, weekdays, DST/non-DST, overlap, bounded expansion, override uniqueness, cancellation/modification, series rollback, stale version, ownership/linkage, bilingual E2E.

**Risks:** DST bugs, infinite expansion, ambiguous scope, accidental bulk changes, inaccessible calendar controls.

**Acceptance criteria:** occurrences match local intent; one override changes one original date; series change confirms range; no drag dependency.

**Definition of done:** recurrence/property tests, performance baseline, audit/security review, no critical RTL/date issue.

**Excluded:** arbitrary RRULE/monthly recurrence, attendance, rooms database, calendar sync, study sessions.

## 7. Sprint 4 — Academic items and Quick Capture

**Goal:** create assignments, projects, and exams quickly without conflating deadline and planned work.

**Scope:** shared item entity/form; timed/all-day deadline; planned fields; full create/edit/detail; archive/delete/recovery; Quick Capture; draft preservation; idempotency; stale conflict; same-owner/same-term constraints.

**Dependencies:** Sprint 2; database model; soft-delete/retention; date/all-day semantics.

**Expected modules/files:** `academic-items`, item migration, `/api/v1/academic-items`, full and Quick Capture UI, constrained safe draft helper.

**Tests:** item types, all-day/timed, due/planned separation, uncategorized item, cross-term rejection, idempotency, error draft, lifecycle, concurrency, XSS/lengths, owner A/B.

**Risks:** Quick Capture expands into full form, content leaks to telemetry, duplicates, ambiguous all-day deadline.

**Acceptance criteria:** minimal capture saves valid item; errors preserve draft without false success; planned fields are independent; one table supports all three types without arbitrary JSON.

**Definition of done:** use cases/migrations green; localized accessible states; privacy/log inspection; no P0/P1.

**Excluded:** notes/files, subtasks, grades, attachments, AI capture, collaboration.

## 8. Sprint 5 — Today and This Week

**Goal:** deliver the core promise with fast, correct projections.

**Scope:** Today sections; This Week range/navigation/filters; active-term context; all global states; detail/capture links; indexed bounded queries and explain-plan baseline.

**Dependencies:** Sprints 3–4; week-start decision; ordering rules.

**Expected modules/files:** `planning-views`, `/api/v1/views/today`, `/week`, view routes/components, query services/index migrations.

**Tests:** midnight/week boundaries, zones, all-day, due+planned deduplication, overdue/completed, series overrides, lifecycle exclusion, URL filters, performance, owner A/B, bilingual/mobile/desktop E2E.

**Risks:** duplicates, confusing time meanings, slow mixed query, locale boundary bug, misleading empty state.

**Acceptance criteria:** fixed data produces expected views across zones; type meanings use text/shape plus color; no cross-user row/count; provisional performance budgets pass.

**Definition of done:** core promise demonstrable in both locales/surfaces; accessibility exploration recorded; no P0/P1.

**Excluded:** AI prioritization, workload scoring, advanced analytics, calendar editing.

## 9. Sprint 6 — Calendar, completion, and rescheduling

**Goal:** provide calendar context and safe state/date mutations.

**Scope:** month and/or approved mobile agenda; event detail; complete/reopen; planned-work reschedule with before/after; separate deadline edit; consistent actions across views; safe optimistic behavior only.

**Dependencies:** Sprint 5; mobile calendar decision; completion/audit rules.

**Expected modules/files:** `calendar`, extensions to items/views, calendar API/query, mutation commands/components.

**Tests:** calendar range/labels, completion invariant, planned-only reschedule, explicit deadline edit, undo/rollback, stale conflict, occurrence/series regression, keyboard/touch, owner A/B, locale/viewports.

**Risks:** deadline corruption, inaccessible calendar, optimistic mismatch, unexpected completed-item hiding.

**Acceptance criteria:** database proves reschedule leaves due fields unchanged; reopen retains record; non-drag 320px calendar path; views converge on canonical server state.

**Definition of done:** no open deadline/series integrity defect; full core E2E, performance, accessibility pass.

**Excluded:** external calendar integration, drag-only editing, recurring items, grades.

## 10. Sprint 7 — Reminders and notifications

**Goal:** reliable basic in-app reminders without prematurely promising external push.

**Scope:** one reminder per item; due/planned/absolute basis; canonical schedule; notification center/read state; optional protected materializer if needed; preferences; idempotency; lag/failure telemetry.

**Dependencies:** Sprint 6; reminder options; in-app delivery definition; scheduler-host decision if needed.

**Expected modules/files:** `reminders-notifications`, reminder/preferences migrations, APIs, notification center, optional scheduler adapter—not a separate worker by default.

**Tests:** recalculation, date mutations, DST, duplicate retries, lifecycle, preferences, missed scheduler degradation, auth/rate, ownership, bilingual accessibility.

**Risks:** implied push guarantee, duplicate/missed state, scheduler limit, zone drift, notification fatigue.

**Acceptance criteria:** UI says in-app; retries are idempotent; failures do not alter item; lag is observable with runbook.

**Definition of done:** semantics documented; reliability suite green; no external channel dependency; bilingual copy reviewed.

**Excluded:** push, SMS, WhatsApp, marketing, complex recurrence, separate queue/worker absent approved need.

## 11. Sprint 8 — Settings, accessibility, and bilingual polish

**Goal:** complete account controls and remove cross-product accessibility/localization debt.

**Scope:** profile, locale, zone, week start, notifications, sessions; account deletion request/cancel/status; copy and bidi audit; WCAG 2.2 AA journey audit; responsive/browser/reduced-motion/performance remediation.

**Dependencies:** Sprints 1–7; retention/deletion/legal notices; supported browser/locale policy; auth session capability.

**Expected modules/files:** `profile-settings`, deletion workflow in `audit-security`, global i18n/design refinements, privacy/support/terms routes.

**Tests:** locale before hydration, zone, optional clear, session revoke, recent-auth deletion, grace/cancel/purge simulation, 320px/zoom, screen readers, keyboard, contrast, bidi, localized emails/errors, full E2E matrix.

**Risks:** incomplete provider/backup deletion, copy drift, inaccessible auth UI, late layout regressions.

**Acceptance criteria:** every key has reviewed Arabic/English; critical journeys meet accessibility; deletion matches published operation; settings remain owner-scoped.

**Definition of done:** manual accessibility report, localization audit, browser/device matrix, privacy-content approval, no serious/critical accessibility defects.

**Excluded:** extra languages, unapproved themes, export UI unless legally required, personalization analytics.

## 12. Sprint 9 — Security, testing, deployment, and production readiness

**Goal:** prove the MVP can be operated, restored, secured, deployed, observed, and rolled back.

**Scope:** threat/ASVS review; dependency/secret/static scans; ownership/abuse suite; CSP/headers/CORS/rate limits; performance/reliability; production migrations and backup/PITR; restore/rollback; DNS/TLS/email authentication; dashboards/alerts/runbooks/incident process; privacy/provider records; release candidate and go/no-go.

**Dependencies:** all sprints; launch country/entity; vendors/regions/budget; retention and RPO/RTO; legal/privacy review; production authorization.

**Expected modules/files:** deployment configuration, runbooks, release report/checklist, security review, restore evidence, alert definitions, privacy/terms. No new feature domain.

**Tests:** full CI/E2E/browser/locale/accessibility/security/performance; migration empty+upgrade; restore/deletion replay; provider outage; rollback; alerts; authorized synthetic production smoke.

**Risks:** late provider/legal blocker, un-restorable backup, migration lock/loss, missing alerts, release-pressure waiver.

**Acceptance criteria:** no P0/P1 or critical/high security issue; restore/rollback evidence current; ownership matrix complete; secrets/MFA/alerts/runbooks verified; bilingual responsive critical journeys pass; owner signs go-live.

**Definition of done:** immutable/versioned `1.0-rc`, complete release report, named operations owner, recorded go/no-go. Public launch only after explicit authorization.

**Excluded:** AI, files, payments, native apps, community, SIS/LMS, later features, unreviewed analytics.

## 13. Cross-sprint deliverables

Every sprint updates requirement/test traceability, ADRs, schema/migrations, threat/risk register, bilingual copy catalog, accessibility checklist, runbooks, known defects/exclusions, and provider cost/runtime observations.

## 14. Change-control template

```text
Change:
Reason and requirement/defect/security ID:
MVP or later release:
New data/provider/permission/job/user role?:
Security/privacy/accessibility/RTL impact:
Migration/rollback/test impact:
Cost and schedule impact:
Owner decision: APPROVE / DEFER / REJECT
```

## 15. Start condition

The next action is owner review of the [Sprint 1 authentication provider evaluation](../decisions/sprint-1-authentication-provider-evaluation.md). Do not install or configure authentication, begin onboarding or academic features, create cloud services or production environments, deploy, or push until the owner explicitly approves the provider direction and separately authorizes Sprint 1.
