import { describe, expect, it } from "vitest";

import {
  assertClassMeetingDraft,
  ClassMeetingInvariantError,
  type ClassMeetingDraft,
} from "@/src/modules/schedule/domain/class-meeting";

function validDraft(overrides: Partial<ClassMeetingDraft> = {}): ClassMeetingDraft {
  return {
    weekdays: [0, 2],
    localStartTime: "09:00",
    localEndTime: "10:30",
    startsOn: new Date("2026-09-01T00:00:00.000Z"),
    endsOn: new Date("2026-12-15T00:00:00.000Z"),
    timeZone: "Asia/Riyadh",
    location: "Building 3, Room 101",
    meetingType: "lecture",
    ...overrides,
  };
}

describe("class meeting invariants", () => {
  it("accepts a valid draft", () => {
    expect(assertClassMeetingDraft(validDraft())).toEqual(validDraft());
  });

  it("rejects an empty weekday list", () => {
    expect(() => assertClassMeetingDraft(validDraft({ weekdays: [] }))).toThrow(
      ClassMeetingInvariantError,
    );
  });

  it("rejects duplicate weekdays", () => {
    try {
      assertClassMeetingDraft(validDraft({ weekdays: [1, 1] }));
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ClassMeetingInvariantError);
      expect((error as ClassMeetingInvariantError).invariant).toBe("WEEKDAYS_INVALID");
    }
  });

  it("rejects a weekday outside 0-6", () => {
    try {
      // Runtime-only invariant: the literal union can't express "7" (an
      // out-of-range value that could still arrive before zod validation).
      assertClassMeetingDraft(validDraft({ weekdays: [7 as never] }));
      expect.unreachable();
    } catch (error) {
      expect((error as ClassMeetingInvariantError).invariant).toBe("WEEKDAYS_INVALID");
    }
  });

  it("rejects an end time that is not after the start time", () => {
    try {
      assertClassMeetingDraft(
        validDraft({ localStartTime: "10:00", localEndTime: "10:00" }),
      );
      expect.unreachable();
    } catch (error) {
      expect((error as ClassMeetingInvariantError).invariant).toBe("TIME_ORDER");
    }
  });

  it("rejects a malformed local time", () => {
    try {
      assertClassMeetingDraft(validDraft({ localStartTime: "9:00" }));
      expect.unreachable();
    } catch (error) {
      expect((error as ClassMeetingInvariantError).invariant).toBe("TIME_FORMAT");
    }
  });

  it("rejects an end date before the start date", () => {
    try {
      assertClassMeetingDraft(
        validDraft({
          startsOn: new Date("2026-12-15T00:00:00.000Z"),
          endsOn: new Date("2026-09-01T00:00:00.000Z"),
        }),
      );
      expect.unreachable();
    } catch (error) {
      expect((error as ClassMeetingInvariantError).invariant).toBe("DATE_ORDER");
    }
  });
});
