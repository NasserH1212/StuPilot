import type { Route } from "next";
import { notFound, redirect } from "next/navigation";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createCourseService } from "@/src/composition/courses";
import { createOnboardingService } from "@/src/composition/onboarding";
import { createTermService } from "@/src/composition/terms";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { CoursesView } from "@/src/modules/courses/presentation/courses-view";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

interface TermCoursesPageProps {
  readonly params: Promise<{ locale: string; termId: string }>;
}

export default async function TermCoursesPage({ params }: TermCoursesPageProps) {
  const { locale, termId } = await params;

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

  const courses = await createCourseService().listCourses(account.id, termId);

  return <CoursesView locale={locale} term={term} courses={courses} />;
}
