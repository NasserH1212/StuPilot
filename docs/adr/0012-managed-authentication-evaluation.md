# ADR 0012: Managed authentication evaluation plan

- **Status:** Proposed
- **Date:** 2026-08-07

## Context

Managed authentication is the preferred direction, but no vendor is approved and authentication belongs to Sprint 1 or later. Arabic/English custom-flow quality, account recovery, session controls, privacy, and internal ownership mapping are material requirements.

## Proposal

Evaluate current vendor documentation and a disposable non-production spike against:

- fully owned Arabic/RTL and English/LTR screens, validation, email templates, and errors;
- secure server-side Next.js session verification, rotation, expiry, logout, recovery, and abuse controls;
- mapping each external subject to one internal opaque UUID without using provider IDs as domain ownership;
- account export/deletion, auditability, data location/subprocessors, incident history, and legal/privacy review;
- local/test/preview separation, test automation, pricing thresholds, rate limits, and documented exit/migration;
- adapter isolation with no vendor SDK in domain or application code.

Clerk or any other blueprint candidate is not selected by this ADR. Sprint 0 contains no auth route, middleware guard, account table, session, SDK, or fake login.

## Decision gate

Owner approval follows evidence from bilingual custom-flow QA and a security/privacy review. Only then may Sprint 1 integration begin.
