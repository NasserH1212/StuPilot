import type { Locale } from "@/src/shared/localization/locales";

export interface WeekDictionary {
  readonly weekOf: (index: number, total: number) => string;
  readonly today: string;
  readonly nextWeek: string;
  readonly previousWeek: string;
  readonly listView: string;
  readonly gridView: string;
  readonly weekViewToggleLabel: string;
  readonly weekSchedule: string;
  readonly weekScheduleHint: string;
  readonly noLecturesToday: string;
  readonly tasksAndExamsNotYetAvailable: string;
  readonly noActiveTerm: string;
  readonly noActiveTermBody: string;
  readonly goToTerms: string;
  readonly breakEmptyTitle: string;
  readonly breakEmptyBody: string;
  readonly returnToCurrentWeek: string;
  readonly addMeetingHeading: string;
  readonly weekdaysLabel: string;
  readonly startTimeLabel: string;
  readonly endTimeLabel: string;
  readonly roomLabel: string;
  readonly meetingTypeLabel: string;
  readonly meetingTypeLecture: string;
  readonly meetingTypeLab: string;
  readonly meetingTypeTutorial: string;
  readonly addMeetingSubmit: string;
  readonly addMeetingSubmitting: string;
  readonly addMeetingCreated: string;
  readonly errors: {
    readonly weekdaysRequired: string;
    readonly timeInvalid: string;
    readonly timeOrder: string;
    readonly unavailable: string;
    readonly unexpected: string;
  };
}

const dictionaries: Record<Locale, WeekDictionary> = {
  ar: {
    weekOf: (index, total) => `الأسبوع ${index} من ${total}`,
    today: "اليوم",
    nextWeek: "الأسبوع التالي",
    previousWeek: "الأسبوع السابق",
    listView: "قائمة",
    gridView: "شبكة",
    weekViewToggleLabel: "طريقة عرض الأسبوع",
    weekSchedule: "جدول الأسبوع",
    weekScheduleHint: "الأحد على اليمين · الألوان مع رموز المقررات",
    noLecturesToday: "لا محاضرات لهذا اليوم",
    tasksAndExamsNotYetAvailable: "المهام والاختبارات غير متاحة بعد في هذا الإصدار",
    noActiveTerm: "لا يوجد فصل دراسي نشط",
    noActiveTermBody: "فعّل فصلاً دراسياً من صفحة الفصول لعرض جدول الأسبوع.",
    goToTerms: "الفصول الدراسية",
    breakEmptyTitle: "لا محاضرات هذا الأسبوع",
    breakEmptyBody: "إجازة فرصة للراحة. تبقى مهامك المحفوظة متاحة.",
    returnToCurrentWeek: "العودة للأسبوع الحالي",
    addMeetingHeading: "إضافة محاضرة أسبوعية",
    weekdaysLabel: "أيام الأسبوع",
    startTimeLabel: "وقت البدء",
    endTimeLabel: "وقت الانتهاء",
    roomLabel: "القاعة (اختياري)",
    meetingTypeLabel: "نوع اللقاء",
    meetingTypeLecture: "محاضرة",
    meetingTypeLab: "معمل",
    meetingTypeTutorial: "تمرين",
    addMeetingSubmit: "حفظ الموعد",
    addMeetingSubmitting: "جارٍ الحفظ…",
    addMeetingCreated: "تمت إضافة الموعد الأسبوعي.",
    errors: {
      weekdaysRequired: "اختر يوماً واحداً على الأقل.",
      timeInvalid: "أدخل وقتاً صحيحاً.",
      timeOrder: "يجب أن يكون وقت الانتهاء بعد وقت البدء.",
      unavailable: "الخدمة غير متاحة حالياً. حاول لاحقاً.",
      unexpected: "تعذر حفظ الموعد بأمان.",
    },
  },
  en: {
    weekOf: (index, total) => `Week ${index} of ${total}`,
    today: "Today",
    nextWeek: "Next week",
    previousWeek: "Previous week",
    listView: "List",
    gridView: "Grid",
    weekViewToggleLabel: "Week view",
    weekSchedule: "Week schedule",
    weekScheduleHint: "Sunday on the right · colors match course tags",
    noLecturesToday: "No lectures for this day",
    tasksAndExamsNotYetAvailable:
      "Tasks and exams are not available in this release yet",
    noActiveTerm: "No active academic term",
    noActiveTermBody: "Activate a term from the Terms page to see the week schedule.",
    goToTerms: "Academic terms",
    breakEmptyTitle: "No lectures this week",
    breakEmptyBody: "A break is a chance to rest. Your saved tasks stay available.",
    returnToCurrentWeek: "Return to the current week",
    addMeetingHeading: "Add a weekly class meeting",
    weekdaysLabel: "Days of the week",
    startTimeLabel: "Start time",
    endTimeLabel: "End time",
    roomLabel: "Room (optional)",
    meetingTypeLabel: "Meeting type",
    meetingTypeLecture: "Lecture",
    meetingTypeLab: "Lab",
    meetingTypeTutorial: "Tutorial",
    addMeetingSubmit: "Save meeting",
    addMeetingSubmitting: "Saving…",
    addMeetingCreated: "The weekly meeting was added.",
    errors: {
      weekdaysRequired: "Choose at least one day.",
      timeInvalid: "Enter a valid time.",
      timeOrder: "End time must be after start time.",
      unavailable: "The service is unavailable right now. Try again later.",
      unexpected: "The meeting could not be saved safely.",
    },
  },
};

export function getWeekDictionary(locale: Locale): WeekDictionary {
  return dictionaries[locale];
}
