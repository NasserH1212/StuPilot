export const classMeetingTypes = ["lecture", "lab", "tutorial"] as const;

export type ClassMeetingType = (typeof classMeetingTypes)[number];

/** 0=Sunday..6=Saturday — matches JS Date#getDay and this app's Sunday week start. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ClassMeeting {
  readonly id: string;
  readonly userId: string;
  readonly userCourseId: string;
  readonly weekdays: readonly Weekday[];
  /** 24-hour "HH:MM" local wall-clock time. */
  readonly localStartTime: string;
  readonly localEndTime: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
  readonly location: string | null;
  readonly meetingType: ClassMeetingType;
  readonly archivedAt: Date | null;
  readonly version: number;
}

export interface ClassMeetingDraft {
  readonly weekdays: readonly Weekday[];
  readonly localStartTime: string;
  readonly localEndTime: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
  readonly location: string | null;
  readonly meetingType: ClassMeetingType;
}

export const classMeetingInvariantCodes = [
  "WEEKDAYS_REQUIRED",
  "WEEKDAYS_INVALID",
  "TIME_ORDER",
  "TIME_FORMAT",
  "DATE_ORDER",
] as const;

export type ClassMeetingInvariantCode = (typeof classMeetingInvariantCodes)[number];

export class ClassMeetingInvariantError extends Error {
  public constructor(public readonly invariant: ClassMeetingInvariantCode) {
    super(`The class meeting violates the ${invariant} invariant.`);
    this.name = "ClassMeetingInvariantError";
  }
}

const localTimePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseLocalTimeMinutes(value: string): number {
  const match = localTimePattern.exec(value);
  if (!match) throw new ClassMeetingInvariantError("TIME_FORMAT");
  return Number(match[1]) * 60 + Number(match[2]);
}

export function assertClassMeetingDraft<T extends ClassMeetingDraft>(draft: T): T {
  if (draft.weekdays.length === 0) {
    throw new ClassMeetingInvariantError("WEEKDAYS_REQUIRED");
  }

  const uniqueWeekdays = new Set(draft.weekdays);
  if (
    uniqueWeekdays.size !== draft.weekdays.length ||
    draft.weekdays.some((day) => !Number.isInteger(day) || day < 0 || day > 6)
  ) {
    throw new ClassMeetingInvariantError("WEEKDAYS_INVALID");
  }

  const startMinutes = parseLocalTimeMinutes(draft.localStartTime);
  const endMinutes = parseLocalTimeMinutes(draft.localEndTime);
  if (endMinutes <= startMinutes) {
    throw new ClassMeetingInvariantError("TIME_ORDER");
  }

  if (draft.endsOn.getTime() < draft.startsOn.getTime()) {
    throw new ClassMeetingInvariantError("DATE_ORDER");
  }

  return draft;
}
