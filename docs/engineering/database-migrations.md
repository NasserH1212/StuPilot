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

## Production identity migration

`20260809090000_production_identity_foundation` creates:

- `user_account_state` with `active`, `disabled`, and `deletion_pending`;
- `users` with a PostgreSQL-generated internal UUID and explicit lifecycle state;
- `auth_identities` with a restrictive foreign key to `users.id`;
- a unique `(provider, provider_subject)` index and a supporting `user_id` index;
- non-blank checks for provider keys and opaque provider subjects.

The migration does not create ownership by email and does not reference Supabase schemas. `prisma/recovery/20260809090000_production_identity_foundation.rollback.sql` is a manual, data-destructive reference for a verified empty/disposable target only. Once any user or product data exists, use a reviewed forward fix and preserve the identity history.

## Onboarding profile migration

`20260925000000_onboarding_profile` creates `user_profiles`: a one-row-per-user table
keyed by `user_id` (restrictive FK to `users.id`) holding the locale and time zone
captured during first-sign-in onboarding, plus a nullable `completed_at` that gates
whether onboarding is finished. `locale` is constrained to `('ar', 'en')` and
`time_zone` to non-blank, matching the check-constraint style used for
`academic_terms`. This migration was authored by hand — no `DATABASE_URL` or
`TEST_DATABASE_URL` was configured in the environment it was written in, so it has
not been run via `db:migrate:dev`/`db:test:migrate` or exercised by
`test:integration`. Run `npm run db:test:migrate`, `npm run db:test:status`, and
`npm run test:integration` against a real dedicated test database before treating
this migration as verified. `prisma/recovery/20260925000000_onboarding_profile.rollback.sql`
is a manual, data-destructive reference for a verified empty/disposable target only.

## Courses migration

`20260925010000_courses` creates two tables, matching `03f-database-domain-model.md`
§4.5–4.6: `courses` (a reusable, user-owned course identity — name, optional code,
color token, and default location) and `user_courses` (an enrollment attaching one
course to one term for one user). `user_courses` carries composite FKs
`(term_id, user_id)` → `academic_terms(id, user_id)` and `(course_id, user_id)` →
`courses(id, user_id)`, so a row can never reference another user's term or course
even if application checks are missed. A unique `(user_id, term_id, course_id)`
prevents enrolling the same course twice in the same term. Archiving a
`user_courses` row hides the course from that term's default lists without
touching the reusable `courses` row or other terms' enrollments. This slice's UI
always creates a course and its enrollment together in one step; reusing an
existing course across terms (course picker) is deferred.

Like the onboarding migration above, this one was authored by hand with no
`DATABASE_URL`/`TEST_DATABASE_URL` configured, so it has not been run via
`db:test:migrate`/`db:test:status` or exercised by `test:integration`. Verify it
against a real dedicated test database before treating it as safe to deploy.
`prisma/recovery/20260925010000_courses.rollback.sql` is a manual,
data-destructive reference for a verified empty/disposable target only.

## Current technical table

`_foundation_health_checks` proves migration execution, UUID/default mapping, generated client use, transactions, and cleanup. It contains only `id`, `checked_at`, and a test marker. Do not add product or user fields to it.

## References

- [Prisma Migrate overview](https://docs.prisma.io/docs/orm/prisma-migrate)
- [Migration history rules](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories)
- [Patching and failed-migration recovery](https://docs.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing)
