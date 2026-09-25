import type {
  OnboardingCompletion,
  OnboardingProfileRecord,
  OnboardingRepository,
} from "@/src/modules/onboarding/application/ports/onboarding-repository";
import type { Locale } from "@/src/shared/localization/locales";

import type { StuPilotPrismaClient } from "./create-prisma-client";

interface UserProfileRow {
  readonly userId: string;
  readonly locale: string;
  readonly timeZone: string;
  readonly university: string | null;
  readonly universityId: string | null;
  readonly major: string | null;
  readonly completedAt: Date | null;
}

function toRecord(row: UserProfileRow): OnboardingProfileRecord {
  return {
    userId: row.userId,
    locale: row.locale as Locale,
    timeZone: row.timeZone,
    university: row.university,
    universityId: row.universityId,
    major: row.major,
    completedAt: row.completedAt,
  };
}

export class PrismaOnboardingRepository implements OnboardingRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async findForUser(userId: string): Promise<OnboardingProfileRecord | null> {
    const row = await this.client.userProfile.findUnique({ where: { userId } });
    return row ? toRecord(row) : null;
  }

  public async complete(
    userId: string,
    completion: OnboardingCompletion,
  ): Promise<OnboardingProfileRecord> {
    const row = await this.client.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        locale: completion.locale,
        timeZone: completion.timeZone,
        university: completion.university,
        universityId: completion.universityId,
        major: completion.major,
        completedAt: new Date(),
      },
      update: {
        locale: completion.locale,
        timeZone: completion.timeZone,
        university: completion.university,
        universityId: completion.universityId,
        major: completion.major,
        completedAt: new Date(),
      },
    });

    return toRecord(row);
  }
}
