import type {
  FoundationHealthRecord,
  FoundationHealthRepository,
} from "@/src/modules/foundation/application/ports/foundation-health-repository";

import type { StuPilotPrismaClient } from "./create-prisma-client";

export class PrismaFoundationHealthRepository implements FoundationHealthRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async createInTransaction(): Promise<FoundationHealthRecord> {
    return this.client.$transaction(async (transaction) => {
      return transaction.foundationHealthCheck.create({
        data: { marker: "repository-transaction-proof" },
        select: { id: true, checkedAt: true },
      });
    });
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.foundationHealthCheck.delete({ where: { id } });
  }
}
