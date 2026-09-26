"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import { AddClassMeetingForm } from "@/src/modules/schedule/presentation/add-class-meeting-form";
import type { ClassMeetingRecord } from "@/src/modules/schedule/application/ports/class-meeting-repository";
import type { Weekday } from "@/src/modules/schedule/domain/class-meeting";
import { weekdayLabel } from "@/src/modules/schedule/presentation/weekday-labels";
import type { UniversityDisplay } from "@/src/modules/universities/presentation/university-display";
import {
  AppHeader,
  BottomNavigation,
  Button,
  CourseColorTag,
  IconButton,
  IconChevronBack,
  LinkButton,
  TimeRange,
} from "@/src/shared/design-system";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import { resolveCourseColor } from "./course-color";
import styles from "./course-detail-view.module.css";
import { archiveCourseAction } from "../transport/course-actions";
import { initialCourseActionState } from "../transport/course-action-state";
import { courseActionMessage, getCoursesDictionary } from "./courses-dictionary";

interface ScheduleRow {
  readonly weekday: Weekday;
  readonly start: { readonly hour: number; readonly minute: number };
  readonly end: { readonly hour: number; readonly minute: number };
}

function parseLocalTime(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);
  return { hour: hour ?? 0, minute: minute ?? 0 };
}

function scheduleRowsFor(
  meetings: readonly ClassMeetingRecord[],
): readonly ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  for (const meeting of meetings) {
    if (meeting.archivedAt) continue;
    for (const weekday of meeting.weekdays) {
      rows.push({
        weekday,
        start: parseLocalTime(meeting.localStartTime),
        end: parseLocalTime(meeting.localEndTime),
      });
    }
  }
  return rows.sort(
    (a, b) =>
      a.weekday - b.weekday ||
      a.start.hour * 60 + a.start.minute - (b.start.hour * 60 + b.start.minute),
  );
}

export function CourseDetailView({
  locale,
  termId,
  course,
  meetings,
  university,
}: {
  readonly locale: Locale;
  readonly termId: string;
  readonly course: TermCourseRecord;
  readonly meetings: readonly ClassMeetingRecord[];
  readonly university: UniversityDisplay | null;
}) {
  const dictionary = getCoursesDictionary(locale);
  const router = useRouter();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [confirmingArchive, setConfirmingArchive] = useState(false);
  const [addingMeeting, setAddingMeeting] = useState(false);
  const [archiveState, archiveAction, archivePending] = useActionState(
    archiveCourseAction,
    initialCourseActionState,
  );
  const coursesHref = `/${locale}/workspace/terms/${termId}/courses` as Route;
  const scheduleRows = scheduleRowsFor(meetings);
  const statusMessage =
    archiveState.status === "error"
      ? courseActionMessage(dictionary, archiveState.code)
      : null;

  useEffect(() => {
    if (archiveState.status === "success") router.push(coursesHref);
  }, [archiveState.status, router, coursesHref]);

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <AppHeader
          brandLabel="StuPilot"
          homeHref={localizedPath(locale, "workspace") as Route}
          university={university}
        />

        <div className={styles.headingRow}>
          <h1 className={styles.heading} dir="auto">
            {dictionary.detailHeading}
          </h1>
          <IconButton
            href={coursesHref}
            icon={<IconChevronBack />}
            aria-label={dictionary.backToCourses}
          />
        </div>

        {course.code && (
          <div className={styles.identityRow}>
            <CourseColorTag
              color={resolveCourseColor(course.colorToken, course.courseId)}
              courseCode={course.code}
            />
          </div>
        )}

        <p className={styles.courseTitle} dir="auto">
          {course.name}
        </p>

        {course.defaultLocation && (
          <div className={styles.infoCard}>
            <p className={styles.infoLine} dir="auto">
              {course.defaultLocation}
            </p>
          </div>
        )}

        <div className={styles.actions}>
          <LinkButton href={coursesHref} variant="secondary">
            {dictionary.editAction}
          </LinkButton>
          {confirmingArchive ? (
            <form action={archiveAction} className={styles.actions}>
              <input name="locale" type="hidden" value={locale} />
              <input name="termId" type="hidden" value={termId} />
              <input name="enrollmentId" type="hidden" value={course.enrollmentId} />
              <span role="status" className={styles.mutedNote}>
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
                onClick={() => setConfirmingArchive(false)}
                disabled={archivePending}
              >
                {dictionary.archiveCancel}
              </Button>
            </form>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmingArchive(true)}
            >
              {dictionary.archiveAction}
            </Button>
          )}
        </div>
        <div role="status" aria-live="polite" className={styles.mutedNote}>
          {statusMessage}
        </div>

        <h2 className={styles.sectionHeading} dir="auto">
          {dictionary.scheduleHeading}
        </h2>
        {scheduleRows.length === 0 ? (
          <p className={styles.mutedNote} dir="auto">
            {dictionary.noScheduleYet}
          </p>
        ) : (
          <ul className={styles.list}>
            {scheduleRows.map((row, index) => (
              <li key={index} className={styles.scheduleRow}>
                <span className={styles.dayName} dir="auto">
                  {weekdayLabel(locale, row.weekday)}
                </span>
                <TimeRange start={row.start} end={row.end} />
              </li>
            ))}
          </ul>
        )}

        {addingMeeting ? (
          <AddClassMeetingForm
            locale={locale}
            termId={termId}
            userCourseId={course.enrollmentId}
            onCreated={() => {
              setAddingMeeting(false);
              router.refresh();
            }}
          />
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setAddingMeeting(true)}
          >
            {dictionary.addMeetingAction}
          </Button>
        )}

        <h2 className={styles.sectionHeading} dir="auto">
          {dictionary.upcomingTasksHeading}
        </h2>
        <p className={styles.mutedNote} dir="auto">
          {dictionary.tasksNotYetAvailable}
        </p>

        <h2 className={styles.sectionHeading} dir="auto">
          {dictionary.upcomingExamsHeading}
        </h2>
        <p className={styles.mutedNote} dir="auto">
          {dictionary.examsNotYetAvailable}
        </p>
      </div>

      <BottomNavigation
        active="courses"
        hrefFor={(key) =>
          ({
            profile: localizedPath(locale, "workspace"),
            courses: localizedPath(locale, "terms"),
            week: `/${locale}/workspace/week`,
            today: localizedPath(locale, "workspace"),
          })[key] as Route
        }
        captureOpen={captureOpen}
        onToggleCapture={() => setCaptureOpen((open) => !open)}
      />
    </div>
  );
}
