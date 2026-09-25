import { BidiIsolate } from "@/src/modules/foundation/presentation/bidi-isolate";
import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import type { Locale } from "@/src/shared/localization/locales";

import { getTermsDictionary } from "./terms-dictionary";
import { TermCreateForm } from "./term-create-form";

function formatDate(locale: Locale, value: Date): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export function TermsView({
  locale,
  terms,
}: {
  readonly locale: Locale;
  readonly terms: readonly TermRecord[];
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
            <li key={term.id} className="termItem">
              <div className="termItemHeader">
                <span className="termName">
                  <BidiIsolate>{term.name}</BidiIsolate>
                </span>
                {term.archivedAt ? (
                  <span className="termBadge">{dictionary.archivedBadge}</span>
                ) : term.isActive ? (
                  <span className="termBadge termBadgeActive">
                    {dictionary.activeBadge}
                  </span>
                ) : null}
              </div>
              <p className="termDates">
                <BidiIsolate direction="ltr">
                  {formatDate(locale, term.startsOn)}
                </BidiIsolate>
                <span aria-hidden="true"> {dictionary.datesSeparator} </span>
                <BidiIsolate direction="ltr">
                  {formatDate(locale, term.endsOn)}
                </BidiIsolate>
              </p>
            </li>
          ))}
        </ul>
      )}

      <TermCreateForm locale={locale} />
    </section>
  );
}
