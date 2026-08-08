# Database migration guide

## Principles

- PostgreSQL is the only database target.
- `prisma/migrations/` is the immutable, reviewed history.
- Migration SQL—not the current Prisma schema alone—is the deployable artifact.
- `prisma db push` is prohibited for production or shared workflows.
- Development and test databases are separate; production credentials do not belong locally.

## Create a migration in development

1. Confirm `DATABASE_URL` targets the intended local development database.
2. Edit `prisma/schema.prisma` only for approved sprint scope.
3. Run `npm run db:migrate:dev -- --name <short_name>`.
4. Read the complete generated `migration.sql` for locks, data loss, constraints, defaults, indexes, and PostgreSQL compatibility.
5. Run generation, migration status, integration tests, and a production build.
6. Commit the schema, migration directory, and `migration_lock.toml` together.

Do not accept a reset prompt without explicit confirmation that the exact development database may be destroyed.

## Apply reviewed migrations

Development creation uses `migrate dev`; isolated test/preview/future production application uses:

```bash
npm run db:test:migrate
npm run db:test:status
```

The future deployment pipeline may call `prisma migrate deploy` only after hosting/database approval. Sprint 0 CI applies it solely to a fresh service database.

## Failed migration recovery

1. Stop additional deploy attempts.
2. Verify the exact environment/database and preserve provider backups/logs.
3. Inspect Prisma's `_prisma_migrations.logs` and the database's actual partial state.
4. Prefer a reviewed forward-fix migration.
5. For a failed migration only, use `prisma migrate resolve --rolled-back <name>` after manually reversing partial operations, or `--applied` after manually completing them exactly.
6. Re-run `migrate deploy`, status, and integration/acceptance checks.

Never edit/delete a migration already applied to a shared environment. Never run `migrate reset` or a recovery SQL file against an unverified target.

## Sprint 0 recovery artifact

`prisma/recovery/20260807000000_foundation_health_check.rollback.sql` drops only the technical health table. It was validated in a disposable `studenthub_recovery_test` database. It is a manual reference—not an automatic down migration—and becomes inappropriate if that table ever contains required data.

## Current technical table

`_foundation_health_checks` proves migration execution, UUID/default mapping, generated client use, transactions, and cleanup. It contains only `id`, `checked_at`, and a test marker. Do not add product or user fields to it.

## References

- [Prisma Migrate overview](https://docs.prisma.io/docs/orm/prisma-migrate)
- [Migration history rules](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories)
- [Patching and failed-migration recovery](https://docs.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing)
