import { zonedTimeToUtc } from "@/src/shared/time/zoned-time";

import type { ClassMeetingType, Weekday } from "./class-meeting";

export interface OccurrenceWindow {
  readonly startsOn: Date;
  /** Null when the window's end is not yet resolved — see the "safe behavior" note below. */
  readonly endsOn: Date | null;
}

export interface OccurrenceBreak {
  readonly startsOn: Date;
  readonly endsOn: Date;
}

export interface OccurrenceMeeting {
  readonly seriesId: string;
  readonly weekdays: readonly Weekday[];
  readonly localStartTime: string;
  readonly localEndTime: string;
  readonly timeZone: string;
  readonly location: string | null;
  readonly meetingType: ClassMeetingType;
}

export interface ClassOccurrence {
  readonly seriesId: string;
  readonly localDate: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly location: string | null;
  readonly meetingType: ClassMeetingType;
}

export class OccurrenceWindowError extends Error {
  public constructor() {
    super("Occurrence generation requires a resolved (non-null) window end date.");
    this.name = "OccurrenceWindowError";
  }
}

function parseTimeParts(value: string): {
  readonly hour: number;
  readonly minute: number;
} {
  const parts = value.split(":");
  return { hour: Number(parts[0]), minute: Number(parts[1]) };
}

function toLocalDateLabel(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function withinInclusive(date: Date, start: Date, end: Date): boolean {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

/**
 * Expands one weekly meeting pattern into dated occurrences within
 * `window`, skipping any date that falls inside a break.
 *
 * Safe behavior for a null window end date (documented decision): throws
 * `OccurrenceWindowError` instead of generating an unbounded result. A
 * student's own `academic_terms.ends_on` is a required column, so this
 * path cannot occur for a student's own term — it exists as a defensive
 * contract for this function in case it is ever pointed directly at a
 * university's published calendar term, which can have a null end date
 * (e.g. an unannounced summer term).
 */
export function generateOccurrences(
  meeting: OccurrenceMeeting,
  window: OccurrenceWindow,
  breaks: readonly OccurrenceBreak[] = [],
): readonly ClassOccurrence[] {
  if (!window.endsOn) throw new OccurrenceWindowError();

  const start = parseTimeParts(meeting.localStartTime);
  const end = parseTimeParts(meeting.localEndTime);
  const weekdaySet = new Set<number>(meeting.weekdays);
  const occurrences: ClassOccurrence[] = [];

  const cursor = new Date(window.startsOn.getTime());
  const endsOn = window.endsOn;

  while (cursor.getTime() <= endsOn.getTime()) {
    const isScheduledWeekday = weekdaySet.has(cursor.getUTCDay());
    const isOnBreak = breaks.some((brk) =>
      withinInclusive(cursor, brk.startsOn, brk.endsOn),
    );

    if (isScheduledWeekday && !isOnBreak) {
      const year = cursor.getUTCFullYear();
      const month = cursor.getUTCMonth() + 1;
      const day = cursor.getUTCDate();

      occurrences.push({
        seriesId: meeting.seriesId,
        localDate: toLocalDateLabel(cursor),
        startsAt: zonedTimeToUtc(
          { year, month, day, hour: start.hour, minute: start.minute },
          meeting.timeZone,
        ),
        endsAt: zonedTimeToUtc(
          { year, month, day, hour: end.hour, minute: end.minute },
          meeting.timeZone,
        ),
        location: meeting.location,
        meetingType: meeting.meetingType,
      });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return occurrences;
}
