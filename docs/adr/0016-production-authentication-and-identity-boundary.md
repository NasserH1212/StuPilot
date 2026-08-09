# ADR 0016: Production authentication and application-owned identity boundary

- **Date:** 2026-08-09
- **Status:** Accepted architecture; Supabase provider acceptance remains evidence-gated
- **Decision owners:** StuPilot project owner and engineering

## Context

The web application and future native clients need one identity model without making product ownership depend on a managed authentication vendor, email address, browser cookie, or provider SDK type. D01–D16 require an internal UUID, opaque external identity links, no automatic email merging, explicit account lifecycle states, and server-side authorization.

## Decision

- `users.id` is the only future product-ownership key.
- `auth_identities` links an opaque `(provider, provider_subject)` pair to one internal user. The pair is unique; verified email is an optional snapshot and is never queried for ownership or merging.
- `users.state` is `active`, `disabled`, or `deletion_pending`. Only `active` accounts authenticate; other states fail closed.
- The authentication module owns provider-neutral ports and stable errors. Supabase SDK imports are allowed only below `src/infrastructure/authentication` and are enforced by the boundary checker.
- Identity creation runs in a serializable Prisma transaction. A concurrent uniqueness winner is re-read, so repeated or simultaneous first logins converge on one internal UUID.
- Browser sessions use server-managed, HttpOnly, SameSite cookies. Proxy performs refresh and an optimistic signature/claims check; pages, actions, and API handlers still perform authoritative provider validation and internal account-state authorization.
- Email verification and recovery links first render a non-consuming confirmation page. Only an explicit same-origin POST consumes the single-use token, reducing accidental consumption by email-link scanners.
- Password updates require both a provider-validated recovery session and a short-lived, HMAC-signed, HttpOnly recovery-intent cookie bound to the opaque provider subject.
- Redirects accept only the exact localized workspace path. Authenticated and auth-related responses are private and `no-store`.
- Ordinary runtime accepts only a Supabase project URL and publishable key. A Supabase secret key, service-role key, management token, or database password is never a browser/auth-provider input.

## Provider status

Supabase Auth is the implemented candidate adapter, not a production-accepted provider. No hosted project or real credentials were available in this implementation phase. Repository behavior without the complete configuration group fails closed and contains no fake success path.

## Consequences

- A provider migration can preserve internal ownership and replace identity links without rewriting academic foreign keys.
- Email changes do not change ownership, and equal emails never merge identities.
- Provider-backed registration, email delivery, token reuse, recovery, cookie refresh, and revocation remain release blockers until executed against an owner-authorized hosted non-production environment.
- Multi-instance deployment must provide a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` through the deployment secret store because callback confirmation uses an encrypted Server Action closure.
