# StuPilot — Product Requirements Document

**Deliverable:** 3A — Production Product Blueprint  
**Version:** 1.0 — Owner-Directed Planning Baseline  
**Date:** 5 August 2026  
**Status:** Ready for owner review; implementation is not authorized by this document  
**Product promise:** **Know what you need to do today and this week.**

## 1. Decision basis

This PRD implements the owner's 5 August 2026 strategy decision. Participant research, Gate L0, and Gate G1 are cancelled and are not prerequisites for product planning or development. Existing research material is historical and optional; it is not presented as user evidence.

Terms used here:

- **Approved:** fixed by the owner for the production MVP.
- **Requirement:** behavior the approved product must provide.
- **Proposal:** a recommended implementation or target that can be changed during review.
- **Open decision:** a real owner choice that changes cost, policy, or release behavior.

## 2. Product vision

StuPilot is a bilingual personal academic command center for university students. It turns terms, courses, class schedules, deadlines, and planned work into a clear Today and This Week view. It is a general-purpose product: it does not depend on a particular university, major, country, SIS, or LMS.

The production product begins as a responsive website. A future mobile application can consume the same domain rules and versioned API, but native iOS and Android applications are outside the MVP.

## 3. Product problem

University students must reconcile recurring classes, assignments, projects, exams, and changes across several sources. A generic calendar can represent time, and an LMS can represent some official work, but neither guarantees a personal, actionable plan. StuPilot addresses the operational problem of maintaining one student-owned view of what is due and what is planned without requiring institutional integration.

This is an owner-approved product thesis, not a claimed research finding. Product telemetry, support feedback, and real usage after release will test it.

## 4. Target users

### Primary user

A university student who independently organizes an active academic term and is willing to enter the minimum necessary information manually. The product supports students across universities, majors, and countries. Arabic and English speakers are first-class users.

### Relevant contexts

- A student managing a regular weekly class timetable.
- A student balancing several assignment, project, and exam deadlines.
- A student who plans work separately from the official deadline.
- A student using a phone for fast capture and a desktop for broader review.

### Not an institutional user in the MVP

Universities, instructors, administrators, parents, and employers have no organization account, data access, or control plane in the MVP.

## 5. Value proposition

> In a few minutes, create the academic structure of your term; after that, quickly capture commitments and see a trustworthy plan for today and this week in Arabic or English on any modern phone or desktop browser.

Value depends on four product qualities:

1. **Clarity:** due work and planned work are visibly different.
2. **Speed:** Quick Capture does not require full-form completion.
3. **Trust:** completing, reopening, or rescheduling one item never silently changes unrelated data.
4. **Ownership:** every record is private to its account owner.

## 6. Product principles

- Arabic/RTL and English/LTR are equivalent product modes, not a translation afterthought.
- Mobile is the primary interaction constraint; desktop adds space, not different capabilities.
- The official deadline and the student's planned work time are separate fields and actions.
- A single recurring occurrence and its full series are separate edit scopes.
- Manual entry must remain useful without SIS/LMS.
- Defaults reduce work but never invent academic facts.
- Destructive or wide-scope actions require explicit confirmation.
- The MVP is a modular monolith, not a collection of premature services.

## 7. Approved MVP scope

1. Registration, login, logout, and password recovery.
2. Basic onboarding with optional university and major.
3. Academic terms and courses.
4. Recurring class schedules and occurrence overrides.
5. Assignments, projects, and exams.
6. Today, This Week, academic calendar, and Quick Capture.
7. Complete, reopen, and reschedule planned work.
8. Basic in-app reminders.
9. Arabic RTL, English LTR, responsive mobile and desktop layouts.
10. Account settings and strict per-user data ownership.

## 8. Explicitly out of scope

- Social community and student-to-student file sharing.
- SIS/LMS integration or university-specific connectors.
- Payments, subscriptions, advanced analytics, and career development.
- Notes, files, GPA/grade tracking, study sessions, and flashcards until later releases.
- General AI chat, document upload, RAG, and every production AI feature.
- Native iOS or Android applications.
- University administration, instructor portals, multi-user workspaces, or public profiles.

## 9. Functional requirements

### 9.1 Identity and account

| ID | Requirement |
|---|---|
| FR-AUTH-001 | A visitor can create an account using a verified email-based flow. |
| FR-AUTH-002 | A registered user can sign in and receive a secure server-validated session. |
| FR-AUTH-003 | A signed-in user can log out of the current session. |
| FR-AUTH-004 | A user can request a time-limited password-reset flow without revealing whether an email is registered. |
| FR-AUTH-005 | After a successful password reset, existing sessions are revoked according to the approved security policy. |
| FR-AUTH-006 | Protected routes and mutations reject unauthenticated requests on the server. |
| FR-AUTH-007 | Account and session errors are localized in Arabic and English. |

### 9.2 Onboarding and profile

| ID | Requirement |
|---|---|
| FR-ONB-001 | First sign-in opens a resumable onboarding flow. |
| FR-ONB-002 | The user selects Arabic or English; the document language and direction change immediately. |
| FR-ONB-003 | The user selects an IANA time zone, with a detected suggestion that can be changed. |
| FR-ONB-004 | University and major are optional free-text fields and can be skipped without reduced functionality. |
| FR-ONB-005 | Onboarding leads directly to creating the first academic term. |
| FR-ONB-006 | Progress survives refresh and can be completed later. |

### 9.3 Academic terms and courses

| ID | Requirement |
|---|---|
| FR-TERM-001 | A user can create a term with name, start date, end date, and time zone. |
| FR-TERM-002 | A user can edit, archive, restore, and select an active term. |
| FR-TERM-003 | Term end date must not precede its start date. |
| FR-TERM-004 | At most one term is active for the user's default Today/This Week context, while overlapping stored terms remain allowed. |
| FR-COURSE-001 | A user can create a course with name and optional code, color, and short location. |
| FR-COURSE-002 | A course is attached to a term through a user-owned enrollment record. |
| FR-COURSE-003 | A user can edit, archive, restore, and remove a course from a term without affecting another user's data. |
| FR-COURSE-004 | Archiving a course hides it from default creation lists but preserves historical items and schedule records. |

### 9.4 Recurring classes

| ID | Requirement |
|---|---|
| FR-SCHED-001 | A user can create a weekly class series for one course with one or more weekdays, local start/end times, date range, time zone, and optional location. |
| FR-SCHED-002 | The system renders occurrences inside the term without materializing an unlimited future schedule. |
| FR-SCHED-003 | A user can edit or cancel one occurrence without changing the rest of its series. |
| FR-SCHED-004 | A user can edit an entire series after a scope confirmation. |
| FR-SCHED-005 | A series-wide edit states whether it applies from the series start or from a selected effective date; the MVP may support only one documented option. |
| FR-SCHED-006 | Duplicate or overlapping classes are permitted with a visible warning, not silently rejected. |
| FR-SCHED-007 | Daylight-saving changes follow the stored IANA time zone while preserving intended local class time. |

### 9.5 Academic items

| ID | Requirement |
|---|---|
| FR-ITEM-001 | A user can create an assignment, project, or exam from one shared form and domain model. |
| FR-ITEM-002 | Every item has a type, title, term, optional course, and deadline date/time or explicit all-day deadline. |
| FR-ITEM-003 | An item can have an optional planned start and planned duration separate from its deadline. |
| FR-ITEM-004 | A user can edit, archive, restore, and delete an item under the approved retention policy. |
| FR-ITEM-005 | Rescheduling changes planned work fields only; it does not change the original deadline. |
| FR-ITEM-006 | Editing the deadline is a distinct, explicitly labelled action. |
| FR-ITEM-007 | A user can mark an item complete and reopen it while preserving its original data. |
| FR-ITEM-008 | Completion stores a timestamp; reopening clears the active completion state and records the mutation in the audit trail where required. |
| FR-ITEM-009 | Past-due open items remain visible and are labelled overdue; the system never completes them automatically. |

### 9.6 Quick Capture

| ID | Requirement |
|---|---|
| FR-QC-001 | Quick Capture is reachable in one primary action from every authenticated top-level view. |
| FR-QC-002 | The minimum save requires a title, item type, and deadline or an explicit “schedule later” choice. |
| FR-QC-003 | The form proposes the active term and recent course but allows correction before saving. |
| FR-QC-004 | Saving provides a localized confirmation and a direct edit action. |
| FR-QC-005 | Draft input is preserved across recoverable validation or network errors. |

### 9.7 Today, This Week, and calendar

| ID | Requirement |
|---|---|
| FR-VIEW-001 | Today shows today's class occurrences, planned work, due items, and overdue open items in distinct sections. |
| FR-VIEW-002 | This Week shows the user's locale-aware week with class occurrences, planned work, and deadlines. |
| FR-VIEW-003 | Users can filter Today and This Week by course and item type without changing stored data. |
| FR-VIEW-004 | Completed items can be hidden or revealed and reopened in context. |
| FR-CAL-001 | The academic calendar provides at least month and agenda/list representations on mobile and desktop. |
| FR-CAL-002 | Calendar entries distinguish classes, deadlines, and planned work visually and textually, not by color alone. |
| FR-CAL-003 | Selecting an entry opens a detail sheet/page with its available actions. |
| FR-CAL-004 | Week start, numerals, date formatting, and time formatting follow locale settings while stored values remain locale-neutral. |

### 9.8 Reminders and notification preferences

| ID | Requirement |
|---|---|
| FR-REM-001 | A user can create, edit, disable, and delete a basic in-app reminder for an academic item. |
| FR-REM-002 | A reminder can use an absolute time or a supported offset before the deadline/planned time. |
| FR-REM-003 | The in-app notification center shows due reminders and supports read/acknowledged state. |
| FR-REM-004 | Reminder computation is time-zone aware and idempotent; duplicates must not be created by retries. |
| FR-REM-005 | Notification preferences include enable/disable and time-zone settings; external push/SMS is not promised. |
| FR-REM-006 | Missed background processing cannot change an academic deadline or completion state. |

### 9.9 Settings, localization, and ownership

| ID | Requirement |
|---|---|
| FR-SET-001 | The user can change language, direction-linked locale, time zone, optional university/major, and notification preferences. |
| FR-SET-002 | The user can request account deletion and see the applicable consequence and retention window before confirmation. |
| FR-SET-003 | The user can view active sessions if supported by the selected authentication solution and revoke other sessions. |
| FR-I18N-001 | Every production screen and system message is available in Arabic and English from release day. |
| FR-I18N-002 | The root `lang` and `dir` values match the active locale, including auth and error pages. |
| FR-I18N-003 | Mixed Arabic/Latin content, codes, numerals, email addresses, and times remain readable without hard-coded physical directions. |
| FR-OWN-001 | Every user-owned domain row carries or resolves to the authenticated user's internal ID. |
| FR-OWN-002 | Every read and mutation enforces ownership on the server; client filtering is never an authorization control. |
| FR-OWN-003 | Object identifiers are non-sequential and insufficient by themselves to authorize access. |
| FR-OWN-004 | Cross-user access attempts return a non-disclosing response and create a security signal without logging sensitive content. |

## 10. Core user stories and acceptance criteria

| Story ID | User story | Acceptance criteria |
|---|---|---|
| US-001 | As a new student, I want to register and recover access so my plan is available across devices. | Verified registration works; invalid/expired recovery is safe and localized; protected pages require a valid session. |
| US-002 | As a new student, I want to skip university and major so I can reach value quickly. | Both fields are visibly optional; Skip works; no later feature is disabled. |
| US-003 | As a student, I want to create my current term and courses. | Valid dates save; active term is selected; course appears only in this account. |
| US-004 | As a student, I want one recurring class series instead of entering every class. | Weekly occurrences render for the date range and correct time zone; no occurrence appears beyond the range. |
| US-005 | As a student, I want to move one cancelled class without changing the series. | The interface asks “this occurrence” versus “series”; one override changes exactly one date. |
| US-006 | As a student, I want to capture an assignment quickly. | Minimum fields save; draft survives validation error; the item appears in the correct views. |
| US-007 | As a student, I want Today and This Week to answer what needs attention. | Classes, due, planned, overdue, and completed states are distinguishable; dates use the user's time zone. |
| US-008 | As a student, I want to plan work earlier without corrupting the deadline. | Reschedule changes `planned_start_at`; `due_at` is unchanged and still visible. |
| US-009 | As a student, I want to correct an accidental completion. | Reopen restores the item to open state without recreating it or losing timestamps/history. |
| US-010 | As an Arabic user, I want the entire workflow in RTL. | Navigation, forms, calendar controls, dialogs, validation, focus order, and mixed text pass the RTL checklist. |
| US-011 | As a user, I expect my academic data to be private. | Requests using another user's object ID do not reveal, modify, or confirm that record. |

## 11. Primary journeys

### Journey A — first value

Register → verify/sign in → choose language and time zone → optionally skip university/major → create term → add first course → add class or item → arrive at Today with a useful next action.

### Journey B — daily capture and decision

Open Today → Quick Capture → save assignment → optionally plan work → view it under Today or This Week → complete → reopen if needed.

### Journey C — schedule exception

Open calendar → select class occurrence → Edit → choose “this occurrence” → move/cancel → verify surrounding occurrences are unchanged.

### Journey D — account recovery

Open login → request recovery → receive time-limited message → choose new password → previous sessions revoked per policy → sign in → return to owned data.

Detailed screen flows are in `03c-information-architecture-and-user-flows.md`.

## 12. Empty, error, and edge states

| Context | Required state |
|---|---|
| No term | Explain why a term is needed; primary action “Create term”; no dead-end dashboard. |
| No courses | Allow adding a course or creating an uncategorized item. |
| Empty Today | Calm success state plus next class/week context and Quick Capture; never imply the account is broken. |
| Empty This Week | Offer calendar navigation and capture; retain selected week. |
| No reminders | Explain in-app reminders and link to create one from an item. |
| Offline/network failure | Preserve unsaved input locally for the current attempt where safe; provide Retry; never claim success. |
| Validation failure | Inline, programmatically associated, localized message; focus the first invalid field. |
| Unauthorized/expired session | Clear sensitive state, redirect to login, and preserve only a safe return path. |
| Forbidden/not found | Do not reveal whether another user's record exists. |
| Duplicate submit | Idempotency or disabled submit prevents duplicate item/reminder creation. |
| Time-zone/DST ambiguity | Show interpreted local time before save and retain the series time zone. |
| Destructive action | State scope and consequence; require confirmation; show recovery path if one exists. |
| Service degradation | Localized status, correlation ID, and safe retry; no raw stack or vendor error. |

## 13. Product success metrics

These are product metrics, not fabricated findings. Numeric targets are **proposals requiring owner approval before production instrumentation**.

| Metric | Definition | Proposed initial signal |
|---|---|---|
| Activation | New verified account creates a term, a course, and one schedule/item within 24 hours | ≥55% of eligible new accounts |
| Time to first value | Median time from verified first sign-in to first populated Today/Week view | ≤10 minutes |
| Week-one return | Activated users with a meaningful visit on 2+ distinct days in first 7 days | ≥35% |
| Four-week retention | Activated users with a meaningful action in week 4 | ≥20% as an early directional target |
| Planning adoption | Activated users who set planned work distinct from deadline | Track baseline; no target until launch data |
| Quick Capture completion | Started Quick Captures that save successfully | ≥85%, excluding deliberate cancel |
| Reminder reliability | Due in-app reminders created exactly once within service objective | ≥99.5% |
| Ownership security | Confirmed cross-user disclosure/modification incidents | 0 |
| Task integrity | Confirmed cases where reschedule changed deadline or one-occurrence edit changed series | 0 |
| Availability | Monthly production availability excluding announced maintenance | Proposed 99.5% MVP SLO |
| Accessibility/locale escape | Release-blocking WCAG/RTL defects open at launch | 0 |

Basic, privacy-aware product events are permitted to measure these metrics; session replay, behavioral profiling, or advanced analytics remain outside the MVP.

## 14. Non-functional requirements

### Accessibility

- Target WCAG 2.2 AA for complete user journeys, including accessible authentication, focus visibility, target sizes, labels, error association, status messages, keyboard use, reduced motion, and contrast.
- Semantic HTML precedes ARIA. All icon-only controls have localized accessible names.
- Calendar and recurrence controls must have a usable non-drag alternative.
- Color never carries course/type/status meaning alone.

### Arabic and RTL

- Arabic is available at first production release and receives the same QA depth as English.
- Use logical CSS properties and direction-aware icons; do not mirror media, checkmarks, clocks, or inherently directional content blindly.
- Isolate mixed-direction user content; course codes, emails, dates, and numbers remain stable.
- Arabic copy is authored/reviewed as product text, not raw machine translation.

### Mobile-first and desktop

- Design baseline begins at 320 CSS px without horizontal page scrolling.
- Touch targets meet the accessibility target; critical actions remain reachable without hover.
- Desktop uses additional space for split panes and persistent navigation but exposes the same capabilities.
- Supported-browser policy is finalized in Sprint 0 and tested in the current major versions of major mobile and desktop browsers.

### Performance and reliability

- Proposed budgets: LCP ≤2.5 s at the 75th percentile on representative mobile conditions; INP ≤200 ms; CLS ≤0.1 for key routes.
- Mutations are transactional, ownership-scoped, and safe to retry where practical.
- Today/This Week queries are indexed by owner, status, and relevant dates.
- Backups and restore tests exist before production launch.

### Security and privacy

- Server-side authentication and authorization for every protected operation.
- Secure cookies/session handling, CSRF protections appropriate to the auth model, input validation, output encoding, rate limiting, dependency scanning, secret management, and audit events for sensitive changes.
- Data minimization: university and major optional; no SIS/LMS credentials or academic files in MVP.
- Account deletion, retention, incident response, and provider/data-region decisions must be approved before launch.

## 15. Assumptions and risks

| ID | Type | Statement | Consequence / response |
|---|---|---|---|
| A-01 | Assumption | Students will manually enter enough data to receive value. | Minimize setup; measure activation and incomplete onboarding. |
| A-02 | Assumption | One shared item model can serve assignments, projects, and exams. | Keep type-specific fields nullable and constrained; split only on proven divergence. |
| A-03 | Assumption | Basic in-app reminders satisfy MVP scope. | Do not promise push/SMS; make future dispatch replaceable. |
| R-01 | Risk | Manual setup feels more costly than the value. | Progressive onboarding, Quick Capture, defaults, import deferred. |
| R-02 | Risk | A date/time bug destroys trust. | Explicit time-zone model, DST tests, invariant tests, monitoring. |
| R-03 | Risk | Recurrence scope causes accidental bulk edits. | Scope dialog, preview, transactional update, tests. |
| R-04 | Risk | Arabic is visually translated but functionally weaker. | RTL acceptance criteria in every sprint and bilingual E2E coverage. |
| R-05 | Risk | Managed auth or hosting lock-in raises future cost. | Internal user IDs, provider adapters, standard PostgreSQL, deployment portability. |
| R-06 | Risk | Solo-founder scope expands into later-release features. | Release ledger, excluded-work section per sprint, owner change control. |
| R-07 | Risk | Lack of pre-build research produces wrong priorities. | Accept owner-directed risk; use launch telemetry, support intake, and reversible architecture. |
| R-08 | Risk | Cross-user data leak through missing ownership predicate. | Repository/service boundary, adversarial integration tests, optional PostgreSQL RLS defense. |

## 16. Dependencies and open decisions

Implementation depends on owner approval of this Deliverable 3 and the Sprint 0 decisions listed in `03d-production-technology-evaluation.md` and `03g-security-and-privacy-baseline.md`. The PRD itself does not require participant interviews.

Genuine owner decisions still open:

1. Initial launch countries and legal entity/controller identity.
2. Authentication vendor versus application-owned authentication, after the documented trade-off review.
3. Production hosting/database region and monthly operating budget ceiling.
4. Transactional email provider and sender domain.
5. Account deletion grace period and detailed retention schedule.
6. Whether calendar month view is release-blocking on narrow mobile or agenda view is sufficient there.
7. Week-start default by locale and whether the user can override it.
8. First-party product analytics consent/collection policy and numeric success targets.

## 17. Approval boundary

Approval of this PRD authorizes refinement of Sprint 0 only when the owner says so explicitly. It does not itself authorize package installation, application code, cloud resources, accounts, deployment, production data, payments, AI, or participant research.
