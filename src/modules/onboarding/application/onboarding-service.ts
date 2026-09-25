import {
  assertOnboardingDraft,
  OnboardingInvariantError,
  type OnboardingDraft,
} from "../domain/onboarding-profile";
import { isOnboardingError, OnboardingError } from "./onboarding-error";
import type {
  OnboardingProfileRecord,
  OnboardingRepository,
} from "./ports/onboarding-repository";

export class OnboardingService {
  public constructor(private readonly profiles: OnboardingRepository) {}

  public async getProfile(userId: string): Promise<OnboardingProfileRecord | null> {
    try {
      return await this.profiles.findForUser(userId);
    } catch (error) {
      throw this.toOnboardingError(error);
    }
  }

  public async completeOnboarding(
    userId: string,
    draft: OnboardingDraft,
  ): Promise<OnboardingProfileRecord> {
    const normalized = this.normalize(draft);
    try {
      return await this.profiles.complete(userId, normalized);
    } catch (error) {
      throw this.toOnboardingError(error);
    }
  }

  private normalize(draft: OnboardingDraft): OnboardingDraft {
    try {
      return assertOnboardingDraft({
        ...draft,
        timeZone: draft.timeZone.trim(),
        university: draft.university?.trim() || null,
        major: draft.major?.trim() || null,
      });
    } catch (error) {
      if (error instanceof OnboardingInvariantError) {
        throw new OnboardingError(
          "ONBOARDING_INVALID",
          "The onboarding profile is invalid.",
          { cause: error },
        );
      }
      throw this.toOnboardingError(error);
    }
  }

  private toOnboardingError(error: unknown): OnboardingError {
    if (isOnboardingError(error)) return error;
    return new OnboardingError(
      "ONBOARDING_PERSISTENCE_UNAVAILABLE",
      "The onboarding profile store is unavailable.",
      { cause: error },
    );
  }
}
