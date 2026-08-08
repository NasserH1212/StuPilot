import { describe, expect, it } from "vitest";

import { timePreferenceDefaults } from "@/src/shared/time/defaults";

describe("time foundation", () => {
  it("defaults to Sunday while preserving a future preference seam", () => {
    expect(timePreferenceDefaults).toEqual({
      weekStartsOn: 0,
      timeZoneSource: "browser-until-user-preference-exists",
    });
  });
});
