export type OnboardingFieldName = "locale" | "timeZone" | "university" | "major";

export type OnboardingActionCode = "VALIDATION_ERROR" | "UNAVAILABLE" | "UNEXPECTED";

export interface OnboardingActionState {
  readonly status: "idle" | "error";
  readonly code?: OnboardingActionCode;
  readonly fieldErrors?: Readonly<Partial<Record<OnboardingFieldName, true>>>;
}

export const initialOnboardingActionState: OnboardingActionState = {
  status: "idle",
};
