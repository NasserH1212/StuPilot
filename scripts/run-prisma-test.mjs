import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { config as loadEnvironment } from "dotenv";

loadEnvironment({ path: ".env.test.local", quiet: true });
loadEnvironment({ path: ".env.local", quiet: true });

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error(
    "TEST_DATABASE_URL is required. It must point to a dedicated PostgreSQL test database.",
  );
}

const parsedUrl = new URL(testDatabaseUrl);
const databaseName = parsedUrl.pathname.slice(1).toLowerCase();

if (
  !["postgres:", "postgresql:"].includes(parsedUrl.protocol) ||
  !databaseName.includes("test")
) {
  throw new Error(
    "Refusing to run: TEST_DATABASE_URL is not a dedicated test database.",
  );
}

if (process.env.DATABASE_URL === testDatabaseUrl) {
  throw new Error("Refusing to run: development and test database URLs are identical.");
}

const prismaCli = fileURLToPath(
  new URL("../node_modules/prisma/build/index.js", import.meta.url),
);
const result = spawnSync(process.execPath, [prismaCli, ...process.argv.slice(2)], {
  env: { ...process.env, DATABASE_URL: testDatabaseUrl },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
