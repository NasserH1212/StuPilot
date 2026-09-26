import type { Route } from "next";
import { notFound, redirect } from "next/navigation";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createCourseService } from "@/src/composition/courses";
import { createOnboardingService } from "@/src/composition/onboarding";
import { createScheduleService } from "@/src/composition/schedule";
import { createTermService } from "@/src/composition/terms";
import { createUniversityService } from "@/src/composition/universities";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { CourseDetailView } from "@/src/modules/courses/presentation/course-detail-view";
import { resolveUniversityDisplay } from "@/src/modules/universities/presentation/university-display";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

interface CourseDetailPageProps {
  readonly params: Promise<{ locale: string; termId: string; enrollmentId: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { locale, termId, enrollmentId } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

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

  const term = await createTermService().getTerm(account.id, termId);
  if (!term) {
    notFound();
  }

  const course = await createCourseService().getCourse(
    account.id,
    termId,
    enrollmentId,
  );
  if (!course) {
    notFound();
  }

  const [meetings, universities] = await Promise.all([
    createScheduleService().listMeetingsForUserCourse(account.id, course.enrollmentId),
    createUniversityService().listActiveUniversities(),
  ]);

  const university = resolveUniversityDisplay(
    universities,
    locale,
    profile.universityId,
    profile.university,
  );

  return (
    <CourseDetailView
      locale={locale}
      termId={termId}
      course={course}
      meetings={meetings}
      university={university}
    />
  );
}
