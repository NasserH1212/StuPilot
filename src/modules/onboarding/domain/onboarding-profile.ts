import type { Locale } from "@/src/shared/localization/locales";

export interface OnboardingProfile {
  readonly userId: string;
  readonly locale: Locale;
  readonly timeZone: string;
  readonly university: string | null;
  readonly major: string | null;
  readonly completedAt: Date | null;
}

export interface OnboardingDraft {
  readonly locale: Locale;
  readonly timeZone: string;
  readonly university: string | null;
  readonly major: string | null;
}

export const onboardingInvariantCodes = ["TIME_ZONE_REQUIRED"] as const;

export type OnboardingInvariantCode = (typeof onboardingInvariantCodes)[number];

export class OnboardingInvariantError extends Error {
  public constructor(public readonly invariant: OnboardingInvariantCode) {
    super(`The onboarding profile violates the ${invariant} invariant.`);
    this.name = "OnboardingInvariantError";
  }
}

export function assertOnboardingDraft(draft: OnboardingDraft): OnboardingDraft {
  if (draft.timeZone.trim().length === 0) {
    throw new OnboardingInvariantError("TIME_ZONE_REQUIRED");
  }

  return draft;
}
