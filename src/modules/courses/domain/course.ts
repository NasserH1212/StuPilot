export interface CourseDraft {
  readonly name: string;
  readonly code: string | null;
  readonly colorToken: string | null;
  readonly defaultLocation: string | null;
}

export const courseInvariantCodes = ["NAME_REQUIRED"] as const;

export type CourseInvariantCode = (typeof courseInvariantCodes)[number];

export class CourseInvariantError extends Error {
  public constructor(public readonly invariant: CourseInvariantCode) {
    super(`The course violates the ${invariant} invariant.`);
    this.name = "CourseInvariantError";
  }
}

export function assertCourseDraft(draft: CourseDraft): CourseDraft {
  if (draft.name.trim().length === 0) {
    throw new CourseInvariantError("NAME_REQUIRED");
  }

  return draft;
}
