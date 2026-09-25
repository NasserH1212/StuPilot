import { CourseError } from "@/src/modules/courses/application/course-error";
import type {
  CourseRepository,
  NewTermCourse,
  TermCourseEdit,
  TermCourseRecord,
} from "@/src/modules/courses/application/ports/course-repository";

import type { StuPilotPrismaClient } from "./create-prisma-client";

interface UserCourseWithCourseRow {
  readonly id: string;
  readonly userId: string;
  readonly termId: string;
  readonly courseId: string;
  readonly archivedAt: Date | null;
  readonly version: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly course: {
    readonly name: string;
    readonly code: string | null;
    readonly colorToken: string | null;
    readonly defaultLocation: string | null;
    readonly version: number;
  };
}

function toRecord(row: UserCourseWithCourseRow): TermCourseRecord {
  return {
    enrollmentId: row.id,
    courseId: row.courseId,
    userId: row.userId,
    termId: row.termId,
    name: row.course.name,
    code: row.course.code,
    colorToken: row.course.colorToken,
    defaultLocation: row.course.defaultLocation,
    archivedAt: row.archivedAt,
    courseVersion: row.course.version,
    enrollmentVersion: row.version,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const courseInclude = { course: true } as const;

export class PrismaCourseRepository implements CourseRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async listForTerm(
    userId: string,
    termId: string,
  ): Promise<readonly TermCourseRecord[]> {
    const rows = await this.client.userCourse.findMany({
      where: { userId, termId },
      include: courseInclude,
      orderBy: [
        { archivedAt: { sort: "asc", nulls: "first" } },
        { course: { name: "asc" } },
      ],
    });

    return rows.map(toRecord);
  }

  public async findForTerm(
    enrollmentId: string,
    userId: string,
    termId: string,
  ): Promise<TermCourseRecord | null> {
    const row = await this.client.userCourse.findFirst({
      where: { id: enrollmentId, userId, termId },
      include: courseInclude,
    });

    return row ? toRecord(row) : null;
  }

  public async create(newCourse: NewTermCourse): Promise<TermCourseRecord> {
    return this.client.$transaction(async (transaction) => {
      const course = await transaction.course.create({
        data: {
          userId: newCourse.userId,
          name: newCourse.name,
          code: newCourse.code,
          colorToken: newCourse.colorToken,
          defaultLocation: newCourse.defaultLocation,
        },
      });

      const enrollment = await transaction.userCourse.create({
        data: {
          userId: newCourse.userId,
          termId: newCourse.termId,
          courseId: course.id,
        },
      });

      return toRecord({ ...enrollment, course });
    });
  }

  public async update(
    enrollmentId: string,
    userId: string,
    termId: string,
    edit: TermCourseEdit,
    expectedCourseVersion: number,
  ): Promise<TermCourseRecord> {
    const enrollment = await this.client.userCourse.findFirst({
      where: { id: enrollmentId, userId, termId },
      select: { courseId: true },
    });

    if (!enrollment) {
      throw new CourseError("COURSE_NOT_FOUND", "The course was not found.");
    }

    const result = await this.client.course.updateMany({
      where: { id: enrollment.courseId, userId, version: expectedCourseVersion },
      data: {
        name: edit.name,
        code: edit.code,
        colorToken: edit.colorToken,
        defaultLocation: edit.defaultLocation,
        version: { increment: 1 },
      },
    });

    if (result.count === 0) {
      throw new CourseError(
        "COURSE_VERSION_CONFLICT",
        "The course changed since it was loaded.",
      );
    }

    return this.requireCurrent(enrollmentId, userId, termId);
  }

  public async archive(
    enrollmentId: string,
    userId: string,
    termId: string,
    expectedEnrollmentVersion: number,
  ): Promise<TermCourseRecord> {
    const result = await this.client.userCourse.updateMany({
      where: { id: enrollmentId, userId, termId, version: expectedEnrollmentVersion },
      data: { archivedAt: new Date(), version: { increment: 1 } },
    });

    if (result.count === 0) {
      throw await this.missingOrConflict(enrollmentId, userId, termId);
    }

    return this.requireCurrent(enrollmentId, userId, termId);
  }

  private async requireCurrent(
    enrollmentId: string,
    userId: string,
    termId: string,
  ): Promise<TermCourseRecord> {
    const row = await this.client.userCourse.findFirst({
      where: { id: enrollmentId, userId, termId },
      include: courseInclude,
    });
    if (!row) {
      throw new CourseError("COURSE_NOT_FOUND", "The course was not found.");
    }
    return toRecord(row);
  }

  private async missingOrConflict(
    enrollmentId: string,
    userId: string,
    termId: string,
  ): Promise<CourseError> {
    const existing = await this.client.userCourse.findFirst({
      where: { id: enrollmentId, userId, termId },
      select: { id: true },
    });

    return existing
      ? new CourseError(
          "COURSE_VERSION_CONFLICT",
          "The course changed since it was loaded.",
        )
      : new CourseError("COURSE_NOT_FOUND", "The course was not found.");
  }
}
