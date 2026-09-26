"use client";

import { useActionState } from "react";
import type { RefObject } from "react";

import { Button, Input } from "@/src/shared/design-system";
import type { Locale } from "@/src/shared/localization/locales";

import { createCourseAction } from "../transport/course-actions";
import { initialCourseActionState } from "../transport/course-action-state";
import { courseActionMessage, getCoursesDictionary } from "./courses-dictionary";
import styles from "./courses-view.module.css";

export function CourseCreateForm({
  locale,
  termId,
  nameFieldRef,
}: {
  readonly locale: Locale;
  readonly termId: string;
  readonly nameFieldRef?: RefObject<HTMLInputElement | null>;
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
    <section className={styles.item} aria-labelledby="course-create-heading">
      <h2 className={styles.createHeading} id="course-create-heading" dir="auto">
        {dictionary.createHeading}
      </h2>
      {state.status === "success" ? (
        <p role="status" dir="auto">
          {dictionary.created}
        </p>
      ) : null}
      <form action={formAction} className={styles.form} noValidate>
        <input name="locale" type="hidden" value={locale} />
        <input name="termId" type="hidden" value={termId} />

        <Input
          ref={nameFieldRef}
          id="course-name"
          name="name"
          label={dictionary.nameLabel}
          required
          maxLength={120}
          error={fieldErrors.name ? dictionary.errors.nameRequired : undefined}
        />

        <Input
          id="course-code"
          name="code"
          label={dictionary.codeLabel}
          dir="ltr"
          maxLength={32}
          error={fieldErrors.code ? dictionary.errors.codeTooLong : undefined}
        />

        <Input
          id="course-location"
          name="defaultLocation"
          label={dictionary.locationLabel}
          maxLength={120}
          error={
            fieldErrors.defaultLocation ? dictionary.errors.locationTooLong : undefined
          }
        />

        <div className={styles.statusMessage} role="status" aria-live="polite">
          {actionMessage}
        </div>
        <Button
          type="submit"
          loading={pending}
          loadingLabel={dictionary.submitting}
          fullWidth
        >
          {dictionary.submit}
        </Button>
      </form>
    </section>
  );
}
