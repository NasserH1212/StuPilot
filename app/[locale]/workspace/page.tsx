import type { Route } from "next";
import { notFound, redirect } from "next/navigation";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import { AuthenticatedWorkspaceView } from "@/src/modules/authentication/presentation/authenticated-workspace-view";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

interface ApplicationShellPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function ApplicationShellPage({
  params,
}: ApplicationShellPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) {
    redirect(
      `${localizedPath(locale, "authentication-unavailable")}?reason=configuration` as Route,
    );
  }

  let account;
  try {
    account = await runtime.service.currentAccount();
  } catch (error) {
    if (isAuthenticationError(error) && error.code === "ACCOUNT_UNAVAILABLE") {
      redirect(
        `${localizedPath(locale, "authentication-unavailable")}?reason=account` as Route,
      );
    }
    redirect(
      `${localizedPath(locale, "authentication-unavailable")}?reason=provider` as Route,
    );
  }

  if (!account) {
    const returnTo = encodeURIComponent(localizedPath(locale, "workspace"));
    redirect(`${localizedPath(locale, "sign-in")}?returnTo=${returnTo}` as Route);
  }

  return <AuthenticatedWorkspaceView locale={locale} account={account} />;
}
