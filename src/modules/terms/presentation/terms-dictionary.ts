import type { UniversityTermSlot } from "@/src/modules/universities/application/ports/university-term-repository";
import type { Locale } from "@/src/shared/localization/locales";

import type { TermActionCode } from "../transport/term-action-state";

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
  readonly publishedTermsLegend: string;
  readonly publishedTermManualOption: string;
  readonly publishedTermNotAnnouncedYet: string;
  readonly termSlotLabels: Readonly<Record<UniversityTermSlot, string>>;
  readonly submit: string;
  readonly submitting: string;
  readonly created: string;
  readonly activeBadge: string;
  readonly archivedBadge: string;
  readonly datesSeparator: string;
  readonly backToWorkspace: string;
  readonly editAction: string;
  readonly editHeading: string;
  readonly editSubmit: string;
  readonly editSubmitting: string;
  readonly editCancel: string;
  readonly edited: string;
  readonly archiveAction: string;
  readonly archiveConfirm: string;
  readonly archiveConfirmPrompt: string;
  readonly archiveCancel: string;
  readonly archiving: string;
  readonly activateAction: string;
  readonly activating: string;
  readonly coursesLink: string;
  readonly errors: {
    readonly nameRequired: string;
    readonly dateRequired: string;
    readonly dateOrder: string;
    readonly timeZoneRequired: string;
    readonly unavailable: string;
    readonly notFound: string;
    readonly conflict: string;
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
    publishedTermsLegend: "فصل جامعتك المعتمد",
    publishedTermManualOption: "إدخال التواريخ يدوياً",
    publishedTermNotAnnouncedYet: "لم يُعلن بعد",
    termSlotLabels: {
      first: "الفصل الأول",
      second: "الفصل الثاني",
      third: "الفصل الثالث",
      summer: "الفصل الصيفي",
    },
    submit: "حفظ الفصل",
    submitting: "جارٍ الحفظ…",
    created: "تم إنشاء الفصل بنجاح.",
    activeBadge: "نشط",
    archivedBadge: "مؤرشف",
    datesSeparator: "إلى",
    backToWorkspace: "العودة إلى مساحة العمل",
    editAction: "تعديل",
    editHeading: "تعديل الفصل",
    editSubmit: "حفظ التعديلات",
    editSubmitting: "جارٍ الحفظ…",
    editCancel: "إلغاء",
    edited: "تم تحديث الفصل بنجاح.",
    archiveAction: "أرشفة",
    archiveConfirm: "تأكيد الأرشفة",
    archiveConfirmPrompt: "لا يمكن التراجع عن أرشفة الفصل. هل تريد المتابعة؟",
    archiveCancel: "إلغاء",
    archiving: "جارٍ الأرشفة…",
    activateAction: "تنشيط",
    activating: "جارٍ التنشيط…",
    coursesLink: "المقررات",
    errors: {
      nameRequired: "أدخل اسماً للفصل.",
      dateRequired: "أدخل تاريخي البداية والنهاية.",
      dateOrder: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية أو مساوياً له.",
      timeZoneRequired: "أدخل منطقة زمنية صالحة.",
      unavailable: "الخدمة غير متاحة حالياً. حاول لاحقاً.",
      notFound: "تعذر العثور على هذا الفصل. ربما حُذف أو أُرشف.",
      conflict: "تغيّر هذا الفصل في مكان آخر. أعد تحميل الصفحة وحاول مرة أخرى.",
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
    publishedTermsLegend: "Your university's published term",
    publishedTermManualOption: "Enter dates manually",
    publishedTermNotAnnouncedYet: "not announced yet",
    termSlotLabels: {
      first: "First term",
      second: "Second term",
      third: "Third term",
      summer: "Summer term",
    },
    submit: "Save term",
    submitting: "Saving…",
    created: "The term was created successfully.",
    activeBadge: "Active",
    archivedBadge: "Archived",
    datesSeparator: "to",
    backToWorkspace: "Back to workspace",
    editAction: "Edit",
    editHeading: "Edit term",
    editSubmit: "Save changes",
    editSubmitting: "Saving…",
    editCancel: "Cancel",
    edited: "The term was updated successfully.",
    archiveAction: "Archive",
    archiveConfirm: "Confirm archive",
    archiveConfirmPrompt: "Archiving this term cannot be undone. Continue?",
    archiveCancel: "Cancel",
    archiving: "Archiving…",
    activateAction: "Activate",
    activating: "Activating…",
    coursesLink: "Courses",
    errors: {
      nameRequired: "Enter a term name.",
      dateRequired: "Enter both the start and end dates.",
      dateOrder: "The end date must be on or after the start date.",
      timeZoneRequired: "Enter a valid time zone.",
      unavailable: "The service is unavailable right now. Try again later.",
      notFound: "This term could not be found. It may have been deleted or archived.",
      conflict: "This term changed elsewhere. Reload the page and try again.",
      unexpected: "The term could not be saved safely.",
    },
  },
};

export function getTermsDictionary(locale: Locale): TermsDictionary {
  return dictionaries[locale];
}

function toDateLabel(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function publishedTermOptionLabel(
  dictionary: TermsDictionary,
  term: {
    readonly term: UniversityTermSlot;
    readonly academicYear: number;
    readonly startsOn: Date;
    readonly endsOn: Date | null;
  },
): string {
  const slot = dictionary.termSlotLabels[term.term];
  const endLabel = term.endsOn
    ? toDateLabel(term.endsOn)
    : dictionary.publishedTermNotAnnouncedYet;
  return `${slot} ${term.academicYear} (${toDateLabel(term.startsOn)} ${dictionary.datesSeparator} ${endLabel})`;
}

export function termActionMessage(
  dictionary: TermsDictionary,
  code: TermActionCode | undefined,
): string | null {
  switch (code) {
    case "UNAVAILABLE":
      return dictionary.errors.unavailable;
    case "NOT_FOUND":
      return dictionary.errors.notFound;
    case "CONFLICT":
      return dictionary.errors.conflict;
    case "UNEXPECTED":
      return dictionary.errors.unexpected;
    default:
      return null;
  }
}
