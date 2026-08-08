import { notFound } from "next/navigation";

import { ApplicationPlaceholderView } from "@/src/modules/foundation/presentation/application-placeholder-view";
import { isLocale } from "@/src/shared/localization/locales";

interface ApplicationShellPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function ApplicationShellPage({
  params,
}: ApplicationShellPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ApplicationPlaceholderView locale={locale} />;
}
