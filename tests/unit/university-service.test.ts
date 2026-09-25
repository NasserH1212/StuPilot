import { describe, expect, it } from "vitest";

import type {
  UniversityRecord,
  UniversityRepository,
} from "@/src/modules/universities/application/ports/university-repository";
import type {
  UniversityTermRecord,
  UniversityTermRepository,
} from "@/src/modules/universities/application/ports/university-term-repository";
import { UniversityService } from "@/src/modules/universities/application/university-service";

const activeUniversity: UniversityRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550101",
  nameAr: "جامعة الملك سعود",
  nameEn: "King Saud University",
  shortName: "KSU",
  logoPath: null,
  active: true,
};

const publishedTerm: UniversityTermRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550201",
  universityId: activeUniversity.id,
  academicYear: 1448,
  term: "first",
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-15T00:00:00.000Z"),
};

function repositories(
  overrides: Partial<{
    universities: Partial<UniversityRepository>;
    universityTerms: Partial<UniversityTermRepository>;
  }> = {},
) {
  const universities: UniversityRepository = {
    listActive: async () => [activeUniversity],
    ...overrides.universities,
  };
  const universityTerms: UniversityTermRepository = {
    listForUniversity: async () => [publishedTerm],
    ...overrides.universityTerms,
  };
  return { universities, universityTerms };
}

describe("university application service", () => {
  it("delegates active-university listing to the repository", async () => {
    let called = false;
    const { universities, universityTerms } = repositories({
      universities: {
        listActive: async () => {
          called = true;
          return [activeUniversity];
        },
      },
    });
    const service = new UniversityService(universities, universityTerms);

    await expect(service.listActiveUniversities()).resolves.toEqual([activeUniversity]);
    expect(called).toBe(true);
  });

  it("lists published terms for a chosen university", async () => {
    let requestedId: string | undefined;
    const { universities, universityTerms } = repositories({
      universityTerms: {
        listForUniversity: async (universityId) => {
          requestedId = universityId;
          return [publishedTerm];
        },
      },
    });
    const service = new UniversityService(universities, universityTerms);

    const result = await service.listPublishedTerms(activeUniversity.id);

    expect(requestedId).toBe(activeUniversity.id);
    expect(result).toEqual([publishedTerm]);
  });

  it("returns an empty list without querying the repository when no university is set", async () => {
    let called = false;
    const { universities, universityTerms } = repositories({
      universityTerms: {
        listForUniversity: async () => {
          called = true;
          return [publishedTerm];
        },
      },
    });
    const service = new UniversityService(universities, universityTerms);

    await expect(service.listPublishedTerms(null)).resolves.toEqual([]);
    expect(called).toBe(false);
  });
});
