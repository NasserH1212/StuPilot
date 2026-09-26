export interface UniversityBreakRecord {
  readonly id: string;
  readonly universityId: string;
  readonly academicYear: number;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly resumesOn: Date;
}

export interface UniversityBreakRepository {
  listForUniversity(universityId: string): Promise<readonly UniversityBreakRecord[]>;
}
