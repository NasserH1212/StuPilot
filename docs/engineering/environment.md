# Environment and configuration guide

## Trust boundaries

| Variable                               | Scope         | Required when                                   | Client-visible |
| -------------------------------------- | ------------- | ----------------------------------------------- | -------------- |
| `NEXT_PUBLIC_APP_ENV`                  | Public        | Optional; defaults to `local`                   | Yes            |
| `NEXT_PUBLIC_SUPABASE_URL`             | Public        | Real Supabase candidate authentication          | Yes            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public        | Real Supabase candidate authentication          | Yes            |
| `AUTH_APP_ORIGIN`                      | Server config | Auth redirects/cookie policy; exact origin only | No             |
| `AUTH_STATE_SECRET`                    | Server secret | Signed password-recovery intent                 | No             |
| `DATABASE_URL`                         | Server secret | Database runtime and internal identity          | No             |
| `TEST_DATABASE_URL`                    | Test tooling  | Test migration and integration execution        | No             |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`   | Deploy secret | Future multi-instance/rolling deployment        | No             |

Allowed application environment values are `local`, `test`, `preview`, and `production`. The type vocabulary does not create those environments.

## Files

- `.env.example`: committed fake local examples only.
- `.env.local`: ignored developer values.
- `.env.test.local`: optional ignored test override.
- Preview/production values: future platform secret injection only; never committed or copied locally from a production service.

Prisma configuration reads local ignored files for CLI work. The connection-free `npm run db:generate` sets an internal generate-only placeholder that is never contacted. All migration commands require a real configured target.

Authentication activates only when `AUTH_APP_ORIGIN`, `AUTH_STATE_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` all pass validation. Missing, partial, malformed, non-HTTPS (except loopback), or path-bearing origin configuration fails closed. Ordinary runtime does not read or accept a Supabase service-role key, secret key, or management token.

## Validation behavior

Zod parsers are separated into public, server, and test functions. They fail with field names/reasons without rendering the supplied value. PostgreSQL URLs must use `postgres:`/`postgresql:` and name a database. Test configuration must name a dedicated test database and cannot equal the development URL.

Only explicit `NEXT_PUBLIC_*` keys may ever be client-visible. The Supabase URL and publishable key are public by provider design, although the current web UI uses server transport only. Never put a database URL, `AUTH_STATE_SECRET`, Supabase secret/service-role key, or management token in a `NEXT_PUBLIC_*` variable. Do not spread `process.env` into client modules.

## Environment policy

- **Local:** local database values; real provider values only during an owner-authorized isolated hosted evaluation using synthetic accounts.
- **Test:** isolated database and deterministic cleanup; no participant or production data.
- **Preview:** not created; future isolated secrets and database/schema require owner approval.
- **Production:** not created; credentials, accounts, domains, and deployment are outside Sprint 0.

Never reuse passwords or URLs between these scopes. Never place participant data in development/test. A `.env` file, key, certificate, token, or database dump must not be committed; `npm run secrets:scan` enforces common cases, but review remains required.

The exact hosted-provider handoff is documented in [authentication.md](authentication.md#owner-credential-handoff--minimum-actions).
