import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { SiteShell } from "@/src/modules/foundation/presentation/site-shell";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import { isLocale, locales } from "@/src/shared/localization/locales";
import { localizedDestinationFromPath } from "@/src/shared/localization/routing";

// Display-only: drives which header nav links render. Never used to gate
// access — every protected page performs its own authoritative check.
async function isSignedIn(): Promise<boolean> {
  try {
    const runtime = await createAuthenticationRuntime();
    if (!runtime.available) return false;
    return (await runtime.service.currentAccount()) !== null;
  } catch {
    return false;
  }
}

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const requestHeaders = await headers();
  const destination = localizedDestinationFromPath(
    requestHeaders.get("x-stupilot-pathname"),
  );
  const authenticated = await isSignedIn();

  return (
    <SiteShell locale={locale} destination={destination} authenticated={authenticated}>
      {children}
    </SiteShell>
  );
}
