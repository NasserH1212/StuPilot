import {
  assertCourseDraft,
  CourseInvariantError,
  type CourseDraft,
} from "../domain/course";
import { CourseError, isCourseError } from "./course-error";
import type {
  CourseRepository,
  TermCourseEdit,
  TermCourseRecord,
} from "./ports/course-repository";

export class CourseService {
  public constructor(private readonly courses: CourseRepository) {}

  public async listCourses(
    userId: string,
    termId: string,
  ): Promise<readonly TermCourseRecord[]> {
    try {
      return await this.courses.listForTerm(userId, termId);
    } catch (error) {
      throw this.toCourseError(error);
    }
  }

  public async createCourse(
    userId: string,
    termId: string,
    draft: CourseDraft,
  ): Promise<TermCourseRecord> {
    const normalized = this.normalize(draft);
    try {
      return await this.courses.create({ userId, termId, ...normalized });
    } catch (error) {
      throw this.toCourseError(error);
    }
  }

  public async editCourse(
    userId: string,
    termId: string,
    enrollmentId: string,
    draft: CourseDraft,
  ): Promise<TermCourseRecord> {
    const normalized = this.normalize(draft);
    const existing = await this.requireOwnedCourse(enrollmentId, userId, termId);
    const edit: TermCourseEdit = normalized;

    try {
      return await this.courses.update(
        enrollmentId,
        userId,
        termId,
        edit,
        existing.courseVersion,
      );
    } catch (error) {
      throw this.toCourseError(error);
    }
  }

  public async archiveCourse(
    userId: string,
    termId: string,
    enrollmentId: string,
  ): Promise<TermCourseRecord> {
    const existing = await this.requireOwnedCourse(enrollmentId, userId, termId);
    try {
      return await this.courses.archive(
        enrollmentId,
        userId,
        termId,
        existing.enrollmentVersion,
      );
    } catch (error) {
      throw this.toCourseError(error);
    }
  }

  private normalize(draft: CourseDraft): CourseDraft {
    try {
      return assertCourseDraft({
        ...draft,
        name: draft.name.trim(),
        code: draft.code?.trim() || null,
        defaultLocation: draft.defaultLocation?.trim() || null,
      });
    } catch (error) {
      if (error instanceof CourseInvariantError) {
        throw new CourseError("COURSE_INVALID", "The course is invalid.", {
          cause: error,
        });
      }
      throw this.toCourseError(error);
    }
  }

  private async requireOwnedCourse(
    enrollmentId: string,
    userId: string,
    termId: string,
  ): Promise<TermCourseRecord> {
    let existing: TermCourseRecord | null;
    try {
      existing = await this.courses.findForTerm(enrollmentId, userId, termId);
    } catch (error) {
      throw this.toCourseError(error);
    }

    if (!existing) {
      throw new CourseError("COURSE_NOT_FOUND", "The course was not found.");
    }

    return existing;
  }

  private toCourseError(error: unknown): CourseError {
    if (isCourseError(error)) return error;
    return new CourseError(
      "COURSE_PERSISTENCE_UNAVAILABLE",
      "The course store is unavailable.",
      { cause: error },
    );
  }
}
