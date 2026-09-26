import { describe, expect, it } from "vitest";

import { CourseService } from "@/src/modules/courses/application/course-service";
import type {
  CourseRepository,
  NewTermCourse,
  TermCourseRecord,
} from "@/src/modules/courses/application/ports/course-repository";
import type { CourseDraft } from "@/src/modules/courses/domain/course";

const baseCourse: TermCourseRecord = {
  enrollmentId: "018f57b5-f220-7d84-bafd-4d975e550200",
  courseId: "018f57b5-f220-7d84-bafd-4d975e550300",
  userId: "018f57b5-f220-7d84-bafd-4d975e550001",
  termId: "018f57b5-f220-7d84-bafd-4d975e550100",
  name: "Calculus I",
  code: "MATH101",
  colorToken: null,
  defaultLocation: "Building A",
  archivedAt: null,
  courseVersion: 0,
  enrollmentVersion: 0,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date("2026-08-01T00:00:00.000Z"),
};

function validDraft(overrides: Partial<CourseDraft> = {}): CourseDraft {
  return {
    name: "Calculus I",
    code: "MATH101",
    colorToken: null,
    defaultLocation: "Building A",
    ...overrides,
  };
}

function repository(overrides: Partial<CourseRepository> = {}): CourseRepository {
  return {
    listForTerm: async () => [baseCourse],
    findForTerm: async () => baseCourse,
    create: async () => baseCourse,
    update: async () => baseCourse,
    archive: async () => ({ ...baseCourse, archivedAt: new Date() }),
    ...overrides,
  };
}

describe("course application service", () => {
  it("trims the name and delegates creation to the repository", async () => {
    let received: NewTermCourse | undefined;
    const service = new CourseService(
      repository({
        create: async (course) => {
          received = course;
          return { ...baseCourse, name: course.name };
        },
      }),
    );

    const result = await service.createCourse(
      baseCourse.userId,
      baseCourse.termId,
      validDraft({ name: "  Calculus I  " }),
    );

    expect(received?.name).toBe("Calculus I");
    expect(received?.termId).toBe(baseCourse.termId);
    expect(received?.userId).toBe(baseCourse.userId);
    expect(result.name).toBe("Calculus I");
  });

  it("normalizes blank optional fields to null", async () => {
    let received: NewTermCourse | undefined;
    const service = new CourseService(
      repository({
        create: async (course) => {
          received = course;
          return baseCourse;
        },
      }),
    );

    await service.createCourse(
      baseCourse.userId,
      baseCourse.termId,
      validDraft({ code: "   ", defaultLocation: "   " }),
    );

    expect(received?.code).toBeNull();
    expect(received?.defaultLocation).toBeNull();
  });

  it("rejects a blank course name as invalid", async () => {
    const service = new CourseService(repository());

    await expect(
      service.createCourse(
        baseCourse.userId,
        baseCourse.termId,
        validDraft({ name: "   " }),
      ),
    ).rejects.toMatchObject({ code: "COURSE_INVALID" });
  });

  it("reports a missing course as not found when editing", async () => {
    const service = new CourseService(repository({ findForTerm: async () => null }));

    await expect(
      service.editCourse(
        baseCourse.userId,
        baseCourse.termId,
        baseCourse.enrollmentId,
        validDraft(),
      ),
    ).rejects.toMatchObject({ code: "COURSE_NOT_FOUND" });
  });

  it("edits using the course's current version, not the enrollment's", async () => {
    let receivedVersion: number | undefined;
    const service = new CourseService(
      repository({
        findForTerm: async () => ({
          ...baseCourse,
          courseVersion: 3,
          enrollmentVersion: 7,
        }),
        update: async (
          _enrollmentId,
          _userId,
          _termId,
          _edit,
          expectedCourseVersion,
        ) => {
          receivedVersion = expectedCourseVersion;
          return baseCourse;
        },
      }),
    );

    await service.editCourse(
      baseCourse.userId,
      baseCourse.termId,
      baseCourse.enrollmentId,
      validDraft(),
    );

    expect(receivedVersion).toBe(3);
  });

  it("archives using the enrollment's current version, not the course's", async () => {
    let receivedVersion: number | undefined;
    const service = new CourseService(
      repository({
        findForTerm: async () => ({
          ...baseCourse,
          courseVersion: 3,
          enrollmentVersion: 7,
        }),
        archive: async (_enrollmentId, _userId, _termId, expectedEnrollmentVersion) => {
          receivedVersion = expectedEnrollmentVersion;
          return { ...baseCourse, archivedAt: new Date() };
        },
      }),
    );

    const result = await service.archiveCourse(
      baseCourse.userId,
      baseCourse.termId,
      baseCourse.enrollmentId,
    );

    expect(receivedVersion).toBe(7);
    expect(result.archivedAt).not.toBeNull();
  });

  it("returns null from getCourse when the repository finds nothing", async () => {
    const service = new CourseService(repository({ findForTerm: async () => null }));

    const result = await service.getCourse(
      baseCourse.userId,
      baseCourse.termId,
      baseCourse.enrollmentId,
    );

    expect(result).toBeNull();
  });

  it("getCourse scopes the lookup to the requesting user, term, and enrollment", async () => {
    let requested: { enrollmentId?: string; userId?: string; termId?: string } = {};
    const service = new CourseService(
      repository({
        findForTerm: async (enrollmentId, userId, termId) => {
          requested = { enrollmentId, userId, termId };
          return baseCourse;
        },
      }),
    );

    const result = await service.getCourse(
      baseCourse.userId,
      baseCourse.termId,
      baseCourse.enrollmentId,
    );

    expect(requested).toEqual({
      enrollmentId: baseCourse.enrollmentId,
      userId: baseCourse.userId,
      termId: baseCourse.termId,
    });
    expect(result).toEqual(baseCourse);
  });

  it("scopes listing to the requesting user and term", async () => {
    let requested: { userId?: string; termId?: string } = {};
    const service = new CourseService(
      repository({
        listForTerm: async (userId, termId) => {
          requested = { userId, termId };
          return [baseCourse];
        },
      }),
    );

    const result = await service.listCourses(baseCourse.userId, baseCourse.termId);

    expect(requested).toEqual({ userId: baseCourse.userId, termId: baseCourse.termId });
    expect(result).toHaveLength(1);
  });
});
