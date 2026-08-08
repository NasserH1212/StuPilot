import type { Locale } from "./locales";

export type LocalizedPath = `/${Locale}` | `/${Locale}/workspace`;

export function localizedPath(
  locale: Locale,
  destination: "home" | "workspace" = "home",
): LocalizedPath {
  return destination === "workspace" ? `/${locale}/workspace` : `/${locale}`;
}
