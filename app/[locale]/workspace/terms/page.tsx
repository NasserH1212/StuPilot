import type { Route } from "next";
import { notFound, redirect } from "next/navigation";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createTermService } from "@/src/composition/terms";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { TermsView } from "@/src/modules/terms/presentation/terms-view";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

interface TermsPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
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

  const terms = await createTermService().listTerms(account.id);

  return <TermsView locale={locale} terms={terms} />;
}
