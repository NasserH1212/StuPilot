# ADR 0010: Provider-adapter strategy

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

Authentication, hosting, managed PostgreSQL, email, and observability vendors are not selected. Product/domain code tied to vendor SDKs would make evaluation superficial and replacement costly.

## Decision

Application code owns capability-oriented interfaces. Provider implementations belong under `src/infrastructure/providers/`; persistence implementations belong under `src/infrastructure/persistence/`. Domain code imports neither, transport maps protocols to application calls, and presentation never reaches a provider or database client.

Adapters must translate vendor identifiers/errors into internal types, keep configuration server-only, and be contract-tested. No placeholder SDK, fake provider, analytics, email, storage, queue, AI, or auth adapter is installed in Sprint 0. The current no-op observability implementation is an application-safe interface default, not a production vendor.

## Consequences

Vendor selection can be evidence-led and localized to infrastructure/configuration. Interfaces must remain narrow: a generic “provider service” that mirrors an SDK is not an adapter boundary.
