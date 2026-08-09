# ADR 0012: Authentication provider direction

- **Status:** Proposed
- **Date:** 2026-08-08

> Historical naming note: this evaluation was authored when StuPilot was named StudentHub AI. The former name is retained below to preserve the decision record.

## Context

Authentication belongs to Sprint 1 or later. No vendor is approved. Arabic/English custom-flow quality, account recovery, session controls, privacy, data location, and internal ownership mapping are material requirements for the Saudi undergraduate market.

## Evidence summary

The current official-document evaluation compares Clerk, Auth0, Supabase Auth, and Better Auth. The full evidence, limitations, prices, legal sources, and access dates are recorded in [the Sprint 1 authentication provider evaluation](../decisions/sprint-1-authentication-provider-evaluation.md).

Material findings:

- Clerk has strong Next.js/security/test ergonomics and hashed-password export, but Arabic localization is experimental, production RTL behavior was not verified, and regional residency is unavailable.
- Auth0 is mature and offers enterprise Private Cloud in Bahrain and UAE, but RTL is Early Access and regional deployment plus advanced controls are disproportionate for the MVP.
- Supabase Auth provides the best hosted balance of fully application-owned Arabic/RTL UI, core flows, App Router support, PostgreSQL-backed export, and MVP economics. It has no managed Middle East region, its recommended SSR package is beta, and production email/lifecycle operations remain StudentHub AI responsibilities.
- Better Auth offers the strongest application ownership and regional deployment flexibility, but moves password/session security, availability, email, monitoring, patching, and incident response onto StudentHub AI. Explicit Node 24 support was not verified.

## Proposal

Use **Supabase Auth as the primary MVP candidate**, only if a qualified Saudi privacy review accepts the selected non-Middle-East region and a disposable exact-runtime evaluation proves its server-side session path.

Use **Better Auth as the fallback** if the region/legal gate or technical gate fails. Keep the provider behind the existing identity adapter, preserve one internal opaque `users.id`, and maintain a replaceable `(provider, subject)` link. No provider ID or SDK type may enter domain/application ownership.

This proposal does not select or authorize either provider. Sprint 0 contains no auth route, middleware/proxy guard, account table, provider session, SDK, credential, or fake login.

## Decision gate

Before Sprint 1, the owner must approve a provider and cost envelope; a qualified review must accept Saudi PDPL/cross-border, DPA, subprocessor, retention, and deletion implications; and an explicitly authorized non-production evaluation must pass exact-runtime server-session and bilingual/RTL QA. Only a subsequent explicit owner authorization may begin Sprint 1 integration.
