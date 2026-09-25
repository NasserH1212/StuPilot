import "server-only";

import { OnboardingService } from "@/src/modules/onboarding/application/onboarding-service";

import { getPrismaClient } from "../infrastructure/persistence/prisma/create-prisma-client";
import { PrismaOnboardingRepository } from "../infrastructure/persistence/prisma/prisma-onboarding-repository";
import { getServerEnvironment } from "../shared/config/server";

export function createOnboardingService(): OnboardingService {
  const environment = getServerEnvironment();
  const prisma = getPrismaClient(environment.DATABASE_URL);
  return new OnboardingService(new PrismaOnboardingRepository(prisma));
}
