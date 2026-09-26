import { describe, expect, it } from "vitest";

import type {
  ClassMeetingRecord,
  ClassMeetingRepository,
  NewClassMeeting,
} from "@/src/modules/schedule/application/ports/class-meeting-repository";
import { ScheduleError } from "@/src/modules/schedule/application/schedule-error";
import { ScheduleService } from "@/src/modules/schedule/application/schedule-service";
import type { ClassMeetingDraft } from "@/src/modules/schedule/domain/class-meeting";

const baseRecord: ClassMeetingRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550400",
  userId: "018f57b5-f220-7d84-bafd-4d975e550001",
  userCourseId: "018f57b5-f220-7d84-bafd-4d975e550200",
  weekdays: [0, 2],
  localStartTime: "09:00",
  localEndTime: "10:30",
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-15T00:00:00.000Z"),
  timeZone: "Asia/Riyadh",
  location: "Building 3, Room 101",
  meetingType: "lecture",
  archivedAt: null,
  version: 0,
};

function validDraft(overrides: Partial<ClassMeetingDraft> = {}): ClassMeetingDraft {
  return {
    weekdays: baseRecord.weekdays,
    localStartTime: baseRecord.localStartTime,
    localEndTime: baseRecord.localEndTime,
    startsOn: baseRecord.startsOn,
    endsOn: baseRecord.endsOn,
    timeZone: baseRecord.timeZone,
    location: baseRecord.location,
    meetingType: baseRecord.meetingType,
    ...overrides,
  };
}

function repository(
  overrides: Partial<ClassMeetingRepository> = {},
): ClassMeetingRepository {
  return {
    create: async () => baseRecord,
    listForUserCourse: async () => [baseRecord],
    findForUser: async () => baseRecord,
    update: async () => baseRecord,
    archive: async () => ({ ...baseRecord, archivedAt: new Date() }),
    ...overrides,
  };
}

describe("schedule application service", () => {
  it("trims the location and delegates creation to the repository", async () => {
    let received: NewClassMeeting | undefined;
    const service = new ScheduleService(
      repository({
        create: async (meeting) => {
          received = meeting;
          return { ...baseRecord, location: meeting.location };
        },
      }),
    );

    await service.createMeeting(
      baseRecord.userId,
      baseRecord.userCourseId,
      validDraft({ location: "  Building 3, Room 101  " }),
    );

    expect(received?.location).toBe("Building 3, Room 101");
    expect(received?.userCourseId).toBe(baseRecord.userCourseId);
  });

  it("converts a blank location to null", async () => {
    let received: NewClassMeeting | undefined;
    const service = new ScheduleService(
      repository({
        create: async (meeting) => {
          received = meeting;
          return baseRecord;
        },
      }),
    );

    await service.createMeeting(
      baseRecord.userId,
      baseRecord.userCourseId,
      validDraft({ location: "   " }),
    );

    expect(received?.location).toBeNull();
  });

  it("rejects an invalid draft before touching the repository", async () => {
    let called = false;
    const service = new ScheduleService(
      repository({ create: async () => ((called = true), baseRecord) }),
    );

    await expect(
      service.createMeeting(
        baseRecord.userId,
        baseRecord.userCourseId,
        validDraft({ weekdays: [] }),
      ),
    ).rejects.toMatchObject({ code: "MEETING_INVALID" });
    expect(called).toBe(false);
  });

  it("reports a missing meeting as not found when editing", async () => {
    const service = new ScheduleService(repository({ findForUser: async () => null }));

    await expect(
      service.editMeeting(baseRecord.userId, baseRecord.id, {
        weekdays: baseRecord.weekdays,
        localStartTime: baseRecord.localStartTime,
        localEndTime: baseRecord.localEndTime,
        timeZone: baseRecord.timeZone,
        location: baseRecord.location,
        meetingType: baseRecord.meetingType,
      }),
    ).rejects.toMatchObject({ code: "MEETING_NOT_FOUND" });
  });

  it("edits an owned meeting using its current version, keeping its dates", async () => {
    let receivedVersion: number | undefined;
    const service = new ScheduleService(
      repository({
        update: async (_id, _userId, _edit, expectedVersion) => {
          receivedVersion = expectedVersion;
          return baseRecord;
        },
      }),
    );

    const result = await service.editMeeting(baseRecord.userId, baseRecord.id, {
      weekdays: [1],
      localStartTime: "13:00",
      localEndTime: "14:00",
      timeZone: baseRecord.timeZone,
      location: null,
      meetingType: "lab",
    });

    expect(receivedVersion).toBe(baseRecord.version);
    expect(result).toEqual(baseRecord);
  });

  it("archives an owned meeting using its current version", async () => {
    let receivedVersion: number | undefined;
    const service = new ScheduleService(
      repository({
        archive: async (_id, _userId, expectedVersion) => {
          receivedVersion = expectedVersion;
          return { ...baseRecord, archivedAt: new Date() };
        },
      }),
    );

    const result = await service.archiveMeeting(baseRecord.userId, baseRecord.id);

    expect(receivedVersion).toBe(baseRecord.version);
    expect(result.archivedAt).not.toBeNull();
  });

  it("surfaces a version conflict raised by the repository", async () => {
    const service = new ScheduleService(
      repository({
        archive: async () => {
          throw new ScheduleError(
            "MEETING_VERSION_CONFLICT",
            "The class meeting changed since it was loaded.",
          );
        },
      }),
    );

    await expect(
      service.archiveMeeting(baseRecord.userId, baseRecord.id),
    ).rejects.toMatchObject({ code: "MEETING_VERSION_CONFLICT" });
  });

  it("scopes listing to the requesting user course", async () => {
    let requested: { userCourseId?: string; userId?: string } = {};
    const service = new ScheduleService(
      repository({
        listForUserCourse: async (userCourseId, userId) => {
          requested = { userCourseId, userId };
          return [baseRecord];
        },
      }),
    );

    const result = await service.listMeetingsForUserCourse(
      baseRecord.userId,
      baseRecord.userCourseId,
    );

    expect(requested).toEqual({
      userCourseId: baseRecord.userCourseId,
      userId: baseRecord.userId,
    });
    expect(result).toHaveLength(1);
  });

  it("wraps an unexpected repository failure as a persistence-unavailable error", async () => {
    const service = new ScheduleService(
      repository({
        create: async () => {
          throw new Error("connection reset");
        },
      }),
    );

    await expect(
      service.createMeeting(baseRecord.userId, baseRecord.userCourseId, validDraft()),
    ).rejects.toMatchObject({ code: "MEETING_PERSISTENCE_UNAVAILABLE" });
  });
});
