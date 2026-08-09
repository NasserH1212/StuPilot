import { notFound } from "next/navigation";

import {
  createAuthenticationRuntime,
  requireRecoverySession,
} from "@/src/composition/authentication";
import { AuthForm } from "@/src/modules/authentication/presentation/auth-form";
import { AuthStateView } from "@/src/modules/authentication/presentation/auth-state-view";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const runtime = await createAuthenticationRuntime();
  if (!runtime.available) return <AuthUnavailableView locale={locale} />;

  try {
    await requireRecoverySession(runtime);
  } catch {
    const dictionary = getDictionary(locale);
    return (
      <AuthStateView
        eyebrow={dictionary.auth.linkError.eyebrow}
        title={dictionary.auth.linkError.title}
        body={dictionary.auth.linkError.expiredOrUsed}
        actionHref={localizedPath(locale, "forgot-password")}
        actionLabel={dictionary.auth.linkError.requestNew}
      />
    );
  }

  return <AuthForm locale={locale} mode="reset-password" />;
}
