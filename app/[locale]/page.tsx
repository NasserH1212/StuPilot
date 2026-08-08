import { notFound } from "next/navigation";

import { LandingView } from "@/src/modules/foundation/presentation/landing-view";
import { isLocale } from "@/src/shared/localization/locales";

interface LocalizedPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function LocalizedLandingPage({ params }: LocalizedPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LandingView locale={locale} />;
}
