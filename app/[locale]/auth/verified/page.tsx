import { notFound, redirect } from "next/navigation";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { AuthStateView } from "@/src/modules/authentication/presentation/auth-state-view";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

export default async function VerifiedPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) return <AuthUnavailableView locale={locale} />;
  let account;
  try {
    account = await runtime.service.currentAccount();
  } catch {
    return <AuthUnavailableView locale={locale} reason="provider" />;
  }
  if (!account) redirect(localizedPath(locale, "sign-in"));
  const dictionary = getDictionary(locale);
  return (
    <AuthStateView
      eyebrow={dictionary.auth.verified.eyebrow}
      title={dictionary.auth.verified.title}
      body={dictionary.auth.verified.body}
      actionHref={localizedPath(locale, "workspace")}
      actionLabel={dictionary.auth.verified.openWorkspace}
    />
  );
}
