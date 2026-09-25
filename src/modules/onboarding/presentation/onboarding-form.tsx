"use client";

import { useActionState, useState } from "react";

import { locales, type Locale } from "@/src/shared/localization/locales";

import { completeOnboardingAction } from "../transport/onboarding-actions";
import { initialOnboardingActionState } from "../transport/onboarding-action-state";
import { getOnboardingDictionary } from "./onboarding-dictionary";

export function OnboardingForm({ locale }: { readonly locale: Locale }) {
  const dictionary = getOnboardingDictionary(locale);
  const [state, formAction, pending] = useActionState(
    completeOnboardingAction,
    initialOnboardingActionState,
  );
  const [defaultTimeZone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "";
    }
  });

  const fieldErrors = state.fieldErrors ?? {};
  const actionMessage =
    state.status === "error" && state.code === "UNAVAILABLE"
      ? dictionary.errors.unavailable
      : state.status === "error" &&
          state.code !== "VALIDATION_ERROR" &&
          state.code !== undefined
        ? dictionary.errors.unexpected
        : null;

  return (
    <section className="authCard" aria-labelledby="onboarding-heading">
      <p className="eyebrow">{dictionary.eyebrow}</p>
      <h1 id="onboarding-heading">{dictionary.title}</h1>
      <p className="supportingCopy">{dictionary.body}</p>

      <form action={formAction} className="authForm" noValidate>
        <fieldset className="fieldGroup">
          <legend>{dictionary.localeLabel}</legend>
          {locales.map((option) => (
            <label
              className="checkboxField"
              key={option}
              htmlFor={`onboarding-locale-${option}`}
            >
              <input
                id={`onboarding-locale-${option}`}
                name="locale"
                type="radio"
                value={option}
                defaultChecked={option === locale}
              />
              <span>{dictionary.localeOptions[option]}</span>
            </label>
          ))}
        </fieldset>

        <div className="fieldGroup">
          <label htmlFor="onboarding-timezone">{dictionary.timeZoneLabel}</label>
          <input
            id="onboarding-timezone"
            name="timeZone"
            type="text"
            dir="ltr"
            required
            maxLength={64}
            defaultValue={defaultTimeZone}
            aria-invalid={fieldErrors.timeZone ? true : undefined}
            aria-describedby={
              fieldErrors.timeZone ? "onboarding-timezone-error" : undefined
            }
          />
          {fieldErrors.timeZone ? (
            <p className="fieldError" id="onboarding-timezone-error">
              {dictionary.errors.timeZoneRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor="onboarding-university">{dictionary.universityLabel}</label>
          <input
            id="onboarding-university"
            name="university"
            type="text"
            maxLength={120}
            aria-invalid={fieldErrors.university ? true : undefined}
            aria-describedby={
              fieldErrors.university ? "onboarding-university-error" : undefined
            }
          />
          {fieldErrors.university ? (
            <p className="fieldError" id="onboarding-university-error">
              {dictionary.errors.universityTooLong}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor="onboarding-major">{dictionary.majorLabel}</label>
          <input
            id="onboarding-major"
            name="major"
            type="text"
            maxLength={120}
            aria-invalid={fieldErrors.major ? true : undefined}
            aria-describedby={fieldErrors.major ? "onboarding-major-error" : undefined}
          />
          {fieldErrors.major ? (
            <p className="fieldError" id="onboarding-major-error">
              {dictionary.errors.majorTooLong}
            </p>
          ) : null}
        </div>

        <div className="authMessage" role="status" aria-live="polite">
          {actionMessage}
        </div>
        <button className="primaryAction" type="submit" disabled={pending}>
          {pending ? dictionary.submitting : dictionary.submit}
        </button>
      </form>
    </section>
  );
}
