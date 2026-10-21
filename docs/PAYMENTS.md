# بوابات الدفع — Paymob

دليل التشغيل الكامل لاستقبال التبرعات أونلاين في موقع جمعية أخوين الخيرية.

> **الفكرة باختصار:** المتبرع يختار الباب والمبلغ ويكتب بياناته، ثم نُنشئ «نية دفع» (Intention) على سيرفر Vercel باستخدام المفتاح السري، ونحوّله إلى صفحة Paymob الآمنة. بعد الدفع يعود إلى الموقع فتتحقق الصفحة من توقيع Paymob (HMAC) وتعرض له النتيجة، ويصلنا Webhook موقّع لتسجيل العملية في Google Sheets.

---

## 1. قبل أي شيء — أمان المفاتيح

- **أي مفتاح تم إرساله في محادثة أو بريد أو GitHub يُعتبر مكشوفاً.** ادخل إلى لوحة Paymob ثم:
  `Settings → API Keys` → أنشئ/جدّد (**Regenerate**) المفاتيح القديمة.
- لا تضع أي مفتاح في الكود أو في GitHub. كل المفاتيح تُضبط في:
  - محلياً: `.env.local` (متجاهَل في git).
  - الإنتاج: Vercel → Project → Settings → Environment Variables.
- `.env.example` يحتوي الأسماء فقط بدون قيم.

---

## 2. المكوّنات

```
المتصفح
  │  1) POST /api/donations/create   (بيانات المتبرع + المبلغ)
  ▼
Vercel Function ──► Paymob Intention API ──► client_secret
  │                                            │
  │  2) نحفظ سجلاً مبدئياً في Google Sheets     │
  ▼                                            ▼
Google Apps Script ◄── 4) Webhook موقّع ── صفحة Paymob الآمنة
  ▲                                            │
  │  5) نحدّث الحالة النهائية                   │ 3) يعود المتبرع
  └────────── POST /api/donations/verify ◄─────┘
```

| المسار | الوظيفة |
|---|---|
| `GET /api/donations/config` | إعدادات عامة للواجهة: الأبواب، المبالغ، هل الدفع مفعّل؟ |
| `POST /api/donations/create` | التحقق من المدخلات + إنشاء Intention + حفظ سجل `pending` |
| `POST /api/donations/webhook` | يستقبل Paymob، يتحقق من HMAC، ويحدّث الحالة |
| `POST /api/donations/verify` | يتحقق من توقيع عودة المتبرع ويعرض النتيجة |
| `GET /api/donations/health` | فحص جاهزية الإعدادات (بدون كشف أي سر) |

**قاعدة التصميم:** لا نسمح بالانتقال إلى الدفع إذا فشل تسجيل السجل المبدئي في Google Sheets. لا نأخذ مالاً لا نستطيع تسجيله.

---

## 3. مفاتيح Paymob المطلوبة

من لوحة Paymob:

| المتغير | من أين |
|---|---|
| `PAYMOB_SECRET_KEY` | Settings → API Keys → **Secret Key** (`egy_sk_test_…` أو `egy_sk_live_…`) |
| `PAYMOB_PUBLIC_KEY` | Settings → API Keys → **Public Key** (`egy_pk_…`) |
| `PAYMOB_INTEGRATION_IDS` | Developers → **Payment Integrations** — معرّف لكل طريقة دفع |
| `PAYMOB_HMAC_SECRET` | Settings → API Keys → **HMAC Secret** |
| `PAYMOB_API_KEY` | (اختياري) API Key القديم — يستخدمه سكربت الفحص فقط |

### طرق الدفع

المشروع يدعم **كل الطرق التي تُفعّلها في حسابك** عبر Unified Checkout. ضع معرّفات التكامل مفصولة بفاصلة:

```env
PAYMOB_INTEGRATION_IDS=111111,222222,333333,444444
```

- بطاقات (Visa / Mastercard / Meeza)
- محافظ موبايل (Vodafone Cash / Orange Cash / Etisalat / WE)
- فوري والكشك
- التقسيط (valU / بنوك) — حسب تعاقد الحساب

> **مهم:** مفاتيح الاختبار تُستخدم مع Integration IDs الخاصة بوضع الاختبار، ومفاتيح الإنتاج مع Integration IDs الإنتاج. لا تخلط بينهما.

---

## 4. إعداد Google Sheets (مرة واحدة)

1. أنشئ Google Sheet جديداً باسم **Akhawein Donations**.
2. من القائمة: **Extensions → Apps Script**.
3. امسح المحتوى والصق ملف `google-apps-script/Code.gs` كاملاً.
4. احفظ (Ctrl+S)، ثم من قائمة الدوال اختر **`setup`** واضغط **Run**.
   - قد يطلب صلاحيات: اسمح بها.
   - افتح **Execution log** وانسخ:
     - `SHEETS_WEBHOOK_SECRET = ...`
5. **Deploy → New deployment → Web app**:
   - Description: `Akhawein donations v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - اضغط Deploy وانسخ رابط **`/exec`**.
6. تحقق أن الرابط يعمل:
   ```
   https://script.google.com/macros/s/XXXX/exec?token=SHEETS_WEBHOOK_SECRET
   ```
   يجب أن يعيد `{"ok":true,...}`.

> الرابط عام لكنه محمي بالسر؛ أي طلب بدون السر يُرفض. لا تشارك السر.
> الورقة نفسها لا تحتاج أن تكون عامة.

### أعمدة الورقة

`reference, created_at, updated_at, status, amount_egp, currency, cause_id, cause_ar, cause_en, donor_first, donor_last, donor_email, donor_phone, anonymous, message, paymob_order_id, paymob_intention_id, paymob_transaction_id, payment_method, masked_pan, lang, hmac_verified, error_message, raw_json`

الحالات: `pending` → `paid` / `failed` / `refunded` / `voided`.

---

## 5. الإعداد المحلي

```bash
cp .env.example .env.local
# عدّل القيم
npm run test:payments     # اختبارات بدون إنترنت
npm run check:paymob      # فحص وجود المفاتيح وصيغتها
npm run dev               # http://localhost:5500
```

ثم افتح:
- `http://localhost:5500/donations`
- `http://localhost:5500/api/donations/health`
- `http://localhost:5500/api/donations/config`

### فحص الاتصال الحقيقي (اختياري)

```bash
# يتحقق من مفتاح API القديم فقط
npm run check:paymob -- --auth

# ينشئ نية دفع تجريبية بقيمة 1 جنيه ويعطيك رابط الدفع
npm run check:paymob -- --intention
```

> `--intention` لا يخصم شيئاً حتى تفتح الرابط وتدفع. في وضع Live سيُنشئ طلباً حقيقياً بقيمة 1 جنيه.

---

## 6. النشر على Vercel

أضف المتغيرات التالية في **Settings → Environment Variables** (Production و Preview):

```env
PAYMOB_SECRET_KEY=...
PAYMOB_PUBLIC_KEY=...
PAYMOB_INTEGRATION_IDS=...
PAYMOB_HMAC_SECRET=...
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
SHEETS_WEBHOOK_SECRET=...
SITE_URL=https://www.akhawein.org
DONATION_MIN_EGP=10
DONATION_MAX_EGP=200000
```

ثم:

```bash
npm run build       # يحدّث ملفات HTML و CSS/JS
git add -A
git commit -m "feat: add Paymob online donations"
git push
```

Vercel سيتعرف تلقائياً على مجلد `api/` كـ Serverless Functions. **لا تحذف `api/` أو `lib/` من `.vercelignore`.**

بعد النشر:

```bash
curl https://www.akhawein.org/api/donations/health
```

يجب أن يعيد `"ready": true`.

---

## 7. إعداد الـ Webhook في Paymob

مع Intention API لا تحتاج إلى ضبط Callback URL يدوياً لكل عملية، لأننا نرسل:

- `notification_url = https://www.akhawein.org/api/donations/webhook`
- `redirection_url = https://www.akhawein.org/donations?payment=return&ref=AKH-…`

لكن تأكد من:

1. **HMAC Secret** في اللوحة مطابق لـ `PAYMOB_HMAC_SECRET`.
2. أن حسابك يسمح بإرسال Webhooks (غالباً مفعّل افتراضياً).
3. أن `SITE_URL` في Vercel هو الدومين النهائي **بدون** `/` في النهاية.
4. أن الدومين لا يحجب `/api/*` عبر WAF أو قواعد Cache.

للاختبار السريع من الطرفية (بدون توقيع صحيح يجب أن يُرفض):

```bash
curl -i -X POST https://www.akhawein.org/api/donations/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"TRANSACTION","obj":{"id":1}}'
# المتوقع: 401 invalid_hmac
```

---

## 8. الاختبار الكامل (Test Mode)

1. استخدم مفاتيح `egy_sk_test_…` و `egy_pk_test_…` و Integration IDs الاختبار.
2. من لوحة Paymob: **Developers → Test Cards** — استخدم البطاقة التجريبية المتاحة لك.
   - بطاقة شائعة في وثائق Paymob: `5123 4567 8901 2346` — تاريخ مستقبلي — CVV `123` — OTP `123456`.
   - إن رفضها الحساب، استخدم البطاقة الظاهرة في لوحتك.
3. جرّب:
   - بطاقة ناجحة → يجب أن تعود لصفحة النجاح ويظهر السجل `paid`.
   - بطاقة مرفوضة → صفحة فشل والسجل `failed`.
   - مبلغ أقل من 10 أو أكبر من 200,000 → رفض من الواجهة والسيرفر.
   - محاولة طلب من Origin غريب → 403.
   - إعادة إرسال نفس الـ Webhook → لا يتكرر السجل (idempotent by reference).
4. راقب `Google Sheet` و`Vercel → Functions → Logs`.

---

## 9. قبل التحويل إلى Live

- [ ] تم تجديد/إلغاء أي مفتاح قديم مكشوف.
- [ ] مفاتيح Live وIntegration IDs Live فقط في Production.
- [ ] `PAYMOB_HMAC_SECRET` الخاص بـ Live مضبوط.
- [ ] `SITE_URL=https://www.akhawein.org` (أو بدون www حسب الدومين الرسمي).
- [ ] `npm run test:payments` ينجح.
- [ ] `/api/donations/health` يعيد `ready: true` و`mode: live`.
- [ ] تجربة حقيقية بمبلغ صغير (مثلاً 10 جنيه) ثم استرجاعها (Refund) من لوحة Paymob.
- [ ] التأكد من وصول Webhook وتسجيل السجل `paid`.
- [ ] مراجعة صلاحيات من يملك الوصول إلى Google Sheet.
- [ ] تفعيل تنبيه على بريد الجمعية عند فشل Webhooks (اختياري).

---

## 10. الأمان — ما تم تطبيقه

- المفتاح السري لا يغادر السيرفر؛ المتصفح يستلم فقط `clientSecret` لعملية واحدة.
- تحقق HMAC-SHA512 على كل Webhook وكل عودة من صفحة الدفع، بمقارنة زمنية آمنة (`timingSafeEqual`).
- التحقق من المبلغ والباب على السيرفر من كتالوج مشترك (`lib/donation-causes.json`)، وليس من قيمة المتصفح.
- رفض الطلبات من أصل مختلف (Origin/Referer).
- Honeypot ضد البوتات + Rate limit لكل IP.
- عدم قبول الدفع إذا فشل تسجيل السجل (fail-closed).
- Idempotency: المرجع `AKH-YYYYMMDD-XXXXXX` مفتاح فريد في الورقة.
- عدم تسجيل بيانات البطاقة أو أي سر في الـ logs.
- رؤوس `no-store` لكل مسارات API.

### ما لا يفعله النظام
- لا يخزّن أرقام البطاقات (Paymob يستضيف الصفحة).
- لا يدعم التبرع المتكرر في هذا الإصدار.
- لا يرسل إيصالات بريدية تلقائية بعد؛ الإيصال الرسمي يُصدر يدوياً من الجمعية حالياً.

---

## 11. استكشاف الأخطاء

| العرض | السبب المحتمل | الحل |
|---|---|---|
| الزر معطّل ورسالة «الدفع قيد التفعيل» | `enabled:false` من `/config` | راجع `health` — غالباً `SHEETS_*` أو `PAYMOB_*` ناقص |
| `intention_failed` 502 | مفتاح/Integration ID خطأ أو وضع مختلف | شغّل `npm run check:paymob` وتأكد من تطابق test/live |
| `storage_failed` 503 | Apps Script لا يستجيب أو السر خطأ | افتح رابط `/exec?token=...` وتحقق من `SHEETS_WEBHOOK_SECRET` |
| Webhook 401 | HMAC Secret مختلف | انسخه من جديد من لوحة Paymob |
| Webhook 503 | فشل الكتابة في الورقة | راجع Apps Script Executions، ثم أعد إرسال الـ Webhook من اللوحة |
| صفحة العودة «تعذر التحقق» | `PAYMOB_HMAC_SECRET` خطأ أو الدومين مختلف | تأكد أن العودة إلى نفس الدومين المضبوط في `SITE_URL` |
| السجل `pending` لا يتحدث | Webhook لم يصل | تحقق من Logs، ثم يعوّضه `verify` عند عودة المتبرع |

---

## 12. ملفات ذات صلة

```
api/donations/{config,create,webhook,verify,health}.js
lib/paymob.js                 عميل Intention + HMAC
lib/sheets.js                 عميل Apps Script
lib/causes.js                 منطق المبالغ والكتالوج
lib/http.js                   تحقق، Rate limit، أدوات HTTP
lib/donation-causes.json      الكتالوج المشترك (واجهة + سيرفر)
google-apps-script/Code.gs    بوابة Google Sheets
scripts/paymob-check.mjs      فحص الإعدادات
scripts/test-payment.mjs      اختبارات بدون إنترنت
src/pages/donations.mjs       واجهة التبرع
assets/js/site.js             منطق الدفع في المتصفح
```

---

© جمعية أخوين الخيرية — للاستفسارات التقنية: البريد الرسمي للجمعية.
