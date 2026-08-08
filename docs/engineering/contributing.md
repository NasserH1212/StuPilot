# Contribution workflow

## Scope first

Confirm the active sprint and approved acceptance criteria before changing code. Sprint 0 does not authorize authentication, accounts, onboarding, academic entities/views, reminders, external providers, analytics, AI, deployment, or production credentials.

Do not import, copy, adapt, or visually derive production work from `research-prototype/`.

## Branch and change discipline

- Branch from the reviewed base; Codex-created branches use `codex/<short-purpose>`.
- Keep one coherent concern per change.
- Preserve existing owner changes and historical documents.
- Add/update an ADR when a durable architectural decision changes.
- Add tests for implemented behavior; do not add pretend future-feature tests.
- Never commit `.env*`, keys, database dumps, generated Prisma client, Next output, test reports, or browser binaries.

## Required local review

```bash
npm ci
npm run db:generate
npm run format:check
npm run lint
npm run boundaries
npm run typecheck
npm test
npm run secrets:scan
npm run audit
```

When source/configuration affects runtime behavior:

```bash
npm run build
npm run test:e2e
```

When schema/persistence changes:

```bash
npm run db:test:migrate
npm run db:test:status
npm run test:integration
```

Review `git status`, the complete diff, generated lockfile changes, and migration SQL before requesting review. Report skipped or environmentally blocked checks explicitly; do not translate a skip into a pass.

## Dependency policy

Use the smallest supported stable dependency that has a direct requirement. Verify official documentation and peer/runtime compatibility, pin the direct version, regenerate the lockfile, run `npm audit`, and document why it exists. Provider SDKs require an approved provider decision.

## Review checklist

- Layer dependencies point inward and `npm run boundaries` passes.
- Arabic/RTL and English/LTR behavior remain equal and first-response-correct.
- Keyboard/focus, 320px layout, reduced motion, and error states are covered when relevant.
- Server variables cannot enter client modules or error output.
- Database tests use a dedicated real PostgreSQL test target and deterministic cleanup.
- No production service, credential, participant data, or historical prototype reuse appears.
