import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { getTextDirection, resolveLocale } from "@/src/shared/localization/locales";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "StudentHub AI",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const requestHeaders = await headers();
  const locale = resolveLocale(requestHeaders.get("x-studenthub-locale"));

  return (
    <html lang={locale} dir={getTextDirection(locale)}>
      <body>{children}</body>
    </html>
  );
}
