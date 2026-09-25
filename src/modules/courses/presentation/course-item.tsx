"use client";

import { useActionState, useState } from "react";

import { BidiIsolate } from "@/src/modules/foundation/presentation/bidi-isolate";
import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import type { Locale } from "@/src/shared/localization/locales";

import {
  archiveCourseAction,
  initialCourseActionState,
} from "../transport/course-actions";
import { courseActionMessage, getCoursesDictionary } from "./courses-dictionary";
import { CourseEditForm } from "./course-edit-form";

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

  if (course.archivedAt) {
    return (
      <li className="courseItem">
        <div className="courseItemHeader">
          <span className="courseName">
            <BidiIsolate>{course.name}</BidiIsolate>
          </span>
          <span className="termBadge">{dictionary.archivedBadge}</span>
        </div>
        {course.code || course.defaultLocation ? (
          <p className="courseMeta">
            {course.code ? (
              <BidiIsolate direction="ltr">{course.code}</BidiIsolate>
            ) : null}
            {course.code && course.defaultLocation ? " · " : null}
            {course.defaultLocation ? (
              <BidiIsolate>{course.defaultLocation}</BidiIsolate>
            ) : null}
          </p>
        ) : null}
      </li>
    );
  }

  if (mode === "editing") {
    return (
      <li className="courseItem">
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
    <li className="courseItem">
      <div className="courseItemHeader">
        <span className="courseName">
          <BidiIsolate>{course.name}</BidiIsolate>
        </span>
      </div>
      {course.code || course.defaultLocation ? (
        <p className="courseMeta">
          {course.code ? (
            <BidiIsolate direction="ltr">{course.code}</BidiIsolate>
          ) : null}
          {course.code && course.defaultLocation ? " · " : null}
          {course.defaultLocation ? (
            <BidiIsolate>{course.defaultLocation}</BidiIsolate>
          ) : null}
        </p>
      ) : null}

      <div className="termActions">
        <button
          type="button"
          className="secondaryAction"
          onClick={() => setMode("editing")}
        >
          {dictionary.editAction}
        </button>

        {mode === "confirmArchive" ? (
          <form action={archiveAction} className="termActions">
            <input name="locale" type="hidden" value={locale} />
            <input name="termId" type="hidden" value={termId} />
            <input name="enrollmentId" type="hidden" value={course.enrollmentId} />
            <span role="status">{dictionary.archiveConfirmPrompt}</span>
            <button className="primaryAction" type="submit" disabled={archivePending}>
              {archivePending ? dictionary.archiving : dictionary.archiveConfirm}
            </button>
            <button
              type="button"
              className="secondaryAction"
              onClick={() => setMode("view")}
              disabled={archivePending}
            >
              {dictionary.archiveCancel}
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="secondaryAction"
            onClick={() => setMode("confirmArchive")}
          >
            {dictionary.archiveAction}
          </button>
        )}
      </div>

      <div className="authMessage" role="status" aria-live="polite">
        {statusMessage}
      </div>
    </li>
  );
}
