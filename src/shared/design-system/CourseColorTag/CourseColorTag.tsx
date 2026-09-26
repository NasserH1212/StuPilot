import styles from "./CourseColorTag.module.css";

export type CourseColor =
  "blue" | "teal" | "violet" | "rose" | "amber" | "orange" | "green" | "slate";

export interface CourseColorTagProps {
  readonly color: CourseColor;
  readonly courseCode: string;
  readonly className?: string;
}

/** Non-interactive label: always pairs a color with a course code, never used alone. */
export function CourseColorTag({ color, courseCode, className }: CourseColorTagProps) {
  return (
    <span
      className={[styles.tag, styles[color], className].filter(Boolean).join(" ")}
      dir="ltr"
    >
      {courseCode}
    </span>
  );
}
