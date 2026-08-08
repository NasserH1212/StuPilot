import { describe, expect, it } from "vitest";

import {
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
});
