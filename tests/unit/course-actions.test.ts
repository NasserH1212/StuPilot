import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/src/composition/authentication", () => ({
  createAuthenticationRuntime: vi.fn(),
}));

vi.mock("@/src/composition/courses", () => ({
  createCourseService: vi.fn(),
}));

vi.mock("@/src/composition/terms", () => ({
  createTermService: vi.fn(),
}));

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createCourseService } from "@/src/composition/courses";
import { createTermService } from "@/src/composition/terms";
import { CourseError } from "@/src/modules/courses/application/course-error";
import {
  archiveCourseAction,
  createCourseAction,
  editCourseAction,
} from "@/src/modules/courses/transport/course-actions";

const termId = "018f57b5-f220-7d84-bafd-4d975e550100";
const enrollmentId = "018f57b5-f220-7d84-bafd-4d975e550200";
const userId = "018f57b5-f220-7d84-bafd-4d975e550001";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

function fakeCourseService(overrides: Record<string, unknown> = {}) {
  return {
    listCourses: vi.fn(),
    createCourse: vi.fn(),
    editCourse: vi.fn(),
    archiveCourse: vi.fn(),
    ...overrides,
  };
}

function fakeTermService(overrides: Record<string, unknown> = {}) {
  return {
    getTerm: vi.fn().mockResolvedValue({ id: termId, userId }),
    ...overrides,
  };
}

function mockAvailableAccount(): void {
  vi.mocked(createAuthenticationRuntime).mockResolvedValue({
    available: true,
    service: { currentAccount: vi.fn().mockResolvedValue({ id: userId }) },
  } as never);
}

describe("course server actions", () => {
  beforeEach(() => {
    vi.mocked(createAuthenticationRuntime).mockReset();
    vi.mocked(createCourseService).mockReset();
    vi.mocked(createTermService).mockReset();
  });

  describe("createCourseAction", () => {
    it("rejects a blank name before touching authentication", async () => {
      const result = await createCourseAction(
        { status: "idle" },
        form({ locale: "en", termId, name: "", code: "", defaultLocation: "" }),
      );

      expect(result).toMatchObject({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("reports TERM_NOT_FOUND when the term does not belong to the user", async () => {
      mockAvailableAccount();
      vi.mocked(createTermService).mockReturnValue(
        fakeTermService({ getTerm: vi.fn().mockResolvedValue(null) }) as never,
      );
      const courseService = fakeCourseService();
      vi.mocked(createCourseService).mockReturnValue(courseService as never);

      const result = await createCourseAction(
        { status: "idle" },
        form({
          locale: "en",
          termId,
          name: "Calculus I",
          code: "",
          defaultLocation: "",
        }),
      );

      expect(result).toEqual({ status: "error", code: "TERM_NOT_FOUND" });
      expect(courseService.createCourse).not.toHaveBeenCalled();
    });

    it("creates the course for the owned term with optional fields normalized to null", async () => {
      mockAvailableAccount();
      vi.mocked(createTermService).mockReturnValue(fakeTermService() as never);
      const courseService = fakeCourseService();
      vi.mocked(createCourseService).mockReturnValue(courseService as never);

      const result = await createCourseAction(
        { status: "idle" },
        form({
          locale: "en",
          termId,
          name: "  Calculus I  ",
          code: "  ",
          defaultLocation: "Building A",
        }),
      );

      expect(courseService.createCourse).toHaveBeenCalledWith(userId, termId, {
        name: "Calculus I",
        code: null,
        colorToken: null,
        defaultLocation: "Building A",
      });
      expect(result).toEqual({ status: "success" });
    });
  });

  describe("editCourseAction", () => {
    it("rejects a submission missing required ids", async () => {
      const result = await editCourseAction(
        { status: "idle" },
        form({ locale: "en", name: "Calculus I", code: "", defaultLocation: "" }),
      );

      expect(result).toMatchObject({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("edits the owned course without re-checking term ownership", async () => {
      mockAvailableAccount();
      const courseService = fakeCourseService();
      vi.mocked(createCourseService).mockReturnValue(courseService as never);

      const result = await editCourseAction(
        { status: "idle" },
        form({
          locale: "en",
          termId,
          enrollmentId,
          name: "Calculus I (revised)",
          code: "MATH101",
          defaultLocation: "Building B",
        }),
      );

      expect(createTermService).not.toHaveBeenCalled();
      expect(courseService.editCourse).toHaveBeenCalledWith(
        userId,
        termId,
        enrollmentId,
        {
          name: "Calculus I (revised)",
          code: "MATH101",
          colorToken: null,
          defaultLocation: "Building B",
        },
      );
      expect(result).toEqual({ status: "success" });
    });

    it("maps a version-conflict service error to the CONFLICT action code", async () => {
      mockAvailableAccount();
      const courseService = fakeCourseService({
        editCourse: vi
          .fn()
          .mockRejectedValue(
            new CourseError(
              "COURSE_VERSION_CONFLICT",
              "The course changed since it was loaded.",
            ),
          ),
      });
      vi.mocked(createCourseService).mockReturnValue(courseService as never);

      const result = await editCourseAction(
        { status: "idle" },
        form({
          locale: "en",
          termId,
          enrollmentId,
          name: "Calculus I",
          code: "",
          defaultLocation: "",
        }),
      );

      expect(result).toEqual({ status: "error", code: "CONFLICT" });
    });
  });

  describe("archiveCourseAction", () => {
    it("rejects a submission missing required ids", async () => {
      const result = await archiveCourseAction(
        { status: "idle" },
        form({ locale: "en" }),
      );

      expect(result).toEqual({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("archives the owned course", async () => {
      mockAvailableAccount();
      const courseService = fakeCourseService();
      vi.mocked(createCourseService).mockReturnValue(courseService as never);

      const result = await archiveCourseAction(
        { status: "idle" },
        form({ locale: "en", termId, enrollmentId }),
      );

      expect(courseService.archiveCourse).toHaveBeenCalledWith(
        userId,
        termId,
        enrollmentId,
      );
      expect(result).toEqual({ status: "success" });
    });
  });
});
