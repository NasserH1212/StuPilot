# StuPilot — Testing and Quality Strategy

**Deliverable:** 3H  
**Version:** 1.0  
**Date:** 5 August 2026  
**Status:** Production quality blueprint; no test code or dependencies created

## 1. Quality goals

1. No user can access another user's data.
2. Dates, deadlines, planned work, recurrence, and reminders remain correct across locales/time zones.
3. Arabic/RTL and English/LTR complete the same journeys.
4. Mobile and desktop expose the same capabilities accessibly.
5. Migrations, backups, deployments, and rollbacks are repeatable.
6. A failure never claims that unsaved work succeeded.

## 2. Quality ownership

For a solo founder, the implementer may also test, but must separate authoring and review moments. Critical ownership/security changes require a second review when available or a documented self-review after a delay using the adversarial checklist. CI is evidence, not a substitute for judgment.

## 3. Test layers

| Layer | Purpose | Typical scope | Run cadence |
|---|---|---|---|
| Static | Type, lint, formatting, secret/dependency issues | Entire repository | Every change |
| Unit | Pure domain rules | Dates, recurrence, status, validation, locale helpers | Every change |
| Component | Accessible interaction/copy | Forms, dialogs, sheets, calendar items, empty/errors | Every change |
| Database integration | Constraints, transactions, repository ownership, queries | PostgreSQL test database | Every PR/change |
| API/application integration | Auth mapping, validation, use cases, errors, idempotency | Route/application boundary | Every PR/change |
| Browser E2E | Complete bilingual responsive journeys | Real app + isolated database + test auth | PR smoke; full on main/release |
| Security | Abuse/ownership/configuration | Auth, BOLA/IDOR, CSRF, headers, rate limits, logs | PR for touched area; full before release |
| Accessibility | Semantics, keyboard, screen reader checks, contrast/reflow | All core journeys | Automated every PR; manual per release |
| Performance/reliability | Budgets, load, failure/retry, jobs | Key routes/use cases | Baseline each sprint; full release |
| Operations | Migration, backup/restore, deploy/rollback, alerts | Staging-like environment | Before RC and production |

## 4. Proposed tooling

To be selected and installed only in Sprint 0 after approval:

- TypeScript compiler and framework lint/build.
- A fast unit runner such as Vitest.
- React Testing Library plus user-event for behavior.
- Playwright for Chromium/WebKit/Firefox journeys and responsive projects.
- Automated accessibility checks (for example axe integration) plus manual WCAG checks.
- Real PostgreSQL in integration tests, preferably ephemeral per run; do not mock constraints.
- Dependency, secret, and static-security scanners supported by the repository host.

Tools may change; the required coverage and gates do not.

## 5. Test data policy

- Use only synthetic accounts and fictional academic data.
- Never copy archived participant/research material into tests.
- No real university ID, grade, LMS screenshot, academic file, credential, or production database dump.
- Seed builder generates owner A, owner B, terms, courses, series/overrides, and items around a fixed clock.
- Tests control clock, locale, time zone, and week start.
- Unique addresses use non-deliverable reserved domains or provider test modes.
- Cleanup is deterministic; parallel tests do not share mutable users.

## 6. Domain test matrix

### Terms and courses

- start=end allowed; end before start rejected;
- only one active term per user;
- overlapping terms stored safely;
- archive/restore retains children/history;
- optional course fields and duplicate names behave as specified;
- different-owner term/course linkage rejected.

### Recurring schedule

- one and multiple weekdays;
- inclusive boundaries and no occurrence outside range;
- same-day start/end validation;
- one override modifies/cancels one original local date;
- series edit leaves independent item data unchanged;
- duplicate/overlap warning without silent rejection;
- DST spring/fall behavior in zones with DST and a non-DST zone;
- user time-zone change does not rewrite series-local intent;
- bounded expansion prevents pathological ranges.

### Academic items

- three item types share behavior;
- timed versus all-day deadline exclusivity;
- optional course but required term;
- course and term must belong to same user/term;
- reschedule changes planned fields only;
- deadline edit changes due fields only;
- complete/reopen status and timestamp invariant;
- overdue calculation at local day boundary;
- archive/delete/recovery behavior;
- stale version returns conflict;
- idempotent create prevents duplicates.

### Views and reminders

- Today/Week include due, planned, classes, overdue, and completion filters exactly once;
- week-start and date range correct in Arabic/English;
- all-day deadline does not shift dates;
- reminder follows selected basis and recalculates safely;
- retry/materializer does not duplicate notification;
- disabled/acknowledged reminder behavior;
- no reminder failure changes the academic item.

## 7. Ownership test pattern

For every owned route and use case:

1. Create equivalent resource trees for users A and B.
2. Prove A can perform the allowed operation on A's object.
3. Substitute B's object ID while authenticated as A.
4. Assert non-disclosing response, no row mutation, no leaked timing/content in response, and appropriate security signal.
5. Attempt cross-owner parent linkage on create/update and assert application plus database rejection.
6. Repeat for list filters, nested IDs, archived/deleted records, reminders, overrides, and bulk/series actions.

No CRUD capability is complete without this matrix.

## 8. Authentication tests

- register, verification, login, logout, recovery, expired/reused token;
- unknown and known email responses do not enumerate;
- password manager/paste and accessible authentication work;
- session cookie attributes and protected-route server checks;
- logout clears protected caches;
- reset/session revocation policy;
- webhook signature, replay, out-of-order events, and idempotency;
- provider outage/degraded flow;
- rate limits and safe localized errors;
- linking cannot merge accounts by unverified email.

Provider test environments must not send uncontrolled real messages.

## 9. Arabic, RTL, and internationalization tests

Every critical E2E journey runs at least once in `ar/rtl` and `en/ltr`.

Checklist:

- correct `html[lang]` and `dir` before hydration;
- no untranslated key/fallback leakage;
- focus and visual order remain logical;
- physical left/right CSS is absent from direction-sensitive layout or explicitly justified;
- arrows/chevrons and previous/next meaning are correct;
- Arabic, English, mixed course codes, email, numbers, and times remain readable;
- error, empty, loading, confirmation, auth email, and notification copy localized;
- truncation, wrapping, zoom to 200%, and 320px reflow;
- locale-aware date/time and week-start behavior without changing stored instants;
- pseudolocalization catches rigid layouts before copy freeze.

Automated snapshots may support review but cannot be the only RTL test.

## 10. Accessibility strategy

Target WCAG 2.2 AA across complete processes.

- Keyboard-only registration through account settings.
- Visible focus not obscured by sticky headers/sheets.
- Correct headings, landmarks, labels, descriptions, errors, and status announcements.
- Modal focus trap/return and Escape behavior.
- Touch target size and spacing.
- Contrast in both themes if a theme exists; color-independent status.
- Reduced-motion support.
- Calendar/recurrence actions available without drag.
- Accessible authentication without cognitive-test barriers where possible.
- Manual screen-reader smoke: at least one common mobile and one desktop combination before launch.

Automated accessibility violations marked serious/critical block merge; manual journey failures block release.

## 11. Responsive/browser matrix

Final support policy is a Sprint 0 decision. Proposed matrix:

| Surface | Representative coverage |
|---|---|
| Narrow mobile | 320×568 and 360×800 responsive viewports |
| Modern mobile | 390×844 / 412×915 |
| Tablet | 768×1024 |
| Desktop | 1280×720 and 1440×900 |
| Browsers | Current supported Chromium, Firefox, WebKit/Safari; real iOS Safari and Android Chrome smoke before launch |

Test virtual keyboard, orientation, browser zoom, long Arabic labels, safe areas, and touch. Desktop-only passing is insufficient.

## 12. API and contract testing

- Schema validation for path/query/body and localized-safe errors.
- Auth required for every protected route.
- API version and response envelope stable.
- Dates serialized as ISO; enums locale-neutral.
- Idempotency, optimistic concurrency, pagination bounds, and request limits.
- Web server-rendered use cases and `/api/v1` use the same application rules.
- Contract tests ensure future client API never exposes ORM/provider fields.
- CORS remains closed unless an approved client needs it.

## 13. Database and migration tests

- Apply full migration chain to empty supported PostgreSQL.
- Upgrade a snapshot of the immediately previous schema.
- Verify all PK/FK/composite ownership/unique/check/index definitions.
- Test transaction rollback under injected failure.
- Explain/analyze Today/Week/reminder queries with representative synthetic volume.
- Detect pending/unapplied migration at deployment.
- Backfill idempotency and resumability.
- Restore backup into isolated staging and run integrity + ownership + smoke tests.
- Never use production data for migration rehearsal.

## 14. Performance and resilience

### Web budgets

Measure core pages under representative mobile conditions against proposed PRD budgets: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75. Set JS/image/font budgets in Sprint 0.

### Server/database

- Define p95 target per main query/mutation after the deployment spike.
- Synthetic load uses bounded realistic term sizes and multiple owners.
- Confirm no N+1 on Today/Week/calendar.
- Test connection pool exhaustion, database timeout, auth/email outage, and scheduler retry.
- Verify graceful error, no false success, and recovery.

Performance regression beyond the approved budget blocks release unless owner accepts a documented exception.

## 15. CI quality gates

Proposed pipeline:

1. Dependency install from lockfile.
2. Secret/license/dependency scan.
3. Format/lint/typecheck.
4. Unit/component tests.
5. PostgreSQL integration and migration tests.
6. Production build.
7. E2E smoke in Arabic and English.
8. Automated accessibility.
9. Preview deployment with synthetic data for approved branches.
10. Full E2E/security/performance suite on release candidate.

Protected branch requires green mandatory checks. Flaky tests are defects: quarantine only with owner, issue, and expiry; do not rerun until green as policy.

## 16. Defect severity and exit policy

| Severity | Example | Release rule |
|---|---|---|
| P0 Critical | Cross-user disclosure, credential compromise, irreversible broad corruption | Stop/revoke/repair; never release |
| P1 High | Auth bypass, deadline changed by reschedule, series-wide accidental edit, core journey unusable | Blocks release |
| P2 Medium | Workaround exists; localized/responsive/accessibility defect outside critical barrier | Fix before release unless explicit time-bounded waiver |
| P3 Low | Cosmetic/minor copy issue with no confusion or accessibility impact | May schedule with owner approval |

No P0/P1 is waived. Every waiver records impact, owner, mitigation, and expiry.

## 17. Definition of tested

A requirement is tested when:

- traceable automated tests cover its stable rules at the lowest useful layer;
- ownership negative cases exist;
- Arabic/English and mobile/desktop coverage is applied where user-facing;
- empty/error/loading/conflict states are exercised;
- accessibility behavior is checked;
- tests pass in CI against production-like configuration without real data;
- risk-based manual exploration is recorded for high-risk UX.

## 18. Release quality report

Each release candidate reports:

- requirement coverage and known gaps;
- pass/fail by test layer, locale, browser, viewport;
- open defects/waivers and risk;
- security/dependency findings;
- accessibility audit results;
- performance against budgets;
- migration, backup restore, rollback, and alert evidence;
- deployment version and owner go/no-go.
