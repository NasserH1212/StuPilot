import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/src/generated/prisma/client";

export function createPrismaClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export type StudentHubPrismaClient = ReturnType<typeof createPrismaClient>;

const globalPrisma = globalThis as typeof globalThis & {
  studentHubPrisma?: {
    readonly connectionString: string;
    readonly client: StudentHubPrismaClient;
  };
};

export function getPrismaClient(connectionString: string): StudentHubPrismaClient {
  const existing = globalPrisma.studentHubPrisma;
  if (existing?.connectionString === connectionString) return existing.client;

  const client = createPrismaClient(connectionString);

  if (process.env.NODE_ENV !== "production") {
    globalPrisma.studentHubPrisma = { connectionString, client };
  }

  return client;
}
