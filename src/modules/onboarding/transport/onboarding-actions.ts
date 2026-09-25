"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createOnboardingService } from "@/src/composition/onboarding";
import { isOnboardingError } from "@/src/modules/onboarding/application/onboarding-error";
import { locales } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

const localeSchema = z.enum(locales);
const timeZoneSchema = z.string().trim().min(1).max(64);
const universitySchema = z.string().trim().max(120);
const majorSchema = z.string().trim().max(120);

export type OnboardingFieldName = "locale" | "timeZone" | "university" | "major";

export type OnboardingActionCode = "VALIDATION_ERROR" | "UNAVAILABLE" | "UNEXPECTED";

export interface OnboardingActionState {
  readonly status: "idle" | "error";
  readonly code?: OnboardingActionCode;
  readonly fieldErrors?: Readonly<Partial<Record<OnboardingFieldName, true>>>;
}

export const initialOnboardingActionState: OnboardingActionState = { status: "idle" };

function fieldValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function completeOnboardingAction(
  _state: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const locale = localeSchema.safeParse(fieldValue(formData, "locale"));
  const timeZone = timeZoneSchema.safeParse(fieldValue(formData, "timeZone"));
  const university = universitySchema.safeParse(fieldValue(formData, "university"));
  const major = majorSchema.safeParse(fieldValue(formData, "major"));

  const fieldErrors: Partial<Record<OnboardingFieldName, true>> = {};
  if (!locale.success) fieldErrors.locale = true;
  if (!timeZone.success) fieldErrors.timeZone = true;
  if (!university.success) fieldErrors.university = true;
  if (!major.success) fieldErrors.major = true;

  if (!locale.success || !timeZone.success || !university.success || !major.success) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const authentication = await createAuthenticationRuntime();
  if (!authentication.available) return { status: "error", code: "UNAVAILABLE" };

  let account;
  try {
    account = await authentication.service.currentAccount();
  } catch {
    return { status: "error", code: "UNAVAILABLE" };
  }
  if (!account) return { status: "error", code: "UNAVAILABLE" };

  try {
    await createOnboardingService().completeOnboarding(account.id, {
      locale: locale.data,
      timeZone: timeZone.data,
      university: university.data.length > 0 ? university.data : null,
      major: major.data.length > 0 ? major.data : null,
    });
  } catch (error) {
    if (isOnboardingError(error) && error.code === "ONBOARDING_INVALID") {
      return {
        status: "error",
        code: "VALIDATION_ERROR",
        fieldErrors: { timeZone: true },
      };
    }
    return { status: "error", code: "UNAVAILABLE" };
  }

  redirect(localizedPath(locale.data, "terms"));
}
