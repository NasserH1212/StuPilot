"use client";

import { useActionState } from "react";

import type { Locale } from "@/src/shared/localization/locales";

import { createCourseAction } from "../transport/course-actions";
import { initialCourseActionState } from "../transport/course-action-state";
import { courseActionMessage, getCoursesDictionary } from "./courses-dictionary";

export function CourseCreateForm({
  locale,
  termId,
}: {
  readonly locale: Locale;
  readonly termId: string;
}) {
  const dictionary = getCoursesDictionary(locale);
  const [state, formAction, pending] = useActionState(
    createCourseAction,
    initialCourseActionState,
  );

  const fieldErrors = state.fieldErrors ?? {};
  const actionMessage =
    state.status === "error" ? courseActionMessage(dictionary, state.code) : null;

  return (
    <section className="authCard" aria-labelledby="course-create-heading">
      <h2 id="course-create-heading">{dictionary.createHeading}</h2>
      {state.status === "success" ? (
        <p className="authSuccess" role="status">
          {dictionary.created}
        </p>
      ) : null}
      <form action={formAction} className="authForm" noValidate>
        <input name="locale" type="hidden" value={locale} />
        <input name="termId" type="hidden" value={termId} />

        <div className="fieldGroup">
          <label htmlFor="course-name">{dictionary.nameLabel}</label>
          <input
            id="course-name"
            name="name"
            type="text"
            required
            maxLength={120}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "course-name-error" : undefined}
          />
          {fieldErrors.name ? (
            <p className="fieldError" id="course-name-error">
              {dictionary.errors.nameRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor="course-code">{dictionary.codeLabel}</label>
          <input
            id="course-code"
            name="code"
            type="text"
            dir="ltr"
            maxLength={32}
            aria-invalid={fieldErrors.code ? true : undefined}
            aria-describedby={fieldErrors.code ? "course-code-error" : undefined}
          />
          {fieldErrors.code ? (
            <p className="fieldError" id="course-code-error">
              {dictionary.errors.codeTooLong}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor="course-location">{dictionary.locationLabel}</label>
          <input
            id="course-location"
            name="defaultLocation"
            type="text"
            maxLength={120}
            aria-invalid={fieldErrors.defaultLocation ? true : undefined}
            aria-describedby={
              fieldErrors.defaultLocation ? "course-location-error" : undefined
            }
          />
          {fieldErrors.defaultLocation ? (
            <p className="fieldError" id="course-location-error">
              {dictionary.errors.locationTooLong}
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
