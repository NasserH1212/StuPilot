export const universityTermSlots = ["first", "second", "third", "summer"] as const;

export type UniversityTermSlot = (typeof universityTermSlots)[number];

export interface UniversityTermRecord {
  readonly id: string;
  readonly universityId: string;
  readonly academicYear: number;
  readonly term: UniversityTermSlot;
  readonly startsOn: Date;
  readonly endsOn: Date;
}

export interface UniversityTermRepository {
  listForUniversity(universityId: string): Promise<readonly UniversityTermRecord[]>;
}
