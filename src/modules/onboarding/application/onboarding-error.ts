import { ApplicationError } from "@/src/shared/errors/application-error";

export const onboardingErrorCodes = [
  "ONBOARDING_INVALID",
  "ONBOARDING_PERSISTENCE_UNAVAILABLE",
] as const;

export type OnboardingErrorCode = (typeof onboardingErrorCodes)[number];

export class OnboardingError extends ApplicationError {
  declare public readonly code: OnboardingErrorCode;

  public constructor(
    code: OnboardingErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(code, message, options);
    this.name = "OnboardingError";
  }
}

export function isOnboardingError(error: unknown): error is OnboardingError {
  return error instanceof OnboardingError;
}
