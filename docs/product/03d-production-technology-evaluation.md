# StuPilot — Production Technology Evaluation

**Deliverable:** 3D  
**Version:** 1.0  
**Evaluation date:** 5 August 2026  
**Status:** Recommendation for owner review; no packages installed

## 1. Decision criteria

Options are evaluated for a solo founder or small team using these weighted priorities:

| Criterion | Weight |
|---|---:|
| Maintainability and delivery speed | 20% |
| Security and safe defaults | 20% |
| Arabic/RTL and responsive UI | 15% |
| Testing and observability | 10% |
| Deployment simplicity | 10% |
| Portability and future mobile API | 10% |
| Operating cost predictability | 10% |
| Ecosystem/team availability | 5% |

Scores are directional proposals, not vendor guarantees. Pricing, regions, limits, and supported versions must be rechecked in Sprint 0.

## 2. Recommended production stack

| Layer | Recommendation |
|---|---|
| Language | TypeScript across web and server modules |
| Web framework | Next.js App Router on current supported stable release |
| UI | React, semantic HTML, CSS logical properties; utility CSS/design tokens selected in Sprint 0 |
| Architecture | Modular monolith with application/domain modules independent of route handlers |
| API | Next.js Route Handlers under versioned `/api/v1` for mobile-ready operations; direct server-module calls for server-rendered web paths |
| Validation | One schema-validation boundary shared by forms and APIs |
| Database | PostgreSQL, managed and region-co-located with compute |
| ORM | Prisma ORM and reviewed SQL migrations; raw SQL allowed for constraints/indexes that need it |
| Authentication | Managed authentication preferred for MVP, behind an internal identity adapter and internal `users` table |
| Hosting | Vercel for the Next.js application; managed PostgreSQL chosen for backups/PITR and region fit |
| Background work | No separate worker initially; durable outbox/job abstraction added when scheduled external delivery is approved |
| Email | Transactional email provider behind an adapter; exact vendor open |
| Future storage | Private S3-compatible object storage behind an application adapter; not provisioned for MVP |
| Testing | Unit + integration + browser E2E + accessibility + security-focused ownership tests |
| Observability | Structured logs, error tracking, metrics, traces via OpenTelemetry-compatible export, uptime checks |

### Recommendation summary

Use **Next.js + TypeScript + PostgreSQL + Prisma as a modular monolith**, deploy the web application to **Vercel**, and use **managed authentication** and a **managed PostgreSQL service** selected in Sprint 0. Keep domain services and `/api/v1` contracts provider-neutral. Do not create NestJS, a queue, Redis, object storage, or AI infrastructure until a real requirement needs them.

## 3. Frontend evaluation

| Option | Strengths | Costs/risks | Directional score |
|---|---|---|---:|
| Next.js App Router | Full-stack React, server/client component boundaries, file routing, route handlers, loading/error conventions, strong deployment path, can self-host as Node/Docker | Framework semantics and caching require discipline; provider-specific optimizations can encourage lock-in | 4.6/5 |
| React + Vite SPA | Simple client model, broad ecosystem, host anywhere; clean separation from a dedicated API | Must separately choose routing, SSR/SEO strategy, backend, auth integration, data fetching, and deployment; more moving parts for one founder | 3.6/5 |
| SvelteKit | Integrated routing/forms/SSR, performant compiled components, Node and other adapters | Smaller hiring/ecosystem pool than React; switching language/component conventions adds risk without a product-specific benefit | 3.8/5 |

The React documentation recommends starting a new production application with a framework. Next.js App Router provides Server Components and Route Handlers, while its official self-hosting guidance confirms a standard Node/Docker path, supporting portability. SvelteKit is viable but not justified strongly enough to outweigh React ecosystem continuity.

### Frontend decision

Choose Next.js. Keep interactivity in focused Client Components; render shells and data-heavy views on the server where useful. Do not call internal Route Handlers from Server Components merely to create an HTTP hop—call application services directly. Use Route Handlers for browser-client calls, auth callbacks/webhooks, and the future mobile API.

## 4. Backend evaluation

| Option | Strengths | Costs/risks | Use decision |
|---|---|---|---|
| Next.js server capabilities | One deployable, shared types, Route Handlers support standard HTTP verbs, fast solo delivery | Easy to mix UI, persistence, and domain logic unless boundaries are enforced; serverless constraints affect long jobs | **Use for MVP** |
| NestJS | Explicit modules/providers/controllers, dependency injection, mature separate-API structure and testing | Second application/deployment, duplicated configuration, auth/CORS/networking, and more operational work | Defer until extraction trigger |
| Fastify/Hono standalone | Lean and portable API, useful for workers or high-throughput services | Requires inventing more architecture and integrations; no current scale need | Not selected |

### Extraction triggers for NestJS

Create a separate NestJS service only if one or more are true and the owner approves:

- native clients require an independently scaled/stable API cadence;
- background processing becomes sustained and long-running;
- team ownership needs separate deploy/release boundaries;
- Next.js runtime constraints are measured blockers;
- regulatory/network separation becomes mandatory.

Until then, domain modules must have no imports from page/components so extraction remains possible without paying for it now.

## 5. PostgreSQL

PostgreSQL is the approved database. It fits relational ownership, term/course/item relationships, transactions, unique constraints, partial/multicolumn indexes, `timestamptz`, and optional Row-Level Security.

Operational requirements for a provider:

- supported region near application compute and intended users;
- TLS connections and least-privileged roles;
- automated backups and point-in-time recovery appropriate to the plan;
- tested restore workflow and documented RPO/RTO;
- connection pooling compatible with the deployment runtime;
- metrics, maintenance policy, export, and standard connection string;
- clear data processing terms and deletion behavior.

Railway can provision a PostgreSQL service and private networking, but its documentation describes the default template as unmanaged and directs operators to configure backups/monitoring. It remains a viable all-in-one deployment if the owner accepts that responsibility. A managed PostgreSQL specialist may reduce database operations for a solo founder.

## 6. ORM evaluation

| Option | Strengths | Costs/risks | Score |
|---|---|---|---:|
| Prisma | Generated type-safe client, declarative schema, migration history with editable SQL, strong onboarding/tooling | Adds generated-client/runtime conventions; advanced PostgreSQL features may require SQL; current major requires driver adapters | 4.5/5 |
| Drizzle | SQL-like TypeScript schema/querying, light abstraction, explicit generated SQL migrations | More SQL/schema responsibility; current official PostgreSQL guide showed a v1 release-candidate track at evaluation time, so pinning/maturity review matters | 4.0/5 |
| Raw `pg` + migration tool | Maximum SQL control and portability | More repetitive mapping/validation, larger solo-maintenance burden | 3.2/5 |

### ORM decision

Recommend Prisma for the MVP because one founder benefits from a single readable schema, generated types, and a migration workflow. Requirements:

- use `migrate` with reviewed SQL in every environment; never use schema push against production;
- add explicit PostgreSQL constraints/indexes in migration SQL where the ORM schema cannot express them;
- avoid hiding authorization in generic helpers;
- benchmark Today/Week queries and use raw parameterized SQL only when justified;
- lock exact versions in Sprint 0 after compatibility verification.

Drizzle is the fallback if the owner strongly prioritizes SQL proximity or Prisma runtime/deployment behavior fails the Sprint 0 spike.

## 7. Authentication evaluation

| Model | Benefits | Responsibilities/risks |
|---|---|---|
| Managed auth (for example Clerk/Auth0-class provider) | Provider operates credential/session flows, verification, recovery, abuse controls and optional MFA; fastest secure start | Recurring cost, data region/vendor dependency, UI/localization constraints, account migration plan |
| Application-owned auth library (for example Better Auth) | Database and UI control, portability, direct Arabic copy, known schema | Team owns secure configuration, email delivery, abuse prevention, upgrades, incident response, session and key operations |
| Hand-built auth | Maximum control | Unacceptable avoidable security/maintenance risk for MVP |

### Authentication decision

Prefer **managed authentication** for the MVP, provided the selected vendor passes Arabic/English custom-flow QA, data-region/legal review, export/deletion needs, session controls, pricing, and server-side Next.js support. Clerk is a practical candidate, but its documented localization package was marked experimental at evaluation time; therefore prebuilt localization alone cannot satisfy the Arabic requirement. Use product-owned bilingual screens/custom flows if supported, or select another vendor.

Regardless of vendor:

- create an internal immutable `users.id` and an `auth_identities` mapping;
- never use provider email as a domain foreign key;
- verify authentication server-side for every operation;
- keep provider calls behind `IdentityProvider` and webhook adapter interfaces;
- require an exit/export plan.

If owner cost/data-control priorities reject managed auth, Better Auth is the reviewed application-owned fallback; its database/session/password-reset features do not remove the team's security obligations.

## 8. Deployment evaluation

| Option | Strengths | Costs/risks | Recommendation |
|---|---|---|---|
| Vercel | First-class Next.js deployment, Git previews, managed functions/logs/tracing, cron trigger option | Function/runtime limits, cost model, ephemeral filesystem, database must be co-located, deeper platform coupling if proprietary features spread | **Preferred web host** |
| Railway | Standard Node/Docker services, PostgreSQL/private network, cron services, straightforward future worker | More service/database operations; default PostgreSQL template needs explicit backup/monitoring responsibility | Strong all-in-one/self-host-like alternative |
| Container platform (Render/Fly/AWS class) | Portability and control | Larger configuration/operations surface without present need | Revisit on measured trigger |

### Deployment decision

Start with Vercel for the Next.js application, using only portable Next.js/Node capabilities where practical. Put the database in a compatible nearby region. Do not use local filesystem persistence. Scheduled in-app reminder materialization can initially use a protected, idempotent cron endpoint if needed; durable outbound delivery waits for a job/outbox design.

Choose Railway instead if Sprint 0 shows that a continuously running Node process, same-provider private PostgreSQL networking, or predictable service topology is more valuable than Vercel previews/integration. This is an owner cost/operations decision, not a code assumption.

## 9. Future file storage

No file feature or bucket belongs to the MVP. Later releases use a private S3-compatible interface supporting:

- server-authorized presigned upload/download;
- user-prefixed object keys that are not authorization by themselves;
- content type/size checks, malware scanning, encryption, retention/lifecycle, deletion, and audit;
- database metadata owned by internal user ID;
- provider replacement through endpoint/credentials configuration.

AWS S3 and Cloudflare R2 are later candidates; R2 documents S3 API compatibility. No provider is selected or provisioned now.

## 10. UI, localization, and testing choices for Sprint 0

Recommended evaluation baseline:

- design tokens with logical spacing and direction-aware components;
- one i18n library with server/client support, locale routing or cookie policy, ICU messages, and type-safe keys;
- accessible headless primitives only after an RTL/keyboard spike;
- unit runner suitable for TypeScript, React Testing Library for behavior, Playwright for browser journeys, automated accessibility checks plus manual audit;
- dates handled with platform `Intl` and a focused time-zone library only if recurrence needs it.

Exact packages are intentionally not installed or frozen in this deliverable.

## 11. Portability rules

- Standard PostgreSQL is the system of record.
- Migrations live in version control and can initialize a fresh database.
- Domain types do not expose ORM or auth-provider objects to UI code.
- Provider SDKs live under adapters.
- API error/envelope and pagination conventions are application-owned.
- Object storage uses S3 semantics later, not vendor-only URLs in domain rows.
- Observability exports through open formats where feasible.
- Infrastructure is reproducible from documented configuration; console-only changes are recorded.

## 12. Sources checked

Official sources accessed 5 August 2026:

- [React — Creating a React App](https://react.dev/learn/creating-a-react-app)
- [Next.js — App Router](https://nextjs.org/docs/app)
- [Next.js — Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Next.js — Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Next.js — Self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [NestJS — Modules](https://docs.nestjs.com/modules)
- [SvelteKit — Introduction](https://svelte.dev/docs/kit/introduction)
- [Prisma ORM overview](https://www.prisma.io/docs/orm)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Drizzle ORM — PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [PostgreSQL current documentation](https://www.postgresql.org/docs/current/)
- [Clerk localization](https://clerk.com/docs/guides/customizing-clerk/localization)
- [Better Auth — database](https://better-auth.com/docs/concepts/database)
- [Vercel deployments](https://vercel.com/docs/deployments/overview)
- [Vercel runtimes](https://vercel.com/docs/functions/runtimes)
- [Railway PostgreSQL](https://docs.railway.com/databases/postgresql)
- [Railway cron jobs](https://docs.railway.com/cron-jobs)
- [Cloudflare R2 S3 compatibility](https://developers.cloudflare.com/r2/get-started/s3/)

## 13. Open owner decisions

1. Managed-auth vendor or application-owned fallback and acceptable monthly auth budget.
2. Vercel versus Railway primary hosting, after a written Sprint 0 cost/region comparison.
3. Managed PostgreSQL vendor, region, backup/PITR tier, RPO, and RTO.
4. Transactional email vendor and sender domain.
5. Error/observability vendor and data-scrubbing/region policy.
6. Whether product analytics is enabled at launch and under what consent policy.

None requires participant research; all require owner or legal/operational approval before production use.
