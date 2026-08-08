export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];
export type TextDirection = "rtl" | "ltr";

export const defaultLocale: Locale = "ar";

const directions: Record<Locale, TextDirection> = {
  ar: "rtl",
  en: "ltr",
};

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getTextDirection(locale: Locale): TextDirection {
  return directions[locale];
}

export function resolveLocale(value: string | null | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
