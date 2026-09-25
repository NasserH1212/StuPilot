export type CourseFieldName = "name" | "code" | "defaultLocation";

export type CourseActionCode =
  | "VALIDATION_ERROR"
  | "UNAVAILABLE"
  | "TERM_NOT_FOUND"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNEXPECTED";

export interface CourseActionState {
  readonly status: "idle" | "error" | "success";
  readonly code?: CourseActionCode;
  readonly fieldErrors?: Readonly<Partial<Record<CourseFieldName, true>>>;
}

export const initialCourseActionState: CourseActionState = { status: "idle" };
