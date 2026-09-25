import { notFound, redirect } from "next/navigation";
import type { Route } from "next";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createOnboardingService } from "@/src/composition/onboarding";
import { createUniversityService } from "@/src/composition/universities";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { OnboardingForm } from "@/src/modules/onboarding/presentation/onboarding-form";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

interface OnboardingPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;

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
  if (profile?.completedAt) {
    redirect(localizedPath(locale, "workspace"));
  }

  const universities = await createUniversityService().listActiveUniversities();

  return <OnboardingForm locale={locale} universities={universities} />;
}
