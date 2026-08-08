(() => {
  "use strict";

  const COURSE_CATALOG = {
    CS214: { id: "CS214", code: "CS 214", name: "هياكل البيانات", color: "blue" },
    MATH203: { id: "MATH203", code: "MATH 203", name: "Calculus III", color: "purple" },
    ARAB110: { id: "ARAB110", code: "ARAB 110", name: "مهارات الكتابة", color: "green" }
  };

  const initialState = () => ({
    language: "ar",
    profileSkipped: false,
    term: null,
    courses: [],
    schedules: [],
    occurrenceOverrides: {},
    items: [
      {
        id: "overdue-review",
        kind: "مهمة",
        title: "مراجعة محاضرة 5",
        courseId: "CS214",
        due: "2026-10-11T20:00",
        completed: false,
        overdue: true,
        planned: null,
        reminder: null
      },
      {
        id: "arab-project",
        kind: "مشروع",
        title: "المسودة الأولى",
        courseId: "ARAB110",
        due: "2026-10-22T18:00",
        completed: false,
        overdue: false,
        planned: null,
        reminder: null
      }
    ],
    conceptStatus: {}
  });

  const concepts = [
    {
      id: "study-plan",
      type: "AI candidate — static",
      title: "خطة مذاكرة من اختبار وموضوعات",
      input: [
        "اختبار MATH 203 — اختبار قصير 2 بعد 6 أيام",
        "الموضوعات: التكامل بالتجزئة، المتتاليات، تطبيقات عامة",
        "الوقت الخيالي: 45 دقيقة في ثلاثة أيام + 90 دقيقة في يوم"
      ],
      output: [
        "اليوم 1 · 45 دقيقة: مراجعة مفهوم التكامل بالتجزئة + مثالين.",
        "اليوم 2 · 45 دقيقة: المتتاليات + تحديد نقطتي ضعف.",
        "اليوم 3 · 90 دقيقة: مسائل تطبيقية مختلطة مع استراحة قصيرة.",
        "اليوم 4 · 45 دقيقة: اختبار ذاتي ومراجعة الأخطاء."
      ],
      limitations: [
        "لا يعرف سرعتك أو طاقتك أو التزاماتك غير المدخلة.",
        "قد تكون المدد أو الأولويات غير واقعية.",
        "يجب تعديل الخطة والتحقق منها قبل الاعتماد."
      ]
    },
    {
      id: "revision-questions",
      type: "AI candidate — static",
      title: "أسئلة مراجعة من نص قصير",
      input: [
        "فقرة خيالية قصيرة عن الأشجار الثنائية.",
        "المطلوب: خمسة أسئلة مراجعة مع إجابات مخفية.",
        "لا يوجد ملف مرفوع أو محتوى مشارك."
      ],
      output: [
        "1. ما الخاصية التي تميز الشجرة الثنائية؟",
        "2. متى تكون الشجرة متوازنة؟",
        "3. قارن بين traversal السابق واللاحق.",
        "4. حدّد خطأً في مثال خيالي لمسار عقد.",
        "5. أنشئ مثالًا صغيرًا يحقق الشرط المذكور."
      ],
      limitations: [
        "قد يصوغ سؤالًا غامضًا أو خارج مستوى المقرر.",
        "الإجابات تحتاج تحققًا من المصدر الأصلي.",
        "هذا التصور لا يرفع ملفات ولا يستخدم RAG."
      ]
    },
    {
      id: "weekly-priority",
      type: "AI candidate — static",
      title: "ترتيب التزامات أسبوعية",
      input: [
        "واجب الأربعاء، اختبار الاثنين، مشروع الخميس القادم.",
        "أربع فترات عمل خيالية متاحة.",
        "مهمة متأخرة تحتاج قرارًا."
      ],
      output: [
        "1. حدد 30 دقيقة للمهمة المتأخرة اليوم: أكملها أو أعد جدولتها.",
        "2. ابدأ واجب الأربعاء في أول فترة 45 دقيقة.",
        "3. احجز فترتين للاختبار قبل نهاية الأسبوع.",
        "4. ضع مسودة المشروع بعد تسليم الواجب."
      ],
      limitations: [
        "الترتيب يفترض أن المواعيد والجهد المدخلين صحيحان.",
        "لا يعرف التزامات العمل أو الصحة أو التنقل.",
        "الاقتراح ليس أمرًا ويجب رفضه إن لم يكن واقعيًا."
      ]
    },
    {
      id: "non-ai-template",
      type: "Non-AI alternative — static",
      title: "قالب تخطيط يدوي ثابت",
      input: [
        "المواعيد والوقت المتاح نفسيهما.",
        "لا توليد أو ترتيب تلقائي.",
        "المستخدم يتخذ كل قرار."
      ],
      output: [
        "□ اكتب الموعد النهائي لكل التزام.",
        "□ قدّر الجهد بنطاق، لا برقم دقيق.",
        "□ اختر أول جلسة عمل لكل التزام.",
        "□ أضف هامشًا قبل الموعد.",
        "□ راجع التعارضات وعدّل يدويًا."
      ],
      limitations: [
        "لا يوفر اقتراحًا مخصصًا أو محتوى جاهزًا.",
        "يتطلب جهدًا وقرارًا يدويين.",
        "قد يكون التحكم والوضوح أهم من السرعة لبعض المستخدمين."
      ]
    }
  ];

  let state = initialState();
  let activeScreen = "welcome";
  let activeSetupStep = "profile";
  let toastTimer = null;
  let lastFocusedElement = null;

  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function courseFor(id) {
    return COURSE_CATALOG[id] || { code: "—", name: "من دون مقرر", color: "green" };
  }

  function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function timeFromDateTime(value) {
    return value ? value.slice(11, 16) : "—";
  }

  function localDate(value) {
    return value ? value.slice(0, 10) : "";
  }

  function navigate(screen) {
    if (!qs(`[data-screen="${screen}"]`)) return;
    activeScreen = screen;
    qsa("[data-screen]").forEach((section) => section.classList.toggle("active", section.dataset.screen === screen));
    qsa("[data-nav]").forEach((button) => {
      if (button.classList.contains("nav-item")) {
        button.classList.toggle("active", button.dataset.nav === screen);
      }
    });

    if (screen === "today") renderToday();
    if (screen === "week") renderWeek();
    if (screen === "concepts") renderConcepts();

    window.scrollTo({ top: 0, behavior: "smooth" });
    qs("#mainContent").focus({ preventScroll: true });
    history.replaceState(null, "", `#${screen}`);
  }

  function showSetupStep(step) {
    const steps = ["profile", "term", "courses", "schedule"];
    if (!steps.includes(step)) return;
    activeSetupStep = step;
    qsa("[data-setup-step]").forEach((panel) => panel.classList.toggle("active", panel.dataset.setupStep === step));
    const index = steps.indexOf(step) + 1;
    qs("#setupProgressLabel").textContent = `الخطوة ${index} من 4`;
    qs("#setupProgressBar").style.width = `${index * 25}%`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(title, message) {
    const toast = qs("#toast");
    qs("#toastTitle").textContent = title;
    qs("#toastMessage").textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function closeToast() {
    qs("#toast").hidden = true;
    clearTimeout(toastTimer);
  }

  function openModal(id, opener = document.activeElement) {
    const modal = qs(`#${id}`);
    if (!modal) return;
    lastFocusedElement = opener;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const firstInput = qs("input:not([type=hidden]), select, textarea, button", modal);
    if (firstInput) setTimeout(() => firstInput.focus(), 0);
  }

  function closeModal(modal) {
    const target = typeof modal === "string" ? qs(`#${modal}`) : modal;
    if (!target) return;
    target.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }

  function closeAllModals() {
    qsa(".modal").forEach((modal) => { modal.hidden = true; });
    document.body.style.overflow = "";
  }

  function seedSchedules(primary) {
    state.schedules = [
      {
        id: "schedule-cs214",
        courseId: primary.courseId,
        days: primary.days,
        start: primary.start,
        end: primary.end,
        room: primary.room
      },
      { id: "schedule-math203", courseId: "MATH203", days: [1, 3], start: "13:00", end: "14:15", room: "قاعة B-04 الخيالية" },
      { id: "schedule-arab110", courseId: "ARAB110", days: [4], start: "09:00", end: "10:30", room: "عن بعد — خيالي" }
    ];
  }

  function renderToday() {
    const timeline = qs("#todayTimeline");
    const csSchedule = state.schedules.find((entry) => entry.courseId === "CS214") || {
      start: "10:00",
      end: "11:15",
      room: "قاعة T-12 الخيالية"
    };
    const override = state.occurrenceOverrides["2026-10-13"];
    const occurrenceStart = override?.start || csSchedule.start;
    const occurrenceEnd = override?.end || csSchedule.end;
    const changed = Boolean(override);

    timeline.innerHTML = `
      <article class="timeline-item">
        <time class="timeline-time" datetime="2026-10-13T${escapeHtml(occurrenceStart)}">${escapeHtml(occurrenceStart)}</time>
        <div class="timeline-card">
          <header>
            <div>
              <span class="course-code blue"><span class="course-dot"></span><bdi>CS 214</bdi></span>
              <h3>هياكل البيانات</h3>
            </div>
            ${changed ? '<span class="status-pill">هذه المرة تغيرت</span>' : '<span class="item-type">حصة</span>'}
          </header>
          <p class="item-meta"><bdi>${escapeHtml(occurrenceStart)}–${escapeHtml(occurrenceEnd)}</bdi> · ${escapeHtml(csSchedule.room)}</p>
          <div class="card-actions">
            <button class="button button-secondary button-small" type="button" data-action="edit-recurrence">تعديل الحصة</button>
          </div>
        </div>
      </article>
      <article class="timeline-item">
        <time class="timeline-time" datetime="2026-10-13T16:00">16:00</time>
        <div class="timeline-card">
          <header><div><span class="course-code purple"><span class="course-dot"></span>وقت خيالي متاح</span><h3>مساحة عمل قصيرة</h3></div><span class="item-type">اختياري</span></header>
          <p class="item-meta">لا يوجد حجز حقيقي؛ يظهر لمناقشة قرار اليوم.</p>
        </div>
      </article>`;

    const overdueItem = state.items.find((item) => item.id === "overdue-review");
    qs("#overduePanel").innerHTML = renderOverdueCard(overdueItem);

    const upcoming = state.items
      .filter((item) => item.id !== "overdue-review")
      .sort((a, b) => a.due.localeCompare(b.due));
    qs("#todayUpcoming").innerHTML = upcoming.length
      ? upcoming.map(renderItemCard).join("")
      : renderInlineEmpty("لا توجد التزامات قادمة في البيانات الخيالية.", "أضف واجبًا أو اختبارًا من الالتقاط السريع.");

    qs("#todayCount").textContent = String(1 + (overdueItem && !overdueItem.completed ? 1 : 0));
    qs("#weekCount").textContent = String(countThisWeek());
    qs("#overdueCount").textContent = overdueItem && !overdueItem.completed ? "1" : "0";
  }

  function renderOverdueCard(item) {
    if (!item) return renderInlineEmpty("لا يوجد عنصر متأخر.", "يمكنك متابعة اليوم بهدوء.");
    const completedClass = item.completed ? " completed" : "";
    return `
      <article class="overdue-card${completedClass}">
        <span class="item-type">${item.completed ? "مكتمل" : "متأخر"}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${item.completed ? "أنهيت هذا العنصر. يمكنك إعادة فتحه إذا كان الإكمال غير مقصود." : "لم يكتمل في الموعد السابق. اختر إجراءً مناسبًا؛ لا يوجد لوم أو ضغط."}</p>
        ${item.planned ? `<div class="planned-time">وقت العمل الجديد: ${escapeHtml(formatDateTime(item.planned))}</div>` : ""}
        <div class="card-actions">
          <button class="button ${item.completed ? "button-secondary" : "button-primary"} button-small" type="button" data-action="toggle-complete" data-item-id="${item.id}">${item.completed ? "إعادة فتح" : "وضع علامة مكتمل"}</button>
          <button class="button button-secondary button-small" type="button" data-action="reschedule" data-item-id="${item.id}">إعادة جدولة</button>
        </div>
      </article>`;
  }

  function renderItemCard(item) {
    const course = courseFor(item.courseId);
    const completedClass = item.completed ? " completed" : "";
    const reminder = item.reminder ? `<span class="reminder-chip">تذكير خيالي قبل ${escapeHtml(item.reminder)} ساعة</span>` : "";
    const reminderAction = item.kind === "اختبار"
      ? `<button class="button button-secondary button-small" type="button" data-action="reminder" data-item-id="${item.id}">تذكير</button>`
      : "";
    return `
      <article class="item-card${completedClass}" data-item-card="${item.id}">
        <header>
          <div>
            <span class="course-code ${course.color}"><span class="course-dot"></span><bdi>${escapeHtml(course.code)}</bdi></span>
            <h3>${escapeHtml(item.title)}</h3>
          </div>
          <span class="item-type">${escapeHtml(item.kind)}</span>
        </header>
        <p class="item-meta">${escapeHtml(formatDateTime(item.due))} · ${escapeHtml(course.name)}</p>
        ${item.planned ? `<div class="planned-time">وقت العمل: ${escapeHtml(formatDateTime(item.planned))} · الموعد الأصلي محفوظ</div>` : ""}
        ${reminder}
        <div class="card-actions">
          <button class="button ${item.completed ? "button-secondary" : "button-primary"} button-small" type="button" data-action="toggle-complete" data-item-id="${item.id}">${item.completed ? "إعادة فتح" : "إكمال"}</button>
          <button class="button button-secondary button-small" type="button" data-action="reschedule" data-item-id="${item.id}">إعادة جدولة</button>
          ${reminderAction}
        </div>
      </article>`;
  }

  function renderInlineEmpty(title, message) {
    return `<div class="empty-state"><div class="empty-icon" aria-hidden="true">◇</div><h3>${escapeHtml(title)}</h3><p class="muted">${escapeHtml(message)}</p></div>`;
  }

  function countThisWeek() {
    const start = "2026-10-11";
    const end = "2026-10-17";
    const itemCount = state.items.filter((item) => {
      const date = localDate(item.due);
      return date >= start && date <= end && !item.completed;
    }).length;
    const classCount = weekOccurrences().length;
    return itemCount + classCount;
  }

  function weekOccurrences() {
    const days = [
      { date: "2026-10-11", dayIndex: 0 },
      { date: "2026-10-12", dayIndex: 1 },
      { date: "2026-10-13", dayIndex: 2 },
      { date: "2026-10-14", dayIndex: 3 },
      { date: "2026-10-15", dayIndex: 4 },
      { date: "2026-10-16", dayIndex: 5 },
      { date: "2026-10-17", dayIndex: 6 }
    ];
    const schedules = state.schedules.length ? state.schedules : [
      { id: "schedule-cs214", courseId: "CS214", days: [0, 2], start: "10:00", end: "11:15", room: "قاعة T-12 الخيالية" },
      { id: "schedule-math203", courseId: "MATH203", days: [1, 3], start: "13:00", end: "14:15", room: "قاعة B-04 الخيالية" },
      { id: "schedule-arab110", courseId: "ARAB110", days: [4], start: "09:00", end: "10:30", room: "عن بعد — خيالي" }
    ];
    const result = [];
    days.forEach((day) => {
      schedules.forEach((schedule) => {
        if (!schedule.days.includes(day.dayIndex)) return;
        const override = state.occurrenceOverrides[day.date];
        result.push({
          id: `${schedule.id}-${day.date}`,
          date: day.date,
          courseId: schedule.courseId,
          start: override && schedule.courseId === "CS214" ? override.start : schedule.start,
          end: override && schedule.courseId === "CS214" ? override.end : schedule.end,
          room: schedule.room,
          changed: Boolean(override && schedule.courseId === "CS214")
        });
      });
    });
    return result;
  }

  function renderWeek() {
    const dayData = [
      { date: "2026-10-11", name: "الأحد", number: "11" },
      { date: "2026-10-12", name: "الاثنين", number: "12" },
      { date: "2026-10-13", name: "الثلاثاء", number: "13", current: true },
      { date: "2026-10-14", name: "الأربعاء", number: "14" },
      { date: "2026-10-15", name: "الخميس", number: "15" },
      { date: "2026-10-16", name: "الجمعة", number: "16" },
      { date: "2026-10-17", name: "السبت", number: "17" }
    ];
    const occurrences = weekOccurrences();
    qs("#weekBoard").innerHTML = dayData.map((day) => {
      const classes = occurrences.filter((entry) => entry.date === day.date);
      const items = state.items.filter((item) => localDate(item.due) === day.date);
      const content = [
        ...classes.map((entry) => renderWeekClass(entry)),
        ...items.map((item) => renderWeekItem(item))
      ].join("");
      return `
        <section class="day-column${day.current ? " current" : ""}" aria-label="${day.name} ${day.number}">
          <header><h2>${day.name}</h2><span>${day.number} أكتوبر</span></header>
          <div class="day-items">${content || '<div class="day-empty">مساحة خالية بهدوء</div>'}</div>
        </section>`;
    }).join("");
  }

  function renderWeekClass(entry) {
    const course = courseFor(entry.courseId);
    return `
      <article class="item-card">
        <span class="course-code ${course.color}"><span class="course-dot"></span><bdi>${course.code}</bdi></span>
        <h3>${escapeHtml(course.name)}</h3>
        <p class="item-meta"><bdi>${escapeHtml(entry.start)}–${escapeHtml(entry.end)}</bdi></p>
        ${entry.changed ? '<span class="status-pill">هذه المرة</span>' : ""}
        ${entry.courseId === "CS214" && entry.date === "2026-10-13" ? '<div class="card-actions"><button class="button button-secondary button-small" type="button" data-action="edit-recurrence">تعديل</button></div>' : ""}
      </article>`;
  }

  function renderWeekItem(item) {
    const course = courseFor(item.courseId);
    return `
      <article class="item-card${item.completed ? " completed" : ""}">
        <span class="item-type">${escapeHtml(item.kind)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="item-meta"><bdi>${escapeHtml(timeFromDateTime(item.due))}</bdi> · <bdi>${escapeHtml(course.code)}</bdi></p>
        <div class="card-actions"><button class="button button-secondary button-small" type="button" data-action="toggle-complete" data-item-id="${item.id}">${item.completed ? "إعادة فتح" : "إكمال"}</button></div>
      </article>`;
  }

  function renderConcepts() {
    qs("#conceptGrid").innerHTML = concepts.map((concept) => {
      const status = state.conceptStatus[concept.id] || { editing: false, rejected: false };
      const outputText = status.editedOutput ?? concept.output.join("\n");
      const outputLines = outputText.split("\n").filter((line) => line.trim());
      return `
        <article class="concept-card${status.rejected ? " rejected" : ""}" data-concept-id="${concept.id}">
          <header>
            <div><span class="concept-type">${escapeHtml(concept.type)}</span><h2>${escapeHtml(concept.title)}</h2></div>
            <span class="status-pill status-static">غير مولد مباشرًا</span>
          </header>
          <div class="static-disclosure"><span aria-hidden="true">◇</span><span>مثال خيالي ثابت كُتب للبحث. لا يوجد اتصال AI أو تحليل للمدخلات.</span></div>
          <section class="concept-block"><h3>مدخلات خيالية</h3><ul>${concept.input.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
          <section class="concept-block concept-output"><h3>${status.editedOutput ? "مخرج ثابت معدّل محليًا" : "مخرج ثابت"}</h3>${status.editing ? `<textarea aria-label="تعديل المخرج الخيالي">${escapeHtml(outputText)}</textarea>` : `<ol>${outputLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>`}</section>
          <section class="concept-block"><h3>الحدود</h3><ul>${concept.limitations.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
          <div class="action-row">
            <button class="button button-secondary button-small" type="button" data-concept-action="edit" data-concept-id="${concept.id}">${status.editing ? "إنهاء التعديل" : "تعديل الاقتراح"}</button>
            <button class="button ${status.rejected ? "button-secondary" : "button-danger-soft"} button-small" type="button" data-concept-action="reject" data-concept-id="${concept.id}">${status.rejected ? "التراجع عن الرفض" : "رفض الاقتراح"}</button>
          </div>
        </article>`;
    }).join("");
  }

  function renderStateDemo(name) {
    const stage = qs("#stateStage");
    const demos = {
      empty: `<div class="empty-state"><div class="empty-icon">○</div><h2>لا توجد التزامات اليوم</h2><p>يمكنك التقاط أول واجب، أو الانتقال إلى هذا الأسبوع. هذه ليست مشكلة تحميل.</p><button class="button button-primary" type="button" data-open-modal="quickCaptureModal">+ إضافة أول التزام</button></div>`,
      loading: `<div class="loading-state" role="status" aria-label="تحميل تمثيلي"><p class="muted">جارٍ تجهيز هذا الأسبوع محليًا…</p><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`,
      error: `<div class="demo-message error"><p class="eyebrow">تعذر الحفظ</p><h2>أضف عنوانًا قبل المتابعة</h2><p>بقية الحقول ما زالت موجودة. صحح الحقل المميز ثم حاول مرة أخرى.</p><button class="button button-secondary" type="button" data-open-modal="quickCaptureModal" data-clear-assignment-title>فتح النموذج الناقص</button></div>`,
      success: `<div class="demo-message success"><p class="eyebrow">تم الحفظ</p><h2>أُضيف الالتزام إلى هذا الأسبوع</h2><p>حفظ مؤقت داخل الصفحة فقط. يمكنك التعديل أو التراجع من البطاقة.</p><button class="button button-secondary" type="button" data-nav="week">عرض هذا الأسبوع</button></div>`,
      overdue: `<div class="demo-message overdue"><p class="eyebrow">يحتاج قرارًا</p><h2>«مراجعة محاضرة 5» لم تكتمل بعد</h2><p>اختر إكمالها، إعادة جدولتها، أو تركها الآن. لا عقوبة ولا رسالة لوم.</p><div class="action-row"><button class="button button-primary" type="button" data-action="toggle-complete" data-item-id="overdue-review">وضع علامة مكتمل</button><button class="button button-secondary" type="button" data-action="reschedule" data-item-id="overdue-review">إعادة جدولة</button></div></div>`
    };
    stage.innerHTML = demos[name] || demos.empty;
  }

  function updateViews() {
    renderToday();
    renderWeek();
    renderConcepts();
  }

  function toggleComplete(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;
    item.completed = !item.completed;
    showToast(item.completed ? "تم الإكمال" : "أُعيد فتح العنصر", item.completed ? "يمكنك إعادة فتحه إذا كان الإجراء غير مقصود." : "عاد العنصر إلى القائمة النشطة.");
    updateViews();
    if (activeScreen === "states") renderStateDemo("overdue");
  }

  function prepareReschedule(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;
    qs("#rescheduleItemId").value = item.id;
    qs("#rescheduleOriginalDue").textContent = formatDateTime(item.due);
    qs("#reschedulePlanned").value = item.id === "arab-project" ? "2026-10-14T16:00" : "2026-10-13T17:00";
    qs("#rescheduleError").hidden = true;
    openModal("rescheduleModal");
  }

  function prepareReminder(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item || item.kind !== "اختبار") return;
    qs("#reminderForm").dataset.itemId = item.id;
    openModal("reminderModal");
  }

  function handleAction(target) {
    const action = target.closest("[data-action]");
    if (!action) return false;
    const itemId = action.dataset.itemId;
    if (action.dataset.action === "toggle-complete") toggleComplete(itemId);
    if (action.dataset.action === "reschedule") prepareReschedule(itemId);
    if (action.dataset.action === "edit-recurrence") openModal("recurrenceModal", action);
    if (action.dataset.action === "reminder") prepareReminder(itemId);
    return true;
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const target = event.target;

      const navigation = target.closest("[data-nav]");
      if (navigation) {
        event.preventDefault();
        navigate(navigation.dataset.nav);
        return;
      }

      const nextSetup = target.closest("[data-next-setup]");
      if (nextSetup) {
        if (nextSetup.id === "skipProfile") {
          qs("#universityInput").value = "";
          qs("#majorInput").value = "";
          state.profileSkipped = true;
          showToast("تم التخطي", "الجامعة والتخصص اختياريان ولم تُحفظ قيمة.");
        }
        showSetupStep(nextSetup.dataset.nextSetup);
        return;
      }

      const modalOpen = target.closest("[data-open-modal]");
      if (modalOpen) {
        if (modalOpen.hasAttribute("data-clear-assignment-title")) {
          qs("#assignmentTitle").value = "";
        }
        openModal(modalOpen.dataset.openModal, modalOpen);
        return;
      }

      const modalClose = target.closest("[data-close-modal]");
      if (modalClose) {
        closeModal(modalClose.closest(".modal"));
        return;
      }

      const stateTrigger = target.closest("[data-state-demo]");
      if (stateTrigger) {
        renderStateDemo(stateTrigger.dataset.stateDemo);
        return;
      }

      const conceptAction = target.closest("[data-concept-action]");
      if (conceptAction) {
        const id = conceptAction.dataset.conceptId;
        state.conceptStatus[id] ||= { editing: false, rejected: false };
        if (conceptAction.dataset.conceptAction === "edit") {
          const status = state.conceptStatus[id];
          if (status.editing) {
            const editor = conceptAction.closest(".concept-card").querySelector("textarea");
            status.editedOutput = editor.value.trim();
          }
          status.editing = !status.editing;
        }
        if (conceptAction.dataset.conceptAction === "reject") state.conceptStatus[id].rejected = !state.conceptStatus[id].rejected;
        renderConcepts();
        return;
      }

      handleAction(target);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const open = qsa(".modal").find((modal) => !modal.hidden);
        if (open) closeModal(open);
      }
    });

    qsa('input[name="language"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        state.language = radio.value;
        document.documentElement.lang = radio.value;
        document.documentElement.dir = radio.value === "ar" ? "rtl" : "ltr";
        qsa(".choice-card").forEach((card) => card.classList.toggle("selected", qs("input", card).checked));
        showToast("تغير اتجاه العرض", radio.value === "ar" ? "واجهة الاختبار الأساسية الآن RTL." : "اتجاه LTR للمقارنة؛ تبقى البيانات البحثية خيالية ومختلطة اللغة.");
      });
    });

    qs("#startPrototype").addEventListener("click", () => {
      navigate("setup");
      showSetupStep("profile");
    });

    qs("#resetPrototype").addEventListener("click", () => {
      const shouldReset = window.confirm("إعادة النموذج إلى البداية والبيانات الخيالية الأصلية؟ لا توجد بيانات حقيقية محفوظة.");
      if (shouldReset) window.location.reload();
    });

    qs("#closeToast").addEventListener("click", closeToast);

    qs("#termForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = qs("#termName").value.trim();
      const start = qs("#termStart").value;
      const end = qs("#termEnd").value;
      const error = qs("#termError");
      if (!name || !start || !end) {
        error.textContent = "أكمل اسم الفصل وتاريخي البداية والنهاية.";
        error.hidden = false;
        return;
      }
      if (end <= start) {
        error.textContent = "يجب أن يكون تاريخ نهاية الفصل بعد تاريخ البداية.";
        error.hidden = false;
        return;
      }
      error.hidden = true;
      state.term = { name, start, end, active: qs("#termActive").checked };
      showToast("تم حفظ الفصل", "الفصل التجريبي نشط في ذاكرة الصفحة فقط.");
      showSetupStep("courses");
    });

    qs("#addCourses").addEventListener("click", () => {
      const selected = qsa('#courseSelector input[type="checkbox"]:checked').map((input) => input.value);
      const error = qs("#coursesError");
      if (!selected.length) {
        error.hidden = false;
        return;
      }
      error.hidden = true;
      state.courses = selected.map((id) => ({ ...COURSE_CATALOG[id] }));
      showToast("أُضيفت المقررات", `${selected.length} مقررات خيالية جاهزة للجدول.`);
      showSetupStep("schedule");
    });

    qs("#scheduleForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const days = qsa('input[name="scheduleDay"]:checked').map((input) => Number(input.value));
      const start = qs("#scheduleStart").value;
      const end = qs("#scheduleEnd").value;
      const room = qs("#scheduleRoom").value.trim();
      const error = qs("#scheduleError");
      if (!days.length || !start || !end || !room) {
        error.textContent = "اختر يومًا واحدًا على الأقل وأكمل الوقت والمكان.";
        error.hidden = false;
        return;
      }
      if (end <= start) {
        error.textContent = "وقت نهاية الحصة يجب أن يكون بعد بدايتها.";
        error.hidden = false;
        return;
      }
      error.hidden = true;
      seedSchedules({ courseId: qs("#scheduleCourse").value, days, start, end, room });
      showToast("تم حفظ الجدول", "أضيفت السلسلة وبقية الجدول الخيالي لإكمال الاختبار.");
      updateViews();
      navigate("today");
    });

    qs("#quickCaptureForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const title = qs("#assignmentTitle").value.trim();
      const due = qs("#assignmentDue").value;
      const error = qs("#assignmentError");
      if (!title || !due) {
        error.textContent = !title ? "أضف عنوانًا للواجب قبل الحفظ." : "أضف موعدًا للواجب.";
        error.hidden = false;
        return;
      }
      error.hidden = true;
      const submit = qs('button[type="submit"]', event.currentTarget);
      submit.disabled = true;
      submit.textContent = "جارٍ الحفظ محليًا…";
      setTimeout(() => {
        const existing = state.items.find((item) => item.id === "tree-assignment");
        const data = {
          id: "tree-assignment",
          kind: "واجب",
          title,
          courseId: qs("#assignmentCourse").value,
          due,
          completed: false,
          overdue: false,
          planned: null,
          reminder: null
        };
        if (existing) Object.assign(existing, data);
        else state.items.push(data);
        submit.disabled = false;
        submit.textContent = "حفظ الواجب";
        closeModal("quickCaptureModal");
        updateViews();
        showToast("تم حفظ الواجب", "ظهر في هذا الأسبوع. الحفظ مؤقت داخل الصفحة فقط.");
      }, 520);
    });

    qs("#examForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const title = qs("#examName").value.trim();
      const due = qs("#examDue").value;
      const error = qs("#examError");
      if (!title || !due) {
        error.textContent = "أكمل اسم الاختبار وموعد بدئه.";
        error.hidden = false;
        return;
      }
      error.hidden = true;
      const existing = state.items.find((item) => item.id === "math-exam");
      const data = {
        id: "math-exam",
        kind: "اختبار",
        title,
        courseId: qs("#examCourse").value,
        due,
        completed: false,
        overdue: false,
        planned: null,
        reminder: null
      };
      if (existing) Object.assign(existing, data);
      else state.items.push(data);
      closeModal("examModal");
      updateViews();
      showToast("تم حفظ الاختبار", "موعد البدء الخيالي ظاهر ويمكن إعداد تذكير تمثيلي.");
    });

    qs("#rescheduleForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const item = state.items.find((entry) => entry.id === qs("#rescheduleItemId").value);
      const planned = qs("#reschedulePlanned").value;
      const error = qs("#rescheduleError");
      if (!item || !planned) {
        error.textContent = "اختر وقت عمل جديدًا.";
        error.hidden = false;
        return;
      }
      item.planned = planned;
      error.hidden = true;
      closeModal("rescheduleModal");
      updateViews();
      showToast("تمت إعادة الجدولة", "تغير وقت العمل فقط؛ بقي موعد التسليم الأصلي واضحًا.");
    });

    qs("#recurrenceForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const scope = qs('input[name="recurrenceScope"]:checked').value;
      const start = qs("#recurrenceStart").value;
      const end = qs("#recurrenceEnd").value;
      const error = qs("#recurrenceError");
      if (!start || !end || end <= start) {
        error.textContent = "تحقق من أن وقت النهاية بعد وقت البداية.";
        error.hidden = false;
        return;
      }
      error.hidden = true;
      if (scope === "occurrence") {
        state.occurrenceOverrides["2026-10-13"] = { start, end };
        showToast("تغيرت هذه المرة فقط", "بقيت بقية سلسلة CS 214 على وقتها السابق.");
      } else {
        const schedule = state.schedules.find((entry) => entry.courseId === "CS214");
        if (schedule) {
          schedule.start = start;
          schedule.end = end;
        } else {
          seedSchedules({ courseId: "CS214", days: [0, 2], start, end, room: "قاعة T-12 الخيالية" });
        }
        state.occurrenceOverrides = {};
        showToast("تغيرت السلسلة كلها", "كل حصص CS 214 في الفصل تستخدم الوقت الجديد.");
      }
      closeModal("recurrenceModal");
      updateViews();
    });

    qs("#reminderForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const item = state.items.find((entry) => entry.id === event.currentTarget.dataset.itemId);
      if (!item) return;
      item.reminder = qs("#reminderOffset").value;
      closeModal("reminderModal");
      updateViews();
      showToast("حُفظ تذكير خيالي", "لن يصل إشعار حقيقي ولا يوجد اتصال بخدمة جهاز.");
    });
  }

  function initialize() {
    bindEvents();
    renderToday();
    renderWeek();
    renderConcepts();
    const requestedScreen = window.location.hash.replace("#", "");
    navigate(qs(`[data-screen="${requestedScreen}"]`) ? requestedScreen : "welcome");
  }

  initialize();
})();
