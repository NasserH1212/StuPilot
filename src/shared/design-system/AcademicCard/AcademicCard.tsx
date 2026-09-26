import type { CourseColor } from "../CourseColorTag/CourseColorTag";
import { CourseColorTag } from "../CourseColorTag/CourseColorTag";
import type { CountdownTone } from "../CountdownBadge/CountdownBadge";
import { CountdownBadge } from "../CountdownBadge/CountdownBadge";
import { IconRoute } from "../icons/icons";
import { TaskCheckbox } from "../TaskCheckbox/TaskCheckbox";
import type { TimeOfDay } from "../TimeRange/TimeRange";
import { TimeRange } from "../TimeRange/TimeRange";
import styles from "./AcademicCard.module.css";

export type AcademicCardKind =
  "nextLecture" | "lecture" | "task" | "exam" | "planned" | "neutral";

export interface AcademicCardProps {
  readonly kind: AcademicCardKind;
  readonly title: string;
  readonly meta?: string;
  readonly time?: { readonly start: TimeOfDay; readonly end: TimeOfDay };
  readonly course?: { readonly color: CourseColor; readonly code: string };
  readonly countdown?: { readonly tone: CountdownTone; readonly label: string };
  readonly task?: {
    readonly checked: boolean;
    readonly onChange: (checked: boolean) => void;
  };
  readonly selected?: boolean;
  readonly className?: string;
}

export function AcademicCard({
  kind,
  title,
  meta,
  time,
  course,
  countdown,
  task,
  selected = false,
  className,
}: AcademicCardProps) {
  const isNextLecture = kind === "nextLecture";
  const classes = [
    styles.card,
    isNextLecture ? styles.nextLecture : null,
    selected ? styles.selected : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (isNextLecture) {
    return (
      <article className={classes}>
        <p className={styles.signature} dir="auto">
          خطوتك التالية
          <IconRoute />
        </p>
        {countdown && (
          <div className={styles.nextLectureHeading}>
            <CountdownBadge tone={countdown.tone} label={countdown.label} />
            <span>المحاضرة القادمة بعد</span>
          </div>
        )}
        <p className={styles.nextLectureTitle} dir="auto">
          {title}
        </p>
        {time && (
          <div className={`${styles.row} ${styles.rowBetween}`}>
            <TimeRange start={time.start} end={time.end} />
            {course && <CourseColorTag color={course.color} courseCode={course.code} />}
          </div>
        )}
        {meta && (
          <p className={styles.meta} dir="auto">
            {meta}
          </p>
        )}
      </article>
    );
  }

  if (kind === "task" || kind === "exam" || kind === "planned") {
    return (
      <article className={classes}>
        {(countdown || course) && (
          <div className={`${styles.row} ${styles.rowBetween}`}>
            {countdown && (
              <CountdownBadge tone={countdown.tone} label={countdown.label} />
            )}
            {course && <CourseColorTag color={course.color} courseCode={course.code} />}
          </div>
        )}
        {kind === "task" && task ? (
          <TaskCheckbox title={title} checked={task.checked} onChange={task.onChange} />
        ) : (
          <p className={styles.title} dir="auto">
            {title}
          </p>
        )}
        {kind === "planned" && time ? (
          <TimeRange start={time.start} end={time.end} />
        ) : (
          meta && (
            <p className={styles.meta} dir="auto">
              {meta}
            </p>
          )
        )}
      </article>
    );
  }

  return (
    <article className={classes}>
      {time && (
        <div className={styles.row}>
          <TimeRange start={time.start} end={time.end} />
          {course && <CourseColorTag color={course.color} courseCode={course.code} />}
        </div>
      )}
      <p className={styles.title} dir="auto">
        {title}
      </p>
      {meta && (
        <p className={styles.meta} dir="auto">
          {meta}
        </p>
      )}
    </article>
  );
}
