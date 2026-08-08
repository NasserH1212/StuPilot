import type { Locale } from "./locales";

export interface Dictionary {
  readonly metadata: {
    readonly title: string;
    readonly description: string;
  };
  readonly navigation: {
    readonly publicHome: string;
    readonly applicationShell: string;
    readonly switchLanguage: string;
  };
  readonly landing: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly promise: string;
    readonly body: string;
    readonly openApplicationShell: string;
  };
  readonly application: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly body: string;
    readonly notice: string;
  };
  readonly state: {
    readonly loading: string;
    readonly errorTitle: string;
    readonly errorBody: string;
    readonly retry: string;
    readonly notFoundTitle: string;
    readonly notFoundBody: string;
    readonly returnHome: string;
  };
  readonly chrome: {
    readonly skipToContent: string;
    readonly phase: string;
    readonly footer: string;
  };
}

const dictionaries = {
  ar: {
    metadata: {
      title: "StudentHub AI | الأساس الهندسي",
      description: "واجهة StudentHub AI العربية التأسيسية — دون خصائص أكاديمية.",
    },
    navigation: {
      publicHome: "الرئيسية",
      applicationShell: "هيكل التطبيق",
      switchLanguage: "English",
    },
    landing: {
      eyebrow: "واجهة تأسيسية فقط",
      heading: "مساحة أكاديمية واضحة تبدأ بلغتك.",
      promise: "اعرف ما تحتاج إلى فعله اليوم وهذا الأسبوع.",
      body: "هذه الواجهة تثبت اتجاه النص، والاستجابة، وإمكانية الوصول فقط. لم تبدأ خصائص المنتج بعد.",
      openApplicationShell: "عرض هيكل التطبيق",
    },
    application: {
      eyebrow: "عنصر تأسيسي فقط",
      heading: "هيكل التطبيق المحمي",
      body: "هذه مساحة محايدة لاختبار بنية الواجهة قبل بناء المنتج.",
      notice: "المصادقة غير مفعلة في Sprint 0، ولا توجد هنا بيانات أو خصائص أكاديمية.",
    },
    state: {
      loading: "جارٍ تحميل الهيكل…",
      errorTitle: "تعذر عرض هذه الواجهة",
      errorBody: "حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى بأمان.",
      retry: "المحاولة مرة أخرى",
      notFoundTitle: "الصفحة غير موجودة",
      notFoundBody: "الرابط المطلوب غير متاح ضمن الهيكل الحالي.",
      returnHome: "العودة إلى الرئيسية",
    },
    chrome: {
      skipToContent: "انتقل إلى المحتوى الرئيسي",
      phase: "Sprint 0 — الأساس الهندسي",
      footer: "لم يبدأ Sprint 1، ولم تُبنَ أي خصائص أكاديمية.",
    },
  },
  en: {
    metadata: {
      title: "StudentHub AI | Engineering foundation",
      description:
        "The foundational StudentHub AI English shell — no academic features.",
    },
    navigation: {
      publicHome: "Home",
      applicationShell: "Application shell",
      switchLanguage: "العربية",
    },
    landing: {
      eyebrow: "Foundation shell only",
      heading: "A clear academic space that starts in your language.",
      promise: "Know what you need to do today and this week.",
      body: "This shell validates direction, responsiveness, and accessibility only. Product features have not started.",
      openApplicationShell: "View the application shell",
    },
    application: {
      eyebrow: "Foundation element only",
      heading: "Protected application shell",
      body: "This is a neutral space for validating the interface structure before product work begins.",
      notice:
        "Authentication is not active in Sprint 0, and no data or academic features exist here.",
    },
    state: {
      loading: "Loading the shell…",
      errorTitle: "This view could not be shown",
      errorBody: "An unexpected error occurred. It is safe to try again.",
      retry: "Try again",
      notFoundTitle: "Page not found",
      notFoundBody: "The requested address is not available in the current foundation.",
      returnHome: "Return home",
    },
    chrome: {
      skipToContent: "Skip to main content",
      phase: "Sprint 0 — engineering foundation",
      footer: "Sprint 1 has not started, and no academic features are implemented.",
    },
  },
} satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
