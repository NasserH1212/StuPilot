import type {
  UniversityTermRecord,
  UniversityTermRepository,
} from "@/src/modules/universities/application/ports/university-term-repository";

import type { StuPilotPrismaClient } from "./create-prisma-client";

interface UniversityTermRow {
  readonly id: string;
  readonly universityId: string;
  readonly academicYear: number;
  readonly term: UniversityTermRecord["term"];
  readonly startsOn: Date;
  readonly endsOn: Date | null;
}

function toRecord(row: UniversityTermRow): UniversityTermRecord {
  return {
    id: row.id,
    universityId: row.universityId,
    academicYear: row.academicYear,
    term: row.term,
    startsOn: row.startsOn,
    endsOn: row.endsOn,
  };
}

export class PrismaUniversityTermRepository implements UniversityTermRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async listForUniversity(
    universityId: string,
  ): Promise<readonly UniversityTermRecord[]> {
    const rows = await this.client.universityTerm.findMany({
      where: { universityId },
      orderBy: [{ academicYear: "desc" }, { startsOn: "asc" }],
    });

    return rows.map(toRecord);
  }
}
