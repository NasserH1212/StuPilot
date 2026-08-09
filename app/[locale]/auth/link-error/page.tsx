import { notFound } from "next/navigation";

import { AuthStateView } from "@/src/modules/authentication/presentation/auth-state-view";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export default async function LinkErrorPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ reason?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const reasonValue = (await searchParams).reason;
  const reason = Array.isArray(reasonValue) ? reasonValue[0] : reasonValue;
  const body =
    reason === "expired_or_used"
      ? dictionary.auth.linkError.expiredOrUsed
      : dictionary.auth.linkError.invalid;
  return (
    <AuthStateView
      eyebrow={dictionary.auth.linkError.eyebrow}
      title={dictionary.auth.linkError.title}
      body={body}
      actionHref={localizedPath(locale, "forgot-password")}
      actionLabel={dictionary.auth.linkError.requestNew}
    />
  );
}
