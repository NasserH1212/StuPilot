# ADR 0006: PostgreSQL and Prisma

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

The approved domain is relational and needs constraints, transactions, time-zone-capable types, and a portable managed-database path. Prisma was conditional on a real compatibility spike with the selected runtime.

## Decision

Use PostgreSQL as the sole application database and Prisma ORM 7.9.1 with the required `@prisma/adapter-pg`/`pg` driver adapter. Keep Prisma in infrastructure and expose application-owned repository interfaces; UI, transport, application, and domain code cannot import the database client.

The Sprint 0 spike ran Node 24, PostgreSQL 18.4, Prisma 7.9.1 client generation, reviewed migration deployment, typed queries, a repository transaction, intentional rollback, and deterministic cleanup successfully. The only schema object is `_foundation_health_checks`, a technical table with no user or academic data.

## Consequences

Prisma is accepted for the MVP foundation, not granted authority over domain rules or authorization. Raw reviewed SQL remains valid for PostgreSQL features and constraints Prisma cannot express. Managed PostgreSQL remains unselected; provider-specific extensions must not enter the domain.

## References

- [Prisma system requirements](https://docs.prisma.io/docs/orm/reference/system-requirements)
- [Prisma PostgreSQL driver adapter](https://www.prisma.io/docs/orm/core-concepts/supported-databases/postgresql)
- [Prisma supported database versions](https://www.prisma.io/docs/orm/reference/supported-databases)
