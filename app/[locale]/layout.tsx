import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { SiteShell } from "@/src/modules/foundation/presentation/site-shell";
import { getDictionary } from "@/src/shared/localization/dictionaries";
import { isLocale, locales } from "@/src/shared/localization/locales";

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
  const destination = requestHeaders
    .get("x-studenthub-pathname")
    ?.endsWith("/workspace")
    ? "workspace"
    : "home";

  return (
    <SiteShell locale={locale} destination={destination}>
      {children}
    </SiteShell>
  );
}
