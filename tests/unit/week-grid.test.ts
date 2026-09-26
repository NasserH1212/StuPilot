import { describe, expect, it } from "vitest";

import { buildWeekGrid } from "@/src/modules/schedule/presentation/week-grid";
import type { WeekLectureItem } from "@/src/modules/schedule/presentation/week-lecture-items";

function item(overrides: Partial<WeekLectureItem>): WeekLectureItem {
  return {
    key: "k",
    weekday: 0,
    localDate: "2026-09-06",
    start: { hour: 10, minute: 0 },
    end: { hour: 11, minute: 15 },
    courseName: "Calculus I",
    courseCode: "MATH101",
    color: "blue",
    ...overrides,
  };
}

describe("week grid", () => {
  it("groups items into one row per distinct start time, sorted ascending", () => {
    const rows = buildWeekGrid([
      item({ weekday: 2, start: { hour: 11, minute: 30 } }),
      item({ weekday: 0, start: { hour: 9, minute: 0 } }),
    ]);

    expect(rows.map((row) => row.timeLabel)).toEqual(["09:00", "11:30"]);
  });

  it("places each item under its own weekday within its time row", () => {
    const sunday = item({ weekday: 0, courseCode: "CS202" });
    const tuesday = item({ weekday: 2, courseCode: "STAT201" });
    const rows = buildWeekGrid([sunday, tuesday]);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.cellsByWeekday.get(0)?.courseCode).toBe("CS202");
    expect(rows[0]?.cellsByWeekday.get(2)?.courseCode).toBe("STAT201");
    expect(rows[0]?.cellsByWeekday.get(1)).toBeUndefined();
  });
});
