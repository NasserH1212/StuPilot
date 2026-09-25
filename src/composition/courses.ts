import "server-only";

import { CourseService } from "@/src/modules/courses/application/course-service";

import { getPrismaClient } from "../infrastructure/persistence/prisma/create-prisma-client";
import { PrismaCourseRepository } from "../infrastructure/persistence/prisma/prisma-course-repository";
import { getServerEnvironment } from "../shared/config/server";

export function createCourseService(): CourseService {
  const environment = getServerEnvironment();
  const prisma = getPrismaClient(environment.DATABASE_URL);
  return new CourseService(new PrismaCourseRepository(prisma));
}
