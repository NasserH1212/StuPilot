import type {
  UniversityBreakRecord,
  UniversityBreakRepository,
} from "@/src/modules/universities/application/ports/university-break-repository";

import type { StuPilotPrismaClient } from "./create-prisma-client";

interface UniversityBreakRow {
  readonly id: string;
  readonly universityId: string;
  readonly academicYear: number;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly resumesOn: Date;
}

function toRecord(row: UniversityBreakRow): UniversityBreakRecord {
  return {
    id: row.id,
    universityId: row.universityId,
    academicYear: row.academicYear,
    nameAr: row.nameAr,
    nameEn: row.nameEn,
    startsOn: row.startsOn,
    endsOn: row.endsOn,
    resumesOn: row.resumesOn,
  };
}

export class PrismaUniversityBreakRepository implements UniversityBreakRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async listForUniversity(
    universityId: string,
  ): Promise<readonly UniversityBreakRecord[]> {
    const rows = await this.client.universityBreak.findMany({
      where: { universityId },
      orderBy: { startsOn: "asc" },
    });

    return rows.map(toRecord);
  }
}
