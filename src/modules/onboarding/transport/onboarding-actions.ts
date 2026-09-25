"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createOnboardingService } from "@/src/composition/onboarding";
import { isOnboardingError } from "@/src/modules/onboarding/application/onboarding-error";
import { locales } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import type {
  OnboardingActionState,
  OnboardingFieldName,
} from "./onboarding-action-state";

const localeSchema = z.enum(locales);
const timeZoneSchema = z.string().trim().min(1).max(64);
const universityIdSchema = z.string().uuid();
const universityFreeTextSchema = z.string().trim().max(120);
const majorSchema = z.string().trim().max(120);
const notListedChoice = "not-listed";

function fieldValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readUniversityChoice(
  formData: FormData,
): { universityId: string | null; university: string | null } | "invalid" {
  const choice = fieldValue(formData, "universityChoice");

  if (choice.length === 0) return { universityId: null, university: null };

  if (choice === notListedChoice) {
    const freeText = universityFreeTextSchema.safeParse(
      fieldValue(formData, "universityFreeText"),
    );
    if (!freeText.success) return "invalid";
    return {
      universityId: null,
      university: freeText.data.length > 0 ? freeText.data : null,
    };
  }

  const parsedId = universityIdSchema.safeParse(choice);
  if (!parsedId.success) return "invalid";
  return { universityId: parsedId.data, university: null };
}

export async function completeOnboardingAction(
  _state: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const locale = localeSchema.safeParse(fieldValue(formData, "locale"));
  const timeZone = timeZoneSchema.safeParse(fieldValue(formData, "timeZone"));
  const university = readUniversityChoice(formData);
  const major = majorSchema.safeParse(fieldValue(formData, "major"));

  const fieldErrors: Partial<Record<OnboardingFieldName, true>> = {};
  if (!locale.success) fieldErrors.locale = true;
  if (!timeZone.success) fieldErrors.timeZone = true;
  if (university === "invalid") fieldErrors.university = true;
  if (!major.success) fieldErrors.major = true;

  if (
    !locale.success ||
    !timeZone.success ||
    university === "invalid" ||
    !major.success
  ) {
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
      university: university.university,
      universityId: university.universityId,
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
