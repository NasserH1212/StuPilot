import type {
  UniversityRecord,
  UniversityRepository,
} from "@/src/modules/universities/application/ports/university-repository";

import type { StuPilotPrismaClient } from "./create-prisma-client";

interface UniversityRow {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly shortName: string;
  readonly logoPath: string | null;
  readonly active: boolean;
}

function toRecord(row: UniversityRow): UniversityRecord {
  return {
    id: row.id,
    nameAr: row.nameAr,
    nameEn: row.nameEn,
    shortName: row.shortName,
    logoPath: row.logoPath,
    active: row.active,
  };
}

export class PrismaUniversityRepository implements UniversityRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async listActive(): Promise<readonly UniversityRecord[]> {
    const rows = await this.client.university.findMany({
      where: { active: true },
      orderBy: { nameEn: "asc" },
    });

    return rows.map(toRecord);
  }
}
