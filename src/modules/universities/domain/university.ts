export interface University {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly shortName: string;
  readonly logoPath: string | null;
  readonly active: boolean;
}
