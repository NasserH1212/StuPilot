# Environment and configuration guide

## Trust boundaries

| Variable              | Scope        | Required when                               | Client-visible |
| --------------------- | ------------ | ------------------------------------------- | -------------- |
| `NEXT_PUBLIC_APP_ENV` | Public       | Optional; defaults to `local`               | Yes            |
| `DATABASE_URL`        | Server       | Development migration/runtime database work | No             |
| `TEST_DATABASE_URL`   | Test tooling | Test migration and integration execution    | No             |

Allowed application environment values are `local`, `test`, `preview`, and `production`. The type vocabulary does not create those environments.

## Files

- `.env.example`: committed fake local examples only.
- `.env.local`: ignored developer values.
- `.env.test.local`: optional ignored test override.
- Preview/production values: future platform secret injection only; never committed or copied locally from a production service.

Prisma configuration reads local ignored files for CLI work. The connection-free `npm run db:generate` sets an internal generate-only placeholder that is never contacted. All migration commands require a real configured target.

## Validation behavior

Zod parsers are separated into public, server, and test functions. They fail with field names/reasons without rendering the supplied value. PostgreSQL URLs must use `postgres:`/`postgresql:` and name a database. Test configuration must name a dedicated test database and cannot equal the development URL.

Only `src/shared/config/public.ts` may be used in client code, and it reads an explicit `NEXT_PUBLIC_*` key. Do not spread `process.env` into client modules.

## Environment policy

- **Local:** fake/local credentials; disposable or developer-owned data.
- **Test:** isolated database and deterministic cleanup; no participant or production data.
- **Preview:** not created; future isolated secrets and database/schema require owner approval.
- **Production:** not created; credentials, accounts, domains, and deployment are outside Sprint 0.

Never reuse passwords or URLs between these scopes. Never place participant data in development/test. A `.env` file, key, certificate, token, or database dump must not be committed; `npm run secrets:scan` enforces common cases, but review remains required.
