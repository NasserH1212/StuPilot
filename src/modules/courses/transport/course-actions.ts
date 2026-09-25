"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createCourseService } from "@/src/composition/courses";
import { createTermService } from "@/src/composition/terms";
import { isCourseError } from "@/src/modules/courses/application/course-error";
import { locales, type Locale } from "@/src/shared/localization/locales";

import type { CourseActionState, CourseFieldName } from "./course-action-state";

const localeSchema = z.enum(locales);
const idSchema = z.string().uuid();
const nameSchema = z.string().trim().min(1).max(120);
const codeSchema = z.string().trim().max(32);
const locationSchema = z.string().trim().max(120);

function fieldValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function localeFrom(formData: FormData): Locale {
  const parsed = localeSchema.safeParse(fieldValue(formData, "locale"));
  return parsed.success ? parsed.data : "ar";
}

function toActionError(error: unknown): CourseActionState {
  if (isCourseError(error)) {
    if (error.code === "COURSE_NOT_FOUND")
      return { status: "error", code: "NOT_FOUND" };
    if (error.code === "COURSE_VERSION_CONFLICT") {
      return { status: "error", code: "CONFLICT" };
    }
    if (error.code === "COURSE_INVALID") {
      return { status: "error", code: "VALIDATION_ERROR" };
    }
  }
  return { status: "error", code: "UNAVAILABLE" };
}

type AccountLookup =
  { readonly account: { readonly id: string } } | { readonly error: CourseActionState };

async function currentAccountOrError(): Promise<AccountLookup> {
  const authentication = await createAuthenticationRuntime();
  if (!authentication.available) {
    return { error: { status: "error", code: "UNAVAILABLE" } };
  }

  let account;
  try {
    account = await authentication.service.currentAccount();
  } catch {
    return { error: { status: "error", code: "UNAVAILABLE" } };
  }
  if (!account) return { error: { status: "error", code: "UNAVAILABLE" } };

  return { account };
}

async function requireOwnedTermOrError(
  userId: string,
  termId: string,
): Promise<CourseActionState | null> {
  try {
    const term = await createTermService().getTerm(userId, termId);
    if (!term) return { status: "error", code: "TERM_NOT_FOUND" };
  } catch {
    return { status: "error", code: "UNAVAILABLE" };
  }
  return null;
}

export async function createCourseAction(
  _state: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const locale = localeFrom(formData);
  const termId = idSchema.safeParse(fieldValue(formData, "termId"));
  const name = nameSchema.safeParse(fieldValue(formData, "name"));
  const code = codeSchema.safeParse(fieldValue(formData, "code"));
  const location = locationSchema.safeParse(fieldValue(formData, "defaultLocation"));

  const fieldErrors: Partial<Record<CourseFieldName, true>> = {};
  if (!name.success) fieldErrors.name = true;
  if (!code.success) fieldErrors.code = true;
  if (!location.success) fieldErrors.defaultLocation = true;

  if (!termId.success || !name.success || !code.success || !location.success) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const lookup = await currentAccountOrError();
  if ("error" in lookup) return lookup.error;

  const termError = await requireOwnedTermOrError(lookup.account.id, termId.data);
  if (termError) return termError;

  try {
    await createCourseService().createCourse(lookup.account.id, termId.data, {
      name: name.data,
      code: code.data.length > 0 ? code.data : null,
      colorToken: null,
      defaultLocation: location.data.length > 0 ? location.data : null,
    });
  } catch (error) {
    return toActionError(error);
  }

  revalidatePath(`/${locale}/workspace/terms/${termId.data}/courses`);
  return { status: "success" };
}

export async function editCourseAction(
  _state: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const locale = localeFrom(formData);
  const termId = idSchema.safeParse(fieldValue(formData, "termId"));
  const enrollmentId = idSchema.safeParse(fieldValue(formData, "enrollmentId"));
  const name = nameSchema.safeParse(fieldValue(formData, "name"));
  const code = codeSchema.safeParse(fieldValue(formData, "code"));
  const location = locationSchema.safeParse(fieldValue(formData, "defaultLocation"));

  const fieldErrors: Partial<Record<CourseFieldName, true>> = {};
  if (!name.success) fieldErrors.name = true;
  if (!code.success) fieldErrors.code = true;
  if (!location.success) fieldErrors.defaultLocation = true;

  if (
    !termId.success ||
    !enrollmentId.success ||
    !name.success ||
    !code.success ||
    !location.success
  ) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const lookup = await currentAccountOrError();
  if ("error" in lookup) return lookup.error;

  try {
    await createCourseService().editCourse(
      lookup.account.id,
      termId.data,
      enrollmentId.data,
      {
        name: name.data,
        code: code.data.length > 0 ? code.data : null,
        colorToken: null,
        defaultLocation: location.data.length > 0 ? location.data : null,
      },
    );
  } catch (error) {
    return toActionError(error);
  }

  revalidatePath(`/${locale}/workspace/terms/${termId.data}/courses`);
  return { status: "success" };
}

export async function archiveCourseAction(
  _state: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const locale = localeFrom(formData);
  const termId = idSchema.safeParse(fieldValue(formData, "termId"));
  const enrollmentId = idSchema.safeParse(fieldValue(formData, "enrollmentId"));
  if (!termId.success || !enrollmentId.success) {
    return { status: "error", code: "VALIDATION_ERROR" };
  }

  const lookup = await currentAccountOrError();
  if ("error" in lookup) return lookup.error;

  try {
    await createCourseService().archiveCourse(
      lookup.account.id,
      termId.data,
      enrollmentId.data,
    );
  } catch (error) {
    return toActionError(error);
  }

  revalidatePath(`/${locale}/workspace/terms/${termId.data}/courses`);
  return { status: "success" };
}
