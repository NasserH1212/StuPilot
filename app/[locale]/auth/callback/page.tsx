import type { Route } from "next";
import { notFound, redirect } from "next/navigation";

import {
  createAuthenticationRuntime,
  recordRecoveryIntent,
} from "@/src/composition/authentication";
import { isAuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import type { AuthenticationLinkIntent } from "@/src/modules/authentication/application/ports/authentication-provider";
import { PendingSubmitButton } from "@/src/modules/authentication/presentation/pending-submit-button";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";
import { getAuthenticationConfiguration } from "@/src/shared/config/authentication";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import { isLocale, type Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export const dynamic = "force-dynamic";

function intentFrom(value: string | undefined): AuthenticationLinkIntent | null {
  if (value === "email") return "email_verification";
  if (value === "recovery") return "password_recovery";
  return null;
}

export default async function AuthenticationCallbackPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{
    token_hash?: string | string[];
    type?: string | string[];
  }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const tokenHash = Array.isArray(query.token_hash)
    ? query.token_hash[0]
    : query.token_hash;
  const type = Array.isArray(query.type) ? query.type[0] : query.type;
  const intent = intentFrom(type);

  if (!tokenHash || tokenHash.length > 4096 || !intent) {
    redirect(`${localizedPath(locale, "link-error")}?reason=invalid` as Route);
  }

  if (!getAuthenticationConfiguration().available) {
    return <AuthUnavailableView locale={locale} />;
  }

  const callbackLocale: Locale = locale;
  const callbackTokenHash: string = tokenHash;
  const callbackIntent: AuthenticationLinkIntent = intent;

  async function completeLink() {
    "use server";

    const runtime = await createAuthenticationRuntime();
    if (!runtime.available) {
      redirect(
        `${localizedPath(callbackLocale, "authentication-unavailable")}?reason=configuration` as Route,
      );
    }

    try {
      const completed = await runtime.service.completeLink(
        callbackTokenHash,
        callbackIntent,
      );
      if (callbackIntent === "password_recovery") {
        await recordRecoveryIntent(runtime, completed.principal);
      }
    } catch (error) {
      if (isAuthenticationError(error)) {
        if (error.code === "RATE_LIMITED") {
          redirect(
            `${localizedPath(callbackLocale, "authentication-unavailable")}?reason=rate_limited` as Route,
          );
        }
        if (error.code === "PROVIDER_UNAVAILABLE") {
          redirect(
            `${localizedPath(callbackLocale, "authentication-unavailable")}?reason=provider` as Route,
          );
        }
        if (error.code === "ACCOUNT_UNAVAILABLE") {
          redirect(
            `${localizedPath(callbackLocale, "authentication-unavailable")}?reason=account` as Route,
          );
        }
        if (error.code === "LINK_EXPIRED_OR_USED") {
          redirect(
            `${localizedPath(callbackLocale, "link-error")}?reason=expired_or_used` as Route,
          );
        }
      }
      redirect(
        `${localizedPath(callbackLocale, "link-error")}?reason=invalid` as Route,
      );
    }

    redirect(
      localizedPath(
        callbackLocale,
        callbackIntent === "password_recovery" ? "reset-password" : "verified",
      ),
    );
  }

  const dictionary = getDictionary(locale);
  const recovery = intent === "password_recovery";
  const content = dictionary.auth.linkConfirmation;

  return (
    <section className="authCard" aria-labelledby="callback-heading">
      <p className="eyebrow">
        {recovery ? content.recoveryEyebrow : content.verificationEyebrow}
      </p>
      <h1 id="callback-heading">
        {recovery ? content.recoveryTitle : content.verificationTitle}
      </h1>
      <p className="supportingCopy">
        {recovery ? content.recoveryBody : content.verificationBody}
      </p>
      <form action={completeLink}>
        <PendingSubmitButton
          pendingLabel={dictionary.auth.common.submitting}
          submitLabel={recovery ? content.recoverySubmit : content.verificationSubmit}
        />
      </form>
    </section>
  );
}
