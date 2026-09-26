"use client";

import { useActionState, useEffect } from "react";

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import { Button, Input } from "@/src/shared/design-system";
import type { Locale } from "@/src/shared/localization/locales";

import { editCourseAction } from "../transport/course-actions";
import { initialCourseActionState } from "../transport/course-action-state";
import { courseActionMessage, getCoursesDictionary } from "./courses-dictionary";
import styles from "./courses-view.module.css";

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
  const headingId = `course-edit-heading-${course.enrollmentId}`;

  return (
    <section className={styles.item} aria-labelledby={headingId}>
      <h3 className={styles.createHeading} id={headingId} dir="auto">
        {dictionary.editHeading}
      </h3>
      <form action={formAction} className={styles.form} noValidate>
        <input name="locale" type="hidden" value={locale} />
        <input name="termId" type="hidden" value={termId} />
        <input name="enrollmentId" type="hidden" value={course.enrollmentId} />

        <Input
          id={`course-edit-name-${course.enrollmentId}`}
          name="name"
          label={dictionary.nameLabel}
          required
          maxLength={120}
          defaultValue={course.name}
          error={fieldErrors.name ? dictionary.errors.nameRequired : undefined}
        />

        <Input
          id={`course-edit-code-${course.enrollmentId}`}
          name="code"
          label={dictionary.codeLabel}
          dir="ltr"
          maxLength={32}
          defaultValue={course.code ?? ""}
          error={fieldErrors.code ? dictionary.errors.codeTooLong : undefined}
        />

        <Input
          id={`course-edit-location-${course.enrollmentId}`}
          name="defaultLocation"
          label={dictionary.locationLabel}
          maxLength={120}
          defaultValue={course.defaultLocation ?? ""}
          error={
            fieldErrors.defaultLocation ? dictionary.errors.locationTooLong : undefined
          }
        />

        <div className={styles.statusMessage} role="status" aria-live="polite">
          {actionMessage}
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            loading={pending}
            loadingLabel={dictionary.editSubmitting}
          >
            {dictionary.editSubmit}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={pending}
          >
            {dictionary.editCancel}
          </Button>
        </div>
      </form>
    </section>
  );
}
