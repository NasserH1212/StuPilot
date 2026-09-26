"use client";

import { useActionState, useEffect, useState } from "react";

import { createClassMeetingAction } from "@/src/modules/schedule/transport/class-meeting-actions";
import {
  initialClassMeetingActionState,
  type ClassMeetingActionCode,
} from "@/src/modules/schedule/transport/class-meeting-action-state";
import { Button, Chip, Input, SegmentedControl } from "@/src/shared/design-system";
import type { Locale } from "@/src/shared/localization/locales";

import type { ClassMeetingType, Weekday } from "../domain/class-meeting";
import styles from "./add-class-meeting-form.module.css";
import { getWeekDictionary, type WeekDictionary } from "./week-dictionary";
import { weekdayLabel } from "./weekday-labels";

const academicWeekdays: readonly Weekday[] = [0, 1, 2, 3, 4];

function actionMessage(
  dictionary: WeekDictionary,
  code: ClassMeetingActionCode | undefined,
): string | null {
  switch (code) {
    case "VALIDATION_ERROR":
      return dictionary.errors.timeInvalid;
    case "UNAVAILABLE":
    case "TERM_NOT_FOUND":
      return dictionary.errors.unavailable;
    default:
      return code ? dictionary.errors.unexpected : null;
  }
}

export function AddClassMeetingForm({
  locale,
  termId,
  userCourseId,
  onCreated,
}: {
  readonly locale: Locale;
  readonly termId: string;
  readonly userCourseId: string;
  readonly onCreated?: () => void;
}) {
  const dictionary = getWeekDictionary(locale);
  const [state, formAction, pending] = useActionState(
    createClassMeetingAction,
    initialClassMeetingActionState,
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState<readonly Weekday[]>([]);
  const [meetingType, setMeetingType] = useState<ClassMeetingType>("lecture");

  useEffect(() => {
    if (state.status === "success") onCreated?.();
  }, [state.status, onCreated]);

  const fieldErrors = state.fieldErrors ?? {};
  const message =
    state.status === "error" ? actionMessage(dictionary, state.code) : null;

  function toggleWeekday(day: Weekday) {
    setSelectedWeekdays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day],
    );
  }

  return (
    <form action={formAction} className={styles.form} noValidate>
      <h3 className={styles.heading} dir="auto">
        {dictionary.addMeetingHeading}
      </h3>
      <input name="locale" type="hidden" value={locale} />
      <input name="termId" type="hidden" value={termId} />
      <input name="userCourseId" type="hidden" value={userCourseId} />
      <input name="meetingType" type="hidden" value={meetingType} />
      {selectedWeekdays.map((day) => (
        <input key={day} name="weekdays" type="hidden" value={day} />
      ))}

      <div>
        <p className={styles.fieldLabel} dir="auto">
          {dictionary.weekdaysLabel}
        </p>
        <div className={styles.dayChips}>
          {academicWeekdays.map((day) => (
            <Chip
              key={day}
              label={weekdayLabel(locale, day)}
              selected={selectedWeekdays.includes(day)}
              onClick={() => toggleWeekday(day)}
            />
          ))}
        </div>
      </div>

      <div className={styles.timeRow}>
        <Input
          id={`meeting-start-${userCourseId}`}
          name="localStartTime"
          type="time"
          label={dictionary.startTimeLabel}
          required
          error={fieldErrors.localStartTime ? dictionary.errors.timeInvalid : undefined}
        />
        <Input
          id={`meeting-end-${userCourseId}`}
          name="localEndTime"
          type="time"
          label={dictionary.endTimeLabel}
          required
          error={fieldErrors.localEndTime ? dictionary.errors.timeOrder : undefined}
        />
      </div>

      <Input
        id={`meeting-location-${userCourseId}`}
        name="location"
        label={dictionary.roomLabel}
        maxLength={120}
      />

      <div>
        <p className={styles.fieldLabel} dir="auto">
          {dictionary.meetingTypeLabel}
        </p>
        <SegmentedControl<ClassMeetingType>
          aria-label={dictionary.meetingTypeLabel}
          value={meetingType}
          onChange={setMeetingType}
          options={[
            { value: "lecture", label: dictionary.meetingTypeLecture },
            { value: "lab", label: dictionary.meetingTypeLab },
            { value: "tutorial", label: dictionary.meetingTypeTutorial },
          ]}
        />
      </div>

      {fieldErrors.weekdays && (
        <p className={styles.statusMessage} role="alert">
          {dictionary.errors.weekdaysRequired}
        </p>
      )}
      <div className={styles.statusMessage} role="status" aria-live="polite">
        {message}
      </div>
      {state.status === "success" && (
        <p className={styles.successMessage} role="status">
          {dictionary.addMeetingCreated}
        </p>
      )}

      <Button
        type="submit"
        loading={pending}
        loadingLabel={dictionary.addMeetingSubmitting}
        fullWidth
      >
        {dictionary.addMeetingSubmit}
      </Button>
    </form>
  );
}
