import type { Locale } from "@/src/shared/localization/locales";

import type { CourseActionCode } from "../transport/course-action-state";

export interface CoursesDictionary {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly emptyTitle: string;
  readonly emptyBody: string;
  readonly createHeading: string;
  readonly nameLabel: string;
  readonly codeLabel: string;
  readonly locationLabel: string;
  readonly submit: string;
  readonly submitting: string;
  readonly created: string;
  readonly archivedBadge: string;
  readonly backToTerms: string;
  readonly editAction: string;
  readonly editHeading: string;
  readonly editSubmit: string;
  readonly editSubmitting: string;
  readonly editCancel: string;
  readonly archiveAction: string;
  readonly archiveConfirm: string;
  readonly archiveConfirmPrompt: string;
  readonly archiveCancel: string;
  readonly archiving: string;
  readonly detailHeading: string;
  readonly backToCourses: string;
  readonly scheduleHeading: string;
  readonly noScheduleYet: string;
  readonly upcomingTasksHeading: string;
  readonly upcomingExamsHeading: string;
  readonly tasksNotYetAvailable: string;
  readonly examsNotYetAvailable: string;
  readonly courseNotFound: string;
  readonly errors: {
    readonly nameRequired: string;
    readonly codeTooLong: string;
    readonly locationTooLong: string;
    readonly unavailable: string;
    readonly termNotFound: string;
    readonly notFound: string;
    readonly conflict: string;
    readonly unexpected: string;
  };
}

const dictionaries: Record<Locale, CoursesDictionary> = {
  ar: {
    eyebrow: "المقررات الدراسية",
    title: "مقررات هذا الفصل",
    body: "أضف مقرراتك لهذا الفصل الدراسي لتبني عليها الجدول والمهام لاحقاً.",
    emptyTitle: "لا توجد مقررات بعد",
    emptyBody: "أضف أول مقرر لهذا الفصل من النموذج بالأسفل.",
    createHeading: "إضافة مقرر",
    nameLabel: "اسم المقرر",
    codeLabel: "رمز المقرر (اختياري)",
    locationLabel: "الموقع الافتراضي (اختياري)",
    submit: "حفظ المقرر",
    submitting: "جارٍ الحفظ…",
    created: "تم إضافة المقرر بنجاح.",
    archivedBadge: "مؤرشف",
    backToTerms: "العودة إلى الفصول الدراسية",
    editAction: "تعديل",
    editHeading: "تعديل المقرر",
    editSubmit: "حفظ التعديلات",
    editSubmitting: "جارٍ الحفظ…",
    editCancel: "إلغاء",
    archiveAction: "أرشفة",
    archiveConfirm: "تأكيد الأرشفة",
    archiveConfirmPrompt: "ستُخفى هذه المقرر من قوائم هذا الفصل. هل تريد المتابعة؟",
    archiveCancel: "إلغاء",
    archiving: "جارٍ الأرشفة…",
    detailHeading: "تفاصيل المقرر",
    backToCourses: "رجوع إلى المقررات",
    scheduleHeading: "الجدول الأسبوعي",
    noScheduleYet: "لا توجد محاضرات مضافة لهذا المقرر بعد.",
    upcomingTasksHeading: "المهام القادمة",
    upcomingExamsHeading: "الاختبارات القادمة",
    tasksNotYetAvailable: "المهام غير متاحة بعد في هذا الإصدار.",
    examsNotYetAvailable: "الاختبارات غير متاحة بعد في هذا الإصدار.",
    courseNotFound: "تعذر العثور على هذا المقرر.",
    errors: {
      nameRequired: "أدخل اسماً للمقرر.",
      codeTooLong: "رمز المقرر طويل جداً.",
      locationTooLong: "الموقع طويل جداً.",
      unavailable: "الخدمة غير متاحة حالياً. حاول لاحقاً.",
      termNotFound: "تعذر العثور على هذا الفصل الدراسي.",
      notFound: "تعذر العثور على هذا المقرر. ربما حُذف أو أُرشف.",
      conflict: "تغيّر هذا المقرر في مكان آخر. أعد تحميل الصفحة وحاول مرة أخرى.",
      unexpected: "تعذر حفظ المقرر بأمان.",
    },
  },
  en: {
    eyebrow: "Courses",
    title: "This term's courses",
    body: "Add your courses for this term to build the schedule and academic items on top of them later.",
    emptyTitle: "No courses yet",
    emptyBody: "Add your first course for this term using the form below.",
    createHeading: "Add a course",
    nameLabel: "Course name",
    codeLabel: "Course code (optional)",
    locationLabel: "Default location (optional)",
    submit: "Save course",
    submitting: "Saving…",
    created: "The course was added successfully.",
    archivedBadge: "Archived",
    backToTerms: "Back to academic terms",
    editAction: "Edit",
    editHeading: "Edit course",
    editSubmit: "Save changes",
    editSubmitting: "Saving…",
    editCancel: "Cancel",
    archiveAction: "Archive",
    archiveConfirm: "Confirm archive",
    archiveConfirmPrompt: "This hides the course from this term's lists. Continue?",
    archiveCancel: "Cancel",
    archiving: "Archiving…",
    detailHeading: "Course details",
    backToCourses: "Back to courses",
    scheduleHeading: "Weekly schedule",
    noScheduleYet: "No class meetings have been added for this course yet.",
    upcomingTasksHeading: "Upcoming tasks",
    upcomingExamsHeading: "Upcoming exams",
    tasksNotYetAvailable: "Tasks are not available in this release yet.",
    examsNotYetAvailable: "Exams are not available in this release yet.",
    courseNotFound: "This course could not be found.",
    errors: {
      nameRequired: "Enter a course name.",
      codeTooLong: "The course code is too long.",
      locationTooLong: "The location is too long.",
      unavailable: "The service is unavailable right now. Try again later.",
      termNotFound: "This academic term could not be found.",
      notFound: "This course could not be found. It may have been deleted or archived.",
      conflict: "This course changed elsewhere. Reload the page and try again.",
      unexpected: "The course could not be saved safely.",
    },
  },
};

export function getCoursesDictionary(locale: Locale): CoursesDictionary {
  return dictionaries[locale];
}

export function courseActionMessage(
  dictionary: CoursesDictionary,
  code: CourseActionCode | undefined,
): string | null {
  switch (code) {
    case "UNAVAILABLE":
      return dictionary.errors.unavailable;
    case "TERM_NOT_FOUND":
      return dictionary.errors.termNotFound;
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
