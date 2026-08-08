# ADR 0008: Testing stack

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

The foundation needs fast logic feedback, real rendering and accessibility checks, real PostgreSQL constraints/transactions, and browser proof of first-response localization, responsive layout, and keyboard behavior.

## Decision

- TypeScript compiler: static type correctness.
- ESLint plus an executable repository-boundary checker: code and dependency direction.
- Prettier: deterministic formatting.
- Vitest: unit, React component, accessibility, and PostgreSQL integration suites.
- React Testing Library: behavior-oriented component queries.
- axe-core: JSDOM structural checks and real-Chromium serious/critical checks.
- Playwright Chromium: E2E, hydration, direction, 320px/desktop, 404, and keyboard smoke tests.
- Real PostgreSQL: migration, generated client, transaction rollback, and cleanup; never a constraint mock.

Tests mirror only implemented foundation behavior. Full multi-browser coverage, performance budgets, and feature tests wait for relevant scope.

## Consequences

The suite is layered and CI-reproducible. Browser binaries and PostgreSQL are explicit prerequisites. JSDOM cannot calculate real color contrast, so contrast is covered by token review and browser axe rather than a simulated canvas result.

## References

- [Vitest guide](https://vitest.dev/guide/)
- [Playwright installation and supported runtimes](https://playwright.dev/docs/intro)
- [Testing Library guiding principles](https://testing-library.com/docs/guiding-principles)
