# ADR 0001: Production repository structure

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

The repository already contained project documentation and a disposable research prototype, but no package manifest or production application. A nested application would add navigation and tooling overhead without isolating another active product.

## Decision

Place the production Next.js application at the repository root. Keep project documentation under `docs/` and leave `research-prototype/` as an isolated historical directory.

The executable structure is:

- `app/`: route composition and Next.js boundaries;
- `src/modules/<feature>/{presentation,transport,application,domain}`: feature-owned layers;
- `src/infrastructure/{persistence,providers}`: technical implementations;
- `src/shared/{config,localization,validation,time,errors,observability}`: narrow cross-cutting code;
- `prisma/`: reviewed schema and migration history;
- `tests/`: unit, component, accessibility, integration, and E2E suites;
- `scripts/`: local enforcement/orchestration with no product behavior.

## Consequences

Root commands are simple and there is one lockfile. Documentation and the prototype remain visible but cannot become implicit runtime dependencies. If another independently deployable application is later approved, this decision must be revisited before introducing a workspace/monorepo tool.
