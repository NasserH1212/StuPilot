import {
  assertClassMeetingDraft,
  ClassMeetingInvariantError,
  type ClassMeetingDraft,
} from "../domain/class-meeting";
import {
  generateOccurrences as expandMeetingOccurrences,
  OccurrenceWindowError,
  type ClassOccurrence,
  type OccurrenceBreak,
  type OccurrenceWindow,
} from "../domain/occurrence-generation";
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
    draft: Omit<ClassMeetingDraft, "startsOn" | "endsOn" | "timeZone">,
  ): Promise<ClassMeetingRecord> {
    const existing = await this.requireOwnedMeeting(id, userId);
    const normalized = this.normalize({
      ...draft,
      startsOn: existing.startsOn,
      endsOn: existing.endsOn,
      timeZone: existing.timeZone,
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

  /**
   * Expands already-fetched meetings into occurrences within `window`,
   * skipping `breaks`. Takes its inputs as plain data rather than fetching
   * the term or university breaks itself, so this service has no
   * dependency on TermService/UniversityService — the caller gathers those
   * first (see the class-meeting transport actions for the exact sequence).
   */
  public generateOccurrences(
    meetings: readonly ClassMeetingRecord[],
    window: OccurrenceWindow,
    breaks: readonly OccurrenceBreak[] = [],
  ): readonly ClassOccurrence[] {
    try {
      return meetings.flatMap((meeting) =>
        expandMeetingOccurrences(
          {
            seriesId: meeting.id,
            weekdays: meeting.weekdays,
            localStartTime: meeting.localStartTime,
            localEndTime: meeting.localEndTime,
            timeZone: meeting.timeZone,
            location: meeting.location,
            meetingType: meeting.meetingType,
          },
          window,
          breaks,
        ),
      );
    } catch (error) {
      if (error instanceof OccurrenceWindowError) {
        throw new ScheduleError(
          "OCCURRENCE_WINDOW_END_REQUIRED",
          "Occurrence generation requires a resolved end date for the window.",
          { cause: error },
        );
      }
      throw error;
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
