# StuPilot — MVP Scope and Release Plan

**Deliverable:** 3B  
**Version:** 1.0  
**Date:** 5 August 2026  
**Status:** Production scope baseline; no implementation started

## 1. Purpose

This document turns the owner-approved direction into a controlled release boundary. It supersedes research gates as prerequisites. It does not treat archived research as evidence and does not authorize Sprint 0.

## 2. Release promise

The production MVP is successful when a student can create a private account, model an academic term manually, and reliably answer:

> What do I need to do today and this week?

The MVP is one responsive bilingual web product. Mobile and desktop share the same data and capabilities.

## 3. MVP capability map

| Module | In MVP | Minimum releasable behavior | Not included |
|---|---:|---|---|
| Identity | Yes | Register, verify, login, logout, recover password, secure sessions | University SSO, enterprise tenants |
| Onboarding | Yes | Locale, time zone, optional university/major, first-term path | Long preference survey, SIS import |
| Terms | Yes | Create/edit/archive/activate | Institutional academic calendar feed |
| Courses | Yes | Create/edit/archive within term | Shared course catalog, instructor portal |
| Class schedule | Yes | Weekly series, occurrence override, full-series edit | Complex RRULE builder, attendance |
| Academic items | Yes | Assignment/project/exam, due vs planned, status | Gradebook, rubrics, subtasks unless separately approved |
| Today | Yes | Classes, due, planned, overdue, completed visibility | AI prioritization |
| This Week | Yes | Locale-aware weekly overview and filters | Advanced workload analytics |
| Calendar | Yes | Month/agenda, item details, navigation | External calendar sync/export unless later approved |
| Quick Capture | Yes | Fast create with safe defaults and draft recovery | Natural-language AI parsing |
| Completion | Yes | Complete/reopen without data loss | Gamification/streaks |
| Rescheduling | Yes | Move planned work only; deadline stays intact | Auto-scheduling AI |
| Reminders | Yes | In-app reminders and preferences | SMS, WhatsApp, push guarantee, marketing email |
| Localization | Yes | Arabic RTL and English LTR end to end | Additional locales |
| Settings | Yes | Locale, time zone, optional profile, notifications, account controls | Billing or organization settings |
| Ownership | Yes | All user data server-authorized by internal user ID | Sharing, collaboration, public links |

## 4. Release slices

### Slice A — secure personal account

Identity, internal user record, sessions, ownership guard, localized auth states, account recovery. No academic feature ships before cross-user isolation tests pass.

### Slice B — academic foundation

Onboarding, term, course, active-term context, empty states, archive behavior.

### Slice C — time structure

Weekly class series, generated occurrences, occurrence overrides, calendar rendering, DST/time-zone behavior.

### Slice D — actionable work

Shared academic item model, Quick Capture, deadline/planned separation, complete/reopen, Today and This Week.

### Slice E — dependable release

In-app reminders, settings, accessibility, bilingual polish, security hardening, observability, backups, deployment and runbooks.

Each slice must be vertically usable in development; unfinished slices are not represented as released functionality.

## 5. Release train

| Release | Objective | Included | Exit rule |
|---|---|---|---|
| `0.x` internal | Build and integrate safely | Sprints 0–8 behind non-production environments | No real student launch claim |
| `1.0-rc` | Production-readiness candidate | Full approved MVP, seeded test data, migration/backup/restore/security checks | Sprint 9 release checklist passes |
| `1.0` MVP | Public or controlled production launch | Same scope as RC; only release blockers fixed | Owner approves go-live, legal/provider decisions closed |
| `1.0.x` | Stabilization | Defect, security, accessibility, copy and performance fixes | No feature expansion |
| `1.1+` | Evidence-led increments | Only separately approved later capabilities | New scope and migration review |

## 6. Later-release lanes

These lanes are ordered by dependency, not promised dates.

| Lane | Candidate capabilities | Entry condition |
|---|---|---|
| Personal context | Lightweight notes, links, later private files | Storage/privacy/retention design approved; no sharing by default |
| Academic progress | Grade and GPA tracking | Country/institution grading variability modeled explicitly |
| Study workflow | Study sessions, flashcards | Core schedule/item model stable and usage justifies expansion |
| Focused AI | A narrow study-planning or revision feature | Organizational MVP stable; separate AI risk, privacy, evaluation and cost gate |
| Mobile apps | Native iOS/Android clients | Stable versioned API, mobile need, distribution budget and support plan |

General AI chat, document upload, and RAG are not silently introduced through any lane.

## 7. Scope-control rules

1. A change is in scope only if it directly satisfies a requirement in `03a` or closes a release blocker.
2. “Small” additions that create a new data domain, provider, permission, job type, or user role require owner approval.
3. Later-release columns, endpoints, and infrastructure are not built speculatively unless the MVP needs a low-cost extension point.
4. No university-specific logic enters shared domain rules.
5. Auth, storage, email, analytics, or AI vendor SDKs stay behind application-owned adapters where practical.
6. A disposable research-prototype asset may be read for historical context but never copied into production.

## 8. MVP release gates

These are engineering/product gates, not Gate L0/G1 research operations.

### RG-0 — Blueprint approval

- Owner approves PRD, stack direction, architecture, security baseline, and open decisions.
- Explicit authorization is required to begin Sprint 0.

### RG-1 — Foundation integrity

- CI, environments, secrets pattern, migration workflow, and testing harness are working.
- No production credentials or data are used.

### RG-2 — Ownership integrity

- Authentication and authorization integration tests prove same-user access and deny cross-user access for every domain repository.
- Recovery, logout, and session expiry work in both locales.

### RG-3 — Domain integrity

- Term/course/schedule/item invariants pass unit and database tests.
- DST, recurrence scope, deadline/planned separation, complete/reopen, and idempotency tests pass.

### RG-4 — Experience completeness

- All journeys work at supported mobile and desktop sizes in Arabic and English.
- Empty, loading, error, offline/retry, and destructive states exist.

### RG-5 — Production readiness

- Threat review, dependency scan, backup and restore exercise, migration rehearsal, observability alerts, rate limits, email-domain controls, privacy copy, accessibility audit, and rollback plan pass.
- Owner explicitly authorizes deployment and launch.

## 9. Definition of MVP done

The MVP is done only when:

- all approved requirements are implemented or formally waived by the owner;
- no P0/P1 defects remain and no known ownership leak exists;
- Arabic and English E2E smoke suites pass at mobile and desktop sizes;
- database migrations work from an empty database and from the previous release;
- backup restore is demonstrated in a non-production environment;
- operational dashboards and alerts cover availability, error rate, latency, job failures, email failures, and database health;
- security/privacy launch decisions are documented;
- the product can be deployed and rolled back from version-controlled configuration;
- out-of-scope modules are absent or unreachable behind no production dependency.

## 10. Metrics and feedback after launch

The product may collect the minimum first-party events needed for activation, reliability, and retention metrics once the owner approves the policy. It must not introduce session replay, ad tracking, cross-site profiling, or advanced analytics as an implementation shortcut.

Support tickets, bug reports, opt-in feedback, and aggregate usage can guide post-MVP priorities. Participant interviews remain optional and are not a release gate.

## 11. Decisions that can change the plan

- Auth and hosting vendors.
- Launch geography/data region and legal obligations.
- Operating-cost ceiling.
- Calendar month-view requirement on narrow mobile.
- External email notifications versus in-app only at `1.0`.
- Account deletion grace and retention periods.
- Analytics policy and success targets.

If unresolved at Sprint 0, they are recorded as blockers with an owner and deadline; they are not guessed in code.
