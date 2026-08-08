# Sprint 0 Baseline Report

- **Recorded:** 2026-08-07 (Asia/Riyadh)
- **Scope:** State observed before Sprint 0 production-foundation changes
- **Repository root:** `C:/Users/Hasib/Documents/StudentHub-AI`

## Repository identity and state

This is the independent **StudentHub AI** repository. Repository and documentation searches found StudentHub AI throughout and no CreateCV application, package, or source tree. No production application exists at this baseline: there is no package manifest, lockfile, Next.js configuration, TypeScript configuration, Prisma schema, CI workflow, or production source directory.

Git is initialized on branch `master`, but the repository has no commits. `git status --short --branch` reported every current project file as untracked:

```text
## No commits yet on master
?? README.md
?? docs/
?? research-prototype/
```

Consequences:

- There is no historical revision against which Sprint 0 can produce a conventional Git diff.
- Existing untracked documentation and prototype files are owner material and must be preserved.
- Sprint 0 verification will therefore use file inventory, status, and `git diff --no-index`-style or targeted content review where useful, while reporting this limitation truthfully.

## Existing files

The baseline contained 35 non-Git files (689,776 bytes), all text files and none larger than 1 MiB.

### Root

- `README.md`

### Approved product blueprint and prior deliverables

- `docs/deliverables/01-project-discovery-and-product-definition.md`
- `docs/deliverables/02-market-competitor-user-validation-plan-outline.md`
- `docs/product/README.md`
- `docs/product/03a-product-requirements-document.md`
- `docs/product/03b-mvp-scope-and-release-plan.md`
- `docs/product/03c-information-architecture-and-user-flows.md`
- `docs/product/03d-production-technology-evaluation.md`
- `docs/product/03e-system-architecture-blueprint.md`
- `docs/product/03f-database-domain-model.md`
- `docs/product/03g-security-and-privacy-baseline.md`
- `docs/product/03h-testing-and-quality-strategy.md`
- `docs/product/03i-development-roadmap-and-sprints.md`

### Historical research material

- `docs/research/README.md`
- `docs/research/02a-research-operations-plan.md`
- `docs/research/02b-competitor-landscape.md`
- `docs/research/02c-participant-screener-and-recruitment.md`
- `docs/research/02d-interview-guide.md`
- `docs/research/02e-diary-study-kit.md`
- `docs/research/02f-student-survey-draft.md`
- `docs/research/02g-prototype-usability-test-plan.md`
- `docs/research/02h-evidence-matrix-and-decision-templates.md`
- `docs/research/03a-validation-sprint-1-plan.md`
- `docs/research/03b-recruitment-launch-package.md`
- `docs/research/03c-participant-information-and-consent.md`
- `docs/research/03d-session-moderator-pack.md`
- `docs/research/03e-validation-tracking-templates.md`
- `docs/research/03f-research-prototype-verification.md`
- `docs/research/03g-gate-l0-owner-decisions.md`
- `docs/research/03h-internal-dry-run-checklist.md`
- `docs/archive/research/README.md`

### Disposable research prototype

- `research-prototype/README.md`
- `research-prototype/index.html`
- `research-prototype/styles.css`
- `research-prototype/app.js`

The prototype is historical and disposable. It will remain physically isolated, will not be imported by the production application, and will not be copied, adapted, or treated as a production design system. Sprint 0 will add an automated import-boundary check for this prohibition.

## Detected tooling and runtimes

| Tool       | Detected state             | Sprint 0 implication                                                                                                                                     |
| ---------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js    | `v24.14.0`                 | Compatible with the selected Node 24 LTS policy; update to the latest Node 24 patch is recommended separately.                                           |
| npm        | `11.9.0` through `npm.cmd` | Selected package manager; PowerShell blocks the `npm.ps1` shim under the current execution policy, so Windows documentation uses `npm.cmd` where needed. |
| Corepack   | `0.34.6`                   | Available, but not required for the npm workflow.                                                                                                        |
| pnpm       | `11.9.0`                   | Available but not selected; one lockfile/package-manager path is preferable.                                                                             |
| Git        | `2.53.0.windows.1`         | Available.                                                                                                                                               |
| Docker     | Not detected               | A local container-based PostgreSQL verification cannot run on this machine unless Docker is installed.                                                   |
| `psql`     | Not detected               | No native local PostgreSQL client/server was detected.                                                                                                   |
| Yarn / Bun | Not detected               | Not used.                                                                                                                                                |

Official documentation checked on 2026-08-07 identifies Node 24 as LTS, Next.js 16 as the current supported major with a Node.js 20.9 minimum, React 19.2 as current, and Prisma ORM 7 as the supported production release with Node 24 support and required PostgreSQL driver adapters. Exact package versions will be resolved into the lockfile during installation rather than copied from the planning documents.

## Safety inspection

- A filename scan found no `.env`, key, certificate, package lock, generated asset, database, or credential file.
- A content scan outside `.git/` and `research-prototype/` found no matches for common private-key, AWS key, GitHub token, OpenAI-style token, or assigned-secret patterns.
- No merge-conflict markers were found.
- No unexpected binary or generated files were found.
- Existing documentation is internally consistent with an approved blueprint and a not-yet-started production application; active status documents may be updated, but historical research content will not be rewritten.

## Risks and constraints

1. **No baseline commit:** ownership and before/after review must rely on this inventory until the owner creates the first commit.
2. **No local PostgreSQL runtime:** real PostgreSQL tests can be configured and run in CI; local execution is environmentally blocked unless another reachable test PostgreSQL instance is supplied or Docker/PostgreSQL is installed.
3. **No production credentials or vendors:** this is intentional. Sprint 0 must not create production environments, deployments, provider accounts, or provider SDK integrations.
4. **PowerShell execution policy:** bare `npm` resolves to a blocked script; `npm.cmd` is the reliable local invocation.
5. **Dependency/network availability:** clean installation and browser download require access to package and Playwright distribution endpoints.
6. **Direction correctness:** the first HTTP response must set matching `lang` and `dir`; the implementation and browser tests must verify this without a client-only correction.
7. **Architecture erosion:** a small foundation can still normalize unsafe imports, so boundary checks must be executable from the first source files.

## Assumptions

- The application will live at the repository root because the root has no competing application and already holds project-wide documentation.
- Node 24 LTS is the supported runtime line; CI will exercise Node 24 and `package.json` will reject other major lines.
- npm is the supported package manager because it is bundled with the selected runtime and can generate a reproducible `package-lock.json` without another tool bootstrap.
- Plain CSS with custom-property design tokens is sufficient for this neutral shell and avoids a premature UI framework.
- A single technical-only database table is acceptable for the Prisma compatibility proof; it will not contain academic or user data.
- CI-hosted PostgreSQL is an acceptable real-database execution path when the local machine lacks PostgreSQL.

## Planned Sprint 0 changes

- Add a strict TypeScript Next.js App Router shell with `/ar` (default RTL) and `/en` (LTR) routes.
- Add public and application-placeholder shells only, with semantic, responsive, loading, error, not-found, focus, and reduced-motion foundations.
- Add modular-monolith directories and enforceable import boundaries.
- Add typed localization, configuration, validation, time, error, observability, persistence, and provider-adapter seams without feature or provider implementations.
- Add a minimal reviewed Prisma/PostgreSQL migration and generated-client/transaction/isolation integration proof.
- Add lint, format, type, unit, component, accessibility, browser E2E, secret-scan, audit, and CI foundations.
- Add the required ADRs and developer documentation.

The plan explicitly excludes authentication, accounts, onboarding, academic domain functionality, reminders, external providers, analytics, AI, storage, queues, payments, deployment, and production credentials.
