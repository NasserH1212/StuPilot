# ADR 0002: Next.js modular monolith

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

The approved blueprint needs a responsive web product, a future versioned mobile API boundary, strong server rendering, and solo-founder delivery speed. Splitting services before product behavior exists would create operational cost without validated scaling needs.

## Decision

Use Next.js App Router and React as one deployable modular monolith. `app/` composes routes; feature presentation and transport call application services; application code owns ports; domain code is framework-free; infrastructure implements those ports. Reserve `/api/v1` for future HTTP contracts without creating a Sprint 0 endpoint.

Executable boundary checks prohibit domain-to-framework/infrastructure imports, presentation or transport access to persistence, infrastructure dependencies on delivery layers, and all production imports from the research prototype.

## Consequences

The product shares types and one deployment while keeping extraction seams. Long-running jobs, separate services, Redis, and queues require measured needs and new decisions. Server Components must call application services directly rather than loop through internal HTTP.

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js backend-for-frontend guidance](https://nextjs.org/docs/app/guides/backend-for-frontend)
