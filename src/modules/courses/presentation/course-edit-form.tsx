"use client";

import { useActionState, useEffect } from "react";

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import type { Locale } from "@/src/shared/localization/locales";

import { editCourseAction } from "../transport/course-actions";
import { initialCourseActionState } from "../transport/course-action-state";
import { courseActionMessage, getCoursesDictionary } from "./courses-dictionary";

export function CourseEditForm({
  locale,
  termId,
  course,
  onCancel,
  onSaved,
}: {
  readonly locale: Locale;
  readonly termId: string;
  readonly course: TermCourseRecord;
  readonly onCancel: () => void;
  readonly onSaved: () => void;
}) {
  const dictionary = getCoursesDictionary(locale);
  const [state, formAction, pending] = useActionState(
    editCourseAction,
    initialCourseActionState,
  );

  useEffect(() => {
    if (state.status === "success") onSaved();
  }, [state.status, onSaved]);

  const fieldErrors = state.fieldErrors ?? {};
  const actionMessage =
    state.status === "error" ? courseActionMessage(dictionary, state.code) : null;

  return (
    <section
      className="authCard"
      aria-labelledby={`course-edit-heading-${course.enrollmentId}`}
    >
      <h3 id={`course-edit-heading-${course.enrollmentId}`}>
        {dictionary.editHeading}
      </h3>
      <form action={formAction} className="authForm" noValidate>
        <input name="locale" type="hidden" value={locale} />
        <input name="termId" type="hidden" value={termId} />
        <input name="enrollmentId" type="hidden" value={course.enrollmentId} />

        <div className="fieldGroup">
          <label htmlFor={`course-edit-name-${course.enrollmentId}`}>
            {dictionary.nameLabel}
          </label>
          <input
            id={`course-edit-name-${course.enrollmentId}`}
            name="name"
            type="text"
            required
            maxLength={120}
            defaultValue={course.name}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={
              fieldErrors.name
                ? `course-edit-name-error-${course.enrollmentId}`
                : undefined
            }
          />
          {fieldErrors.name ? (
            <p
              className="fieldError"
              id={`course-edit-name-error-${course.enrollmentId}`}
            >
              {dictionary.errors.nameRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor={`course-edit-code-${course.enrollmentId}`}>
            {dictionary.codeLabel}
          </label>
          <input
            id={`course-edit-code-${course.enrollmentId}`}
            name="code"
            type="text"
            dir="ltr"
            maxLength={32}
            defaultValue={course.code ?? ""}
            aria-invalid={fieldErrors.code ? true : undefined}
            aria-describedby={
              fieldErrors.code
                ? `course-edit-code-error-${course.enrollmentId}`
                : undefined
            }
          />
          {fieldErrors.code ? (
            <p
              className="fieldError"
              id={`course-edit-code-error-${course.enrollmentId}`}
            >
              {dictionary.errors.codeTooLong}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor={`course-edit-location-${course.enrollmentId}`}>
            {dictionary.locationLabel}
          </label>
          <input
            id={`course-edit-location-${course.enrollmentId}`}
            name="defaultLocation"
            type="text"
            maxLength={120}
            defaultValue={course.defaultLocation ?? ""}
            aria-invalid={fieldErrors.defaultLocation ? true : undefined}
            aria-describedby={
              fieldErrors.defaultLocation
                ? `course-edit-location-error-${course.enrollmentId}`
                : undefined
            }
          />
          {fieldErrors.defaultLocation ? (
            <p
              className="fieldError"
              id={`course-edit-location-error-${course.enrollmentId}`}
            >
              {dictionary.errors.locationTooLong}
            </p>
          ) : null}
        </div>

        <div className="authMessage" role="status" aria-live="polite">
          {actionMessage}
        </div>

        <div className="termActions">
          <button className="primaryAction" type="submit" disabled={pending}>
            {pending ? dictionary.editSubmitting : dictionary.editSubmit}
          </button>
          <button
            type="button"
            className="secondaryAction"
            onClick={onCancel}
            disabled={pending}
          >
            {dictionary.editCancel}
          </button>
        </div>
      </form>
    </section>
  );
}
