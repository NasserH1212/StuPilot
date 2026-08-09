import Link from "next/link";

import { publicBrand } from "@/src/shared/config/brand";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import { getFoundationStatus } from "../application/get-foundation-status";
import { BidiIsolate } from "./bidi-isolate";

interface LandingViewProps {
  readonly locale: Locale;
}

export function LandingView({ locale }: LandingViewProps) {
  const dictionary = getDictionary(locale);
  const status = getFoundationStatus("public");

  return (
    <section
      className="hero"
      aria-labelledby="landing-heading"
      data-phase={status.phase}
    >
      <p className="eyebrow">{dictionary.landing.eyebrow}</p>
      <h1 id="landing-heading">{dictionary.landing.heading}</h1>
      <p className="promise">{dictionary.landing.promise}</p>
      <p className="supportingCopy">{dictionary.landing.body}</p>
      <Link className="primaryAction" href={localizedPath(locale, "workspace")}>
        {dictionary.landing.openApplicationShell}
      </Link>
      <p className="mixedText">
        <BidiIsolate direction="ltr">{publicBrand.productName}</BidiIsolate>
        <span aria-hidden="true"> · </span>
        <BidiIsolate>العربية + English</BidiIsolate>
      </p>
    </section>
  );
}
