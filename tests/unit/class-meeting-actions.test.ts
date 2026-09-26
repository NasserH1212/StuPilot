import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/composition/authentication", () => ({
  createAuthenticationRuntime: vi.fn(),
}));

vi.mock("@/src/composition/schedule", () => ({
  createScheduleService: vi.fn(),
}));

vi.mock("@/src/composition/terms", () => ({
  createTermService: vi.fn(),
}));

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createScheduleService } from "@/src/composition/schedule";
import { createTermService } from "@/src/composition/terms";
import { ScheduleError } from "@/src/modules/schedule/application/schedule-error";
import {
  archiveClassMeetingAction,
  createClassMeetingAction,
  editClassMeetingAction,
} from "@/src/modules/schedule/transport/class-meeting-actions";

const termId = "018f57b5-f220-7d84-bafd-4d975e550100";
const userCourseId = "018f57b5-f220-7d84-bafd-4d975e550200";
const meetingId = "018f57b5-f220-7d84-bafd-4d975e550400";
const userId = "018f57b5-f220-7d84-bafd-4d975e550001";

const term = {
  id: termId,
  userId,
  name: "Fall 2026",
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-31T00:00:00.000Z"),
  timeZone: "Asia/Riyadh",
  isActive: true,
  archivedAt: null,
  version: 0,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date("2026-08-01T00:00:00.000Z"),
};

function form(fields: Record<string, string | readonly string[]>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      for (const item of value) data.append(key, item);
    } else {
      data.set(key, value as string);
    }
  }
  return data;
}

function fakeScheduleService(overrides: Record<string, unknown> = {}) {
  return {
    createMeeting: vi.fn(),
    editMeeting: vi.fn(),
    archiveMeeting: vi.fn(),
    ...overrides,
  };
}

function mockAvailableAccount(): void {
  vi.mocked(createAuthenticationRuntime).mockResolvedValue({
    available: true,
    service: { currentAccount: vi.fn().mockResolvedValue({ id: userId }) },
  } as never);
}

function mockOwnedTerm(): void {
  vi.mocked(createTermService).mockReturnValue({
    getTerm: vi.fn().mockResolvedValue(term),
  } as never);
}

describe("class meeting server actions", () => {
  beforeEach(() => {
    vi.mocked(createAuthenticationRuntime).mockReset();
    vi.mocked(createScheduleService).mockReset();
    vi.mocked(createTermService).mockReset();
  });

  describe("createClassMeetingAction", () => {
    it("rejects an incomplete submission before touching authentication", async () => {
      const result = await createClassMeetingAction(
        { status: "idle" },
        form({ termId, userCourseId }),
      );

      expect(result).toMatchObject({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("rejects an end time that is not after the start time", async () => {
      const result = await createClassMeetingAction(
        { status: "idle" },
        form({
          termId,
          userCourseId,
          weekdays: ["0", "2"],
          localStartTime: "10:00",
          localEndTime: "09:00",
          meetingType: "lecture",
        }),
      );

      expect(result).toEqual({
        status: "error",
        code: "VALIDATION_ERROR",
        fieldErrors: { localEndTime: true },
      });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("reports the service as unavailable when authentication cannot be reached", async () => {
      vi.mocked(createAuthenticationRuntime).mockResolvedValue({
        available: false,
      } as never);

      const result = await createClassMeetingAction(
        { status: "idle" },
        form({
          termId,
          userCourseId,
          weekdays: ["0", "2"],
          localStartTime: "09:00",
          localEndTime: "10:30",
          meetingType: "lecture",
        }),
      );

      expect(result).toEqual({ status: "error", code: "UNAVAILABLE" });
      expect(createTermService).not.toHaveBeenCalled();
    });

    it("reports the term as not found when it is not owned by the current account", async () => {
      mockAvailableAccount();
      vi.mocked(createTermService).mockReturnValue({
        getTerm: vi.fn().mockResolvedValue(null),
      } as never);

      const result = await createClassMeetingAction(
        { status: "idle" },
        form({
          termId,
          userCourseId,
          weekdays: ["0"],
          localStartTime: "09:00",
          localEndTime: "10:30",
          meetingType: "lecture",
        }),
      );

      expect(result).toEqual({ status: "error", code: "TERM_NOT_FOUND" });
      expect(createScheduleService).not.toHaveBeenCalled();
    });

    it("creates the meeting using the term's dates and time zone", async () => {
      mockAvailableAccount();
      mockOwnedTerm();
      const service = fakeScheduleService();
      vi.mocked(createScheduleService).mockReturnValue(service as never);

      const result = await createClassMeetingAction(
        { status: "idle" },
        form({
          termId,
          userCourseId,
          weekdays: ["0", "2"],
          localStartTime: "09:00",
          localEndTime: "10:30",
          location: "  Building 3, Room 101  ",
          meetingType: "lecture",
        }),
      );

      expect(service.createMeeting).toHaveBeenCalledWith(userId, userCourseId, {
        weekdays: [0, 2],
        localStartTime: "09:00",
        localEndTime: "10:30",
        startsOn: term.startsOn,
        endsOn: term.endsOn,
        timeZone: term.timeZone,
        location: "Building 3, Room 101",
        meetingType: "lecture",
      });
      expect(result).toEqual({ status: "success" });
    });

    it("maps an invalid-meeting service error to VALIDATION_ERROR", async () => {
      mockAvailableAccount();
      mockOwnedTerm();
      const service = fakeScheduleService({
        createMeeting: vi
          .fn()
          .mockRejectedValue(new ScheduleError("MEETING_INVALID", "invalid")),
      });
      vi.mocked(createScheduleService).mockReturnValue(service as never);

      const result = await createClassMeetingAction(
        { status: "idle" },
        form({
          termId,
          userCourseId,
          weekdays: ["0"],
          localStartTime: "09:00",
          localEndTime: "10:30",
          meetingType: "lecture",
        }),
      );

      expect(result).toEqual({ status: "error", code: "VALIDATION_ERROR" });
    });
  });

  describe("editClassMeetingAction", () => {
    it("rejects a submission with an invalid meeting id", async () => {
      const result = await editClassMeetingAction(
        { status: "idle" },
        form({
          id: "not-a-uuid",
          weekdays: ["0"],
          localStartTime: "09:00",
          localEndTime: "10:30",
          meetingType: "lecture",
        }),
      );

      expect(result).toMatchObject({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("edits the owned meeting without accepting a time zone override", async () => {
      mockAvailableAccount();
      const service = fakeScheduleService();
      vi.mocked(createScheduleService).mockReturnValue(service as never);

      const result = await editClassMeetingAction(
        { status: "idle" },
        form({
          id: meetingId,
          weekdays: ["1"],
          localStartTime: "13:00",
          localEndTime: "14:00",
          location: "",
          meetingType: "lab",
          timeZone: "Etc/UTC",
        }),
      );

      expect(service.editMeeting).toHaveBeenCalledWith(userId, meetingId, {
        weekdays: [1],
        localStartTime: "13:00",
        localEndTime: "14:00",
        location: null,
        meetingType: "lab",
      });
      expect(result).toEqual({ status: "success" });
    });

    it("maps a version-conflict service error to the CONFLICT action code", async () => {
      mockAvailableAccount();
      const service = fakeScheduleService({
        editMeeting: vi
          .fn()
          .mockRejectedValue(new ScheduleError("MEETING_VERSION_CONFLICT", "conflict")),
      });
      vi.mocked(createScheduleService).mockReturnValue(service as never);

      const result = await editClassMeetingAction(
        { status: "idle" },
        form({
          id: meetingId,
          weekdays: ["1"],
          localStartTime: "13:00",
          localEndTime: "14:00",
          meetingType: "lab",
        }),
      );

      expect(result).toEqual({ status: "error", code: "CONFLICT" });
    });
  });

  describe("archiveClassMeetingAction", () => {
    it("rejects a submission missing the meeting id", async () => {
      const result = await archiveClassMeetingAction({ status: "idle" }, form({}));

      expect(result).toEqual({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("archives the owned meeting for the current account", async () => {
      mockAvailableAccount();
      const service = fakeScheduleService();
      vi.mocked(createScheduleService).mockReturnValue(service as never);

      const result = await archiveClassMeetingAction(
        { status: "idle" },
        form({ id: meetingId }),
      );

      expect(service.archiveMeeting).toHaveBeenCalledWith(userId, meetingId);
      expect(result).toEqual({ status: "success" });
    });

    it("maps a not-found service error to the NOT_FOUND action code", async () => {
      mockAvailableAccount();
      const service = fakeScheduleService({
        archiveMeeting: vi
          .fn()
          .mockRejectedValue(new ScheduleError("MEETING_NOT_FOUND", "missing")),
      });
      vi.mocked(createScheduleService).mockReturnValue(service as never);

      const result = await archiveClassMeetingAction(
        { status: "idle" },
        form({ id: meetingId }),
      );

      expect(result).toEqual({ status: "error", code: "NOT_FOUND" });
    });
  });
});
