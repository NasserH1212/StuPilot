import { notFound } from "next/navigation";

import { AuthStateView } from "@/src/modules/authentication/presentation/auth-state-view";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import { isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export default async function VerificationPendingPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  return (
    <AuthStateView
      eyebrow={dictionary.auth.verificationPending.eyebrow}
      title={dictionary.auth.verificationPending.title}
      body={dictionary.auth.verificationPending.body}
      actionHref={localizedPath(locale, "sign-in")}
      actionLabel={dictionary.auth.verificationPending.returnToSignIn}
    />
  );
}
