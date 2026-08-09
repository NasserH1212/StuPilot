import { describe, expect, it } from "vitest";

import {
  parseAuthenticationEnvironment,
  parsePublicEnvironment,
  parseServerEnvironment,
  parseTestEnvironment,
} from "@/src/shared/config/environment";

describe("environment validation", () => {
  it("uses the local public environment when the optional value is absent", () => {
    expect(parsePublicEnvironment({})).toEqual({ NEXT_PUBLIC_APP_ENV: "local" });
  });

  it("fails fast for a malformed public environment", () => {
    expect(() => parsePublicEnvironment({ NEXT_PUBLIC_APP_ENV: "staging" })).toThrow(
      /Invalid public environment configuration/,
    );
  });

  it("fails fast when required server configuration is missing", () => {
    expect(() => parseServerEnvironment({})).toThrow(
      /Invalid server environment configuration/,
    );
  });

  it("rejects non-PostgreSQL server URLs", () => {
    expect(() =>
      parseServerEnvironment({ DATABASE_URL: "https://example.invalid/database" }),
    ).toThrow(/postgresql protocol/);
  });

  it("requires a dedicated test database", () => {
    expect(() =>
      parseTestEnvironment({
        TEST_DATABASE_URL: "postgresql://local:local@127.0.0.1:5432/studenthub_dev",
      }),
    ).toThrow(/dedicated test database/);
  });

  it("keeps development and test URLs separate", () => {
    const sameUrl = "postgresql://local:local@127.0.0.1:5432/studenthub_test";
    expect(() =>
      parseTestEnvironment({ TEST_DATABASE_URL: sameUrl, DATABASE_URL: sameUrl }),
    ).toThrow(/must differ/);
  });

  it("accepts only a complete authentication environment with an exact origin", () => {
    expect(
      parseAuthenticationEnvironment({
        AUTH_APP_ORIGIN: "https://preview.studenthub.example",
        AUTH_STATE_SECRET: "a-production-secret-needs-at-least-32-bytes",
        DATABASE_URL: "postgresql://app:local@127.0.0.1:5432/studenthub_preview",
        NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          "sb_publishable_example-value-not-a-real-key",
      }).AUTH_APP_ORIGIN,
    ).toBe("https://preview.studenthub.example");
  });

  it("rejects partial authentication configuration and origins with paths", () => {
    expect(() =>
      parseAuthenticationEnvironment({
        AUTH_APP_ORIGIN: "https://preview.studenthub.example/auth",
        AUTH_STATE_SECRET: "short",
      }),
    ).toThrow(/Invalid authentication environment configuration/);
  });
});
