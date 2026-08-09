import Link from "next/link";
import type { ReactNode } from "react";

import { getDictionary } from "@/src/shared/localization/dictionaries";
import { getAlternateLocale, type Locale } from "@/src/shared/localization/locales";
import {
  localizedPath,
  type LocalizedDestination,
} from "@/src/shared/localization/routing";

import { BidiIsolate } from "./bidi-isolate";

interface SiteShellProps {
  readonly children: ReactNode;
  readonly locale: Locale;
  readonly destination: LocalizedDestination;
}

export function SiteShell({ children, locale, destination }: SiteShellProps) {
  const dictionary = getDictionary(locale);
  const alternateLocale = getAlternateLocale(locale);

  return (
    <>
      <a className="skipLink" href="#main-content">
        {dictionary.chrome.skipToContent}
      </a>
      <header className="siteHeader">
        <div className="headerInner">
          <Link className="brand" href={localizedPath(locale)}>
            <BidiIsolate direction="ltr">StudentHub AI</BidiIsolate>
          </Link>
          <nav className="primaryNav" aria-label={dictionary.navigation.publicHome}>
            <Link href={localizedPath(locale)}>{dictionary.navigation.publicHome}</Link>
            <Link href={localizedPath(locale, "workspace")}>
              {dictionary.navigation.applicationShell}
            </Link>
            <Link href={localizedPath(locale, "sign-in")}>
              {dictionary.navigation.signIn}
            </Link>
            <Link
              className="languageLink"
              href={localizedPath(alternateLocale, destination)}
              hrefLang={alternateLocale}
              lang={alternateLocale}
            >
              {dictionary.navigation.switchLanguage}
            </Link>
          </nav>
        </div>
      </header>
      <main className="shellMain" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="siteFooter">
        <div className="footerInner">
          <span>{dictionary.chrome.phase}</span>
          <span>{dictionary.chrome.footer}</span>
        </div>
      </footer>
    </>
  );
}
