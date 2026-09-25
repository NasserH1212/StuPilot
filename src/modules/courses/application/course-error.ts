import { ApplicationError } from "@/src/shared/errors/application-error";

export const courseErrorCodes = [
  "COURSE_NOT_FOUND",
  "COURSE_INVALID",
  "COURSE_VERSION_CONFLICT",
  "COURSE_PERSISTENCE_UNAVAILABLE",
] as const;

export type CourseErrorCode = (typeof courseErrorCodes)[number];

export class CourseError extends ApplicationError {
  declare public readonly code: CourseErrorCode;

  public constructor(code: CourseErrorCode, message: string, options?: ErrorOptions) {
    super(code, message, options);
    this.name = "CourseError";
  }
}

export function isCourseError(error: unknown): error is CourseError {
  return error instanceof CourseError;
}
