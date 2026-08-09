import Link from "next/link";

import { publicBrand } from "@/src/shared/config/brand";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

export function AuthUnavailableView({
  locale,
  reason = "configuration",
}: {
  readonly locale: Locale;
  readonly reason?: "configuration" | "provider" | "rate_limited" | "account";
}) {
  const dictionary = getDictionary(locale);
  const body =
    reason === "rate_limited"
      ? dictionary.auth.common.rateLimited
      : reason === "provider"
        ? dictionary.auth.common.providerUnavailable
        : reason === "account"
          ? dictionary.auth.common.accountUnavailable
          : dictionary.auth.common.configurationBody;

  return (
    <section className="authCard" aria-labelledby="auth-unavailable-heading">
      <p className="eyebrow">{publicBrand.productName}</p>
      <h1 id="auth-unavailable-heading">{dictionary.auth.common.configurationTitle}</h1>
      <p className="supportingCopy">{body}</p>
      <Link className="secondaryAction" href={localizedPath(locale)}>
        {dictionary.navigation.publicHome}
      </Link>
    </section>
  );
}
