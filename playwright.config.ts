import { config as loadEnvironment } from "dotenv";

import { defineConfig, devices } from "@playwright/test";

// Only for optional local-only test credentials (see
// tests/e2e/authenticated-flows.spec.ts); the app server itself loads
// .env.local independently via Next.js's own env handling.
loadEnvironment({ path: ".env.local", quiet: true });

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
