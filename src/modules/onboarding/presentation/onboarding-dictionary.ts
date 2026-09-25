import type { Locale } from "@/src/shared/localization/locales";

export interface OnboardingDictionary {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly localeLabel: string;
  readonly localeOptions: Readonly<Record<Locale, string>>;
  readonly timeZoneLabel: string;
  readonly submit: string;
  readonly submitting: string;
  readonly errors: {
    readonly timeZoneRequired: string;
    readonly unavailable: string;
    readonly unexpected: string;
  };
}

const dictionaries: Record<Locale, OnboardingDictionary> = {
  ar: {
    eyebrow: "إعداد الحساب",
    title: "لنجهّز مساحتك",
    body: "اختر لغتك ومنطقتك الزمنية، ثم انتقل مباشرة لإنشاء فصلك الدراسي الأول.",
    localeLabel: "اللغة",
    localeOptions: { ar: "العربية", en: "English" },
    timeZoneLabel: "المنطقة الزمنية",
    submit: "متابعة إلى الفصل الأول",
    submitting: "جارٍ الحفظ…",
    errors: {
      timeZoneRequired: "أدخل منطقة زمنية صالحة.",
      unavailable: "الخدمة غير متاحة حالياً. حاول لاحقاً.",
      unexpected: "تعذر حفظ إعداداتك بأمان.",
    },
  },
  en: {
    eyebrow: "Account setup",
    title: "Let's set up your workspace",
    body: "Choose your language and time zone, then continue straight into creating your first academic term.",
    localeLabel: "Language",
    localeOptions: { ar: "العربية", en: "English" },
    timeZoneLabel: "Time zone",
    submit: "Continue to your first term",
    submitting: "Saving…",
    errors: {
      timeZoneRequired: "Enter a valid time zone.",
      unavailable: "The service is unavailable right now. Try again later.",
      unexpected: "Your settings could not be saved safely.",
    },
  },
};

export function getOnboardingDictionary(locale: Locale): OnboardingDictionary {
  return dictionaries[locale];
}
