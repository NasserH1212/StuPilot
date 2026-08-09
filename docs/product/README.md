# StuPilot — Deliverable 3: Production Product Blueprint

**Version:** 1.0  
**Date:** 5 August 2026  
**Active phase:** Production authentication foundation implemented; hosted-provider acceptance pending

**Implementation status:** Repository authentication and application-owned identity are implemented; real Supabase qualification remains evidence-gated

> **Status notice:** This approved blueprint preserves the forward-looking scope and authorization language written before Sprint 0. The current authentication state is recorded in the [production authentication report](../sprints/production-authentication-report.md); historical statements below about what approval did or did not authorize describe the gate at that time, not the current Git state.

## 1. Strategy

The project owner cancelled participant recruitment, interviews, usability sessions, diary studies, surveys, incentives, Gate L0, and Gate G1. That decision supersedes the previous rule that research must precede PRD or development.

The previous research program remains intact as optional historical material under `../research/` and is indexed at `../archive/research/README.md`. It is not user evidence, does not block this blueprint, and must not be resumed without a new owner decision.

The disposable prototype in `../../research-prototype/` is not production code and cannot be copied, promoted, deployed, or used as the production foundation.

## 2. Document map

| File | Purpose |
|---|---|
| [`03a-product-requirements-document.md`](03a-product-requirements-document.md) | Vision, problem, users, MVP, requirements, stories, criteria, journeys, states, metrics, quality, risks |
| [`03b-mvp-scope-and-release-plan.md`](03b-mvp-scope-and-release-plan.md) | Release boundary, slices, later lanes, scope control, engineering gates |
| [`03c-information-architecture-and-user-flows.md`](03c-information-architecture-and-user-flows.md) | Sitemap, mobile/desktop navigation, end-to-end flows and UX states |
| [`03d-production-technology-evaluation.md`](03d-production-technology-evaluation.md) | Current stack comparison, recommendation, sources, portability and vendor decisions |
| [`03e-system-architecture-blueprint.md`](03e-system-architecture-blueprint.md) | Modular monolith, frontend/API/data/provider boundaries and operations |
| [`03f-database-domain-model.md`](03f-database-domain-model.md) | PostgreSQL domains, ownership constraints, ERD, recurrence, indexes, lifecycle |
| [`03g-security-and-privacy-baseline.md`](03g-security-and-privacy-baseline.md) | Threats, authentication, authorization, privacy, retention, vendors, incident/release gate |
| [`03h-testing-and-quality-strategy.md`](03h-testing-and-quality-strategy.md) | Test layers, ownership matrix, RTL/accessibility, CI, performance and release quality |
| [`03i-development-roadmap-and-sprints.md`](03i-development-roadmap-and-sprints.md) | Sprints 0–9 with goals, scope, dependencies, modules, tests, risks and done criteria |

## 3. Approved production product

StuPilot is a general-purpose bilingual website and future mobile application for university students. It is institution- and country-platform independent, manual-first, Arabic/RTL and English/LTR from release day, mobile-first, and fully usable on desktop.

The MVP contains identity/account recovery, onboarding, optional university/major, terms, courses, recurring classes, assignments/projects/exams, Today, This Week, calendar, Quick Capture, completion/reopen, planned-work rescheduling, occurrence/series edits, in-app reminders, settings, and strict per-user ownership.

Community, sharing, SIS/LMS, payments, subscriptions, advanced analytics, career, general chat, document upload/RAG, AI features, and native applications remain outside MVP. Notes/files, GPA/grades, study sessions, flashcards, focused AI, and native apps are later lanes only.

## 4. Recommended stack

- Next.js App Router + React + TypeScript.
- Modular monolith with application/domain boundaries and versioned `/api/v1` contracts.
- PostgreSQL with Prisma and reviewed SQL migrations.
- Managed authentication preferred, mapped to an internal user ID behind an adapter.
- Vercel preferred for the web application; managed PostgreSQL in a nearby approved region.
- Transactional email and observability behind adapters.
- S3-compatible storage and AI provider abstractions documented for later, not implemented.
- Unit, PostgreSQL integration, Playwright E2E, accessibility, security, performance, migration/restore testing.

This is a recommendation, not an installed stack. Exact vendors and supported versions are Sprint 0 decisions.

## 5. Architecture guardrails

- Ownership is enforced server-side and in database relationships; client filtering is never permission.
- Deadline and planned work are separate fields and commands.
- One class occurrence is an override; the recurring series is a different mutation scope.
- Time uses UTC instants plus IANA zones; all-day dates remain local dates.
- Public caches never contain private academic data.
- No service, queue, storage bucket, analytics SDK, or AI integration is created for hypothetical future use.
- Production and non-production accounts, data, secrets, and databases are separated.

## 6. Original review order

1. Approve or revise the PRD and MVP boundary (`03a`, `03b`).
2. Approve navigation/flow decisions (`03c`).
3. Decide the technology/vendor questions in `03d`.
4. Review architecture/data invariants (`03e`, `03f`).
5. Approve security/privacy/retention and quality gates (`03g`, `03h`).
6. Approve or revise the sprint sequence (`03i`).
7. Issue a separate explicit authorization before Sprint 0. **Completed.**

## 7. Remaining owner decisions before Sprint 1 or production

### Sprint 1 blocker

- Approve the authentication provider direction, Saudi privacy/data-region position, technical evaluation, cost envelope, and operational ownership recorded in [the provider evaluation](../decisions/sprint-1-authentication-provider-evaluation.md).

### Production blockers

- Launch countries, legal entity/controller, age eligibility, privacy/terms/support identity.
- Data region, subprocessors, retention/deletion schedule, analytics policy.
- RPO/RTO, incident contacts, operator access and go-live authority.
- Numeric product-success targets.

Unknown values are not guessed in application code.

## 8. Current status

- Deliverable 3 documentation: approved production blueprint.
- Sprint 0: **CLOSED AND COMMITTED**.
- Sprint 1: **NOT STARTED / NOT AUTHORIZED** pending authentication-provider approval.
- Production foundation: committed locally; no remote push, deployment, or production service exists.
- Participant research: cancelled; no contact, forms, sessions, or findings.
- Research prototype: historical disposable artifact only.
