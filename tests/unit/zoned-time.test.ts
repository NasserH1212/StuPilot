import { describe, expect, it } from "vitest";

import { zonedTimeToUtc } from "@/src/shared/time/zoned-time";

describe("zonedTimeToUtc", () => {
  it("converts a fixed-offset zone (Asia/Riyadh, UTC+3) with no DST", () => {
    const instant = zonedTimeToUtc(
      { year: 2026, month: 9, day: 1, hour: 9, minute: 0 },
      "Asia/Riyadh",
    );
    expect(instant.toISOString()).toBe("2026-09-01T06:00:00.000Z");
  });

  it("crosses midnight backward when converting Riyadh's local midnight", () => {
    const instant = zonedTimeToUtc(
      { year: 2026, month: 9, day: 1, hour: 0, minute: 0 },
      "Asia/Riyadh",
    );
    expect(instant.toISOString()).toBe("2026-08-31T21:00:00.000Z");
  });

  it("returns the same instant for the UTC zone itself", () => {
    const instant = zonedTimeToUtc(
      { year: 2026, month: 9, day: 1, hour: 9, minute: 30 },
      "UTC",
    );
    expect(instant.toISOString()).toBe("2026-09-01T09:30:00.000Z");
  });

  it("applies the winter (EST, UTC-5) offset for a DST-observing zone", () => {
    const instant = zonedTimeToUtc(
      { year: 2027, month: 1, day: 15, hour: 12, minute: 0 },
      "America/New_York",
    );
    expect(instant.toISOString()).toBe("2027-01-15T17:00:00.000Z");
  });

  it("applies the summer (EDT, UTC-4) offset for the same zone, proving DST-awareness", () => {
    const instant = zonedTimeToUtc(
      { year: 2027, month: 7, day: 15, hour: 12, minute: 0 },
      "America/New_York",
    );
    expect(instant.toISOString()).toBe("2027-07-15T16:00:00.000Z");
  });
});
