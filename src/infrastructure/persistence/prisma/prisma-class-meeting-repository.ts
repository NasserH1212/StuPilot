import type {
  ClassMeetingEdit,
  ClassMeetingRecord,
  ClassMeetingRepository,
  NewClassMeeting,
} from "@/src/modules/schedule/application/ports/class-meeting-repository";
import { ScheduleError } from "@/src/modules/schedule/application/schedule-error";
import type { Weekday } from "@/src/modules/schedule/domain/class-meeting";

import type { StuPilotPrismaClient } from "./create-prisma-client";

interface ClassMeetingRow {
  readonly id: string;
  readonly userId: string;
  readonly userCourseId: string;
  readonly weekdays: readonly number[];
  readonly localStartTime: Date;
  readonly localEndTime: Date;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
  readonly location: string | null;
  readonly meetingType: ClassMeetingRecord["meetingType"];
  readonly archivedAt: Date | null;
  readonly version: number;
}

/** Postgres TIME values round-trip through Prisma as a UTC-based Date. */
function toLocalTimeString(value: Date): string {
  const hours = String(value.getUTCHours()).padStart(2, "0");
  const minutes = String(value.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toRecord(row: ClassMeetingRow): ClassMeetingRecord {
  return {
    id: row.id,
    userId: row.userId,
    userCourseId: row.userCourseId,
    weekdays: row.weekdays as readonly Weekday[],
    localStartTime: toLocalTimeString(row.localStartTime),
    localEndTime: toLocalTimeString(row.localEndTime),
    startsOn: row.startsOn,
    endsOn: row.endsOn,
    timeZone: row.timeZone,
    location: row.location,
    meetingType: row.meetingType,
    archivedAt: row.archivedAt,
    version: row.version,
  };
}

export class PrismaClassMeetingRepository implements ClassMeetingRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async create(meeting: NewClassMeeting): Promise<ClassMeetingRecord> {
    const row = await this.client.recurringClassSeries.create({
      data: {
        userId: meeting.userId,
        userCourseId: meeting.userCourseId,
        weekdays: [...meeting.weekdays],
        localStartTime: `${meeting.localStartTime}:00`,
        localEndTime: `${meeting.localEndTime}:00`,
        startsOn: meeting.startsOn,
        endsOn: meeting.endsOn,
        timeZone: meeting.timeZone,
        location: meeting.location,
        meetingType: meeting.meetingType,
      },
    });

    return toRecord(row);
  }

  public async listForUserCourse(
    userCourseId: string,
    userId: string,
  ): Promise<readonly ClassMeetingRecord[]> {
    const rows = await this.client.recurringClassSeries.findMany({
      where: { userCourseId, userId },
      orderBy: [{ localStartTime: "asc" }],
    });

    return rows.map(toRecord);
  }

  public async findForUser(
    id: string,
    userId: string,
  ): Promise<ClassMeetingRecord | null> {
    const row = await this.client.recurringClassSeries.findFirst({
      where: { id, userId },
    });
    return row ? toRecord(row) : null;
  }

  public async update(
    id: string,
    userId: string,
    edit: ClassMeetingEdit,
    expectedVersion: number,
  ): Promise<ClassMeetingRecord> {
    const result = await this.client.recurringClassSeries.updateMany({
      where: { id, userId, version: expectedVersion },
      data: {
        weekdays: [...edit.weekdays],
        localStartTime: `${edit.localStartTime}:00`,
        localEndTime: `${edit.localEndTime}:00`,
        timeZone: edit.timeZone,
        location: edit.location,
        meetingType: edit.meetingType,
        version: { increment: 1 },
      },
    });

    if (result.count === 0) throw await this.missingOrConflict(id, userId);

    return this.requireCurrent(id, userId);
  }

  public async archive(
    id: string,
    userId: string,
    expectedVersion: number,
  ): Promise<ClassMeetingRecord> {
    const result = await this.client.recurringClassSeries.updateMany({
      where: { id, userId, version: expectedVersion },
      data: { archivedAt: new Date(), version: { increment: 1 } },
    });

    if (result.count === 0) throw await this.missingOrConflict(id, userId);

    return this.requireCurrent(id, userId);
  }

  private async requireCurrent(
    id: string,
    userId: string,
  ): Promise<ClassMeetingRecord> {
    const row = await this.client.recurringClassSeries.findFirst({
      where: { id, userId },
    });
    if (!row) {
      throw new ScheduleError("MEETING_NOT_FOUND", "The class meeting was not found.");
    }
    return toRecord(row);
  }

  private async missingOrConflict(id: string, userId: string): Promise<ScheduleError> {
    const existing = await this.client.recurringClassSeries.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    return existing
      ? new ScheduleError(
          "MEETING_VERSION_CONFLICT",
          "The class meeting changed since it was loaded.",
        )
      : new ScheduleError("MEETING_NOT_FOUND", "The class meeting was not found.");
  }
}
