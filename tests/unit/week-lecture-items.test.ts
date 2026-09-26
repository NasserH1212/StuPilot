import { describe, expect, it } from "vitest";

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import type { ClassMeetingRecord } from "@/src/modules/schedule/application/ports/class-meeting-repository";
import type { ClassOccurrence } from "@/src/modules/schedule/domain/occurrence-generation";
import {
  buildWeekLectureItems,
  itemsForWeekday,
} from "@/src/modules/schedule/presentation/week-lecture-items";

const course: TermCourseRecord = {
  enrollmentId: "018f57b5-f220-7d84-bafd-4d975e550200",
  courseId: "018f57b5-f220-7d84-bafd-4d975e550300",
  userId: "018f57b5-f220-7d84-bafd-4d975e550001",
  termId: "018f57b5-f220-7d84-bafd-4d975e550100",
  name: "Calculus I",
  code: "MATH101",
  colorToken: null,
  defaultLocation: "Building A",
  archivedAt: null,
  courseVersion: 0,
  enrollmentVersion: 0,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date("2026-08-01T00:00:00.000Z"),
};

const meeting: ClassMeetingRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550400",
  userId: course.userId,
  userCourseId: course.enrollmentId,
  weekdays: [0, 2],
  localStartTime: "10:00",
  localEndTime: "11:15",
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-17T00:00:00.000Z"),
  timeZone: "Asia/Riyadh",
  location: "Room 1",
  meetingType: "lecture",
  archivedAt: null,
  version: 0,
};

const occurrenceSunday: ClassOccurrence = {
  seriesId: meeting.id,
  localDate: "2026-09-06", // a Sunday
  startsAt: new Date("2026-09-06T07:00:00.000Z"),
  endsAt: new Date("2026-09-06T08:15:00.000Z"),
  location: meeting.location,
  meetingType: meeting.meetingType,
};

const occurrenceTuesday: ClassOccurrence = {
  ...occurrenceSunday,
  localDate: "2026-09-08", // the following Tuesday
};

const orphanOccurrence: ClassOccurrence = {
  ...occurrenceSunday,
  seriesId: "018f57b5-f220-7d84-bafd-4d975e550999",
  localDate: "2026-09-09",
};

describe("week lecture items", () => {
  it("correlates an occurrence back to its meeting's wall-clock time and course", () => {
    const items = buildWeekLectureItems(
      [occurrenceSunday],
      [meeting],
      [course],
      () => "teal",
    );

    expect(items).toEqual([
      {
        key: `${meeting.id}-2026-09-06`,
        weekday: 0,
        localDate: "2026-09-06",
        start: { hour: 10, minute: 0 },
        end: { hour: 11, minute: 15 },
        courseName: "Calculus I",
        courseCode: "MATH101",
        color: "teal",
      },
    ]);
  });

  it("drops an occurrence whose meeting can no longer be found", () => {
    const items = buildWeekLectureItems(
      [orphanOccurrence],
      [meeting],
      [course],
      () => "blue",
    );
    expect(items).toEqual([]);
  });

  it("sorts by date then by start time", () => {
    const items = buildWeekLectureItems(
      [occurrenceTuesday, occurrenceSunday],
      [meeting],
      [course],
      () => "blue",
    );
    expect(items.map((item) => item.localDate)).toEqual(["2026-09-06", "2026-09-08"]);
  });

  it("filters items down to a single weekday", () => {
    const items = buildWeekLectureItems(
      [occurrenceSunday, occurrenceTuesday],
      [meeting],
      [course],
      () => "blue",
    );
    expect(itemsForWeekday(items, 2)).toHaveLength(1);
    expect(itemsForWeekday(items, 2)[0]?.localDate).toBe("2026-09-08");
  });
});
