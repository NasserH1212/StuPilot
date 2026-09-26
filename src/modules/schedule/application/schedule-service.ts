import {
  assertClassMeetingDraft,
  ClassMeetingInvariantError,
  type ClassMeetingDraft,
} from "../domain/class-meeting";
import type {
  ClassMeetingEdit,
  ClassMeetingRecord,
  ClassMeetingRepository,
  NewClassMeeting,
} from "./ports/class-meeting-repository";
import { isScheduleError, ScheduleError } from "./schedule-error";

export class ScheduleService {
  public constructor(private readonly meetings: ClassMeetingRepository) {}

  public async listMeetingsForUserCourse(
    userId: string,
    userCourseId: string,
  ): Promise<readonly ClassMeetingRecord[]> {
    try {
      return await this.meetings.listForUserCourse(userCourseId, userId);
    } catch (error) {
      throw this.toScheduleError(error);
    }
  }

  public async getMeeting(
    userId: string,
    id: string,
  ): Promise<ClassMeetingRecord | null> {
    try {
      return await this.meetings.findForUser(id, userId);
    } catch (error) {
      throw this.toScheduleError(error);
    }
  }

  public async createMeeting(
    userId: string,
    userCourseId: string,
    draft: ClassMeetingDraft,
  ): Promise<ClassMeetingRecord> {
    const normalized = this.normalize(draft);
    const newMeeting: NewClassMeeting = { userId, userCourseId, ...normalized };
    try {
      return await this.meetings.create(newMeeting);
    } catch (error) {
      throw this.toScheduleError(error);
    }
  }

  public async editMeeting(
    userId: string,
    id: string,
    draft: Omit<ClassMeetingDraft, "startsOn" | "endsOn">,
  ): Promise<ClassMeetingRecord> {
    const existing = await this.requireOwnedMeeting(id, userId);
    const normalized = this.normalize({
      ...draft,
      startsOn: existing.startsOn,
      endsOn: existing.endsOn,
    });
    const edit: ClassMeetingEdit = {
      weekdays: normalized.weekdays,
      localStartTime: normalized.localStartTime,
      localEndTime: normalized.localEndTime,
      timeZone: normalized.timeZone,
      location: normalized.location,
      meetingType: normalized.meetingType,
    };

    try {
      return await this.meetings.update(id, userId, edit, existing.version);
    } catch (error) {
      throw this.toScheduleError(error);
    }
  }

  public async archiveMeeting(userId: string, id: string): Promise<ClassMeetingRecord> {
    const existing = await this.requireOwnedMeeting(id, userId);
    try {
      return await this.meetings.archive(id, userId, existing.version);
    } catch (error) {
      throw this.toScheduleError(error);
    }
  }

  private normalize(draft: ClassMeetingDraft): ClassMeetingDraft {
    try {
      return assertClassMeetingDraft({
        ...draft,
        location: draft.location?.trim() || null,
      });
    } catch (error) {
      if (error instanceof ClassMeetingInvariantError) {
        throw new ScheduleError("MEETING_INVALID", "The class meeting is invalid.", {
          cause: error,
        });
      }
      throw this.toScheduleError(error);
    }
  }

  private async requireOwnedMeeting(
    id: string,
    userId: string,
  ): Promise<ClassMeetingRecord> {
    let existing: ClassMeetingRecord | null;
    try {
      existing = await this.meetings.findForUser(id, userId);
    } catch (error) {
      throw this.toScheduleError(error);
    }

    if (!existing) {
      throw new ScheduleError("MEETING_NOT_FOUND", "The class meeting was not found.");
    }

    return existing;
  }

  private toScheduleError(error: unknown): ScheduleError {
    if (isScheduleError(error)) return error;
    return new ScheduleError(
      "MEETING_PERSISTENCE_UNAVAILABLE",
      "The class meeting store is unavailable.",
      { cause: error },
    );
  }
}
