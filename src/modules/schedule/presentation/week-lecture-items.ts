import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import type { CourseColor } from "@/src/shared/design-system";

import type { ClassMeetingRecord } from "../application/ports/class-meeting-repository";
import type { ClassOccurrence } from "../domain/occurrence-generation";
import type { Weekday } from "../domain/class-meeting";

export interface WeekLectureItem {
  readonly key: string;
  readonly weekday: Weekday;
  readonly localDate: string;
  readonly start: { readonly hour: number; readonly minute: number };
  readonly end: { readonly hour: number; readonly minute: number };
  readonly courseName: string;
  readonly courseCode: string | null;
  readonly color: CourseColor;
}

function parseLocalTime(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);
  return { hour: hour ?? 0, minute: minute ?? 0 };
}

/**
 * Correlates generated occurrences back to the meeting (for its wall-clock
 * times, read directly rather than re-derived from the UTC occurrence
 * instant) and the course (for its name/code/color) each belongs to.
 * Occurrences whose meeting or course can't be resolved are dropped rather
 * than shown with missing data.
 */
export function buildWeekLectureItems(
  occurrences: readonly ClassOccurrence[],
  meetings: readonly ClassMeetingRecord[],
  courses: readonly TermCourseRecord[],
  resolveColor: (course: TermCourseRecord) => CourseColor,
): readonly WeekLectureItem[] {
  const meetingsById = new Map(meetings.map((meeting) => [meeting.id, meeting]));
  const coursesByEnrollmentId = new Map(
    courses.map((course) => [course.enrollmentId, course]),
  );

  const items: WeekLectureItem[] = [];
  for (const occurrence of occurrences) {
    const meeting = meetingsById.get(occurrence.seriesId);
    if (!meeting) continue;
    const course = coursesByEnrollmentId.get(meeting.userCourseId);
    if (!course) continue;

    items.push({
      key: `${occurrence.seriesId}-${occurrence.localDate}`,
      weekday: new Date(`${occurrence.localDate}T00:00:00.000Z`).getUTCDay() as Weekday,
      localDate: occurrence.localDate,
      start: parseLocalTime(meeting.localStartTime),
      end: parseLocalTime(meeting.localEndTime),
      courseName: course.name,
      courseCode: course.code,
      color: resolveColor(course),
    });
  }

  return items.sort(
    (a, b) =>
      a.localDate.localeCompare(b.localDate) ||
      a.start.hour * 60 + a.start.minute - (b.start.hour * 60 + b.start.minute),
  );
}

export function itemsForWeekday(
  items: readonly WeekLectureItem[],
  weekday: Weekday,
): readonly WeekLectureItem[] {
  return items.filter((item) => item.weekday === weekday);
}

export function weekdaysWithDeadlines(): ReadonlySet<Weekday> {
  // Deadlines (tasks/exams due on a given day) aren't modeled yet — see
  // course-detail-view.tsx's "not available yet" sections. No day strip
  // tab shows a deadline dot until that data exists.
  return new Set();
}
