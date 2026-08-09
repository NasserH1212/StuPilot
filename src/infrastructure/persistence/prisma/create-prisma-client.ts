import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/src/generated/prisma/client";

export function createPrismaClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export type StuPilotPrismaClient = ReturnType<typeof createPrismaClient>;

const globalPrisma = globalThis as typeof globalThis & {
  stuPilotPrisma?: {
    readonly connectionString: string;
    readonly client: StuPilotPrismaClient;
  };
};

export function getPrismaClient(connectionString: string): StuPilotPrismaClient {
  const existing = globalPrisma.stuPilotPrisma;
  if (existing?.connectionString === connectionString) return existing.client;

  const client = createPrismaClient(connectionString);

  if (process.env.NODE_ENV !== "production") {
    globalPrisma.stuPilotPrisma = { connectionString, client };
  }

  return client;
}
