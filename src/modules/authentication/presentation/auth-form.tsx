"use client";

import Link from "next/link";
import { useActionState } from "react";

import { getDictionary } from "@/src/shared/localization/dictionaries";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import type { AuthenticationErrorCode } from "../application/authentication-error";
import {
  forgotPasswordAction,
  registerAction,
  resetPasswordAction,
  signInAction,
} from "../transport/auth-actions";
import {
  initialAuthActionState,
  type AuthActionState,
  type AuthFieldError,
} from "../transport/auth-action-state";

type AuthFormMode = "sign-in" | "register" | "forgot-password" | "reset-password";

interface AuthFormProps {
  readonly locale: Locale;
  readonly mode: AuthFormMode;
  readonly returnTo?: string;
}

const actions = {
  "forgot-password": forgotPasswordAction,
  register: registerAction,
  "reset-password": resetPasswordAction,
  "sign-in": signInAction,
} satisfies Record<
  AuthFormMode,
  (state: AuthActionState, formData: FormData) => Promise<AuthActionState>
>;

function fieldErrorText(
  error: AuthFieldError | undefined,
  dictionary: ReturnType<typeof getDictionary>,
): string | undefined {
  if (error === "INVALID_EMAIL") return dictionary.auth.common.invalidEmail;
  if (error === "PASSWORDS_DO_NOT_MATCH") {
    return dictionary.auth.common.passwordsDoNotMatch;
  }
  if (error === "PASSWORD_REQUIREMENTS") {
    return dictionary.auth.common.passwordRequirements;
  }
  return undefined;
}

function actionErrorText(
  code: AuthenticationErrorCode | "VALIDATION_ERROR" | undefined,
  mode: AuthFormMode,
  dictionary: ReturnType<typeof getDictionary>,
): string | undefined {
  if (!code || code === "VALIDATION_ERROR") return undefined;
  if (code === "CONFIGURATION_UNAVAILABLE") {
    return dictionary.auth.common.configurationBody;
  }
  if (code === "RATE_LIMITED") return dictionary.auth.common.rateLimited;
  if (code === "PROVIDER_UNAVAILABLE") {
    return dictionary.auth.common.providerUnavailable;
  }
  if (code === "ACCOUNT_UNAVAILABLE") {
    return dictionary.auth.common.accountUnavailable;
  }
  if (code === "EMAIL_NOT_VERIFIED") {
    return dictionary.auth.signIn.emailNotVerified;
  }
  if (code === "INVALID_CREDENTIALS" && mode === "sign-in") {
    return dictionary.auth.signIn.invalidCredentials;
  }
  if (
    code === "LINK_INVALID" ||
    code === "LINK_EXPIRED_OR_USED" ||
    code === "RECOVERY_SESSION_REQUIRED" ||
    code === "UNAUTHORIZED"
  ) {
    return dictionary.auth.linkError.expiredOrUsed;
  }
  return dictionary.auth.common.unexpected;
}

export function AuthForm({ locale, mode, returnTo }: AuthFormProps) {
  const dictionary = getDictionary(locale);
  const [state, formAction, pending] = useActionState(
    actions[mode],
    initialAuthActionState,
  );
  const content =
    mode === "forgot-password"
      ? dictionary.auth.forgotPassword
      : mode === "reset-password"
        ? dictionary.auth.resetPassword
        : mode === "sign-in"
          ? dictionary.auth.signIn
          : dictionary.auth.register;
  const emailError = fieldErrorText(state.fieldErrors?.email, dictionary);
  const passwordError = fieldErrorText(state.fieldErrors?.password, dictionary);
  const confirmPasswordError = fieldErrorText(
    state.fieldErrors?.confirmPassword,
    dictionary,
  );
  const actionError = actionErrorText(state.code, mode, dictionary);

  if (state.status === "success" && mode === "forgot-password") {
    return (
      <section className="authCard" aria-labelledby="auth-form-heading">
        <p className="eyebrow">{dictionary.auth.forgotPassword.eyebrow}</p>
        <h1 id="auth-form-heading">{dictionary.auth.forgotPassword.title}</h1>
        <p className="authSuccess" role="status">
          {dictionary.auth.forgotPassword.sent}
        </p>
        <Link className="primaryAction" href={localizedPath(locale, "sign-in")}>
          {dictionary.auth.forgotPassword.returnToSignIn}
        </Link>
      </section>
    );
  }

  if (state.status === "success" && mode === "reset-password") {
    return (
      <section className="authCard" aria-labelledby="auth-form-heading">
        <p className="eyebrow">{dictionary.auth.resetPassword.eyebrow}</p>
        <h1 id="auth-form-heading">{dictionary.auth.resetPassword.completedTitle}</h1>
        <p className="authSuccess" role="status">
          {dictionary.auth.resetPassword.completedBody}
        </p>
        <Link className="primaryAction" href={localizedPath(locale, "sign-in")}>
          {dictionary.auth.signIn.submit}
        </Link>
      </section>
    );
  }

  return (
    <section className="authCard" aria-labelledby="auth-form-heading">
      <p className="eyebrow">{content.eyebrow}</p>
      <h1 id="auth-form-heading">{content.title}</h1>
      <p className="supportingCopy">{content.body}</p>
      <form action={formAction} className="authForm" noValidate>
        <input name="locale" type="hidden" value={locale} />
        {mode === "sign-in" ? (
          <input
            name="returnTo"
            type="hidden"
            value={returnTo ?? localizedPath(locale, "workspace")}
          />
        ) : null}

        {mode !== "reset-password" ? (
          <div className="fieldGroup">
            <label htmlFor={`${mode}-email`}>{dictionary.auth.common.email}</label>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? `${mode}-email-error` : undefined}
            />
            {emailError ? (
              <p className="fieldError" id={`${mode}-email-error`}>
                {emailError}
              </p>
            ) : null}
          </div>
        ) : null}

        {mode === "sign-in" || mode === "register" || mode === "reset-password" ? (
          <div className="fieldGroup">
            <label htmlFor={`${mode}-password`}>
              {dictionary.auth.common.password}
            </label>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              dir="ltr"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              required
              minLength={mode === "sign-in" ? 1 : 12}
              maxLength={128}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={
                passwordError
                  ? `${mode}-password-error`
                  : mode === "register" || mode === "reset-password"
                    ? `${mode}-password-help`
                    : undefined
              }
            />
            {mode === "register" || mode === "reset-password" ? (
              <p className="fieldHelp" id={`${mode}-password-help`}>
                {dictionary.auth.common.passwordRequirements}
              </p>
            ) : null}
            {passwordError ? (
              <p className="fieldError" id={`${mode}-password-error`}>
                {passwordError}
              </p>
            ) : null}
          </div>
        ) : null}

        {mode === "register" || mode === "reset-password" ? (
          <div className="fieldGroup">
            <label htmlFor={`${mode}-confirm-password`}>
              {dictionary.auth.common.confirmPassword}
            </label>
            <input
              id={`${mode}-confirm-password`}
              name="confirmPassword"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
              aria-invalid={confirmPasswordError ? true : undefined}
              aria-describedby={
                confirmPasswordError ? `${mode}-confirm-password-error` : undefined
              }
            />
            {confirmPasswordError ? (
              <p className="fieldError" id={`${mode}-confirm-password-error`}>
                {confirmPasswordError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="authMessage" role="status" aria-live="polite">
          {actionError}
        </div>
        <button className="primaryAction" type="submit" disabled={pending}>
          {pending ? dictionary.auth.common.submitting : content.submit}
        </button>
      </form>

      <div className="authLinks">
        {mode === "sign-in" ? (
          <>
            <Link href={localizedPath(locale, "forgot-password")}>
              {dictionary.auth.signIn.forgotPassword}
            </Link>
            <Link href={localizedPath(locale, "register")}>
              {dictionary.auth.signIn.createAccount}
            </Link>
          </>
        ) : null}
        {mode === "register" ? (
          <Link href={localizedPath(locale, "sign-in")}>
            {dictionary.auth.register.haveAccount}
          </Link>
        ) : null}
        {mode === "forgot-password" ? (
          <Link href={localizedPath(locale, "sign-in")}>
            {dictionary.auth.forgotPassword.returnToSignIn}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
