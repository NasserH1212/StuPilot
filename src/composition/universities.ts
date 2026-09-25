import "server-only";

import { UniversityService } from "@/src/modules/universities/application/university-service";

import { getPrismaClient } from "../infrastructure/persistence/prisma/create-prisma-client";
import { PrismaUniversityRepository } from "../infrastructure/persistence/prisma/prisma-university-repository";
import { PrismaUniversityTermRepository } from "../infrastructure/persistence/prisma/prisma-university-term-repository";
import { getServerEnvironment } from "../shared/config/server";

export function createUniversityService(): UniversityService {
  const environment = getServerEnvironment();
  const prisma = getPrismaClient(environment.DATABASE_URL);
  return new UniversityService(
    new PrismaUniversityRepository(prisma),
    new PrismaUniversityTermRepository(prisma),
  );
}
