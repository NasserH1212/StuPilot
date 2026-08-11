import { config as loadEnvironment } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnvironment({ path: ".env.local", quiet: true });
loadEnvironment({ path: ".env", quiet: true });

const generateOnlyUrl =
  "postgresql://generate-only:generate-only@127.0.0.1:1/generate_only";
const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.PRISMA_GENERATE_ONLY === "1" ? generateOnlyUrl : undefined);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for Prisma commands. Use `npm run db:generate` for connection-free client generation.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
