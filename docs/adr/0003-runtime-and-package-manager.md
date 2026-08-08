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

## Consequences

Installations are reproducible and engine drift fails early. npm is a workflow choice, not an application dependency; switching requires an ADR and replacement—not coexistence—of lockfiles.

## References

- [Node.js release policy](https://nodejs.org/en/about/previous-releases)
- [Next.js installation requirements](https://nextjs.org/docs/app/getting-started/installation)
- [TypeScript 7.0 transition guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
