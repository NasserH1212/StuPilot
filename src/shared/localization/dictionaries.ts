import { publicBrand } from "../config/brand";
import type { Locale } from "./locales";

export interface Dictionary {
  readonly metadata: {
    readonly title: string;
    readonly description: string;
  };
  readonly navigation: {
    readonly publicHome: string;
    readonly applicationShell: string;
    readonly signIn: string;
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
  readonly auth: {
    readonly common: {
      readonly email: string;
      readonly password: string;
      readonly confirmPassword: string;
      readonly submitting: string;
      readonly configurationTitle: string;
      readonly configurationBody: string;
      readonly providerUnavailable: string;
      readonly rateLimited: string;
      readonly unexpected: string;
      readonly accountUnavailable: string;
      readonly passwordRequirements: string;
      readonly passwordsDoNotMatch: string;
      readonly invalidEmail: string;
    };
    readonly signIn: {
      readonly eyebrow: string;
      readonly title: string;
      readonly body: string;
      readonly submit: string;
      readonly invalidCredentials: string;
      readonly emailNotVerified: string;
      readonly forgotPassword: string;
      readonly createAccount: string;
    };
    readonly register: {
      readonly eyebrow: string;
      readonly title: string;
      readonly body: string;
      readonly submit: string;
      readonly haveAccount: string;
    };
    readonly verificationPending: {
      readonly eyebrow: string;
      readonly title: string;
      readonly body: string;
      readonly returnToSignIn: string;
    };
    readonly verified: {
      readonly eyebrow: string;
      readonly title: string;
      readonly body: string;
      readonly openWorkspace: string;
    };
    readonly forgotPassword: {
      readonly eyebrow: string;
      readonly title: string;
      readonly body: string;
      readonly submit: string;
      readonly sent: string;
      readonly returnToSignIn: string;
    };
    readonly resetPassword: {
      readonly eyebrow: string;
      readonly title: string;
      readonly body: string;
      readonly submit: string;
      readonly completedTitle: string;
      readonly completedBody: string;
    };
    readonly linkError: {
      readonly eyebrow: string;
      readonly title: string;
      readonly invalid: string;
      readonly expiredOrUsed: string;
      readonly requestNew: string;
    };
    readonly linkConfirmation: {
      readonly verificationEyebrow: string;
      readonly verificationTitle: string;
      readonly verificationBody: string;
      readonly verificationSubmit: string;
      readonly recoveryEyebrow: string;
      readonly recoveryTitle: string;
      readonly recoveryBody: string;
      readonly recoverySubmit: string;
    };
    readonly workspace: {
      readonly eyebrow: string;
      readonly title: string;
      readonly body: string;
      readonly signedInAs: string;
      readonly signOut: string;
    };
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
      title: `${publicBrand.productName} | الأساس الهندسي`,
      description: `واجهة ${publicBrand.productName} العربية التأسيسية — دون خصائص أكاديمية.`,
    },
    navigation: {
      publicHome: "الرئيسية",
      applicationShell: "هيكل التطبيق",
      signIn: "تسجيل الدخول",
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
    auth: {
      common: {
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        submitting: "جارٍ الإرسال…",
        configurationTitle: "المصادقة غير متاحة حالياً",
        configurationBody:
          "لم تكتمل تهيئة خدمة المصادقة الآمنة لهذه البيئة. لم يتم إنشاء جلسة أو حساب بديل.",
        providerUnavailable:
          "تعذر الوصول إلى خدمة المصادقة بأمان. حاول مرة أخرى لاحقاً.",
        rateLimited: "تم إرسال طلبات كثيرة. انتظر قليلاً ثم حاول مرة أخرى.",
        unexpected: "تعذر إكمال طلب المصادقة بأمان.",
        accountUnavailable: "هذا الحساب غير متاح. تواصل مع الدعم عند توفره.",
        passwordRequirements: "استخدم 12 حرفاً على الأقل، وبحد أقصى 128، مع حرف ورقم.",
        passwordsDoNotMatch: "كلمتا المرور غير متطابقتين.",
        invalidEmail: "أدخل عنوان بريد إلكتروني صالحاً.",
      },
      signIn: {
        eyebrow: "مصادقة آمنة",
        title: "تسجيل الدخول",
        body: `استخدم بريدك الإلكتروني وكلمة المرور للوصول إلى مساحة ${publicBrand.productName}.`,
        submit: "تسجيل الدخول",
        invalidCredentials: "تعذر تسجيل الدخول بهذه البيانات.",
        emailNotVerified: "تحقق من بريدك الإلكتروني قبل تسجيل الدخول.",
        forgotPassword: "نسيت كلمة المرور؟",
        createAccount: "إنشاء حساب جديد",
      },
      register: {
        eyebrow: "حساب جديد",
        title: "إنشاء حساب",
        body: "سنرسل رابط تحقق إلى بريدك الإلكتروني قبل السماح بتسجيل الدخول.",
        submit: "إنشاء الحساب",
        haveAccount: "لديك حساب؟ سجّل الدخول",
      },
      verificationPending: {
        eyebrow: "تحقق من بريدك",
        title: "تحقق من بريدك إذا طلبت إنشاء حساب للتو",
        body: "إذا كان العنوان مؤهلاً فستصله التعليمات. افتح أحدث رسالة ولا تشارك الرابط.",
        returnToSignIn: "العودة إلى تسجيل الدخول",
      },
      verified: {
        eyebrow: "تم التحقق",
        title: "تم التحقق من البريد الإلكتروني",
        body: `أصبحت الجلسة جاهزة، وتم ربط الهوية بمعرّف ${publicBrand.productName} الداخلي.`,
        openWorkspace: "فتح مساحة العمل",
      },
      forgotPassword: {
        eyebrow: "استعادة الحساب",
        title: "طلب إعادة تعيين كلمة المرور",
        body: "أدخل بريدك. سنعرض النتيجة نفسها سواء كان الحساب موجوداً أم لا.",
        submit: "إرسال التعليمات",
        sent: "إذا كان العنوان مؤهلاً، فستصله تعليمات إعادة التعيين.",
        returnToSignIn: "العودة إلى تسجيل الدخول",
      },
      resetPassword: {
        eyebrow: "جلسة استعادة آمنة",
        title: "تعيين كلمة مرور جديدة",
        body: "اختر كلمة مرور جديدة لهذا الحساب.",
        submit: "حفظ كلمة المرور الجديدة",
        completedTitle: "تم تحديث كلمة المرور",
        completedBody: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
      },
      linkError: {
        eyebrow: "تعذر قبول الرابط",
        title: "رابط المصادقة غير صالح",
        invalid: "الرابط غير مكتمل أو غير صحيح.",
        expiredOrUsed: "قد يكون الرابط منتهياً أو استُخدم من قبل.",
        requestNew: "طلب رابط جديد",
      },
      linkConfirmation: {
        verificationEyebrow: "تأكيد آمن",
        verificationTitle: "تأكيد البريد الإلكتروني",
        verificationBody:
          "اضغط الزر لإكمال التحقق. عرض هذه الصفحة وحده لا يستهلك الرابط.",
        verificationSubmit: "إكمال التحقق",
        recoveryEyebrow: "تأكيد الاستعادة",
        recoveryTitle: "متابعة إعادة تعيين كلمة المرور",
        recoveryBody:
          "اضغط الزر لبدء جلسة استعادة قصيرة وآمنة. عرض الصفحة وحده لا يستهلك الرابط.",
        recoverySubmit: "متابعة الاستعادة",
      },
      workspace: {
        eyebrow: "مساحة محمية",
        title: `مساحة عمل ${publicBrand.productName}`,
        body: "تم التحقق من الجلسة والحساب الداخلي على الخادم. لم تبدأ الخصائص الأكاديمية بعد.",
        signedInAs: "معرّف المستخدم الداخلي",
        signOut: "تسجيل الخروج",
      },
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
      phase: "أساس المصادقة الإنتاجية",
      footer: "لا توجد خصائص أكاديمية أو تطبيقات جوال في هذه المرحلة.",
    },
  },
  en: {
    metadata: {
      title: `${publicBrand.productName} | Engineering foundation`,
      description: `The foundational ${publicBrand.productName} English shell — no academic features.`,
    },
    navigation: {
      publicHome: "Home",
      applicationShell: "Application shell",
      signIn: "Sign in",
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
    auth: {
      common: {
        email: "Email address",
        password: "Password",
        confirmPassword: "Confirm password",
        submitting: "Submitting…",
        configurationTitle: "Authentication is currently unavailable",
        configurationBody:
          "Secure authentication is not fully configured for this environment. No substitute account or session was created.",
        providerUnavailable:
          "The authentication service could not be reached safely. Try again later.",
        rateLimited: "Too many requests were sent. Wait a moment and try again.",
        unexpected: "The authentication request could not be completed safely.",
        accountUnavailable:
          "This account is unavailable. Contact support when it is available.",
        passwordRequirements:
          "Use 12 to 128 characters with at least one letter and one number.",
        passwordsDoNotMatch: "The passwords do not match.",
        invalidEmail: "Enter a valid email address.",
      },
      signIn: {
        eyebrow: "Secure authentication",
        title: "Sign in",
        body: `Use your email and password to access your ${publicBrand.productName} workspace.`,
        submit: "Sign in",
        invalidCredentials: "We could not sign in with those details.",
        emailNotVerified: "Verify your email address before signing in.",
        forgotPassword: "Forgot your password?",
        createAccount: "Create a new account",
      },
      register: {
        eyebrow: "New account",
        title: "Create an account",
        body: "We will send an email verification link before sign-in is allowed.",
        submit: "Create account",
        haveAccount: "Already have an account? Sign in",
      },
      verificationPending: {
        eyebrow: "Check your email",
        title: "Check your email if you just requested an account",
        body: "If the address is eligible, instructions will arrive. Open the newest message and do not share its link.",
        returnToSignIn: "Return to sign in",
      },
      verified: {
        eyebrow: "Verified",
        title: "Your email address is verified",
        body: `The session is ready and the identity is linked to an internal ${publicBrand.productName} ID.`,
        openWorkspace: "Open workspace",
      },
      forgotPassword: {
        eyebrow: "Account recovery",
        title: "Request a password reset",
        body: "Enter your email. The response is the same whether or not an account exists.",
        submit: "Send instructions",
        sent: "If the address is eligible, password-reset instructions will arrive.",
        returnToSignIn: "Return to sign in",
      },
      resetPassword: {
        eyebrow: "Secure recovery session",
        title: "Set a new password",
        body: "Choose a new password for this account.",
        submit: "Save new password",
        completedTitle: "Password updated",
        completedBody: "You can now sign in with the new password.",
      },
      linkError: {
        eyebrow: "Link not accepted",
        title: "This authentication link is not valid",
        invalid: "The link is incomplete or malformed.",
        expiredOrUsed: "The link may have expired or already been used.",
        requestNew: "Request a new link",
      },
      linkConfirmation: {
        verificationEyebrow: "Secure confirmation",
        verificationTitle: "Confirm your email address",
        verificationBody:
          "Use the button to complete verification. Viewing this page alone does not consume the link.",
        verificationSubmit: "Complete verification",
        recoveryEyebrow: "Recovery confirmation",
        recoveryTitle: "Continue password reset",
        recoveryBody:
          "Use the button to begin a short, protected recovery session. Viewing this page alone does not consume the link.",
        recoverySubmit: "Continue recovery",
      },
      workspace: {
        eyebrow: "Protected workspace",
        title: `${publicBrand.productName} workspace`,
        body: "The provider session and internal account were validated on the server. Academic features have not started.",
        signedInAs: "Internal user ID",
        signOut: "Sign out",
      },
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
      phase: "Production authentication foundation",
      footer: "No academic features or mobile applications are included in this phase.",
    },
  },
} satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
