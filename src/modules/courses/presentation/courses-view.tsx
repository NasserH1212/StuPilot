import Link from "next/link";

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import { BidiIsolate } from "@/src/modules/foundation/presentation/bidi-isolate";
import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import { CourseCreateForm } from "./course-create-form";
import { CourseItem } from "./course-item";
import { getCoursesDictionary } from "./courses-dictionary";

export function CoursesView({
  locale,
  term,
  courses,
}: {
  readonly locale: Locale;
  readonly term: TermRecord;
  readonly courses: readonly TermCourseRecord[];
}) {
  const dictionary = getCoursesDictionary(locale);

  return (
    <section className="applicationPlaceholder" aria-labelledby="courses-heading">
      <div>
        <p className="eyebrow">{dictionary.eyebrow}</p>
        <h1 id="courses-heading">
          <BidiIsolate>{term.name}</BidiIsolate>
        </h1>
        <p className="supportingCopy">{dictionary.body}</p>
      </div>

      {courses.length === 0 ? (
        <div className="notice">
          <p>
            <strong>{dictionary.emptyTitle}</strong>
          </p>
          <p>{dictionary.emptyBody}</p>
        </div>
      ) : (
        <ul className="courseList">
          {courses.map((course) => (
            <CourseItem
              key={course.enrollmentId}
              locale={locale}
              termId={term.id}
              course={course}
            />
          ))}
        </ul>
      )}

      <CourseCreateForm locale={locale} termId={term.id} />

      <Link className="secondaryAction" href={localizedPath(locale, "terms")}>
        {dictionary.backToTerms}
      </Link>
    </section>
  );
}
