import { notFound } from "next/navigation";

import { AuthForm } from "@/src/modules/authentication/presentation/auth-form";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { getAuthenticationConfiguration } from "@/src/shared/config/authentication";
import { isLocale } from "@/src/shared/localization/locales";

export default async function RegisterPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (!getAuthenticationConfiguration().available) {
    return <AuthUnavailableView locale={locale} />;
  }
  return <AuthForm locale={locale} mode="register" />;
}
