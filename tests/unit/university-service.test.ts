import { describe, expect, it } from "vitest";

import type {
  UniversityRecord,
  UniversityRepository,
} from "@/src/modules/universities/application/ports/university-repository";
import { UniversityService } from "@/src/modules/universities/application/university-service";

const activeUniversity: UniversityRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550101",
  nameAr: "جامعة الملك سعود",
  nameEn: "King Saud University",
  shortName: "KSU",
  logoPath: null,
  active: true,
};

describe("university application service", () => {
  it("delegates active-university listing to the repository", async () => {
    let called = false;
    const repository: UniversityRepository = {
      listActive: async () => {
        called = true;
        return [activeUniversity];
      },
    };
    const service = new UniversityService(repository);

    await expect(service.listActiveUniversities()).resolves.toEqual([activeUniversity]);
    expect(called).toBe(true);
  });
});
