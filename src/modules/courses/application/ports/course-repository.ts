export interface TermCourseRecord {
  readonly enrollmentId: string;
  readonly courseId: string;
  readonly userId: string;
  readonly termId: string;
  readonly name: string;
  readonly code: string | null;
  readonly colorToken: string | null;
  readonly defaultLocation: string | null;
  readonly archivedAt: Date | null;
  readonly courseVersion: number;
  readonly enrollmentVersion: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface NewTermCourse {
  readonly userId: string;
  readonly termId: string;
  readonly name: string;
  readonly code: string | null;
  readonly colorToken: string | null;
  readonly defaultLocation: string | null;
}

export interface TermCourseEdit {
  readonly name: string;
  readonly code: string | null;
  readonly colorToken: string | null;
  readonly defaultLocation: string | null;
}

export interface CourseRepository {
  listForTerm(userId: string, termId: string): Promise<readonly TermCourseRecord[]>;
  findForTerm(
    enrollmentId: string,
    userId: string,
    termId: string,
  ): Promise<TermCourseRecord | null>;
  create(course: NewTermCourse): Promise<TermCourseRecord>;
  update(
    enrollmentId: string,
    userId: string,
    termId: string,
    edit: TermCourseEdit,
    expectedCourseVersion: number,
  ): Promise<TermCourseRecord>;
  archive(
    enrollmentId: string,
    userId: string,
    termId: string,
    expectedEnrollmentVersion: number,
  ): Promise<TermCourseRecord>;
}
