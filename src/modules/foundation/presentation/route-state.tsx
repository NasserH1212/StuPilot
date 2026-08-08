"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { getDictionary } from "@/src/shared/localization/dictionaries";
import { resolveLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

function useBoundaryLocale() {
  const params = useParams<{ locale?: string | string[] }>();
  const candidate = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  return resolveLocale(candidate);
}

export function RouteLoading() {
  const dictionary = getDictionary(useBoundaryLocale());

  return (
    <div className="stateCard" role="status" aria-live="polite">
      <span className="loadingMark" aria-hidden="true" />
      <p>{dictionary.state.loading}</p>
    </div>
  );
}

interface RouteErrorProps {
  readonly retry: () => void;
}

export function RouteError({ retry }: RouteErrorProps) {
  const dictionary = getDictionary(useBoundaryLocale());

  return (
    <section className="stateCard" aria-labelledby="error-heading">
      <p className="eyebrow">{dictionary.chrome.phase}</p>
      <h1 id="error-heading">{dictionary.state.errorTitle}</h1>
      <p>{dictionary.state.errorBody}</p>
      <button className="primaryAction" type="button" onClick={retry}>
        {dictionary.state.retry}
      </button>
    </section>
  );
}

export function RouteNotFound() {
  const locale = useBoundaryLocale();
  const dictionary = getDictionary(locale);

  return (
    <section className="stateCard" aria-labelledby="not-found-heading">
      <p className="errorCode" aria-hidden="true">
        404
      </p>
      <h1 id="not-found-heading">{dictionary.state.notFoundTitle}</h1>
      <p>{dictionary.state.notFoundBody}</p>
      <Link className="primaryAction" href={localizedPath(locale)}>
        {dictionary.state.returnHome}
      </Link>
    </section>
  );
}
