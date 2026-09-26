import "server-only";

import { ScheduleService } from "@/src/modules/schedule/application/schedule-service";

import { getPrismaClient } from "../infrastructure/persistence/prisma/create-prisma-client";
import { PrismaClassMeetingRepository } from "../infrastructure/persistence/prisma/prisma-class-meeting-repository";
import { getServerEnvironment } from "../shared/config/server";

export function createScheduleService(): ScheduleService {
  const environment = getServerEnvironment();
  const prisma = getPrismaClient(environment.DATABASE_URL);
  return new ScheduleService(new PrismaClassMeetingRepository(prisma));
}
