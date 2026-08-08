# ADR 0011: Initial hosting evaluation plan

- **Status:** Proposed
- **Date:** 2026-08-07

## Context

The blueprint prefers a low-operations Next.js host but Sprint 0 does not authorize deployment, production credentials, or a final hosting/managed-PostgreSQL vendor. Application and database region choices affect latency, privacy, backup, and incident recovery.

## Proposal

Before deployment authorization, compare at least the preferred managed Next.js path and a portable Node/container path using current official evidence and a small non-production proof. Gate the decision on:

- supported Next.js features without proprietary application APIs;
- a suitable region and measured application-to-database latency;
- environment/secret controls and access logging;
- preview isolation and safe migration execution;
- backups, restore/PITR evidence, export, and deletion;
- logs/metrics/traces, incident access, quotas, cost model, and exit procedure;
- Saudi legal/privacy review appropriate to the data actually collected.

Vercel remains a candidate from the blueprint, not an accepted vendor. No host, managed database, domain, or deployment is created by this ADR.

## Decision gate

Accept a provider only after the evaluation evidence, owner approval, a non-production restore rehearsal, and confirmation that provider-specific code stays in infrastructure/configuration.
