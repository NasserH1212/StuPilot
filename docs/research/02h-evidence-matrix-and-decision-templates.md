# StudentHub AI — Evidence Matrix & Decision Templates

> **ARCHIVED / OPTIONAL — 5 August 2026:** Owner-cancelled research program. Do not execute participant operations or use this file as a product-planning gate. Historical reference only; see `../archive/research/README.md` and active `../product/README.md`.

**الإصدار:** 0.1 — Empty Templates  
**التاريخ:** 4 أغسطس 2026  
**الحالة:** قوالب بلا نتائج؛ لا تملأ إلا بأدلة قابلة للتتبع من بحث منفذ فعلًا.

## 1. قاموس الحالات والوسوم

### نوع المعرفة

- `AD` — قرار معتمد.
- `VF` — حقيقة متحققة من مصدر رسمي/أولي مؤرخ.
- `OBS` — سلوك أو حدث شاهده الباحث.
- `REP` — ما أبلغ عنه مشارك أو مصدر.
- `INF` — استنتاج الباحث؛ لا يُعرض كحقيقة.
- `P` — مقترح يحتاج موافقة.
- `NV` — غير متحقق.
- `PENDING` — لم يجمع دليل بعد.

### جودة/ثقة الدليل

- **High:** سلوك حديث ملاحظ أو سجل حدث قريب، متكرر عبر سياقات، ومتثلث بطريقة أخرى؛ لا تعارض جوهري غير مفسر.
- **Medium:** أكثر من مصدر مستقل أو طريقة، لكن يغلب التقرير الذاتي/العينة المحدودة أو توجد قيود.
- **Low:** حالة/قناة واحدة، رأي مستقبلي، مصدر تسويقي منفرد، أو استنتاج غير متثلث.
- **None:** لا دليل؛ لا تستخدم «منخفضة» بدل الاعتراف بالغياب.

الثقة ليست تصويتًا ولا تحسب من عدد الاقتباسات وحده.

## 2. قالب تتبع سؤال البحث

| RQ ID | السؤال | القرار الذي سيؤثر فيه | الطرق المخططة | Source IDs المؤيدة | Source IDs المعارضة | OBS | REP | INF | فجوات/تحيز | Confidence | الحالة/النتيجة المؤقتة |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RQ-___ |  |  |  |  |  |  |  |  |  | None | PENDING |

قواعد:

1. لا يوضع Source ID واحد في خانتي التأييد والمعارضة دون شرح الجزء المختلف.
2. يكتب الاستنتاج المؤقت بصيغة محدودة: «في هذه العينة/السياق…».
3. السؤال بلا دليل يبقى `PENDING` ولا يغلق بالحدس.

## 3. سجل الأدلة مع وضد

| Evidence ID | Claim/Hypothesis | Stance: For/Against/Mixed | Type: OBS/REP/VF | Method | Source ID | Date | Broad context | Evidence summary (redacted) | Recency | Directness | Limitation | Researcher interpretation (INF) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EV-___ | H-__ |  |  |  |  |  |  |  |  |  |  |  |

يُمنع إدخال «لم يعترض المشارك» بوصفه دليل تأييد، أو نسخ اقتباس يمكن أن يكشفه.

## 4. قالب Observed / Reported / Inferred

```text
Source ID: __________
Context: __________ (broad, privacy-safe)

OBSERVED
- What the researcher directly saw/heard during a task/event: __________
- Timestamp/task/event reference: __________

REPORTED
- Participant/source statement, paraphrased or approved-redacted quote: __________
- Period referenced: __________

INFERRED
- Interpretation: __________
- Alternative explanation: __________
- Evidence needed to distinguish: __________
```

مثال بنيوي بلا نتيجة: `OBS: توقف عند label` لا يساوي `INF: العربية غير واضحة` حتى يسأل الباحث ويتكرر النمط.

## 5. سياق المشارك المنقح

| Participant ID | Method | Broad age band | Broad year | Broad field | University type | Schedule pattern | Workflow segment(s) | Main device | Language pattern | Accessibility accommodation | Recruitment channel class | Consent flags | Notes safe for analysis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ___-___ |  |  |  |  |  |  |  |  |  |  |  |  |  |

لا اسم، جامعة محددة، مدينة صغيرة، تخصص نادر مع سنة، رقم جامعي، درجة، أو بيانات اتصال. الاتصال في سجل منفصل مؤقت.

## 6. قالب تقييم الثقة

| Claim ID | Claim | Evidence count (with denominator) | Method diversity | Context diversity | Behavioral proximity | Contradictions | Sampling/bias risk | Confidence | Reviewer | Rationale |
|---|---|---:|---|---|---|---|---|---|---|---|
| CL-___ |  |  |  |  |  |  |  | None/Low/Medium/High |  |  |

أسئلة إلزامية قبل `High`:

- هل الدليل سلوك حديث أم نية مستقبلية؟
- هل يوجد مصدر مستقل/طريقة ثانية؟
- هل بحثنا عن حالة مخالفة؟
- هل الخلاصة أضيق من الدليل أم أوسع منه؟
- هل يستطيع متحيز غير ظاهر (قناة، موسم، أداة مستخدمة) تفسير النمط؟

## 7. سجل حالة الافتراض

| Hypothesis ID | نص الفرضية | Criticality | Test method(s) | Falsifier المحدد مسبقًا | Evidence for | Evidence against | Status | Confidence | Product implication | Next action | Owner/date |
|---|---|---|---|---|---|---|---|---|---|---|---|
| H-___ |  |  |  |  |  |  | PENDING / SUPPORTED / WEAKENED / REFUTED / MIXED | None |  |  |  |

`SUPPORTED` لا تعني «حقيقة دائمة». يضاف تاريخ وسياق النسخة، ويعاد فتح الافتراض عند تغير السوق أو النطاق.

## 8. قالب دليل منافس

| Competitor ID | Product | Cluster | Claim ID | Statement | Label: VF/RO/INF/NV | Official source URL | Source type | Access date | Source publish/update date | Pricing currency/region | Conflict/limitation | Implication for StudentHub AI |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CMP-___ |  |  |  |  |  |  |  |  |  |  |  |  |

قواعد:

- لا تستخدم صفحة مقارنة تابعة لمنافس لإثبات ضعف منتج آخر.
- السعر بلا رقم ظاهر في مصدر رسمي = `NV`، لا يؤخذ من snippet غير مؤرخ.
- العربية = `VF` فقط من وثائق/متجر رسمي؛ RTL مستقل عنها ولا يفترض تلقائيًا.
- ادعاء المنتج عن نفسه `VF` في معنى «المصدر الرسمي يقول»، لا في معنى فعالية مستقلة مثبتة.
- تضارب مصدرين رسميين يوثق ولا يحسم بلا تحقق إضافي.

## 9. سجل مشكلة قابلية الاستخدام

| Issue ID | Prototype version | Task/state | Device | Language | Problem statement | OBS evidence IDs | REP evidence IDs | Participants / tested | Severity S0–S4 | Frequency in sample | Core-job impact | Workaround | Proposed change [P] | R2 result | Status |
|---|---|---|---|---|---|---|---|---|---:|---|---|---|---|---|---|
| UX-___ |  |  |  |  |  |  |  | __ / __ |  |  |  |  |  |  | OPEN |

لا تدمج مشكلتين لأنهما في الشاشة نفسها. يسجل `Prototype blocked` منفصلًا عن فشل المشارك.

## 10. مقارنة مرشحي AI والبديل غير AI

لا يملأ هذا القالب قبل جمع سلوك حقيقي ومقارنة مفاهيم ثابتة. لا ينتج تلقائيًا اختيار Pilot.

| Criterion | Study plan AI | Revision questions AI | Weekly prioritization AI | Non-AI template | Evidence IDs | Confidence |
|---|---|---|---|---|---|---|
| Task frequency in recent period |  |  |  |  |  |  |
| Current effort/friction |  |  |  |  |  |  |
| Output understood without coaching |  |  |  |  |  |  |
| Useful action enabled |  |  |  |  |  |  |
| Required edits/verification |  |  |  |  |  |  |
| Harm if wrong |  |  |  |  |  |  |
| Sensitive inputs |  |  |  |  |  |  |
| Academic-integrity risk |  |  |  |  |  |  |
| Measurability of benefit |  |  |  |  |  |  |
| Lower-risk fallback |  |  |  |  |  |  |
| Depends on upload/RAG/chat? |  |  |  |  |  |  |
| Core MVP dependency |  |  |  |  |  |  |
| Overall evidence status | PENDING | PENDING | PENDING | PENDING |  | None |

### مذكرة AI hypothesis — بلا قرار مبكر

```text
Question: Is there enough evidence to keep any candidate for a later Pilot?
Evidence-backed ranking (if any): __________
Candidate(s) eliminated and why: __________
Non-AI alternative performance: __________
Unknowns: __________
Privacy/integrity guardrails needed: __________
Recommendation now: More research / Keep candidate(s) / No AI Pilot hypothesis

Important: This does not authorize the AI Pilot. The Pilot gate remains after
core MVP implementation and real validation.
```

## 11. قالب تحديث المخاطر

| Risk ID | Existing/new | Risk statement | Trigger/evidence | Likelihood before | Impact before | Likelihood now | Impact now | Evidence IDs | Mitigation | Residual risk | Owner | Review gate |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-___ |  |  |  |  |  |  |  |  |  |  |  |  |

لا يُحذف خطر من السجل؛ يغيّر إلى `Closed/Accepted/Transferred/Monitoring` مع سبب وتاريخ.

## 12. قالب قرار Proceed / Narrow / Pivot / Stop

```markdown
# Decision Memo — Gate [G__]

Date:
Prepared by:
Decision owners present:
Decision requested:
Scope covered:

## Baseline decisions that remain fixed
- AD-01 ...

## Evidence collected
| Method | Actual sample/source count | Dates | Coverage | Key limitations |
|---|---:|---|---|---|

## What the evidence supports
| Claim | Evidence IDs | Confidence | Boundary |
|---|---|---|---|

## What the evidence challenges
| Claim/hypothesis | Counter-evidence IDs | Confidence | Consequence |
|---|---|---|---|

## What remains unknown
- ...

## Options
### Proceed
Benefits:
Risks:
Evidence threshold met/not met:

### Narrow
Exact segment/workflow/features retained:
Exact items removed/deferred:
Validation needed:

### Pivot
New hypothesis:
Why this is not scope creep:
Validation reset required:

### Stop
Cost avoided:
Conditions for reopening:

## Recommendation [P]
Proceed / Narrow / Pivot / Stop
Rationale:
Dissent/alternative interpretation:

## Decision
Chosen by owner:
Date:
Conditions:

## Consequences
- PRD authorization: Yes / No
- Core MVP change: None / Narrowed / Requires new validation
- AI candidate status: Still unselected / Hypotheses narrowed / No current candidate
- Next approved deliverable:
```

## 13. قالب سجل القرار المختصر

| Decision ID | Gate | Date | Options considered | Decision | Evidence matrix version | Owner | Conditions | Revisit trigger | PRD authorized? |
|---|---|---|---|---|---|---|---|---|---|
| DEC-___ |  |  |  |  |  |  |  |  | No |

## 14. تعريف الحد الأدنى لحزمة الأدلة قبل البوابة

- قائمة الطرق التي نُفذت فعلًا والأعداد الفعلية والانحراف عن الخطة.
- مصفوفة RQ بلا أسئلة حرجة مخفية؛ `PENDING` ظاهر.
- افتراضات مؤيدة ومضعفة/منفية ومختلطة.
- حالات مخالفة لا «اقتباسات جميلة» فقط.
- مشاكل قابلية الاستخدام مع denominators وإصدار النموذج.
- تركيب للمنافسين مع مصدر رسمي وحدود.
- تكوين العينة والتحيز والانسحاب/المفقود.
- تحديث المخاطر والخصوصية.
- مذكرة القرار وتوقيع/اعتماد المالك.

## 15. تسمية الملفات المستقبلية

داخل مجلد وصوله محدود (يُحدد قبل الجمع):

```text
evidence/
  participant-contact/        # منفصل، مؤقت، غير مشارك مع التحليل
  consent/                    # صلاحيات محدودة
  interviews/redacted/
  diary/redacted/
  survey/deidentified/
  usability/redacted/
  synthesis/
    rq-matrix-vNN
    assumption-register-vNN
    risk-register-vNN
    decision-memo-GN-vNN
```

هذا مخطط حوكمة ملفات بحث، وليس تصميم قاعدة بيانات أو بنية تطبيق. لا تُنشأ مجلدات بيانات مشاركين قبل اعتماد التخزين والخصوصية.

## 16. الحالة

كل الصفوف أعلاه فارغة عمدًا. **لا دليل مشاركين، لا نتيجة usability، ولا قرار Proceed/Narrow/Pivot/Stop موجود حتى تنفيذ البحث الحقيقي ومراجعته.**
