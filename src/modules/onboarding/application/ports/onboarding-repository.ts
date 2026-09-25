import type { Locale } from "@/src/shared/localization/locales";

export interface OnboardingProfileRecord {
  readonly userId: string;
  readonly locale: Locale;
  readonly timeZone: string;
  readonly university: string | null;
  readonly major: string | null;
  readonly completedAt: Date | null;
}

export interface OnboardingCompletion {
  readonly locale: Locale;
  readonly timeZone: string;
  readonly university: string | null;
  readonly major: string | null;
}

export interface OnboardingRepository {
  findForUser(userId: string): Promise<OnboardingProfileRecord | null>;
  complete(
    userId: string,
    completion: OnboardingCompletion,
  ): Promise<OnboardingProfileRecord>;
}
