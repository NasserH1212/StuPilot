# ADR 0007: Migration workflow

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

Schema changes must be reproducible, reviewable, and safe across local, test, preview, and eventual production environments. Schema push does not provide an auditable production history.

## Decision

- Treat `prisma/migrations/` and its SQL as the source-controlled history.
- Use `prisma migrate dev` only to create development migrations, then review/edit the SQL before merge.
- Use `prisma migrate deploy` for isolated tests and future non-development environments.
- Never use `prisma db push` as a production workflow.
- Never edit or delete an already-applied migration; add a forward fix.
- Keep manual recovery references outside migration history under `prisma/recovery/`.
- For a failed migration, inspect `_prisma_migrations` logs and use `migrate resolve` only under the documented recovery procedure.

The Sprint 0 rollback SQL was syntax-checked by applying the migration and recovery file in a separate disposable test database. It is not an automatic down migration and must not be run against an unknown target.

## Consequences

Every schema change has a reviewed SQL artifact and deterministic CI application. Recovery requires operational judgment; destructive resets are never automated against shared or production data.

## References

- [Prisma Migrate](https://docs.prisma.io/docs/orm/prisma-migrate)
- [Migration histories](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories)
- [Failed-migration recovery](https://docs.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing)
