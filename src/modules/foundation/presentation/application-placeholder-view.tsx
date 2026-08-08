import { getDictionary } from "@/src/shared/localization/dictionaries";
import type { Locale } from "@/src/shared/localization/locales";

import { getFoundationStatus } from "../application/get-foundation-status";

interface ApplicationPlaceholderViewProps {
  readonly locale: Locale;
}

export function ApplicationPlaceholderView({
  locale,
}: ApplicationPlaceholderViewProps) {
  const dictionary = getDictionary(locale);
  const status = getFoundationStatus("application-placeholder");

  return (
    <section
      className="applicationPlaceholder"
      aria-labelledby="application-heading"
      data-authentication-enabled={String(status.authenticationEnabled)}
      data-academic-features-enabled={String(status.academicFeaturesEnabled)}
    >
      <div>
        <p className="eyebrow">{dictionary.application.eyebrow}</p>
        <h1 id="application-heading">{dictionary.application.heading}</h1>
        <p className="supportingCopy">{dictionary.application.body}</p>
      </div>
      <aside className="notice" aria-label={dictionary.application.eyebrow}>
        {dictionary.application.notice}
      </aside>
      <div className="placeholderGrid" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
