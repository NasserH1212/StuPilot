# ADR 0013: UUID strategy

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

Internal identifiers must be opaque, portable across providers, and distinct from authorization. UUIDv7 can improve index locality, but the current application has no measured write-volume problem and adding a generator dependency before product schema exists is premature.

## Decision

Store identifiers in native PostgreSQL `uuid` columns and use UUIDv4 as the MVP baseline. Product IDs will be generated on the trusted server/application side using a cryptographically secure implementation so they exist before persistence; clients cannot select ownership IDs. External provider subjects map to internal UUIDs and are never domain primary keys.

The Sprint 0 technical health table uses PostgreSQL `gen_random_uuid()` because it is infrastructure-only; it contains no ownership semantics. UUID values are not secrets and never grant access. Reconsider UUIDv7 only if measured index/write behavior justifies it and the supported runtime/database strategy provides a stable implementation.

## Consequences

IDs remain non-sequential and provider-neutral at the cost of less index locality than UUIDv7. Authorization always checks authenticated ownership and scope rather than possession or format of an ID.

## References

- [PostgreSQL UUID type](https://www.postgresql.org/docs/current/datatype-uuid.html)
- [Node.js `crypto.randomUUID`](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions)
