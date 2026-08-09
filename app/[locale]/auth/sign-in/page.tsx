import { notFound } from "next/navigation";

import { getAuthenticationConfiguration } from "@/src/shared/config/authentication";
import { isLocale } from "@/src/shared/localization/locales";
import { safeWorkspaceReturnTo } from "@/src/shared/localization/routing";
import { AuthForm } from "@/src/modules/authentication/presentation/auth-form";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";

interface SignInPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignInPage({ params, searchParams }: SignInPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  if (!getAuthenticationConfiguration().available) {
    return <AuthUnavailableView locale={locale} />;
  }

  const requestedReturnTo = (await searchParams).returnTo;
  const candidate = Array.isArray(requestedReturnTo)
    ? requestedReturnTo[0]
    : requestedReturnTo;

  return (
    <AuthForm
      locale={locale}
      mode="sign-in"
      returnTo={safeWorkspaceReturnTo(candidate, locale)}
    />
  );
}
