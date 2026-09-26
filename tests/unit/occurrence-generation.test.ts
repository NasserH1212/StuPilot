import { describe, expect, it } from "vitest";

import {
  generateOccurrences,
  OccurrenceWindowError,
  type OccurrenceBreak,
  type OccurrenceMeeting,
} from "@/src/modules/schedule/domain/occurrence-generation";
import type { Weekday } from "@/src/modules/schedule/domain/class-meeting";

function weekdayOf(value: Date): Weekday {
  return value.getUTCDay() as Weekday;
}

function baseMeeting(overrides: Partial<OccurrenceMeeting> = {}): OccurrenceMeeting {
  return {
    seriesId: "018f57b5-f220-7d84-bafd-4d975e550400",
    weekdays: [0, 2],
    localStartTime: "09:00",
    localEndTime: "10:30",
    timeZone: "Asia/Riyadh",
    location: "Building 3, Room 101",
    meetingType: "lecture",
    ...overrides,
  };
}

function date(iso: string): Date {
  return new Date(iso);
}

function localDates(occurrences: ReturnType<typeof generateOccurrences>): string[] {
  return occurrences.map((occurrence) => occurrence.localDate);
}

describe("generateOccurrences — term boundaries", () => {
  it("includes occurrences exactly on the window's start and end dates, and nothing outside it", () => {
    const windowStart = date("2026-09-06T00:00:00.000Z");
    const oneWeekLater = date("2026-09-13T00:00:00.000Z");
    const meeting = baseMeeting({ weekdays: [weekdayOf(windowStart)] });

    const occurrences = generateOccurrences(meeting, {
      startsOn: windowStart,
      endsOn: oneWeekLater,
    });

    expect(localDates(occurrences)).toEqual(["2026-09-06", "2026-09-13"]);
  });

  it("excludes a matching weekday one day before the window starts", () => {
    const dayBeforeStart = date("2026-09-05T00:00:00.000Z");
    const windowStart = date("2026-09-06T00:00:00.000Z");
    const windowEnd = date("2026-09-06T00:00:00.000Z");
    const meeting = baseMeeting({
      weekdays: [weekdayOf(dayBeforeStart), weekdayOf(windowStart)],
    });

    const occurrences = generateOccurrences(meeting, {
      startsOn: windowStart,
      endsOn: windowEnd,
    });

    expect(localDates(occurrences)).toEqual(["2026-09-06"]);
  });

  it("excludes a matching weekday one day after the window ends", () => {
    const windowStart = date("2026-09-06T00:00:00.000Z");
    const windowEnd = date("2026-09-06T00:00:00.000Z");
    const dayAfterEnd = date("2026-09-07T00:00:00.000Z");
    const meeting = baseMeeting({
      weekdays: [weekdayOf(windowStart), weekdayOf(dayAfterEnd)],
    });

    const occurrences = generateOccurrences(meeting, {
      startsOn: windowStart,
      endsOn: windowEnd,
    });

    expect(localDates(occurrences)).toEqual(["2026-09-06"]);
  });

  it("returns no occurrences when no configured weekday falls in the window", () => {
    const windowStart = date("2026-09-06T00:00:00.000Z");
    const windowEnd = date("2026-09-06T00:00:00.000Z");
    const unmatchedWeekday = ((windowStart.getUTCDay() + 1) % 7) as
      0 | 1 | 2 | 3 | 4 | 5 | 6;
    const meeting = baseMeeting({ weekdays: [unmatchedWeekday] });

    const occurrences = generateOccurrences(meeting, {
      startsOn: windowStart,
      endsOn: windowEnd,
    });

    expect(occurrences).toEqual([]);
  });
});

// University of Hail's real, owner-verified 1448 calendar (see the
// 20260926020000_university_of_hail_1448_calendar migration).
describe("generateOccurrences — University of Hail's official 1448 breaks", () => {
  const allWeekdays = [0, 1, 2, 3, 4, 5, 6] as const;

  it("skips every date of the fall break (2026-11-22 to 2026-11-28)", () => {
    const meeting = baseMeeting({ weekdays: [...allWeekdays] });
    const fallBreak: OccurrenceBreak = {
      startsOn: date("2026-11-22T00:00:00.000Z"),
      endsOn: date("2026-11-28T00:00:00.000Z"),
    };

    const occurrences = generateOccurrences(
      meeting,
      {
        startsOn: date("2026-11-20T00:00:00.000Z"),
        endsOn: date("2026-11-30T00:00:00.000Z"),
      },
      [fallBreak],
    );

    expect(localDates(occurrences)).toEqual([
      "2026-11-20",
      "2026-11-21",
      "2026-11-29",
      "2026-11-30",
    ]);
  });

  it("skips every date of the Eid al-Fitr break (2027-02-28 to 2027-03-13)", () => {
    const meeting = baseMeeting({ weekdays: [...allWeekdays] });
    const eidAlFitr: OccurrenceBreak = {
      startsOn: date("2027-02-28T00:00:00.000Z"),
      endsOn: date("2027-03-13T00:00:00.000Z"),
    };

    const occurrences = generateOccurrences(
      meeting,
      {
        startsOn: date("2027-02-27T00:00:00.000Z"),
        endsOn: date("2027-03-14T00:00:00.000Z"),
      },
      [eidAlFitr],
    );

    expect(localDates(occurrences)).toEqual(["2027-02-27", "2027-03-14"]);
  });

  it("skips every date of the Eid al-Adha break (2027-05-09 to 2027-05-22)", () => {
    const meeting = baseMeeting({ weekdays: [...allWeekdays] });
    const eidAlAdha: OccurrenceBreak = {
      startsOn: date("2027-05-09T00:00:00.000Z"),
      endsOn: date("2027-05-22T00:00:00.000Z"),
    };

    const occurrences = generateOccurrences(
      meeting,
      {
        startsOn: date("2027-05-08T00:00:00.000Z"),
        endsOn: date("2027-05-23T00:00:00.000Z"),
      },
      [eidAlAdha],
    );

    expect(localDates(occurrences)).toEqual(["2027-05-08", "2027-05-23"]);
  });

  it("skips all three breaks at once across the full first and second terms", () => {
    const meeting = baseMeeting({ weekdays: [...allWeekdays] });
    const breaks: OccurrenceBreak[] = [
      {
        startsOn: date("2026-11-22T00:00:00.000Z"),
        endsOn: date("2026-11-28T00:00:00.000Z"),
      },
      {
        startsOn: date("2027-02-28T00:00:00.000Z"),
        endsOn: date("2027-03-13T00:00:00.000Z"),
      },
      {
        startsOn: date("2027-05-09T00:00:00.000Z"),
        endsOn: date("2027-05-22T00:00:00.000Z"),
      },
    ];

    const occurrences = generateOccurrences(
      meeting,
      {
        startsOn: date("2026-08-23T00:00:00.000Z"),
        endsOn: date("2027-06-17T00:00:00.000Z"),
      },
      breaks,
    );

    const localDateSet = new Set(localDates(occurrences));
    for (const brk of breaks) {
      const cursor = new Date(brk.startsOn.getTime());
      while (cursor.getTime() <= brk.endsOn.getTime()) {
        expect(localDateSet.has(cursor.toISOString().slice(0, 10))).toBe(false);
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    }
    // A full academic year of every weekday, minus the 7+14+14 broken days.
    expect(occurrences.length).toBeGreaterThan(0);
  });
});

describe("generateOccurrences — time zone", () => {
  it("converts the local start and end time to the correct UTC instants for Asia/Riyadh", () => {
    const meeting = baseMeeting({
      weekdays: [0],
      localStartTime: "09:00",
      localEndTime: "10:30",
      timeZone: "Asia/Riyadh",
    });
    const sunday = date("2026-09-06T00:00:00.000Z");

    const occurrences = generateOccurrences(meeting, {
      startsOn: sunday,
      endsOn: sunday,
    });

    expect(occurrences).toHaveLength(1);
    expect(occurrences[0]?.startsAt.toISOString()).toBe("2026-09-06T06:00:00.000Z");
    expect(occurrences[0]?.endsAt.toISOString()).toBe("2026-09-06T07:30:00.000Z");
  });

  it("produces a different UTC instant for the same local time in a different zone", () => {
    const sunday = date("2026-09-06T00:00:00.000Z");
    const riyadh = generateOccurrences(
      baseMeeting({ weekdays: [0], timeZone: "Asia/Riyadh" }),
      {
        startsOn: sunday,
        endsOn: sunday,
      },
    );
    const newYork = generateOccurrences(
      baseMeeting({ weekdays: [0], timeZone: "America/New_York" }),
      { startsOn: sunday, endsOn: sunday },
    );

    expect(riyadh[0]?.startsAt.toISOString()).not.toBe(
      newYork[0]?.startsAt.toISOString(),
    );
  });
});

describe("generateOccurrences — null window end date", () => {
  it("throws OccurrenceWindowError instead of generating an unbounded result", () => {
    const meeting = baseMeeting();

    expect(() =>
      generateOccurrences(meeting, {
        startsOn: date("2027-06-20T00:00:00.000Z"),
        endsOn: null,
      }),
    ).toThrow(OccurrenceWindowError);
  });
});
