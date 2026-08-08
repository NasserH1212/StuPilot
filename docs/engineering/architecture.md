# Architecture overview

## System shape

StudentHub AI is one Next.js App Router deployment backed by one PostgreSQL database. It is a modular monolith: module boundaries are code ownership/dependency rules, not network calls.

```text
app route composition
        |
        v
feature presentation / transport
        |
        v
feature application services + owned ports
        |
        v
feature domain

infrastructure adapters ----implement----> application-owned ports
```

Dependencies point inward. The domain has no Next.js, Prisma, provider SDK, or infrastructure knowledge. Presentation and transport cannot access persistence. Infrastructure may implement application interfaces but cannot depend on presentation/transport.

## Directories

| Path                                 | Responsibility                                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `app/`                               | Route/layout composition, localized metadata, loading/error/not-found boundaries, future `/api/v1` handlers |
| `src/modules/<feature>/presentation` | UI components and view composition                                                                          |
| `src/modules/<feature>/transport`    | HTTP input/output translation; no persistence access                                                        |
| `src/modules/<feature>/application`  | Use cases, orchestration, transactions through owned ports                                                  |
| `src/modules/<feature>/domain`       | Entities, values, invariants, policies                                                                      |
| `src/infrastructure/persistence`     | Prisma client and repository implementations                                                                |
| `src/infrastructure/providers`       | Future vendor adapters; empty of SDKs in Sprint 0                                                           |
| `src/shared/`                        | Narrow configuration, localization, validation, time, errors, observability                                 |
| `prisma/`                            | Schema, immutable reviewed migration history, manual recovery references                                    |
| `tests/`                             | Foundation verification by layer                                                                            |

## Request and localization flow

1. `proxy.ts` redirects `/` to `/ar` and validates the first path segment.
2. It adds internal request headers for the validated locale and current foundation path.
3. The root server layout emits matching `<html lang>` and `dir` on the first response.
4. `[locale]` validates again, generates localized metadata, and selects a typed dictionary.
5. Unsupported segments call Next.js `notFound()` and fall back safely to the Arabic document shell.

The client does not repair document direction after hydration. CSS logical properties and `<bdi>` protect directional layout and mixed Arabic/English text.

## Database flow

Feature application code owns repository interfaces. Prisma implementations and the generated client live under infrastructure. UI/route code cannot import either; `npm run boundaries` checks this independently of TypeScript and ESLint.

The Sprint 0 `_foundation_health_checks` table is a technical compatibility artifact only. It is not a product entity and must not accumulate feature fields.

## Provider boundaries

Hosting, managed PostgreSQL, authentication, email, and observability remain unselected. Future adapters translate provider errors/IDs into internal contracts. Storage, jobs, analytics, AI, payments, and external messaging have no current boundary or SDK because they are not approved scope.

## Enforced rules

`scripts/check-boundaries.mjs` scans static, dynamic, and CommonJS imports. It fails when:

- domain imports Next.js, Prisma/generated client, or infrastructure;
- application imports delivery or infrastructure;
- presentation/transport imports persistence or Prisma;
- infrastructure imports presentation/transport;
- any production/test/tooling source imports `research-prototype/`.

The checker is run directly, unit-tested with negative fixtures, and executed in CI.
