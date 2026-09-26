"use client";

import type { Route } from "next";
import { useRef, useState } from "react";

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import type { UniversityDisplay } from "@/src/modules/universities/presentation/university-display";
import { AppHeader, BottomNavigation, EmptyState } from "@/src/shared/design-system";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import { CourseCreateForm } from "./course-create-form";
import { CourseItem } from "./course-item";
import { getCoursesDictionary } from "./courses-dictionary";
import styles from "./courses-view.module.css";

export function CoursesView({
  locale,
  term,
  courses,
  university,
}: {
  readonly locale: Locale;
  readonly term: TermRecord;
  readonly courses: readonly TermCourseRecord[];
  readonly university: UniversityDisplay | null;
}) {
  const dictionary = getCoursesDictionary(locale);
  const [captureOpen, setCaptureOpen] = useState(false);
  const nameFieldRef = useRef<HTMLInputElement>(null);
  const activeCourses = courses.filter((course) => !course.archivedAt);
  const archivedCourses = courses.filter((course) => course.archivedAt);

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <AppHeader
          brandLabel="StuPilot"
          homeHref={localizedPath(locale, "workspace") as Route}
          university={university}
        />

        <div className={styles.item}>
          <h1 className={styles.title} dir="auto">
            {dictionary.eyebrow}
          </h1>
          <p className={styles.subtitle} dir="auto">
            {dictionary.title}
            {" · "}
            {term.name}
          </p>
        </div>

        {activeCourses.length === 0 ? (
          <EmptyState
            title={dictionary.emptyTitle}
            description={dictionary.emptyBody}
            actionLabel={dictionary.submit}
            onAction={() => nameFieldRef.current?.focus()}
          />
        ) : (
          <ul className={styles.list}>
            {activeCourses.map((course) => (
              <CourseItem
                key={course.enrollmentId}
                locale={locale}
                termId={term.id}
                course={course}
              />
            ))}
          </ul>
        )}

        {archivedCourses.length > 0 && (
          <ul className={styles.list}>
            {archivedCourses.map((course) => (
              <CourseItem
                key={course.enrollmentId}
                locale={locale}
                termId={term.id}
                course={course}
              />
            ))}
          </ul>
        )}

        <CourseCreateForm
          locale={locale}
          termId={term.id}
          nameFieldRef={nameFieldRef}
        />
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
