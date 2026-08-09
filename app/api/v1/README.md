# API v1 boundary

`GET /api/v1/session` is the first provider-neutral identity contract. It returns only the internal `userId` and application account state after authoritative server validation, or a stable error code with `401`, `403`, or `503`. It is private/no-store and does not expose email, provider IDs, cookies, refresh tokens, or SDK types.

Future handlers must translate HTTP input into application services, return additive stable v1 contracts, and never access Prisma directly. Native bearer transport is not implemented in this phase.
