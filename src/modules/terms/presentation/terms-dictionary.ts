import type { Locale } from "@/src/shared/localization/locales";

export interface TermsDictionary {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly emptyTitle: string;
  readonly emptyBody: string;
  readonly createHeading: string;
  readonly nameLabel: string;
  readonly startLabel: string;
  readonly endLabel: string;
  readonly timeZoneLabel: string;
  readonly activeLabel: string;
  readonly submit: string;
  readonly submitting: string;
  readonly created: string;
  readonly activeBadge: string;
  readonly archivedBadge: string;
  readonly datesSeparator: string;
  readonly backToWorkspace: string;
  readonly errors: {
    readonly nameRequired: string;
    readonly dateRequired: string;
    readonly dateOrder: string;
    readonly timeZoneRequired: string;
    readonly unavailable: string;
    readonly unexpected: string;
  };
}

const dictionaries: Record<Locale, TermsDictionary> = {
  ar: {
    eyebrow: "الفصول الأكاديمية",
    title: "فصولك الدراسية",
    body: "أنشئ فصلاً دراسياً وحدّد مدته، وستُبنى بقية خطتك الأكاديمية داخله.",
    emptyTitle: "لا توجد فصول بعد",
    emptyBody: "ابدأ بإنشاء أول فصل دراسي لك من النموذج بالأسفل.",
    createHeading: "إضافة فصل جديد",
    nameLabel: "اسم الفصل",
    startLabel: "تاريخ البداية",
    endLabel: "تاريخ النهاية",
    timeZoneLabel: "المنطقة الزمنية",
    activeLabel: "اجعله الفصل النشط",
    submit: "حفظ الفصل",
    submitting: "جارٍ الحفظ…",
    created: "تم إنشاء الفصل بنجاح.",
    activeBadge: "نشط",
    archivedBadge: "مؤرشف",
    datesSeparator: "إلى",
    backToWorkspace: "العودة إلى مساحة العمل",
    errors: {
      nameRequired: "أدخل اسماً للفصل.",
      dateRequired: "أدخل تاريخي البداية والنهاية.",
      dateOrder: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية أو مساوياً له.",
      timeZoneRequired: "أدخل منطقة زمنية صالحة.",
      unavailable: "الخدمة غير متاحة حالياً. حاول لاحقاً.",
      unexpected: "تعذر حفظ الفصل بأمان.",
    },
  },
  en: {
    eyebrow: "Academic terms",
    title: "Your academic terms",
    body: "Create an academic term and set its dates; the rest of your academic plan is built inside it.",
    emptyTitle: "No terms yet",
    emptyBody: "Start by creating your first academic term using the form below.",
    createHeading: "Add a new term",
    nameLabel: "Term name",
    startLabel: "Start date",
    endLabel: "End date",
    timeZoneLabel: "Time zone",
    activeLabel: "Make this the active term",
    submit: "Save term",
    submitting: "Saving…",
    created: "The term was created successfully.",
    activeBadge: "Active",
    archivedBadge: "Archived",
    datesSeparator: "to",
    backToWorkspace: "Back to workspace",
    errors: {
      nameRequired: "Enter a term name.",
      dateRequired: "Enter both the start and end dates.",
      dateOrder: "The end date must be on or after the start date.",
      timeZoneRequired: "Enter a valid time zone.",
      unavailable: "The service is unavailable right now. Try again later.",
      unexpected: "The term could not be saved safely.",
    },
  },
};

export function getTermsDictionary(locale: Locale): TermsDictionary {
  return dictionaries[locale];
}
