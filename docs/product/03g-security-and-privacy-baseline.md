# StuPilot — Security and Privacy Baseline

**Deliverable:** 3G  
**Version:** 1.0  
**Date:** 5 August 2026  
**Status:** Minimum production baseline; not legal advice or a compliance claim

## 1. Security objective

Protect each student's account and academic data against unauthorized access, accidental disclosure, loss, corruption, and abusive automation while keeping the MVP operable by a small team.

The non-negotiable security property is:

> An authenticated user can read and change only data owned by that internal user ID, except for explicitly public system content—which the MVP does not currently define.

## 2. Standards and review basis

- Use the current [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) as a verification checklist, targeting the practical baseline level for an internet-facing application.
- Use relevant [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) guidance for authentication, sessions, password reset, CSRF, logging, rate limiting, file upload later, and secrets.
- Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), including accessible authentication.
- Follow the selected providers' official security/configuration guidance and PostgreSQL privilege/backup guidance.

This document does not assert PDPL, GDPR, or other legal compliance. Launch countries, controller identity, data region, and legal basis determine the review required before production.

## 3. Threat model summary

| Asset | Main threats | Primary controls |
|---|---|---|
| Account | Credential stuffing, reset abuse, session theft | Managed auth, verification, rate limits, secure cookies, revocation, MFA for operators |
| Academic data | IDOR/BOLA, missing ownership predicate, insecure cache | Internal user ID, scoped repositories, composite FKs, adversarial tests, private caching |
| Deadlines/schedules | Accidental bulk edit, race, duplicate request, time-zone error | Scope confirmation, transactions, optimistic concurrency, idempotency, invariant tests |
| Secrets/providers | Repository leak, client exposure, excessive privilege | Secret store, environment separation, rotation, least privilege, startup validation |
| Availability | Bot abuse, expensive queries, provider outage | Rate limits, bounded queries, timeouts, health/alerts, degradation policy |
| Logs/telemetry | Sensitive academic text or identifiers captured | Allow-list logging, redaction, retention, restricted access |
| Supply chain | Malicious/vulnerable dependency, compromised CI | Lockfile, minimal dependencies, scans, reviewed updates, protected CI secrets |
| Admin operations | Broad database access, silent export, unsafe migration | MFA, named access, audit, break-glass process, migration separation, backups |

## 4. Data classification

| Class | Examples | Rules |
|---|---|---|
| Restricted credentials | Password hashes if owned, tokens, cookies, API keys, reset secrets | Never log; strong secret storage/encryption; narrow access; short retention |
| Personal | Email at identity provider, optional display name, university/major, IP where logged | Purpose-limited, disclosed, minimized, retained by policy |
| Private academic | Terms, courses, class times, item titles/deadlines/status | User-only; never public; redact from telemetry/support by default |
| Security metadata | Audit event, auth failure, correlation ID, session metadata | Restricted operational access and defined retention |
| Public/system | Marketing copy, localization strings, status content | May be cached publicly after review |

Grades, academic files, LMS credentials, payments, and AI prompts are not collected in MVP.

## 5. Identity and session baseline

- Prefer a managed auth provider; do not build cryptographic auth primitives.
- Verify email before establishing normal account access unless the selected risk policy explicitly allows a constrained state.
- Password policy favors sufficient length, paste/password-manager support, breached-password/abuse defenses where provider supports them, and no arbitrary composition rules that harm accessibility.
- Recovery responses do not reveal account existence; tokens are single-use, time-limited, and invalid after use.
- Password reset revokes other sessions under the approved policy.
- Session cookies are `HttpOnly`, `Secure`, and use an appropriate `SameSite`; session lifetime/rotation is documented.
- Sensitive changes require recent authentication.
- Provider webhook events require signature verification, timestamp/replay protection, and idempotency.
- Operator accounts on hosting, database, auth, DNS, email, and observability require MFA and individual access—no shared credentials.

## 6. Authorization and ownership controls

1. Resolve provider identity to internal `users.id` on the server.
2. Pass that ID explicitly into every domain use case and repository.
3. Query by `(user_id, resource_id)`, never resource ID alone.
4. Enforce same-owner relationships with composite database constraints.
5. Return a non-disclosing not-found/forbidden response for non-owned IDs.
6. Never accept a client-supplied `user_id` as authority.
7. Never authorize using email, university, course code, route visibility, or object UUID entropy.
8. Clear/invalidate protected caches on logout, session expiry, and account switch.
9. Test every CRUD operation by substituting user B's ID into user A's authenticated request.
10. No support/admin impersonation feature in MVP.

Optional PostgreSQL RLS can add defense in depth only after connection-context and backup behavior are proven. It does not replace the rules above.

## 7. Input, output, and browser controls

- Validate type, length, format, enum, dates, time zones, recurrence bounds, and relationship ownership on the server.
- Parameterize all SQL through ORM/query tooling; raw SQL must use parameters and review.
- Render user text as text, not HTML. Rich text is outside MVP.
- Use framework escaping, a restrictive Content Security Policy, security headers, and no unsafe inline script unless nonces/hashes are deliberately configured.
- Apply CSRF protection appropriate to cookie-based mutations; check origin/host for sensitive endpoints where applicable.
- Set clickjacking protection via CSP `frame-ancestors`; define referrer and permissions policies.
- CORS is deny-by-default; same-origin web does not need broad cross-origin access. Future mobile API gets an explicit client/auth design.
- Uploaded files do not exist in MVP. Later files require content/size/type limits, malware scanning, private buckets, presigned URLs, and download authorization.

## 8. Business-integrity controls

Security includes preventing harmful valid-looking mutations:

- reschedule command cannot update deadline fields;
- deadline edit is explicit and tested separately;
- single-occurrence edit cannot update series pattern;
- series-wide edit previews scope and uses a transaction;
- complete/reopen has consistent status/timestamp constraints;
- duplicate creates use idempotency;
- stale edits return conflict instead of last-write-wins data loss;
- reminder retries cannot create duplicate notification state;
- time-zone conversion is centralized and tested.

## 9. Rate limiting and abuse prevention

- Layer provider/WAF controls with application limits for registration, login, recovery, resend, and authenticated mutations.
- Combine IP and normalized account identifiers without exposing whether an account exists.
- Limit request body size and bounded date ranges; no unbounded series expansion or list export.
- Apply endpoint-specific burst/sustained limits and return localized retry guidance.
- Protect cron/webhook endpoints independently from user sessions.
- Monitor repeated cross-owner IDs, abnormal object enumeration, reset storms, and high error rates.
- CAPTCHA or additional challenges are escalation controls, not mandatory friction for every user.

## 10. Secrets, encryption, and access

- TLS in transit for browser, providers, and PostgreSQL.
- Provider-managed encryption at rest is verified contractually/configurationally; highly sensitive secrets use provider secret storage.
- No secret in Git, Markdown, issue text, client bundle, screenshot, test fixture, analytics, or log.
- Separate credentials by environment and service; runtime DB role is least privileged and differs from migration role.
- Maintain a secret rotation/revocation runbook and inventory.
- Production access is least-privileged, time-bounded where available, MFA-protected, and reviewed.
- Break-glass access requires reason, approval where feasible, audit, and post-event review.

## 11. Logging, audit, and observability privacy

Allow-list structured fields. Never log:

- passwords, reset/verification/session tokens, cookies, authorization headers;
- email bodies or provider payloads containing credentials;
- academic item titles/details, course names, optional university/major;
- raw form bodies, database rows, or full URLs containing secrets;
- unnecessary full IP/user-agent values.

Security audit events are append-only and minimal. Application logs and audit logs have separate purposes and retention. Error-reporting breadcrumbs, replay, DOM capture, and network-body capture are disabled unless explicitly reviewed; session replay is outside MVP.

## 12. Privacy product requirements

### Transparency and choice

- Publish accurate privacy notice, terms, support/complaint contact, controller/business identity, provider categories, purposes, retention, rights, and international transfers before launch.
- University and major are optional and clearable.
- Product analytics, if used, follows an owner-approved consent/legitimate-purpose policy and data minimization.
- No advertising, sale of data, university sharing, or AI training use is implied.

### User rights and lifecycle

- Account settings provide an authenticated deletion request.
- Support has a documented process for access, correction, deletion, complaint, and identity verification proportional to risk.
- Deletion covers domain data, auth identity, email/suppression limits, telemetry where linkable, and future providers; exceptions are disclosed.
- Backup aging and restore re-deletion are documented.
- Export is not an approved MVP feature, but the operator must be able to fulfill legally required access/export without exposing another user.

### Children and geography

The product direction does not define an age threshold or launch countries. The owner must decide launch eligibility and obtain appropriate legal advice before public registration. Do not silently carry the archived research program's `18+ Saudi participant` rule into product accounts.

## 13. Retention baseline requiring approval

| Data | Proposed baseline | Owner/legal decision needed |
|---|---|---|
| Active account/domain data | While account active | Purpose and jurisdiction |
| Soft-deleted items | 30 days | Recovery need versus minimization |
| Account-deletion grace | 14 days | Whether immediate deletion is required/available |
| Security audit | 12 months | Incident/legal need |
| App logs/errors | 30–90 days | Vendor plan and minimization |
| Provider auth/session data | Provider policy plus configured expiry | Vendor terms/region |
| Database backups/PITR | Provider tier; shortest period meeting RPO/RTO | Backup/legal policy |
| Email delivery metadata | Minimum needed for deliverability/security | Provider policy |

All values are proposals. No production collection begins until the schedule is approved and reflected in notices and provider configuration.

## 14. Vendor security review

Before selecting auth, hosting, database, email, observability, analytics, or future storage:

- data locations/subprocessors and transfer terms;
- encryption, access controls, MFA, incident notification;
- backups/deletion/export and account termination;
- security/compliance evidence relevant to launch markets;
- availability/support and breach history review;
- pricing/limits and exit plan;
- SDK telemetry/default data capture;
- least-privilege keys and environment isolation.

Record decision, reviewer, date, evidence links, risks, and renewal date. Marketing pages alone are insufficient evidence.

## 15. Secure development lifecycle

- Protected main branch and reviewed changes.
- Lockfile committed; minimal dependencies; automated dependency/license/secret scanning.
- Static analysis, type checking, tests, and production build in CI.
- Threat review for auth, ownership, recurrence bulk edits, account deletion, reminders, and every new provider.
- No production data in local/CI/preview.
- Migrations reviewed for data loss and privilege; restore tested.
- Security defects have severity and response targets; exploitable ownership/auth issues block release.
- Dependency updates are regular and tested, not ignored until a major release.

## 16. Incident response minimum

1. Detect and create an incident record outside public logs.
2. Triage scope, data, users, environments, and active threat.
3. Contain: revoke keys/sessions, disable route/provider, block abuse, preserve necessary evidence.
4. Eradicate and patch with reviewed deployment.
5. Recover and verify ownership/data integrity.
6. Notify owner and obtain legal guidance for user/regulator obligations.
7. Conduct blameless post-incident review and track controls.

Maintain current contacts for hosting, auth, database, email, DNS, and legal counsel. Test the runbook before launch.

## 17. Release-blocking security tests

- Registration/login/recovery abuse and enumeration checks.
- Session expiry/logout/reset/revocation.
- Cross-user read/create/update/delete for every owned domain.
- Composite FK attempts linking different owners.
- CSRF/origin/CORS/security-header checks.
- XSS payloads in every user text field.
- SQL injection probes at raw/query boundaries.
- Rate-limit and oversized-body behavior.
- Recurrence and reschedule business-integrity tests.
- Secret scan, dependency scan, production build and source-map review.
- Backup restore, rollback, and deletion workflow exercise.
- Log/telemetry inspection proving sensitive values are absent.

## 18. Security launch gate

Production launch is blocked until:

- auth/hosting/database/email/observability vendors and regions are approved;
- threat model and ownership matrix are reviewed;
- privacy/terms/contact/retention/deletion texts match operation;
- all release-blocking tests pass with no unresolved critical/high risk;
- operator MFA, least privilege, backups, restore, alerting, key rotation, and incident runbooks work;
- owner signs the go-live decision.
