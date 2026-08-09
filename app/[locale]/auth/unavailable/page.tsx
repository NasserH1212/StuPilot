import { notFound } from "next/navigation";

import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { isLocale } from "@/src/shared/localization/locales";

const reasons = ["configuration", "provider", "rate_limited", "account"] as const;

export default async function AuthenticationUnavailablePage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ reason?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const reasonValue = (await searchParams).reason;
  const candidate = Array.isArray(reasonValue) ? reasonValue[0] : reasonValue;
  const reason = reasons.find((value) => value === candidate) ?? "configuration";
  return <AuthUnavailableView locale={locale} reason={reason} />;
}
