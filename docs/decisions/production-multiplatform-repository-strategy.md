# Production multi-platform repository strategy

- **Decision date:** 2026-08-08
- **Owner approval:** 2026-08-09 — Nasser Al-Tamimi
- **Status:** **OWNER-APPROVED — Option D governs sequencing; entry/parity evidence remains required**
- **Scope:** repository topology, backend placement, shared-code boundary, and transition timing
- **Supersedes:** future topology/timing guidance that assumed native apps were permanently outside the product path; it does not rewrite historical implementation reports

## Decision summary

**OWNER-APPROVED — Option D: a gated, staged repository transition.** Keep the existing Next.js modular monolith at the repository root while implementing production identity, `/api/v1`, and one stable academic contract. Immediately before native application work, perform a dedicated behavior-neutral conversion to npm workspaces, moving the web application to `apps/web`. Only after that move passes parity gates should a separate change create `apps/mobile` and the minimal shared packages.

This is an explicit decision, not “decide later”:

```text
Now                         Gate                         Then
root Next.js app   ->  auth + /api/v1 + first   ->  workspace conversion
modular monolith       academic contract stable      -> native foundation
```

**OWNER-APPROVED direction — keep the backend inside the Next.js deployment for the MVP.** Route Handlers expose the versioned HTTP API to native clients; Server Components and Server Actions call the same application services without an internal HTTP round trip. A separate backend service or worker is justified only by a measured requirement.

## Decision drivers

| Driver                           | Evidence and implication                                                                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Preserve verified work           | **VERIFIED** — the root web application, tooling, migrations, boundary rules, and local checks already work together. Moving them now creates broad churn without adding user capability.        |
| Native needs a real contract     | **VERIFIED** — `/api/v1` has no handlers or contracts. A folder named `apps/mobile` would not solve identity, authorization, versioning, or data semantics.                                      |
| Avoid web-only coupling          | **VERIFIED** — Next.js Server Actions are a frontend mutation transport; native clients require public HTTP endpoints. Both transports must call application-owned services.                     |
| Share selectively                | **INFERRED** — contracts, semantic tokens, and some locale resources can reduce drift; UI components, ORM models, provider SDK types, and server domain internals would create harmful coupling. |
| Preserve deployment independence | **PROPOSED** — after conversion, web/API and native release pipelines remain independently deployable even though code is co-located.                                                            |
| Keep rollback tractable          | **PROPOSED** — a behavior-neutral move, followed by mobile creation, gives each change a clear rollback boundary.                                                                                |
| Respect client lag               | **VERIFIED** — store-distributed clients cannot be rolled back or upgraded instantly. The API must remain backward-compatible across a defined support window.                                   |

## Options considered

| Option                                                                                    | Assessment                                                                                                                                                                                                                                              | Decision                                                                                   |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **A. Keep the current root web app and add mobile later with minimal repository changes** | Low immediate churn, but a second application at the root or a nested ad-hoc package creates unclear dependency, lockfile, CI, ownership, and shared-contract rules. It tends to postpone the topology decision until both clients are already coupled. | **REJECTED** — acceptable only as the current temporary state, not the target topology.    |
| **B. Convert immediately to `apps/web`, `apps/mobile`, and shared packages**              | Produces a coherent target early, but moves every verified web/tooling path before auth/API contracts exist and encourages speculative shared packages.                                                                                                 | **REJECTED** — wrong timing; revisit as the bounded transition after the contract gate.    |
| **C. Put native and web/backend in separate repositories**                                | Strong release and permission isolation, but duplicates contract/tooling work and raises coordination/version-drift cost for a small product team.                                                                                                      | **REJECTED** — no verified team, compliance, or ownership boundary justifies the overhead. |
| **D. Gate the workspace conversion immediately before native implementation**             | Preserves the current foundation, forces identity/API semantics first, and creates a clean multi-app topology before mobile code accumulates. The transition has explicit entry, parity, and rollback gates.                                            | **SELECTED / OWNER-APPROVED** — governs the transition sequence.                           |

## Exact timing and entry gate

The workspace transition begins only when all of the following are true:

1. **VERIFIED** — Nasser Al-Tamimi accepted this topology decision on 2026-08-09.
2. **VERIFIED** — an authentication provider and browser/native session flows have been selected through a separate decision.
3. **VERIFIED** — a real staging provider/database proves sign-in, verification where applicable, refresh/expiry, logout/revocation, recovery, and internal identity mapping.
4. **VERIFIED** — `/api/v1` has a documented error envelope, auth scheme, compatibility rules, and at least one authenticated contract test.
5. **VERIFIED** — the first academic read/write slice runs against PostgreSQL and is exercised through the API, including authorization and concurrency behavior.
6. **VERIFIED** — the current root web checks are green and their results are captured as the pre-move baseline.
7. **VERIFIED** — mobile identifiers, store-account ownership, signing custody, privacy ownership, and supported platform policy are decided.

If any item is absent, the transition is **BLOCKED**. A target calendar date alone is not an entry criterion.

## Transition shape

### Current, retained until the gate

The following trees preserve the existing local repository folder name. This rebrand does not rename that folder automatically.

```text
StudentHub-AI/
├── app/                 # Next.js routes and future /api/v1 handlers
├── src/                 # modular monolith
├── prisma/              # single authoritative schema/migration history
├── tests/
├── docs/
├── package.json
└── package-lock.json
```

### Target after the behavior-neutral move and native bootstrap

```text
StudentHub-AI/
├── apps/
│   ├── web/             # existing Next.js UI + /api/v1 + backend composition
│   └── mobile/          # Expo/React Native app, created after web-move parity
├── packages/
│   ├── contracts/       # serialized API schemas/types; no Next/Prisma/Expo imports
│   ├── design-tokens/   # reviewed semantic tokens, not shared UI components
│   └── localization/    # only platform-neutral keys/resources proven useful
├── docs/
├── package.json         # private workspace orchestration only
└── package-lock.json    # one reviewed npm lockfile
```

- **PROPOSED** — `apps/web` remains the backend owner for the MVP; there is no `apps/api` during the transition.
- **PROPOSED** — move the web application and repair paths in one dedicated change; do not create mobile features in that change.
- **PROPOSED** — create `apps/mobile` in the next change using the stable Expo/React Native versions selected at that time.
- **PROPOSED** — create a shared package only when two consumers exist and its public boundary is demonstrably platform-neutral. Empty “future” packages are prohibited.
- **PROPOSED** — preserve one root lockfile and npm 11 workspaces initially. npm's official workspace support already provides local package linking and targeted/all-workspace commands; a heavier task runner is not justified by current evidence.

## Shared-code policy

| Share                                                                                                                       | Do not share                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **PROPOSED** — versioned request/response schemas, stable identifiers, problem codes, cursor shapes, and contract fixtures. | **PROPOSED** — Prisma models/client, database repositories, server-only domain services, provider SDK sessions, cookies, or environment loaders. |
| **PROPOSED** — semantic color/space/type/motion values after design approval.                                               | **PROPOSED** — React DOM components, CSS, Next.js route code, React Native screens, or navigation components.                                    |
| **PROPOSED** — locale identifiers, message keys, and carefully reviewed platform-neutral copy.                              | **PROPOSED** — markup-bearing messages, direction side effects, platform accessibility labels that need different phrasing, or web URL helpers.  |
| **PROPOSED** — pure deterministic utilities with identical semantics and tests on both platforms.                           | **PROPOSED** — “shared” abstractions that merely wrap platform APIs or hide divergent lifecycle behavior.                                        |

The serialized `/api/v1` behavior remains the source of compatibility truth even when both clients import a local contracts package. **PROPOSED** — CI must prove that the package, generated API description, handlers, and fixtures agree; co-location must not become permission to make unversioned breaking changes.

## Backend placement decision

**PROPOSED — retain a Next.js-hosted modular backend for the MVP** because the repository already enforces application/domain/infrastructure separation and the expected initial workload is request/response academic CRUD plus auth, not an independently scaling compute or streaming system.

Web access:

```text
Server Component / Server Action -> application service -> repository/provider port
```

Native and external access:

```text
HTTPS /api/v1 Route Handler -> transport validation/auth -> same application service
```

**PROPOSED — do not make Server Components fetch the application's own Route Handlers.** Installed Next.js 16.3 guidance and the current official Backend-for-Frontend guide identify the extra HTTP round trip and build-time limitations. The API is a transport adapter, not the backend's internal architecture.

### Backend extraction triggers

Reconsider a separate backend only when at least one trigger is measured and a short design review shows extraction is the smallest safe response:

- **PROPOSED** — long-running or persistent connection workloads exceed the selected Next.js host's execution model.
- **PROPOSED** — API traffic needs independent scaling, release cadence, regional placement, or failure isolation and the benefit exceeds operational cost.
- **PROPOSED** — multiple non-Next consumers or teams require an independently owned service boundary and contract lifecycle.
- **PROPOSED** — queues, scheduled workloads, notification fan-out, or compute-intensive work become material and cannot be isolated as a worker while keeping the request API in the monolith.
- **PROPOSED** — compliance requires distinct network, credential, or operator boundaries.

Until such evidence exists, service extraction is **DEFERRED**.

## Rejected timing alternatives

- **REJECTED** — restructure before authentication. It expands diff surface while the identity model and native session shape are unresolved.
- **REJECTED** — start mobile UI against mocks first. It creates false progress and lets mock semantics harden before authorization, time, and error contracts exist.
- **REJECTED** — merge the spike to accelerate auth. Its provider/runtime/schema/test evidence is incomplete and entangled.
- **REJECTED** — split the API into a new service before the first vertical slice. No scaling, team, or compliance evidence supports the cost.
- **REJECTED** — share all TypeScript domain code. Cross-platform source compatibility is not the same as a stable product or security boundary.

## Consequences

### Positive

- **INFERRED** — mainline risk stays concentrated on identity/API behavior rather than path churn.
- **INFERRED** — the native app starts with a real authenticated contract and an intentional release topology.
- **INFERRED** — web and native can share narrow artifacts without sharing presentation or provider internals.
- **INFERRED** — backend extraction remains possible because application services are transport-independent.

### Costs

- **PROPOSED** — one deliberate repository move is added before mobile implementation.
- **PROPOSED** — the API must be designed and compatibility-tested even though web could call services directly.
- **PROPOSED** — root scripts, path aliases, Prisma output, CI caches, deployment roots, boundary checks, and documentation must all be updated and parity-tested during the move.
- **INFERRED** — temporarily, future topology is documented while current paths remain unchanged; active documentation must distinguish the two.

## Rollback boundary

- **PROPOSED** — the workspace conversion contains no product behavior, schema migration, provider change, or mobile feature.
- **PROPOSED** — capture the pre-move command matrix and route snapshots; the moved web app must reproduce them before merge.
- **PROPOSED** — if parity, deployment-root, Prisma, or CI behavior cannot be restored within the transition change, revert the entire move and continue at the root. Do not maintain a half-moved topology.
- **PROPOSED** — after mobile releases exist, repository rollback and client rollback are separate concerns; API backward compatibility protects installed clients.

## Decision ownership and review

- **VERIFIED** — the owner accepted Option D on 2026-08-09; [the canonical owner record](../sprints/sprint-0m/owner-decisions.md) controls its constraints.
- **BLOCKED** — the workspace move still requires every entry and parity gate above; owner approval is not implementation evidence.
- **PROPOSED** — review this decision again at the first academic contract exit gate, before any file move.
- **PROPOSED** — review backend placement after the first production load evidence or when an extraction trigger occurs, whichever comes first.
- **PROPOSED** — record any replacement as a new decision; do not silently rewrite this record.

## Primary references

- **VERIFIED, accessed 2026-08-08** — [npm 11 workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/) documents one root workspace, automatic local linking, and per/all-workspace commands. The exact npm version in this repository remains governed by `package.json`.
- **VERIFIED, accessed 2026-08-08** — [Next.js Backend for Frontend guide](https://nextjs.org/docs/app/guides/backend-for-frontend) describes Route Handlers as public endpoints, requires auth/input protection, advises Server Components to read sources directly, and describes Server Actions as frontend mutations. Host-specific runtime limits still require provider evaluation.
