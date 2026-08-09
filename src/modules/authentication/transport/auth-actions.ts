"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  authenticationCallbackUrl,
  consumeRecoveryIntent,
  createAuthenticationRuntime,
  requireRecoverySession,
} from "@/src/composition/authentication";
import {
  isAuthenticationError,
  type AuthenticationErrorCode,
} from "@/src/modules/authentication/application/authentication-error";
import { locales, type Locale } from "@/src/shared/localization/locales";
import {
  localizedPath,
  safeWorkspaceReturnTo,
} from "@/src/shared/localization/routing";

const localeSchema = z.enum(locales);
const emailSchema = z.string().trim().max(254).email();
const passwordSchema = z
  .string()
  .min(12)
  .max(128)
  .regex(/[\p{L}]/u)
  .regex(/[0-9]/);

export type AuthFieldError =
  "INVALID_EMAIL" | "PASSWORD_REQUIREMENTS" | "PASSWORDS_DO_NOT_MATCH";

export interface AuthActionState {
  readonly status: "idle" | "error" | "success";
  readonly code?: AuthenticationErrorCode | "VALIDATION_ERROR";
  readonly fieldErrors?: Readonly<
    Partial<Record<"email" | "password" | "confirmPassword", AuthFieldError>>
  >;
}

export const initialAuthActionState: AuthActionState = { status: "idle" };

function fieldValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function localeFrom(formData: FormData): Locale {
  const parsed = localeSchema.safeParse(fieldValue(formData, "locale"));
  return parsed.success ? parsed.data : "ar";
}

function actionError(error: unknown): AuthActionState {
  return {
    status: "error",
    code: isAuthenticationError(error) ? error.code : "UNEXPECTED_AUTHENTICATION_ERROR",
  };
}

function unavailableState(): AuthActionState {
  return { status: "error", code: "CONFIGURATION_UNAVAILABLE" };
}

export async function registerAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const locale = localeFrom(formData);
  const email = emailSchema.safeParse(fieldValue(formData, "email"));
  const password = passwordSchema.safeParse(fieldValue(formData, "password"));
  const confirmPassword = fieldValue(formData, "confirmPassword");
  const fieldErrors: Partial<
    Record<"email" | "password" | "confirmPassword", AuthFieldError>
  > = {};

  if (!email.success) fieldErrors.email = "INVALID_EMAIL";
  if (!password.success) fieldErrors.password = "PASSWORD_REQUIREMENTS";
  if (password.success && password.data !== confirmPassword) {
    fieldErrors.confirmPassword = "PASSWORDS_DO_NOT_MATCH";
  }
  if (!email.success || !password.success || Object.keys(fieldErrors).length > 0) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) return unavailableState();

  try {
    await runtime.service.register({
      email: email.data,
      password: password.data,
      verificationCallbackUrl: authenticationCallbackUrl(runtime.environment, locale),
    });
  } catch (error) {
    return actionError(error);
  }

  redirect(localizedPath(locale, "verification-pending"));
}

export async function signInAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const locale = localeFrom(formData);
  const email = emailSchema.safeParse(fieldValue(formData, "email"));
  const password = fieldValue(formData, "password");
  const fieldErrors: Partial<Record<"email" | "password", AuthFieldError>> = {};

  if (!email.success) fieldErrors.email = "INVALID_EMAIL";
  if (password.length === 0 || password.length > 128) {
    fieldErrors.password = "PASSWORD_REQUIREMENTS";
  }
  if (!email.success || Object.keys(fieldErrors).length > 0) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) return unavailableState();

  try {
    await runtime.service.signIn({ email: email.data, password });
  } catch (error) {
    return actionError(error);
  }

  redirect(safeWorkspaceReturnTo(fieldValue(formData, "returnTo"), locale));
}

export async function forgotPasswordAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const locale = localeFrom(formData);
  const email = emailSchema.safeParse(fieldValue(formData, "email"));
  if (!email.success) {
    return {
      status: "error",
      code: "VALIDATION_ERROR",
      fieldErrors: { email: "INVALID_EMAIL" },
    };
  }

  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) return unavailableState();

  try {
    await runtime.service.requestPasswordRecovery({
      email: email.data,
      recoveryCallbackUrl: authenticationCallbackUrl(runtime.environment, locale),
    });
    return { status: "success" };
  } catch (error) {
    return actionError(error);
  }
}

export async function resetPasswordAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = passwordSchema.safeParse(fieldValue(formData, "password"));
  const confirmPassword = fieldValue(formData, "confirmPassword");
  const fieldErrors: Partial<Record<"password" | "confirmPassword", AuthFieldError>> =
    {};

  if (!password.success) fieldErrors.password = "PASSWORD_REQUIREMENTS";
  if (password.success && password.data !== confirmPassword) {
    fieldErrors.confirmPassword = "PASSWORDS_DO_NOT_MATCH";
  }
  if (!password.success || Object.keys(fieldErrors).length > 0) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) return unavailableState();

  try {
    await requireRecoverySession(runtime);
    await runtime.service.updatePassword(password.data);
    await consumeRecoveryIntent(runtime);
    try {
      await runtime.service.signOut();
    } catch {
      // The signed recovery intent is already consumed, so another reset is denied.
    }
    return { status: "success" };
  } catch (error) {
    return actionError(error);
  }
}

export async function signOutAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const locale = localeFrom(formData);
  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) return unavailableState();

  try {
    await runtime.service.signOut();
  } catch (error) {
    return actionError(error);
  }

  redirect(localizedPath(locale, "sign-in"));
}
