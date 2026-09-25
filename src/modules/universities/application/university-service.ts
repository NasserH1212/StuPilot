import type {
  UniversityRecord,
  UniversityRepository,
} from "./ports/university-repository";
import type {
  UniversityTermRecord,
  UniversityTermRepository,
} from "./ports/university-term-repository";

export class UniversityService {
  public constructor(
    private readonly universities: UniversityRepository,
    private readonly universityTerms: UniversityTermRepository,
  ) {}

  public async listActiveUniversities(): Promise<readonly UniversityRecord[]> {
    return this.universities.listActive();
  }

  public async listPublishedTerms(
    universityId: string | null,
  ): Promise<readonly UniversityTermRecord[]> {
    if (!universityId) return [];
    return this.universityTerms.listForUniversity(universityId);
  }
}
