export const universityTermSlots = ["first", "second", "third", "summer"] as const;

export type UniversityTermSlot = (typeof universityTermSlots)[number];

export interface UniversityTermRecord {
  readonly id: string;
  readonly universityId: string;
  readonly academicYear: number;
  readonly term: UniversityTermSlot;
  readonly startsOn: Date;
  /** Null when the university has not yet published this term's end date. */
  readonly endsOn: Date | null;
}

export interface UniversityTermRepository {
  listForUniversity(universityId: string): Promise<readonly UniversityTermRecord[]>;
}
