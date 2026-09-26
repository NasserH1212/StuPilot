import type { Locale } from "@/src/shared/localization/locales";

import type { Weekday } from "../domain/class-meeting";

/** 0=Sunday..6=Saturday, matching the domain's Weekday numbering. */
const labels: Record<Locale, readonly string[]> = {
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export function weekdayLabel(locale: Locale, weekday: Weekday): string {
  return labels[locale][weekday] as string;
}
