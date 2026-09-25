import Link from "next/link";

import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import type { UniversityTermRecord } from "@/src/modules/universities/application/ports/university-term-repository";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import { getTermsDictionary } from "./terms-dictionary";
import { TermCreateForm } from "./term-create-form";
import { TermItem } from "./term-item";

export function TermsView({
  locale,
  terms,
  publishedTerms = [],
}: {
  readonly locale: Locale;
  readonly terms: readonly TermRecord[];
  readonly publishedTerms?: readonly UniversityTermRecord[];
}) {
  const dictionary = getTermsDictionary(locale);

  return (
    <section className="applicationPlaceholder" aria-labelledby="terms-heading">
      <div>
        <p className="eyebrow">{dictionary.eyebrow}</p>
        <h1 id="terms-heading">{dictionary.title}</h1>
        <p className="supportingCopy">{dictionary.body}</p>
      </div>

      {terms.length === 0 ? (
        <div className="notice">
          <p>
            <strong>{dictionary.emptyTitle}</strong>
          </p>
          <p>{dictionary.emptyBody}</p>
        </div>
      ) : (
        <ul className="termList">
          {terms.map((term) => (
            <TermItem key={term.id} locale={locale} term={term} />
          ))}
        </ul>
      )}

      <TermCreateForm locale={locale} publishedTerms={publishedTerms} />

      <Link className="secondaryAction" href={localizedPath(locale, "workspace")}>
        {dictionary.backToWorkspace}
      </Link>
    </section>
  );
}
