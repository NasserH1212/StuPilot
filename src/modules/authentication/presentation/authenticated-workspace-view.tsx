import Link from "next/link";

import { getDictionary } from "@/src/shared/localization/dictionaries";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import type { UserAccount } from "../domain/user-account";
import { SignOutButton } from "./sign-out-button";

export function AuthenticatedWorkspaceView({
  account,
  locale,
}: {
  readonly account: UserAccount;
  readonly locale: Locale;
}) {
  const dictionary = getDictionary(locale);

  return (
    <section className="applicationPlaceholder" aria-labelledby="workspace-heading">
      <div>
        <p className="eyebrow">{dictionary.auth.workspace.eyebrow}</p>
        <h1 id="workspace-heading">{dictionary.auth.workspace.title}</h1>
        <p className="supportingCopy">{dictionary.auth.workspace.body}</p>
      </div>
      <dl className="identitySummary">
        <dt>{dictionary.auth.workspace.signedInAs}</dt>
        <dd>
          <bdi dir="ltr">{account.id}</bdi>
        </dd>
      </dl>
      <Link className="primaryAction" href={localizedPath(locale, "terms")}>
        {dictionary.auth.workspace.termsLink}
      </Link>
      <SignOutButton locale={locale} />
    </section>
  );
}
