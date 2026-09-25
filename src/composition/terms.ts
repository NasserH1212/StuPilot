import "server-only";

import { TermService } from "@/src/modules/terms/application/term-service";

import { getPrismaClient } from "../infrastructure/persistence/prisma/create-prisma-client";
import { PrismaTermRepository } from "../infrastructure/persistence/prisma/prisma-term-repository";
import { getServerEnvironment } from "../shared/config/server";

export function createTermService(): TermService {
  const environment = getServerEnvironment();
  const prisma = getPrismaClient(environment.DATABASE_URL);
  return new TermService(new PrismaTermRepository(prisma));
}
