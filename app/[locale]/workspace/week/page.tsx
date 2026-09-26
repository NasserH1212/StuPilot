import type { Route } from "next";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createCourseService } from "@/src/composition/courses";
import { createOnboardingService } from "@/src/composition/onboarding";
import { createScheduleService } from "@/src/composition/schedule";
import { createTermService } from "@/src/composition/terms";
import { createUniversityService } from "@/src/composition/universities";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { resolveCourseColor } from "@/src/modules/courses/presentation/course-color";
import type { AlertBannerKind } from "@/src/shared/design-system";
import { resolveUniversityDisplay } from "@/src/modules/universities/presentation/university-display";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import { buildWeekLectureItems } from "@/src/modules/schedule/presentation/week-lecture-items";
import { WeekNoActiveTermView } from "@/src/modules/schedule/presentation/week-no-active-term-view";
import {
  toLocalDateLabel,
  todayLocalDateLabel,
  totalWeeksInTerm,
  weekIndexForDate,
  weekWindowForIndex,
} from "@/src/modules/schedule/presentation/week-window";
import { weekdayLabel } from "@/src/modules/schedule/presentation/weekday-labels";
import { WeekView } from "@/src/modules/schedule/presentation/week-view";
import type { Weekday } from "@/src/modules/schedule/domain/class-meeting";

export const dynamic = "force-dynamic";

interface WeekPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ week?: string }>;
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function breakKind(nameEn: string): AlertBannerKind {
  const lower = nameEn.toLowerCase();
  if (lower.includes("fall")) return "fall";
  if (lower.includes("fitr")) return "fitr";
  if (lower.includes("adha")) return "adha";
  return "info";
}

export default async function WeekPage({ params, searchParams }: WeekPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) {
    return <AuthUnavailableView locale={locale} />;
  }

  let account;
  try {
    account = await runtime.service.currentAccount();
  } catch (error) {
    if (isAuthenticationError(error) && error.code === "ACCOUNT_UNAVAILABLE") {
      return <AuthUnavailableView locale={locale} reason="account" />;
    }
    return <AuthUnavailableView locale={locale} reason="provider" />;
  }

  if (!account) {
    const returnTo = encodeURIComponent(localizedPath(locale, "workspace"));
    redirect(`${localizedPath(locale, "sign-in")}?returnTo=${returnTo}` as Route);
  }

  const profile = await createOnboardingService().getProfile(account.id);
  if (!profile?.completedAt) {
    redirect(localizedPath(locale, "onboarding"));
  }

  const weekHref = `/${locale}/workspace/week` as Route;

  const [terms, universities] = await Promise.all([
    createTermService().listTerms(account.id),
    createUniversityService().listActiveUniversities(),
  ]);
  const university = resolveUniversityDisplay(
    universities,
    locale,
    profile.universityId,
    profile.university,
  );
  const term = terms.find((candidate) => candidate.isActive && !candidate.archivedAt);

  if (!term) {
    return <WeekNoActiveTermView locale={locale} university={university} />;
  }

  const totalWeeks = totalWeeksInTerm(term);
  const requestedWeek = Number((await searchParams).week);
  const defaultWeek = weekIndexForDate(term, new Date());
  const weekIndex = Number.isInteger(requestedWeek)
    ? Math.min(Math.max(requestedWeek, 1), totalWeeks)
    : defaultWeek;

  const window = weekWindowForIndex(term, weekIndex);

  const activeCourses = (
    await createCourseService().listCourses(account.id, term.id)
  ).filter((course) => !course.archivedAt);

  const meetingsPerCourse = await Promise.all(
    activeCourses.map((course) =>
      createScheduleService().listMeetingsForUserCourse(
        account.id,
        course.enrollmentId,
      ),
    ),
  );
  const meetings = meetingsPerCourse.flat().filter((meeting) => !meeting.archivedAt);

  const breaks = await createUniversityService().listBreaks(profile.universityId);
  const overlappingBreak = breaks.find(
    (brk) =>
      window.startsOn.getTime() >= brk.startsOn.getTime() &&
      window.endsOn.getTime() <= brk.endsOn.getTime(),
  );

  const occurrences =
    meetings.length > 0
      ? createScheduleService().generateOccurrences(
          meetings,
          window,
          breaks.map((brk) => ({ startsOn: brk.startsOn, endsOn: brk.endsOn })),
        )
      : [];

  const items = buildWeekLectureItems(occurrences, meetings, activeCourses, (course) =>
    resolveCourseColor(course.colorToken, course.courseId),
  );

  const todayLabel = todayLocalDateLabel(term.timeZone);
  const days = ([0, 1, 2, 3, 4] as const).map((weekday) => {
    const date = addUtcDays(window.startsOn, weekday);
    const localDate = toLocalDateLabel(date);
    return {
      weekday: weekday as Weekday,
      dayLabel: weekdayLabel(locale, weekday as Weekday),
      dateLabel: String(date.getUTCDate()),
      isToday: localDate === todayLabel,
    };
  });
  const initialSelectedWeekday =
    days.find((day) => day.isToday)?.weekday ?? days[0]?.weekday ?? 0;

  const weekRangeLabel = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).formatRange(window.startsOn, window.endsOn);

  const prevWeekHref =
    weekIndex > 1 ? (`${weekHref}?week=${weekIndex - 1}` as Route) : null;
  const nextWeekHref =
    weekIndex < totalWeeks ? (`${weekHref}?week=${weekIndex + 1}` as Route) : null;

  return (
    <WeekView
      locale={locale}
      university={university}
      termName={term.name}
      weekIndex={weekIndex}
      totalWeeks={totalWeeks}
      weekRangeLabel={weekRangeLabel}
      days={days}
      initialSelectedWeekday={initialSelectedWeekday}
      allWeekItems={items}
      isBreakWeek={Boolean(overlappingBreak)}
      breakBanner={
        overlappingBreak
          ? {
              kind: breakKind(overlappingBreak.nameEn),
              title:
                locale === "ar" ? overlappingBreak.nameAr : overlappingBreak.nameEn,
              body: weekRangeLabel,
            }
          : undefined
      }
      prevWeekHref={prevWeekHref}
      nextWeekHref={nextWeekHref}
      currentWeekHref={weekHref}
    />
  );
}
