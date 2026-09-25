"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createTermService } from "@/src/composition/terms";
import { isTermError } from "@/src/modules/terms/application/term-error";
import { locales, type Locale } from "@/src/shared/localization/locales";

const localeSchema = z.enum(locales);
const nameSchema = z.string().trim().min(1).max(120);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeZoneSchema = z.string().trim().min(1).max(64);

export type TermFieldName = "name" | "startsOn" | "endsOn" | "timeZone";

export type TermActionCode =
  "VALIDATION_ERROR" | "UNAVAILABLE" | "NOT_FOUND" | "CONFLICT" | "UNEXPECTED";

export interface TermActionState {
  readonly status: "idle" | "error" | "success";
  readonly code?: TermActionCode;
  readonly fieldErrors?: Readonly<Partial<Record<TermFieldName, true>>>;
}

export const initialTermActionState: TermActionState = { status: "idle" };

function fieldValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function localeFrom(formData: FormData): Locale {
  const parsed = localeSchema.safeParse(fieldValue(formData, "locale"));
  return parsed.success ? parsed.data : "ar";
}

function toActionError(error: unknown): TermActionState {
  if (isTermError(error)) {
    if (error.code === "TERM_NOT_FOUND") return { status: "error", code: "NOT_FOUND" };
    if (error.code === "TERM_VERSION_CONFLICT") {
      return { status: "error", code: "CONFLICT" };
    }
    if (error.code === "TERM_INVALID") {
      return { status: "error", code: "VALIDATION_ERROR" };
    }
  }
  return { status: "error", code: "UNAVAILABLE" };
}

export async function createTermAction(
  _state: TermActionState,
  formData: FormData,
): Promise<TermActionState> {
  const locale = localeFrom(formData);
  const name = nameSchema.safeParse(fieldValue(formData, "name"));
  const startsOn = dateSchema.safeParse(fieldValue(formData, "startsOn"));
  const endsOn = dateSchema.safeParse(fieldValue(formData, "endsOn"));
  const timeZone = timeZoneSchema.safeParse(fieldValue(formData, "timeZone"));
  const isActive = fieldValue(formData, "isActive") === "on";

  const fieldErrors: Partial<Record<TermFieldName, true>> = {};
  if (!name.success) fieldErrors.name = true;
  if (!startsOn.success) fieldErrors.startsOn = true;
  if (!endsOn.success) fieldErrors.endsOn = true;
  if (!timeZone.success) fieldErrors.timeZone = true;

  if (startsOn.success && endsOn.success) {
    if (new Date(endsOn.data).getTime() < new Date(startsOn.data).getTime()) {
      fieldErrors.endsOn = true;
    }
  }

  if (
    !name.success ||
    !startsOn.success ||
    !endsOn.success ||
    !timeZone.success ||
    fieldErrors.endsOn === true
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
    await createTermService().createTerm(account.id, {
      name: name.data,
      startsOn: new Date(startsOn.data),
      endsOn: new Date(endsOn.data),
      timeZone: timeZone.data,
      isActive,
    });
  } catch (error) {
    return toActionError(error);
  }

  revalidatePath(`/${locale}/workspace/terms`);
  return { status: "success" };
}
