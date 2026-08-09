# Production authentication foundation

## Current status

The repository contains a production-shaped, fail-closed authentication and application-owned identity foundation. Supabase Auth is isolated as the current candidate adapter. This is **not** evidence that hosted provider flows work: no real authorized Supabase environment or email delivery path was available during implementation.

## Implemented routes

| Route                                 | Behavior                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `/{locale}/auth/register`             | Email/password registration with server validation and generic verification-pending response |
| `/{locale}/auth/verification-pending` | Account-enumeration-safe pending state                                                       |
| `/{locale}/auth/callback`             | Non-consuming GET review page; explicit POST verifies email or recovery token                |
| `/{locale}/auth/verified`             | Verified identity state with a path to the protected workspace                               |
| `/{locale}/auth/sign-in`              | Email/password sign-in and exact return-to handling                                          |
| `/{locale}/auth/forgot-password`      | Generic recovery request response                                                            |
| `/{locale}/auth/reset-password`       | New password form gated by provider session plus signed recovery intent                      |
| `/{locale}/auth/link-error`           | Invalid, malformed, expired, or reused link state                                            |
| `/{locale}/auth/unavailable`          | Configuration, provider, rate-limit, and account-unavailable states                          |
| `/{locale}/workspace`                 | Optimistic proxy protection plus authoritative provider/internal account validation          |
| `/api/v1/session`                     | Private/no-store provider-neutral current internal-user contract                             |

Every user-facing state exists in Arabic/RTL and English/LTR. Credential inputs explicitly use LTR direction, forms have labels and autocomplete hints, errors use live regions, controls expose pending/disabled states, and focus remains visible.

## Layer boundaries

```text
Next.js pages, Route Handlers, Server Actions
                  |
                  v
      AuthenticationService + owned ports
          |                       |
          v                       v
Supabase provider adapter   Prisma identity repository
          |                       |
   provider cookies       users + auth_identities
```

- Domain code contains only the internal user ID and lifecycle state.
- Application code defines provider-neutral requests, principals, services, and stable errors.
- Infrastructure translates Supabase errors and implements cookie/session behavior.
- Composition wires adapters to application services; presentation and transport never import Prisma.
- No provider SDK type or identifier is stored in a domain entity.

## Identity and authorization rules

1. Supabase validates a credential or one-time token.
2. The adapter returns an opaque provider key/subject plus verified-email evidence to the application layer.
3. `PrismaUserIdentityRepository.resolveOrCreate` looks up only `(provider, provider_subject)`.
4. If absent, one transaction creates `users.id` and its identity. Unique-constraint/concurrency recovery re-reads the winning row.
5. Equal email snapshots are never looked up or merged.
6. Disabled and deletion-pending users fail closed.
7. Every protected page, Server Action, and API handler revalidates authorization near the operation. Proxy is not the authorization boundary.

## Security behavior

- Server Actions receive Next.js 16 origin/host CSRF enforcement and use a 32 KiB body limit.
- Callback tokens are not consumed by GET. The explicit POST is same-origin and uses an encrypted Server Action closure.
- Return-to navigation accepts only `/{locale}/workspace`; absolute, protocol-relative, traversal, and other internal paths fall back to that exact path.
- Supabase cookies are hardened to HttpOnly, SameSite=Lax, path `/`, and Secure on HTTPS. The recovery-intent cookie is SameSite=Strict and expires after ten minutes.
- Proxy refresh uses `getClaims`; authoritative page/API checks use `getUser`. Server authorization never trusts `getSession` user data.
- Auth/workspace/API session responses set private/no-store cache headers and vary on Cookie/Authorization.
- Provider exceptions are translated to stable application codes; raw messages, tokens, cookies, credentials, and email values are not logged or returned.
- Missing or partial configuration produces an unavailable state. It never produces a user, session, or successful response.

## Owner credential handoff — minimum actions

Do not create these resources automatically. The owner should complete only the steps below, then return the values through the approved local/deployment secret channel.

The owner has purchased `stupilot.com`, but DNS, hosting, and production deployment are not configured. Do not add that domain to Supabase Site URL or callback allowlists until a separately authorized deployment serves the exact HTTPS origin; the local evaluation values below remain loopback-only.

1. Create or designate an **owner-controlled Supabase organization and one isolated hosted non-production project** for authentication evaluation. Require MFA, documented recovery ownership, a budget/expiry date, a cleanup owner, and synthetic test identities only. Do not use production or participant data.
2. Decide the Supabase project region using current supported-region, Saudi cross-border/privacy, latency, DPA/subprocessor, deletion, backup, and cost evidence. **The region decision remains open and is a blocker.** Do not imply that the nearest region satisfies Saudi requirements without qualified review.
3. In Authentication settings, enable email/password signup and **Confirm Email**. Disable anonymous signup, phone auth, social providers, manual identity linking, and any unapproved provider.
4. For local authorized verification, set Site URL to exactly `http://localhost:3000` and add only these exact redirect URLs—no wildcard:

   - `http://localhost:3000/ar/auth/callback`
   - `http://localhost:3000/en/auth/callback`

5. Replace the link in the **Confirm sign up** template with:

   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Confirm email</a>
   ```

   Replace the link in the **Reset password** template with:

   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery"
     >Reset password</a
   >
   ```

   Disable email link tracking. The application confirmation page prevents ordinary GET prefetch from consuming the one-time token, but template and scanner behavior still needs real evidence.

6. Use provider rate limits appropriate to the synthetic evaluation. The built-in email service is evaluation-only and constrained; configure an approved custom SMTP service before any production acceptance. Do not create an email service as part of this repository task.
7. Put the following values in ignored `.env.local` only:

   | Variable                               | Source / handling                                                         |
   | -------------------------------------- | ------------------------------------------------------------------------- |
   | `AUTH_APP_ORIGIN`                      | `http://localhost:3000` for the exact local flow                          |
   | `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL; public by design                                    |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key; public by design                                |
   | `AUTH_STATE_SECRET`                    | New random value of at least 32 bytes; private, never exposed             |
   | `DATABASE_URL`                         | Dedicated isolated PostgreSQL evaluation database; private, never exposed |

   A Supabase secret/service-role key, management access token, database password in a public variable, and production credential are **not required and must not be supplied to ordinary authentication runtime**. A future multi-instance deployment must also inject `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` privately and consistently across instances.

8. Use only synthetic addresses controlled for testing. Do not reuse real student records, upload personal data, or auto-merge accounts by email.
9. Notify Codex that the environment is ready. Codex will apply the reviewed migrations to the isolated database, start the app on port 3000, and execute the real registration, verification, sign-in, refresh, return-to, recovery, reset, reused/expired/malformed link, rate-limit, outage, workspace, API session, sign-out, and revocation checks. Evidence will record the project environment and synthetic account identifiers without recording tokens or credentials.

## Provider evidence still required

- `NOT EXECUTED — real authorized provider environment required` — registration and actual verification email delivery.
- `NOT EXECUTED — real authorized provider environment required` — email verification token consumption, replay, expiry, and scanner behavior.
- `NOT EXECUTED — real authorized provider environment required` — sign-in cookie issuance, secure attributes, refresh, expiry, and server validation.
- `NOT EXECUTED — real authorized provider environment required` — recovery email delivery, recovery session, password update, and reused/expired recovery links.
- `NOT EXECUTED — real authorized provider environment required` — provider 429 mapping using real configured limits.
- `NOT EXECUTED — real authorized provider environment required` — provider outage/degraded response behavior.
- `NOT EXECUTED — real authorized provider environment required` — sign-out refresh-token revocation and post-sign-out workspace/API denial.
- `NOT EXECUTED — real authorized provider environment required` — hosted redirect allowlist rejection and production cookie behavior over HTTPS.

Authentication must not be marked production-complete until all applicable items pass.

## Primary implementation references

Reviewed on 2026-08-09:

- [Supabase server-side client setup for Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs)
- [Supabase authoritative `getUser` validation](https://supabase.com/docs/reference/javascript/auth-getuser)
- [Supabase redirect URL allowlists](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase email templates and token-hash callbacks](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase authentication rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Supabase authentication error codes](https://supabase.com/docs/guides/auth/debugging/error-codes)
- [Supabase session sign-out scopes](https://supabase.com/docs/reference/javascript/auth-signout)
- [Next.js authentication guidance](https://nextjs.org/docs/app/guides/authentication)
