import type { CourseColor } from "../CourseColorTag/CourseColorTag";
import styles from "./WeekGridBlock.module.css";

const surfaceVar: Record<CourseColor, string> = {
  blue: "var(--color-course-blue-surface)",
  teal: "var(--color-course-teal-surface)",
  violet: "var(--color-course-violet-surface)",
  rose: "var(--color-course-rose-surface)",
  amber: "var(--color-course-amber-surface)",
  orange: "var(--color-course-orange-surface)",
  green: "var(--color-course-green-surface)",
  slate: "var(--color-course-slate-surface)",
};

const foregroundVar: Record<CourseColor, string> = {
  blue: "var(--color-course-blue-foreground)",
  teal: "var(--color-course-teal-foreground)",
  violet: "var(--color-course-violet-foreground)",
  rose: "var(--color-course-rose-foreground)",
  amber: "var(--color-course-amber-foreground)",
  orange: "var(--color-course-orange-foreground)",
  green: "var(--color-course-green-foreground)",
  slate: "var(--color-course-slate-foreground)",
};

export interface WeekGridBlockProps {
  readonly color: CourseColor;
  readonly courseCode: string;
  readonly label: string;
  readonly className?: string;
}

/** Motion: none at rest. The course code is always visible alongside color. */
export function WeekGridBlock({
  color,
  courseCode,
  label,
  className,
}: WeekGridBlockProps) {
  return (
    <div
      className={[styles.block, className].filter(Boolean).join(" ")}
      style={{ background: surfaceVar[color], color: foregroundVar[color] }}
    >
      <p className={styles.code} dir="ltr">
        {courseCode}
      </p>
      <p className={styles.label} dir="auto">
        {label}
      </p>
    </div>
  );
}

export function WeekGridEmptyCell({ className }: { readonly className?: string }) {
  return (
    <div
      className={[styles.empty, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}
