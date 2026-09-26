import type { ClassMeetingType, Weekday } from "../../domain/class-meeting";

export interface ClassMeetingRecord {
  readonly id: string;
  readonly userId: string;
  readonly userCourseId: string;
  readonly weekdays: readonly Weekday[];
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

export interface NewClassMeeting {
  readonly userId: string;
  readonly userCourseId: string;
  readonly weekdays: readonly Weekday[];
  readonly localStartTime: string;
  readonly localEndTime: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
  readonly location: string | null;
  readonly meetingType: ClassMeetingType;
}

export interface ClassMeetingEdit {
  readonly weekdays: readonly Weekday[];
  readonly localStartTime: string;
  readonly localEndTime: string;
  readonly timeZone: string;
  readonly location: string | null;
  readonly meetingType: ClassMeetingType;
}

export interface ClassMeetingRepository {
  create(meeting: NewClassMeeting): Promise<ClassMeetingRecord>;
  listForUserCourse(
    userCourseId: string,
    userId: string,
  ): Promise<readonly ClassMeetingRecord[]>;
  findForUser(id: string, userId: string): Promise<ClassMeetingRecord | null>;
  update(
    id: string,
    userId: string,
    edit: ClassMeetingEdit,
    expectedVersion: number,
  ): Promise<ClassMeetingRecord>;
  archive(
    id: string,
    userId: string,
    expectedVersion: number,
  ): Promise<ClassMeetingRecord>;
}
