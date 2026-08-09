import { describe, expect, it } from "vitest";

import {
  createRecoveryIntentValue,
  recoveryIntentLifetimeSeconds,
  verifyRecoveryIntentValue,
} from "@/src/infrastructure/authentication/recovery-intent-value";
import {
  localizedPath,
  safeWorkspaceReturnTo,
} from "@/src/shared/localization/routing";

describe("authentication security helpers", () => {
  it("allows only the exact localized workspace return path", () => {
    expect(safeWorkspaceReturnTo("/en/workspace", "en")).toBe("/en/workspace");
    expect(safeWorkspaceReturnTo("https://attacker.invalid", "en")).toBe(
      localizedPath("en", "workspace"),
    );
    expect(safeWorkspaceReturnTo("//attacker.invalid", "ar")).toBe(
      localizedPath("ar", "workspace"),
    );
    expect(safeWorkspaceReturnTo("/en/workspace/../auth", "en")).toBe(
      localizedPath("en", "workspace"),
    );
  });

  it("binds the short-lived recovery intent to one provider subject", () => {
    const now = Date.parse("2026-08-09T00:00:00.000Z");
    const secret = "a-production-secret-needs-at-least-32-bytes";
    const value = createRecoveryIntentValue("subject-a", secret, now);

    expect(verifyRecoveryIntentValue(value, "subject-a", secret, now)).toBe(true);
    expect(verifyRecoveryIntentValue(value, "subject-b", secret, now)).toBe(false);
    expect(
      verifyRecoveryIntentValue(`${value}tampered`, "subject-a", secret, now),
    ).toBe(false);
    expect(
      verifyRecoveryIntentValue(
        value,
        "subject-a",
        secret,
        now + (recoveryIntentLifetimeSeconds + 1) * 1000,
      ),
    ).toBe(false);
  });
});
