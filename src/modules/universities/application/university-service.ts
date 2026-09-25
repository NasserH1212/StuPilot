import type {
  UniversityRecord,
  UniversityRepository,
} from "./ports/university-repository";

export class UniversityService {
  public constructor(private readonly universities: UniversityRepository) {}

  public async listActiveUniversities(): Promise<readonly UniversityRecord[]> {
    return this.universities.listActive();
  }
}
