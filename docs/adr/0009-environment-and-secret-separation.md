# ADR 0009: Environment and secret separation

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

Client-bundled variables, server credentials, and destructive test targets have different trust boundaries. Sprint 0 is not authorized to create production credentials or environments.

## Decision

- Expose only explicitly named `NEXT_PUBLIC_*` values through the public parser.
- Parse server-only `DATABASE_URL` only where the database subsystem is invoked.
- Require `TEST_DATABASE_URL` for integration tooling, require its database name to include `test`, and reject equality with `DATABASE_URL`.
- Validate with Zod and report field-level issues without echoing credential values.
- Keep real `.env*`, certificates, and key files ignored; commit only fake local examples.
- Distinguish `local`, `test`, `preview`, and `production` modes in types without creating preview/production services.
- Run a repository secret scanner in CI and a separate dependency audit.

## Consequences

Missing required server/test configuration fails before database work and server values have no client import path. A future secret manager must feed the same typed boundary; it must not change application APIs.
