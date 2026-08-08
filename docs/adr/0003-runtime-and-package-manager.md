# ADR 0003: Runtime and package manager policy

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

Versions in planning documents can age. The local baseline had Node 24.14.0, npm 11.9.0, and pnpm 11.9.0; official documentation identifies Node 24 as LTS and confirms compatibility across Next.js, Prisma, Vitest, and Playwright.

TypeScript 7.0.2 is stable, but its initial native release deliberately does not expose the programmatic API still consumed by parts of the framework/lint ecosystem. ESLint 10 was also newer than the peer ranges of the current Next.js plugin chain.

## Decision

- Support Node `>=24 <25`, represented by `.nvmrc`, `engines`, and CI Node 24.
- Use npm 11 and declare `packageManager: npm@11.9.0`.
- Commit `package-lock.json`, use exact direct dependency versions, and use `npm ci` in CI.
- Use TypeScript 6.0.3 and ESLint 9.39.5 until the complete toolchain supports their next majors.
- Review patch/minor updates routinely and major updates through a compatibility PR/ADR amendment.

On this Windows machine, `npm.ps1` is blocked by execution policy; `npm.cmd` is the documented equivalent. The current local Node patch is compatible, while upgrading to the latest Node 24 patch is recommended.

## Runtime policy check — 2026-08-08

The official Node.js `latest-v24.x` release index identified **Node 24.18.1 (Krypton LTS)** as the current supported Node 24 patch on 2026-08-08. The Node 24 archive lists npm 11.16.0 for that release, and the official Node 22-to-24 migration guidance states that Node 24 receives updates through the end of April 2028.

The project configuration does not need a version change:

- `.nvmrc` contains `24`, so version managers resolve the newest installed/available patch within the approved major line;
- GitHub Actions uses `node-version: 24`, so hosted CI resolves the current Node 24 line when a remote run is authorized;
- `package.json` accepts Node `>=24.0.0 <25` and npm `>=11.0.0 <12`, which includes Node 24.18.1 and its bundled npm 11.16.0;
- every exact direct dependency either declares a Node engine range that contains 24.18.1 or does not declare a Node engine restriction.

The clean-snapshot verification in this closure ran on the locally installed Node 24.14.0 and passed. Node 24.18.1 compatibility is supported by the exact dependency engine metadata but was not executed locally because this task did not install another runtime. The local machine should be patched to 24.18.1 before relying on it for the next implementation sprint; GitHub-hosted CI will independently exercise the floating Node 24 policy after a remote push is separately authorized.

## Consequences

Installations are reproducible and engine drift fails early. npm is a workflow choice, not an application dependency; switching requires an ADR and replacement—not coexistence—of lockfiles.

## References

- [Node.js release policy](https://nodejs.org/en/about/previous-releases)
- [Latest Node 24 release index](https://nodejs.org/download/release/latest-v24.x/) — accessed 2026-08-08
- [Node 24 archive and bundled npm version](https://nodejs.org/en/download/archive/v24) — accessed 2026-08-08
- [Node.js v22 to v24 migration and support window](https://nodejs.org/en/blog/migrations/v22-to-v24) — accessed 2026-08-08
- [Next.js installation requirements](https://nextjs.org/docs/app/getting-started/installation)
- [TypeScript 7.0 transition guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
