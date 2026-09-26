"use client";

import type { Route } from "next";
import { useActionState, useState } from "react";

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import type { Locale } from "@/src/shared/localization/locales";
import { Button, CourseListItem } from "@/src/shared/design-system";

import { archiveCourseAction } from "../transport/course-actions";
import { initialCourseActionState } from "../transport/course-action-state";
import { resolveCourseColor } from "./course-color";
import { courseActionMessage, getCoursesDictionary } from "./courses-dictionary";
import { CourseEditForm } from "./course-edit-form";
import styles from "./courses-view.module.css";

type Mode = "view" | "editing" | "confirmArchive";

export function CourseItem({
  locale,
  termId,
  course,
}: {
  readonly locale: Locale;
  readonly termId: string;
  readonly course: TermCourseRecord;
}) {
  const dictionary = getCoursesDictionary(locale);
  const [mode, setMode] = useState<Mode>("view");
  const [archiveState, archiveAction, archivePending] = useActionState(
    archiveCourseAction,
    initialCourseActionState,
  );
  const detailHref =
    `/${locale}/workspace/terms/${termId}/courses/${course.enrollmentId}` as Route;

  if (course.archivedAt) {
    return (
      <li className={styles.archivedRow}>
        <div className={styles.archivedHeader}>
          <span className={styles.archivedName} dir="auto">
            {course.name}
          </span>
          <span className={styles.archivedBadge}>{dictionary.archivedBadge}</span>
        </div>
        {course.code || course.defaultLocation ? (
          <p className={styles.archivedMeta}>
            {course.code ? <span dir="ltr">{course.code}</span> : null}
            {course.code && course.defaultLocation ? " · " : null}
            {course.defaultLocation ? (
              <span dir="auto">{course.defaultLocation}</span>
            ) : null}
          </p>
        ) : null}
      </li>
    );
  }

  if (mode === "editing") {
    return (
      <li>
        <CourseEditForm
          locale={locale}
          termId={termId}
          course={course}
          onCancel={() => setMode("view")}
          onSaved={() => setMode("view")}
        />
      </li>
    );
  }

  const statusMessage =
    archiveState.status === "error"
      ? courseActionMessage(dictionary, archiveState.code)
      : null;

  return (
    <li className={styles.item}>
      <CourseListItem
        href={detailHref}
        title={course.name}
        meta={course.defaultLocation}
        color={resolveCourseColor(course.colorToken, course.courseId)}
        courseCode={course.code}
      />

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => setMode("editing")}>
          {dictionary.editAction}
        </Button>

        {mode === "confirmArchive" ? (
          <form action={archiveAction} className={styles.confirmRow}>
            <input name="locale" type="hidden" value={locale} />
            <input name="termId" type="hidden" value={termId} />
            <input name="enrollmentId" type="hidden" value={course.enrollmentId} />
            <span className={styles.confirmPrompt} role="status">
              {dictionary.archiveConfirmPrompt}
            </span>
            <Button
              type="submit"
              loading={archivePending}
              loadingLabel={dictionary.archiving}
            >
              {dictionary.archiveConfirm}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setMode("view")}
              disabled={archivePending}
            >
              {dictionary.archiveCancel}
            </Button>
          </form>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setMode("confirmArchive")}
          >
            {dictionary.archiveAction}
          </Button>
        )}
      </div>

      <div className={styles.statusMessage} role="status" aria-live="polite">
        {statusMessage}
      </div>
    </li>
  );
}
