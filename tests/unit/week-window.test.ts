import { describe, expect, it } from "vitest";

import {
  toLocalDateLabel,
  totalWeeksInTerm,
  weekIndexForDate,
  weekWindowForIndex,
} from "@/src/modules/schedule/presentation/week-window";

// 2026-09-01 is a Tuesday: the term does not start on a Sunday, so week
// counting must anchor to the Sunday on or before it.
const term = {
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-17T00:00:00.000Z"),
};

describe("week window", () => {
  it("anchors week 1 to the Sunday on or before the term start", () => {
    const window = weekWindowForIndex(term, 1);
    expect(toLocalDateLabel(window.startsOn)).toBe("2026-08-30"); // Sunday
    expect(toLocalDateLabel(window.endsOn)).toBe("2026-09-03"); // Thursday
  });

  it("advances by 7 days per week index", () => {
    const window = weekWindowForIndex(term, 3);
    expect(toLocalDateLabel(window.startsOn)).toBe("2026-09-13");
    expect(toLocalDateLabel(window.endsOn)).toBe("2026-09-17");
  });

  it("resolves the week index containing a given date", () => {
    expect(weekIndexForDate(term, new Date("2026-09-01T00:00:00.000Z"))).toBe(1);
    expect(weekIndexForDate(term, new Date("2026-09-14T00:00:00.000Z"))).toBe(3);
  });

  it("clamps the resolved index to the term's own week count", () => {
    const total = totalWeeksInTerm(term);
    expect(weekIndexForDate(term, new Date("2030-01-01T00:00:00.000Z"))).toBe(total);
    expect(weekIndexForDate(term, new Date("2000-01-01T00:00:00.000Z"))).toBe(1);
  });

  it("counts total weeks across the Sunday-anchored span", () => {
    // 2026-08-30 (Sunday) .. 2026-12-17 inclusive = 110 days = 16 weeks (ceil).
    expect(totalWeeksInTerm(term)).toBe(16);
  });
});
