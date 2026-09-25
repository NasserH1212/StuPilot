import { TermError } from "@/src/modules/terms/application/term-error";
import type {
  NewTerm,
  TermEdit,
  TermRecord,
  TermRepository,
} from "@/src/modules/terms/application/ports/term-repository";

import type { StuPilotPrismaClient } from "./create-prisma-client";

interface TermRow {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
  readonly isActive: boolean;
  readonly archivedAt: Date | null;
  readonly version: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function toRecord(row: TermRow): TermRecord {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    startsOn: row.startsOn,
    endsOn: row.endsOn,
    timeZone: row.timeZone,
    isActive: row.isActive,
    archivedAt: row.archivedAt,
    version: row.version,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaTermRepository implements TermRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async create(term: NewTerm): Promise<TermRecord> {
    return this.client.$transaction(async (transaction) => {
      if (term.isActive) {
        await transaction.term.updateMany({
          where: { userId: term.userId, isActive: true, archivedAt: null },
          data: { isActive: false },
        });
      }

      const row = await transaction.term.create({
        data: {
          userId: term.userId,
          name: term.name,
          startsOn: term.startsOn,
          endsOn: term.endsOn,
          timeZone: term.timeZone,
          isActive: term.isActive,
        },
      });

      return toRecord(row);
    });
  }

  public async listForUser(userId: string): Promise<readonly TermRecord[]> {
    const rows = await this.client.term.findMany({
      where: { userId },
      orderBy: [
        { isActive: "desc" },
        { archivedAt: { sort: "asc", nulls: "first" } },
        { startsOn: "desc" },
      ],
    });

    return rows.map(toRecord);
  }

  public async findForUser(id: string, userId: string): Promise<TermRecord | null> {
    const row = await this.client.term.findFirst({ where: { id, userId } });
    return row ? toRecord(row) : null;
  }

  public async update(
    id: string,
    userId: string,
    edit: TermEdit,
    expectedVersion: number,
  ): Promise<TermRecord> {
    const result = await this.client.term.updateMany({
      where: { id, userId, version: expectedVersion },
      data: {
        name: edit.name,
        startsOn: edit.startsOn,
        endsOn: edit.endsOn,
        timeZone: edit.timeZone,
        version: { increment: 1 },
      },
    });

    if (result.count === 0) throw await this.missingOrConflict(id, userId);

    return this.requireCurrent(id, userId);
  }

  public async archive(
    id: string,
    userId: string,
    expectedVersion: number,
  ): Promise<TermRecord> {
    const result = await this.client.term.updateMany({
      where: { id, userId, version: expectedVersion },
      data: { isActive: false, archivedAt: new Date(), version: { increment: 1 } },
    });

    if (result.count === 0) throw await this.missingOrConflict(id, userId);

    return this.requireCurrent(id, userId);
  }

  public async activate(
    id: string,
    userId: string,
    expectedVersion: number,
  ): Promise<TermRecord> {
    return this.client.$transaction(async (transaction) => {
      const target = await transaction.term.findFirst({ where: { id, userId } });

      if (!target) {
        throw new TermError("TERM_NOT_FOUND", "The academic term was not found.");
      }
      if (target.version !== expectedVersion) {
        throw new TermError(
          "TERM_VERSION_CONFLICT",
          "The academic term changed since it was loaded.",
        );
      }
      if (target.archivedAt) {
        throw new TermError(
          "TERM_INVALID",
          "An archived academic term cannot be activated.",
        );
      }

      await transaction.term.updateMany({
        where: { userId, isActive: true, archivedAt: null, NOT: { id } },
        data: { isActive: false },
      });

      const row = await transaction.term.update({
        where: { id },
        data: { isActive: true, version: { increment: 1 } },
      });

      return toRecord(row);
    });
  }

  private async requireCurrent(id: string, userId: string): Promise<TermRecord> {
    const row = await this.client.term.findFirst({ where: { id, userId } });
    if (!row) {
      throw new TermError("TERM_NOT_FOUND", "The academic term was not found.");
    }
    return toRecord(row);
  }

  private async missingOrConflict(id: string, userId: string): Promise<TermError> {
    const existing = await this.client.term.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    return existing
      ? new TermError(
          "TERM_VERSION_CONFLICT",
          "The academic term changed since it was loaded.",
        )
      : new TermError("TERM_NOT_FOUND", "The academic term was not found.");
  }
}
