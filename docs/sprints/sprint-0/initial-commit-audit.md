# Sprint 0 initial commit audit

- Audit date: 2026-08-08
- Repository root: `C:\Users\Hasib\Documents\StudentHub-AI`
- Branch at the start of the audit: `master`
- Commit count at the start of the audit: `0`
- Owner-authorized target branch: `main`
- Decision: **Pass — approved files are suitable for the official initial local commit.**

## Scope and method

This audit was performed before staging. It covers the complete repository inventory, ignore rules, intended source set, generated and local artifacts, prototype isolation, secret scanning, file size, and binary-file checks.

Commands used included:

```text
git branch --show-current
git rev-list --all --count
rg --files -uu -g '!node_modules/**' -g '!.next/**' -g '!.git/**'
git ls-files --others --cached --exclude-standard
git status --ignored --short
git check-ignore -v -- <path>
git ls-files
git diff --cached --name-only
rg ... research-prototype ... app src proxy.ts next.config.ts package.json tsconfig.json
npm run secrets:scan
```

## Complete inventory result

The complete pre-audit inventory contained **144 files** outside `.git`, excluding the recursively large `node_modules/` and `.next/` trees from the printed inventory. Of those files, **132** were non-ignored intended files before this audit record was created. This audit record becomes the 133rd intended file.

Pre-audit intended-file distribution:

| Area                                            |   Files | Inclusion decision                                  |
| ----------------------------------------------- | ------: | --------------------------------------------------- |
| Repository root configuration and documentation |      19 | Include                                             |
| `.github/`                                      |       1 | Include                                             |
| `app/`                                          |      12 | Include                                             |
| `docs/`                                         |      54 | Include; the present audit adds one more file       |
| `prisma/`                                       |       4 | Include                                             |
| `research-prototype/`                           |       4 | Include as isolated, disposable historical material |
| `scripts/`                                      |       5 | Include                                             |
| `src/` excluding generated Prisma output        |      23 | Include                                             |
| `tests/`                                        |      10 | Include                                             |
| **Pre-audit total**                             | **132** |                                                     |

The intended set contains application foundation source, active production documentation, archived research documentation, the disposable research prototype, ADRs, Prisma schema/migration/recovery SQL, automated tests, CI configuration, engineering scripts, package metadata, and the npm lockfile.

## `.gitignore` inspection

`.gitignore` explicitly excludes:

- dependencies and local package state: `node_modules/`, `.npm/`;
- the former portable PostgreSQL path: `.sprint0-postgres-runtime/`;
- Next.js output: `.next/`, `out/`, and generated `next-env.d.ts`;
- test output: `coverage/`, `playwright-report/`, and `test-results/`;
- generated Prisma client: `src/generated/`;
- local environment files: `.env` and `.env.*`, with example files explicitly allowed;
- logs, local editor/OS state, and TypeScript build cache files.

The ignore rules are appropriately scoped. `.env.example` is intentionally included and contains placeholders only.

## Tracked and staged state before staging

- Tracked or staged files: **0**
- Staged files: **0**
- Repository commits: **0**

Therefore none of the excluded categories was staged or tracked when this audit began.

## Exclusion verification

| Category                                      | Repository state                                                 | Result   |
| --------------------------------------------- | ---------------------------------------------------------------- | -------- |
| `node_modules/`                               | Present locally; ignored by `.gitignore`                         | Excluded |
| `.next/`                                      | Present locally; ignored                                         | Excluded |
| Generated Prisma client `src/generated/`      | Present locally; ignored                                         | Excluded |
| Playwright report                             | Not present; ignore rule exists                                  | Excluded |
| Test results                                  | Present locally; ignored                                         | Excluded |
| Coverage output                               | Not present; ignore rule exists                                  | Excluded |
| Playwright browser binaries                   | No repository-local browser binary path in intended inventory    | Excluded |
| Local `.env` files                            | No local `.env` file present; ignore rules exist                 | Excluded |
| Local database data                           | No database data directory in intended inventory                 | Excluded |
| Portable PostgreSQL runtime                   | Removed; `.sprint0-postgres-runtime/` is absent and ignored      | Excluded |
| TypeScript build cache                        | Present locally; ignored                                         | Excluded |
| Credentials, tokens, private keys, or secrets | No finding in secret scan; no sensitive artifact in intended set | Excluded |

No intended file matched generated/runtime artifact paths. The only intended filenames containing security-related words are legitimate documentation and the secret-scanning script.

## Prototype isolation

A production-source search across `app/`, `src/`, `proxy.ts`, `next.config.ts`, `package.json`, and `tsconfig.json` found **no reference, import, or copy relationship** to `research-prototype/`.

The prototype remains tracked only as approved historical and disposable research material.

## Size and binary review

- Intended pre-audit payload: **1,067,105 bytes**.
- Largest file: `package-lock.json` at **233,241 bytes**.
- Files larger than 1 MiB: **0**.
- NUL-byte binary files in the intended set: **0**.
- Portable PostgreSQL runtime in the intended set: **0 files**.

No unexpected binary or unusually large file requires investigation. `package-lock.json` is explicitly included.

## Secret scan

The pre-stage command `npm run secrets:scan` passed:

```text
Secret scan passed (134 files inspected).
```

## Staged snapshot review

After the pre-stage checks passed, the branch was renamed from `master` to `main` and only the approved paths were staged.

- Staged file count: **133**.
- Staged summary: **24,437 insertions across 133 files**.
- Staged file list: reviewed in full; it matches the intended application, documentation, archive, prototype, migration, test, CI, script, and configuration inventory described above.
- Ignored verification: `.next/`, `next-env.d.ts`, `node_modules/`, `src/generated/`, `test-results/`, and `tsconfig.tsbuildinfo` remain ignored and unstaged.
- Absent-but-ignored verification: `playwright-report/`, `coverage/`, local `.env`, and `.sprint0-postgres-runtime/` are absent and unstaged.
- Generated/runtime artifact path matches in the index: **0**.
- Staged files over 1 MiB: **0**.
- `package-lock.json` staged: **Yes**.
- Portable PostgreSQL runtime staged: **No**.
- Staged secret scan: **Pass — 133 staged files inspected**; lockfile content was intentionally excluded from token-pattern matching, consistent with the repository scanner.

`git diff --cached --check` reports existing two-space Markdown hard breaks and final blank lines in historical owner documents. These are text-formatting findings, not secret, binary, generated, or runtime artifacts. They were retained because the owner explicitly prohibited rewriting previous owner documentation; the repository's Prettier check is the formatting authority for this snapshot.

## Pre-stage conclusion

The repository root, zero-commit state, intended inventory, ignore policy, prototype isolation, file sizes, binary check, staged inventory, ignored-file verification, lockfile inclusion, and both secret scans satisfy the owner-approved initial-commit controls. The 133-file staged snapshot on `main` is approved for the official initial local commit.
