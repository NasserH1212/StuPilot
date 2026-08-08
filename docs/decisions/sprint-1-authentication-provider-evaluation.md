# Sprint 1 authentication provider evaluation

- **Status:** Proposed; owner approval required
- **Evaluation date:** 2026-08-08 (Asia/Riyadh)
- **Evidence cutoff:** 2026-08-08
- **Scope:** Authentication direction only; no provider is installed, configured, connected, or approved for implementation by this document

## Decision summary

The proposed primary MVP choice is **Supabase Auth**, subject to two blocking gates:

1. a Saudi privacy review must explicitly accept the selected non-Middle-East managed region, the DPA, subprocessors, cross-border transfers, retention, and data-subject procedures; and
2. a disposable technical evaluation must prove the current Next.js App Router server-side session path, including the beta `@supabase/ssr` package, against StudentHub AI's exact runtime before production integration is authorized.

The proposed fallback is **Better Auth**, using StudentHub AI's own PostgreSQL deployment and application-owned Arabic/RTL interface. It becomes the preferred direction if managed Supabase region or legal terms are unacceptable, or if the server-side integration gate fails.

This is a recommendation, not a selected provider. ADR 0012 remains `Proposed`, Sprint 1 remains unauthorized, and no account, SDK, credential, database, or service may be created from this evaluation alone.

## Evaluation rules and product constraints

Only current first-party provider documentation and legal/pricing pages were used. Every source is listed with an access date. Where those sources did not establish a fact, the entry is **Not verified**. Marketing claims were not promoted into guarantees, and no legal conclusion is asserted.

The evaluation assumes the approved constraints already recorded by StudentHub AI:

- Arabic and RTL are first-class from the first authentication screen;
- the production runtime is Next.js 16.3.0, React 19.2.8, and Node 24 LTS;
- StudentHub AI owns a stable opaque `users.id` and does not use a provider subject as its domain identity;
- provider code remains behind the application-owned identity adapter established by ADR 0010;
- the MVP needs email/password registration, verification, recovery, server-validated sessions, logout/revocation, and abuse controls;
- optional MFA is evaluated but need not be in the smallest Sprint 1 scope;
- authentication must not start before an explicit owner decision.

## Comparative findings

### Core authentication and security

| Criterion                   | Clerk                                                                                                                     | Auth0                                                                                                                                                                            | Supabase Auth                                                                                                                                                                                         | Better Auth                                                                                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email/password registration | Supported through prebuilt components or custom flows.                                                                    | Supported through Auth0 database connections and Universal Login.                                                                                                                | Supported; hosted projects enable email authentication and confirmation by default.                                                                                                                   | Supported when explicitly enabled.                                                                                                                                                                                                                   |
| Email verification          | Supported by prebuilt and custom flows.                                                                                   | Supported as a Universal Login account flow.                                                                                                                                     | Supported with link/PKCE flows and configurable templates.                                                                                                                                            | Supported; StudentHub AI supplies the sending function.                                                                                                                                                                                              |
| Password recovery           | Supported by provider flows and custom UI APIs.                                                                           | Supported by Universal Login and customizable email templates.                                                                                                                   | Supported; production should use custom SMTP because the built-in sender is best-effort and limited.                                                                                                  | Supported; StudentHub AI supplies email delivery and templates.                                                                                                                                                                                      |
| Secure session handling     | Managed sessions, short-lived tokens, server-side App Router verification, configurable controls on paid plans.           | SDK-managed encrypted application session plus OIDC flows; the current Next.js quickstart exposes login, logout, callback, access-token refresh, and back-channel logout routes. | Short-lived JWT access token plus one-time refresh-token rotation; SSR stores sessions in cookies. Default sessions are indefinite and multi-device unless paid controls are configured.              | Database or secondary-storage sessions with seven-day default expiry, rotation/update policy, secure cookies, and optional stateless mode. StudentHub AI owns correct configuration and operation.                                                   |
| Session revocation          | User/device session management and revocation are supported.                                                              | Logout and back-channel logout are supported; the exact end-user device-session management experience required by StudentHub AI is **Not verified**.                             | Sign-out and security-sensitive actions terminate sessions; time-box, inactivity, and single-session controls require Pro. Revocation is observed no later than token refresh/JWT expiry.             | List, revoke one, revoke others, or revoke all sessions; password change can revoke other sessions.                                                                                                                                                  |
| Optional MFA                | TOTP, SMS, and backup codes; production MFA is Pro.                                                                       | Pro MFA is included from Essentials; exact factor availability varies by tier.                                                                                                   | TOTP/basic MFA is included; phone MFA is a paid add-on. Enrollment/challenge APIs support an application-owned UI.                                                                                    | Two-factor plugin supports TOTP and backup codes; StudentHub AI owns enrollment UX, recovery, monitoring, and support.                                                                                                                               |
| Webhooks/events             | Signed webhooks include user create/update/delete. Delivery is retryable but not guaranteed and is eventually consistent. | Event Streams and log streams are available with plan limits. Exact delivery semantics for every user lifecycle event are **Not verified**.                                      | Auth Hooks alter selected pre-auth/token/email/SMS stages; a general durable post-user-lifecycle webhook contract is **Not verified**. PostgreSQL triggers are possible but are application-operated. | Request and database lifecycle hooks are available, but a managed durable webhook/event-delivery service is **Not verified** for the self-hosted framework.                                                                                          |
| Abuse and rate limits       | Built-in bot/attack protection, account lockout, breached-password controls, and documented frontend/backend limits.      | Basic brute-force and suspicious-IP protections are included; enhanced protection is plan-gated. Limits vary by tenant, plan, and endpoint.                                      | Endpoint rate limits plus optional hCaptcha/Turnstile; built-in email is only two messages/hour. Leaked-password and some session controls are paid.                                                  | Built-in per-IP rate limiting is enabled in production, with stricter sign-in/MFA defaults. In-memory storage is unsuitable for multi-instance/serverless production, so StudentHub AI must provide durable storage and additional abuse monitoring. |

### Arabic/RTL, framework, and testing fit

| Criterion                                       | Clerk                                                                                                                                                             | Auth0                                                                                                                                                                                | Supabase Auth                                                                                                                                                    | Better Auth                                                                                                                                                                                |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Custom authentication UI                        | Prebuilt UI or fully custom flows through Clerk APIs.                                                                                                             | Hosted Universal Login is preferred and customizable; embedded/custom forms increase security work and do not remove the hosted authorization flow.                                  | API-first; StudentHub AI can own all screens. Optional drop-in components are not required.                                                                      | Framework/API-first; StudentHub AI owns all screens.                                                                                                                                       |
| Arabic localization and full custom Arabic copy | `ar-SA` exists and strings/errors can be overridden, but the localization feature is explicitly experimental.                                                     | Standard, Egyptian, and Saudi Arabic locales exist; prompt text can be customized per supported language. Some surfaces, such as consent, have localization limits.                  | The app owns every screen and can own every Arabic string. Email templates are customizable. Provider error-code mapping remains StudentHub AI's responsibility. | The app and its chosen email provider own every Arabic string. No provider-hosted localization dependency is required.                                                                     |
| RTL compatibility                               | An explicit, production-grade RTL guarantee was **Not verified**. Arabic prebuilt UI must be tested at 320px, desktop, keyboard, zoom, and error/recovery states. | RTL is explicitly Early Access and requires Auth0 Support. Custom page templates must set `dir`; production acceptance is blocked on an Arabic/RTL test.                             | RTL is controlled by StudentHub AI's existing app shell and custom forms; no hosted auth layout is imposed. Auth emails still need bidi testing.                 | RTL is controlled by StudentHub AI's existing app shell and custom forms; auth emails still need bidi testing.                                                                             |
| Next.js App Router                              | First-class App Router server helpers, Route Handlers, Server Components, and Server Actions.                                                                     | Current Next.js SDK quickstart supports Next.js 15.2.4+ and Route Handlers; first-party App Router guidance exists.                                                                  | First-party Next.js App Router quickstart and cookie-based auth.                                                                                                 | First-party Next.js integration includes App Router route handlers, RSC, Server Actions, and explicit Next.js 16 proxy guidance.                                                           |
| React and current runtime                       | React hooks and Next.js support are documented. Explicit certification of StudentHub AI's exact React 19.2.8/Node 24.18.1 combination is **Not verified**.        | React hooks and Next.js 15.2.4+ are documented. Exact Next.js 16.3.0/React 19.2.8/Node 24.18.1 certification is **Not verified**.                                                    | JavaScript/React clients and App Router are documented. Exact Next.js 16.3.0/React 19.2.8/Node 24.18.1 certification is **Not verified**.                        | Next.js 16 and React client integration are documented. An explicit Node 24 support declaration is **Not verified**.                                                                       |
| Test/development environments                   | Separate development and production instances; development is capped at 100 users and cannot be promoted to production. Testing Tokens and test guidance exist.   | Free has one tenant; Essentials includes separate production/development environments. A provider-supported equivalent to local/offline authentication fixtures is **Not verified**. | Local Docker/CLI stack, Mailpit for email, and separate hosted projects are available; local development is not feature-complete. `@supabase/ssr` remains beta.  | Runs locally against an isolated test database and provides test-only utilities for user/session factories, Playwright cookies, and OTP capture. StudentHub AI owns isolation and cleanup. |

### Portability, legal, cost, and operating model

| Criterion                              | Clerk                                                                                                                                                                                                                                  | Auth0                                                                                                                                                                                                                                                       | Supabase Auth                                                                                                                                                                                                                                                    | Better Auth                                                                                                                                                                                                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User export and migration              | Dashboard CSV export includes hashed passwords; Backend API and documented import/migration paths exist. Development data cannot move to production.                                                                                   | Import and export/Management API paths exist. Whether all credential hashes can be exported in a form accepted by the fallback is **Not verified**.                                                                                                         | User data can be extracted from `auth.users` and `auth.identities`; pricing states user-data ownership. Credential-hash portability into every fallback is **Not verified**.                                                                                     | Auth tables are in StudentHub AI's database; schema generation and documented Clerk/Supabase migration guides exist. Migration correctness remains StudentHub AI's responsibility.                                                                                                              |
| Vendor lock-in                         | Medium-high: hosted subject/session semantics and components are proprietary, although user and hash export reduces exit cost.                                                                                                         | High: hosted tenant, Universal Login, Actions, event, and plan-specific features create substantial coupling.                                                                                                                                               | Medium: open PostgreSQL data and app-owned UI reduce UI/data lock-in, but GoTrue behavior, JWT/session semantics, managed `auth` schema, and beta SSR client remain provider coupling.                                                                           | Low vendor lock-in but high framework/operations coupling: data and UI are owned, while StudentHub AI assumes upgrades, migrations, email, security, and availability.                                                                                                                          |
| Data storage and regions               | Clerk states no regional residency or region selection; its primary storage and listed subprocessors are US-based.                                                                                                                     | Public-cloud Middle East availability is **Not verified**. Enterprise Private Cloud on AWS supports customer-selected data residency including Bahrain and UAE.                                                                                             | Each hosted project has one selected AWS region. Current managed regions include Frankfurt and Mumbai but no Saudi Arabia, Bahrain, UAE, or other Middle East region. Changing region requires a new project and migration.                                      | Stored in StudentHub AI's selected PostgreSQL/secondary-storage region. Actual Saudi or Middle East suitability depends on the separately selected hosting, backup, email, logging, and monitoring providers.                                                                                   |
| Privacy and subprocessors              | Public DPA defines Clerk as processor/subprocessor for customer data and permits processing where Clerk/subprocessors operate; a current subprocessor list is published. Saudi PDPL suitability is not established by those documents. | Auth0/Okta describes itself as processor and offers DPA/compliance material; Private Cloud points to current Trust & Compliance subprocessor information. Saudi PDPL suitability and the complete current applicable subprocessor set are **Not verified**. | Supabase DPA treats Supabase as processor/service provider and lists subprocessors; selected-region storage does not eliminate all cross-border processing. Saudi PDPL suitability is **Not verified**.                                                          | The self-hosted framework does not need Better Auth Infrastructure to store end-user auth data. If its optional infrastructure is used, Better Auth acts as processor under its legal terms. The full current named subprocessor/location list and Saudi PDPL suitability are **Not verified**. |
| Pricing/free limits                    | Hobby: $0, 50,000 monthly retained users/app, fixed seven-day sessions, no production MFA, no custom email templates. Pro: $20/month annual or $25 monthly, 50,000 MRU included, then published per-MRU rates beginning at $0.02.      | Free: $0 up to 25,000 monthly active users. At the displayed 500 MAU level, Essentials is $35/month and Professional $240/month; security/customization capabilities are tiered and prices scale with MAU.                                                  | Free: 50,000 MAU, two active projects, 500 MB DB, projects pause after one inactive week, one-hour auth logs, no leaked-password/session controls. Pro starts at $25/month, includes 100,000 MAU, then $0.00325/MAU plus database, compute, egress, and add-ons. | Framework is free/open source. StudentHub AI pays database, compute, backups, email/SMS, monitoring, on-call, and security work. Optional Better Auth Infrastructure Starter is free and Pro is $20/month with metered logs, detections, email, and SMS.                                        |
| Growth cost risk                       | Retained-user billing can become expensive for a large, frequently returning, low-revenue student audience; 100,000 billable MRU would incur material overage.                                                                         | Paid tiers begin at low displayed MAU counts and advanced security/private regional deployment can force Professional/Enterprise procurement. Exact large-volume price is quote/configuration dependent.                                                    | Auth MAU overage is low, but total platform spend includes compute, database, egress, logs, SMTP, backups, and optional phone MFA; coupling auth and database can magnify migration cost.                                                                        | Cash vendor fees can be lower, but engineering/on-call/security opportunity cost and incident exposure rise with usage. This is not “free authentication.”                                                                                                                                      |
| Saudi Arabia / Middle East suitability | Arabic locale is promising, but experimental localization, unverified RTL behavior, and US-only processing are material blockers without legal acceptance.                                                                             | Arabic is present, but RTL is Early Access. Bahrain/UAE residency is verified only for enterprise Private Cloud, making it disproportionate for the MVP unless residency is mandatory and budget is approved.                                               | Best hosted fit for fully owned Arabic/RTL and MVP economics, but no managed Middle East region. It is suitable only if a qualified review accepts the chosen cross-border region and measured latency.                                                          | Best control over Arabic/RTL and potential regional placement, but suitability depends on an approved regional infrastructure stack and the team's ability to operate authentication securely.                                                                                                  |
| Operations retained by StudentHub AI   | UI QA, internal identity sync, webhook reconciliation, authorization, provider configuration, email branding, support, privacy/DSAR, monitoring, and incident response coordination.                                                   | Same, plus tenant/Actions/Universal Login configuration and more complex plan/procurement administration.                                                                                                                                                   | All UI/error localization, SSR cookie correctness, SMTP, CAPTCHA, identity sync, RLS boundaries if used, project/DB operations shared with Supabase, support, privacy, and incident coordination.                                                                | Password/session configuration, migrations, secrets/rotation, database/backup/HA, SMTP deliverability, abuse defense, monitoring, patching, incident response, support, and privacy.                                                                                                            |
| Map to internal `users.id`             | Yes through a unique `(provider, subject)` identity link to an internal UUID; never use the Clerk ID as domain ownership.                                                                                                              | Same pattern using the OIDC `sub`.                                                                                                                                                                                                                          | Same pattern even though `auth.users.id` is already a UUID; do not make provider ownership indistinguishable from StudentHub AI ownership.                                                                                                                       | Can generate/use UUIDs and map its auth user to internal `users.id`; separate identity linkage remains preferred for provider replaceability.                                                                                                                                                   |
| Existing identity adapter              | Compatible if all SDK calls, token/session parsing, and provider event handling remain in infrastructure.                                                                                                                              | Compatible under the same constraint.                                                                                                                                                                                                                       | Compatible if Supabase SDK, JWT/session, and `auth` schema details do not enter domain/application code.                                                                                                                                                         | Compatible if Better Auth remains an infrastructure implementation rather than becoming the domain user model.                                                                                                                                                                                  |

## Provider-specific evaluation

### Clerk

Clerk has the fastest modern Next.js integration, strong built-in attack protection, practical development/test support, signed lifecycle webhooks, and an unusually useful exit export that includes hashed passwords. Its `ar-SA` localization can override component and error text.

It is not the primary recommendation because the localization system is experimental, an explicit production RTL guarantee was not found, and Clerk states that regional residency is unavailable and processing is US-based. Those are disproportionate risks for an Arabic-first Saudi student product. If future regional hosting and stable RTL support appear, Clerk should be re-evaluated rather than permanently excluded.

### Auth0

Auth0 is the most mature enterprise identity option in the set. It offers broad security controls, imports/exports, event/log streams, paid environment separation, a current Next.js SDK, Arabic variants, and Private Cloud residency in Bahrain and UAE.

It is not the MVP recommendation because RTL is still Early Access, requires support enablement, and has known localization limitations. Middle East residency is verified only for enterprise Private Cloud, while self-service pricing places important controls in increasingly expensive tiers. Auth0 remains a viable later-stage regulated/enterprise option if budget and procurement requirements change.

### Supabase Auth

Supabase Auth is the proposed primary because it satisfies the core flows while allowing StudentHub AI to own the entire Arabic/RTL interface, error mapping, and content; it provides a first-party App Router path; it stores auth data in PostgreSQL that can be inspected/exported; and its MVP/growth price is comparatively transparent.

The proposal is deliberately conditional. No managed Middle East region is listed. The recommended SSR package is beta and may break. Built-in production email is not sufficient, lifecycle event delivery is weaker than a dedicated webhook product, and using Auth can pull the product toward broader Supabase platform coupling. StudentHub AI must use Supabase only behind its identity adapter, retain its own user identity, select custom SMTP before production, and avoid adopting unrelated Supabase services by implication.

### Better Auth

Better Auth is the proposed fallback because it gives StudentHub AI direct control over auth data location, schema, Arabic/RTL UI, email content, sessions, and migration. It documents Next.js 16 integration, a Prisma adapter, rate limits, revocation, MFA, and strong test utilities. It also provides documented migration examples from Clerk and Supabase.

That control transfers security and reliability responsibility to StudentHub AI. Durable distributed rate limiting, email deliverability, password/session policy, database availability, secret rotation, patching, monitoring, incident response, and user support become first-party obligations. Explicit Node 24 support was not verified. Better Auth should therefore be used only if StudentHub AI accepts and staffs the operating burden or if regional-control requirements outweigh it.

## Proposed architecture and internal ownership

The provider authenticates a credential; StudentHub AI owns the user and product account.

At integration time, a future reviewed migration should introduce an application-owned link equivalent to:

```text
internal users.id (UUID)
  <- identity link: provider + immutable provider subject (unique)
  <- optional normalized verified-email snapshot for display/recovery coordination
```

The provider subject must never become a foreign key throughout academic data. A verified email is not an immutable identity key and must not silently merge accounts. Identity creation/linking must be idempotent, transactional where possible, and safe under event retries and concurrent first login.

StudentHub AI must continue to own:

- `users.id`, account lifecycle state, locale, consent/privacy records, and product profile;
- authorization and ownership decisions for terms, courses, items, reminders, and future data;
- all Arabic/English UI copy, `lang`/`dir`, validation mapping, accessibility, and analytics-free error states;
- provider-neutral identity/session interfaces used by application code;
- DSAR/account-deletion orchestration, audit evidence, support procedures, and incident response;
- secrets policy, environment separation, test fixtures, monitoring, and reconciliation;
- an export and exit runbook tested before material scale.

The provider may own only credential verification, provider session/token mechanics, verification/recovery tokens, optional MFA factors, and provider-required security telemetry.

## Exit and migration strategy

Before production launch, the approved provider implementation should include a provider-neutral exit plan:

1. Keep one internal UUID and a replaceable external identity link; do not spread provider IDs or SDK types outside infrastructure.
2. Store only the minimum provider data needed for authentication and reconciliation.
3. Document and test a periodic user/identity export in a non-production environment.
4. Confirm whether password hashes can be exported and accepted by Better Auth. This is **Not verified** for Supabase Auth; if it fails, the exit plan must use a staged password-reset campaign rather than claim seamless credential migration.
5. Build a dry-run migration that reports source count, target count, conflicts, unverified addresses, MFA loss, and checksum/reconciliation evidence.
6. During a future authorized cutover, freeze identity mutations briefly, perform the final export/import, invalidate old sessions, verify sampled accounts, switch the identity-adapter configuration, monitor, and retain rollback evidence according to the approved retention policy.
7. Delete provider data only after legal/retention review, owner approval, successful cutover, and expiration of the rollback window.

No dual-provider runtime or migration code is authorized now.

## Minimal Sprint 1 integration scope after approval

If and only if the owner approves a provider and Sprint 1, the smallest integration should contain:

- provider dependency and typed environment validation;
- one infrastructure identity adapter and server-side session verifier;
- internal `users.id` plus an external identity link created idempotently;
- app-owned Arabic/RTL and English/LTR registration, sign-in, verification-pending, recovery-request, reset, logout, and safe error/rate-limit screens;
- verified-email/password flows only; no social login, phone login, organizations, roles, billing, or provider-hosted profile product;
- server-side protection of the application workspace and mutation routes;
- current-user, logout, revoke-session/revoke-all support required for account safety;
- test-only identity fixtures or a dedicated isolated test environment;
- unit, component, accessibility, browser, session, abuse/error, and identity-link race/retry tests;
- privacy/configuration checklist, export test, operational runbook, and rollback procedure.

Optional MFA can be planned behind a separate acceptance gate after the core flows work; it is not required to enlarge the first integration slice. Onboarding and every academic feature remain outside this decision.

## Decision gates

The owner must resolve all of the following before implementation:

1. **Provider decision:** approve Supabase Auth, choose Better Auth, request another evaluation, or reject both.
2. **Saudi privacy gate:** obtain a qualified review of Saudi PDPL obligations, cross-border transfer basis, selected region, DPA, subprocessors, retention, deletion, breach notice, and any under-age user implications. This document is not legal advice.
3. **Technical gate:** authorize a disposable, non-production compatibility evaluation using the exact locked runtime; require server validation, cookie behavior, Arabic/RTL, recovery, error, and test automation evidence.
4. **Commercial gate:** approve the expected plan, SMTP, support, logs, backup, and growth-cost envelope; do not rely on a free tier as the production operating model.
5. **Operational gate:** name ownership for auth incidents, user support, provider status monitoring, account recovery, DSAR/deletion, exports, secrets, and emergency revocation.

Until all applicable gates pass and the owner explicitly authorizes Sprint 1, ADR 0012 stays `Proposed` and no authentication work begins.

## Official sources

Every source below was accessed on **2026-08-08**.

### Clerk

- [Next.js App Router `auth()`](https://clerk.com/docs/reference/nextjs/app-router/auth)
- [Next.js SDK overview](https://clerk.com/docs/reference/nextjs/overview)
- [Next.js App Router quickstart](https://clerk.com/docs/nextjs/getting-started/quickstart)
- [Localization, including `ar-SA` (experimental)](https://clerk.com/docs/guides/customizing-clerk/localization)
- [Routing and email verification](https://clerk.com/docs/guides/how-clerk-works/routing)
- [Webhooks and user-data synchronization](https://clerk.com/docs/guides/development/webhooks/syncing)
- [Rate limits](https://clerk.com/docs/guides/how-clerk-works/system-limits)
- [Security and attack protection](https://clerk.com/docs/guides/secure/overview)
- [Account lockout](https://clerk.com/docs/guides/secure/user-lockout)
- [Testing](https://clerk.com/docs/guides/development/testing/overview)
- [Development and production instances](https://clerk.com/docs/guides/development/managing-environments)
- [Migration and export](https://clerk.com/docs/guides/development/migrating/overview)
- [Pricing](https://clerk.com/pricing)
- [Data Processing Addendum](https://clerk.com/legal/dpa)
- [Subprocessors](https://clerk.com/legal/subprocessors/)
- [Security and data-residency statement](https://clerk.com/articles/clerk-security-how-we-protect-your-users)

### Auth0

- [Next.js SDK quickstart](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Next.js App Router guide](https://developer.auth0.com/resources/guides/web-app/nextjs/basic-authentication)
- [Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login)
- [Universal Login localization and RTL status](https://auth0.com/docs/customize/internationalization-and-localization/universal-login-internationalization)
- [Custom Universal Login text](https://auth0.com/docs/customize/login-pages/universal-login/customize-text-elements)
- [Universal Login page templates](https://auth0.com/docs/customize/login-pages/universal-login/customize-templates)
- [Attack protection](https://auth0.com/docs/secure/attack-protection)
- [Rate-limit policy](https://auth0.com/docs/troubleshoot/customer-support/operational-policies/rate-limit-policy)
- [Bulk user imports](https://auth0.com/docs/manage-users/user-migration/bulk-user-imports)
- [Private Cloud on AWS and data-center locations](https://auth0.com/docs/deploy-monitor/deploy-private-cloud/private-cloud-on-aws)
- [GDPR roles, data, export, and deletion responsibilities](https://auth0.com/docs/secure/data-privacy-and-compliance/gdpr)
- [Security, privacy, and compliance](https://auth0.com/docs/secure/data-privacy-and-compliance)
- [Okta Data Processing Addendum](https://www.okta.com/content/dam/okta---digital/en_us/legal/data-processing-addendum-2025-01.pdf)
- [Pricing](https://auth0.com/pricing)

### Supabase Auth

- [Auth overview](https://supabase.com/docs/guides/auth)
- [Next.js App Router quickstart](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Server-side rendering and beta `@supabase/ssr`](https://supabase.com/docs/guides/auth/server-side)
- [Password authentication, confirmation, recovery, SMTP, and local Mailpit](https://supabase.com/docs/guides/auth/passwords)
- [User sessions](https://supabase.com/docs/guides/auth/sessions)
- [Multi-factor authentication](https://supabase.com/docs/guides/auth/auth-mfa)
- [Rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- [CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha)
- [Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)
- [User management and export](https://supabase.com/docs/guides/auth/managing-user-data)
- [Local development and its limitations](https://supabase.com/docs/guides/local-development/database-migrations)
- [Available regions](https://supabase.com/docs/guides/platform/regions)
- [Changing project region](https://supabase.com/docs/guides/troubleshooting/change-project-region-eWJo5Z)
- [Security](https://supabase.com/docs/guides/security)
- [Data Processing Addendum](https://supabase.com/downloads/docs/Supabase%2BDPA%2B260601.pdf)
- [Pricing](https://supabase.com/pricing)

### Better Auth

- [Installation](https://better-auth.com/docs/installation)
- [Email verification and password recovery](https://better-auth.com/docs/concepts/email)
- [Email/password authentication](https://better-auth.com/docs/authentication/email-password)
- [Next.js integration and Next.js 16 compatibility](https://better-auth.com/docs/integrations/next)
- [Session management and revocation](https://better-auth.com/docs/concepts/session-management)
- [Security reference](https://better-auth.com/docs/reference/security)
- [Rate limiting](https://better-auth.com/docs/concepts/rate-limit)
- [Database ownership, migrations, IDs, and hooks](https://better-auth.com/docs/concepts/database)
- [Prisma adapter](https://better-auth.com/docs/adapters/prisma)
- [Plugins, including two-factor authentication](https://better-auth.com/docs/plugins)
- [Testing utilities](https://better-auth.com/docs/plugins/test-utils)
- [Migration from Clerk](https://better-auth.com/docs/guides/clerk-migration-guide)
- [Migration from Supabase Auth](https://better-auth.com/docs/guides/supabase-migration-guide)
- [Pricing](https://better-auth.com/pricing)
- [Privacy policy](https://better-auth.com/legal/privacy)
- [Terms and DPA availability](https://better-auth.com/legal/terms)
