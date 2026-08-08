# Local setup

## 1. Install supported tools

- Node.js 24 LTS (`node --version` must be `v24.x`).
- npm 11 (`npm --version` must be `11.x`).
- Git.
- Docker Desktop for the supplied PostgreSQL workflow, or equivalent PostgreSQL development and test databases.

The repository enforces the Node/npm major lines. The latest security patch within Node 24 is recommended. On Windows where PowerShell blocks `npm.ps1`, invoke `npm.cmd`; do not change machine execution policy for this project.

## 2. Install reproducibly

```bash
git clone <repository-url>
cd StudentHub-AI
npm ci
npm run db:generate
```

`npm ci` consumes the committed lockfile. Prisma client generation is an explicit command so a dependency install never needs a database URL or network connection beyond package installation/schema-engine download.

## 3. Configure only local values

Copy `.env.example` to `.env.local`. Its values are local-only examples and must never be reused in a shared, preview, or production environment.

```bash
cp .env.example .env.local
```

On PowerShell:

```powershell
Copy-Item .env.example .env.local
```

The web shell requires no server secret. Database commands validate configuration when invoked.

## 4. Start the application

```bash
npm run dev
```

Open `/ar` for Arabic/RTL or `/en` for English/LTR. `/` redirects to Arabic. `/ar/workspace` and `/en/workspace` are explicit unauthenticated placeholders; they are not fake login or product screens.

## 5. Start local PostgreSQL

```bash
docker compose up -d postgres-dev postgres-test
docker compose ps
```

The services are intentionally separate:

| Service         | Port | Database          | Purpose                                  |
| --------------- | ---: | ----------------- | ---------------------------------------- |
| `postgres-dev`  | 5432 | `studenthub_dev`  | Local development migrations             |
| `postgres-test` | 5433 | `studenthub_test` | Destructive/deterministic test work only |

Apply the reviewed migration:

```bash
npm run db:migrate:dev
npm run db:test:migrate
npm run test:integration
```

Stop containers without deleting the development volume:

```bash
docker compose stop
```

Do not run a volume-removal or database-reset command unless its data-loss scope has been explicitly reviewed.

## 6. Browser setup

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

The E2E runner starts the built application on loopback port 3100, runs Chromium, and shuts the exact child process down. It does not deploy anything.

## Common problems

- **`npm.ps1 cannot be loaded`:** use `npm.cmd`/`npx.cmd` on Windows.
- **Prisma says `DATABASE_URL` is required:** configure `.env.local`, or use `npm run db:generate` if only generating the client.
- **Integration suite is skipped:** `TEST_DATABASE_URL` was absent. Start the test database and configure it; a skipped suite is not a real-database pass.
- **E2E says a build is required:** run `npm run build` first.
- **Port conflict:** stop the process or container already owning 3000, 3100, 5432, or 5433; do not kill an unidentified process.
