import Link from "next/link";
import type { Route } from "next";

import type { CourseColor } from "../CourseColorTag/CourseColorTag";
import { CourseColorTag } from "../CourseColorTag/CourseColorTag";
import styles from "./CourseListItem.module.css";

export interface CourseListItemProps {
  readonly href: Route;
  readonly title: string;
  readonly meta?: string | null;
  readonly color: CourseColor;
  readonly courseCode?: string | null;
  readonly className?: string;
}

export function CourseListItem({
  href,
  title,
  meta,
  color,
  courseCode,
  className,
}: CourseListItemProps) {
  return (
    <Link href={href} className={[styles.item, className].filter(Boolean).join(" ")}>
      {courseCode && (
        <div className={styles.tagRow}>
          <CourseColorTag color={color} courseCode={courseCode} />
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
    </Link>
  );
}
