import { readFileSync } from 'node:fs';
import { html, raw } from '../lib/html.mjs';
import { pageHero, icon, img, copyValue, publishableIban, button } from '../lib/components.mjs';
import { banks } from '../content/accounts.mjs';
import { site, ui } from '../content/site.mjs';

const donationConfig = JSON.parse(readFileSync(new URL('../../lib/donation-causes.json', import.meta.url), 'utf8'));

const T = {
  title: { ar: 'وسائل التبرع', en: 'How to donate' },
  description: {
    ar: 'تبرّع أونلاين بالبطاقة أو المحفظة أو فوري، أو عبر الحسابات البنكية الرسمية لجمعية أخوين الخيرية لدى بنك مصر: الحساب العام وحسابات الإطعام والشنط الغذائية وصك الأضحية وتجهيز العرائس والغسيل الكلوي.',
    en: 'Donate online by card, mobile wallet or Fawry, or through Akhawein Charity’s official Banque Misr accounts: general donations, meals, food parcels, udhiyah, bridal preparation and dialysis.',
  },
  eyebrow: { ar: 'عطاء يدوم وأجر لا ينقطع', en: 'Giving that lasts' },
  heroTitle: { ar: 'تبرّع الآن — بسهولة وأمان', en: 'Donate now — simply and securely' },
  heroLead: {
    ar: 'اختر الباب والمبلغ، وأتمّ تبرعك في أقل من دقيقة بالبطاقة أو المحفظة الإلكترونية أو فوري، أو حوّل عبر حسابات الجمعية المعتمدة لدى بنك مصر.',
    en: 'Choose a cause and an amount and complete your gift in under a minute by card, mobile wallet or Fawry — or transfer to our approved Banque Misr accounts.',
  },

  onlineEyebrow: { ar: 'تبرع إلكتروني آمن', en: 'Secure online giving' },
  onlineTitle: { ar: 'تبرّع في أقل من دقيقة', en: 'Give in under a minute' },
  onlineLead: {
    ar: 'كل تبرع يُسجَّل بإيصال رسمي ويُوجَّه إلى الباب الذي تختاره. بيانات بطاقتك لا تمر على خوادم الجمعية إطلاقاً.',
    en: 'Every gift is recorded with an official receipt and routed to the cause you choose. Your card details never touch our servers.',
  },

  causeLegend: { ar: 'اختر باب التبرع', en: 'Choose a cause' },
  amountLegend: { ar: 'حدّد المبلغ', en: 'Choose an amount' },
  amountOther: { ar: 'أو اكتب مبلغاً آخر', en: 'Or enter another amount' },
  amountHint: {
    ar: `الحد الأدنى ${donationConfig.minAmount} جنيهات، والحد الأقصى ${donationConfig.maxAmount.toLocaleString('en-US')} جنيه.`,
    en: `Minimum EGP ${donationConfig.minAmount}, maximum EGP ${donationConfig.maxAmount.toLocaleString('en-US')}.`,
  },
  egp: { ar: 'جنيه مصري', en: 'EGP' },
  detailsLegend: { ar: 'بياناتك', en: 'Your details' },
  firstName: { ar: 'الاسم الأول', en: 'First name' },
  lastName: { ar: 'اسم العائلة', en: 'Last name' },
  phone: { ar: 'رقم الموبايل', en: 'Mobile number' },
  phoneHint: { ar: 'مثال: 01012345678', en: 'e.g. 01012345678' },
  email: { ar: 'البريد الإلكتروني', en: 'Email address' },
  emailOptional: { ar: 'اختياري — لإرسال الإيصال', en: 'Optional — for your receipt' },
  message: { ar: 'إهداء أو ملاحظة', en: 'Dedication or note' },
  messageOptional: { ar: 'اختياري — يظهر في السجل الداخلي فقط', en: 'Optional — stored on the internal record only' },
  anonymous: { ar: 'أفضّل عدم ذكر اسمي علناً', en: 'Hide my name from public mentions' },
  anonymousHint: { ar: 'يظل اسمك مسجلاً بشكل خاص لإصدار الإيصال الرسمي.', en: 'Your name is still recorded privately for the official receipt.' },
  summaryLabel: { ar: 'إجمالي التبرع', en: 'Total donation' },
  summaryNote: {
    ar: 'سيتم تحويلك إلى صفحة Paymob الآمنة لإتمام الدفع. الجمعية لا ترى بيانات بطاقتك ولا تحتفظ بها.',
    en: 'You will be redirected to Paymob’s secure page to complete the payment. The charity never sees or stores your card details.',
  },
  pay: { ar: 'تبرّع الآن', en: 'Donate now' },
  secure: { ar: 'مؤمّن بواسطة Paymob · 3-D Secure · PCI DSS', en: 'Secured by Paymob · 3-D Secure · PCI DSS' },
  terms: {
    ar: 'بالمتابعة أنت توافق على تسجيل بيانات التبرع لأغراض الإيصال والمطابقة المالية.',
    en: 'By continuing you agree to your donation details being recorded for receipt and financial reconciliation.',
  },
  requiredNote: { ar: 'الحقول المعلّمة بـ * مطلوبة.', en: 'Fields marked * are required.' },

  methodsTitle: { ar: 'طرق الدفع المتاحة', en: 'Payment methods' },
  methods: [
    { icon: 'credit-card', label: { ar: 'فيزا / ماستركارد / ميزة', en: 'Visa / Mastercard / Meeza' }, note: { ar: 'محمية بـ 3-D Secure', en: '3-D Secure protected' } },
    { icon: 'smartphone', label: { ar: 'المحافظ الإلكترونية', en: 'Mobile wallets' }, note: { ar: 'فودافون كاش وأورنج كاش وغيرها', en: 'Vodafone Cash, Orange Cash and more' } },
    { icon: 'store', label: { ar: 'فوري والكشك', en: 'Fawry & kiosks' }, note: { ar: 'ادفع نقداً من أقرب منفذ', en: 'Pay cash at a nearby outlet' } },
    { icon: 'calendar', label: { ar: 'التقسيط', en: 'Installments' }, note: { ar: 'حسب المتاح في حساب الجمعية', en: 'Subject to availability' } },
  ],
  methodsNote: {
    ar: 'تظهر الطرق المتاحة لحساب الجمعية في صفحة الدفع الآمنة. وإذا اخترت فوري، احتفظ بالرقم المرجعي لمتابعة الدفع.',
    en: 'The methods enabled for the charity’s account are shown on the secure checkout page. If you choose Fawry, keep the reference to track your payment.',
  },

  trustTitle: { ar: 'تبرعك في أيدٍ أمينة', en: 'Your gift is in safe hands' },
  trust: [
    { icon: 'lock', text: { ar: 'بيانات البطاقة لا تمر على خوادم الجمعية.', en: 'Card data never touches the charity’s servers.' } },
    { icon: 'shield-check', text: { ar: 'كل عملية دفع يُتحقق منها بتوقيع Paymob المشفّر.', en: 'Every payment is verified with a signed Paymob webhook.' } },
    { icon: 'receipt-text', text: { ar: 'إيصال رسمي يُسجَّل لكل تبرع.', en: 'An official record is kept for every donation.' } },
  ],
  helpTitle: { ar: 'محتاج مساعدة؟', en: 'Need help?' },
  helpText: { ar: 'كلّمنا على واتساب وفريق الجمعية يساعدك في إتمام تبرعك.', en: 'Message us on WhatsApp and our team will help you complete your gift.' },
  helpBtn: { ar: 'تواصل على واتساب', en: 'Chat on WhatsApp' },

  orBank: { ar: 'أو تبرّع عبر الحسابات البنكية', en: 'Or donate by bank transfer' },
  bankTitle: { ar: 'الحسابات الرسمية للجمعية', en: 'The charity’s official accounts' },
  bankLead: {
    ar: 'حوّل من تطبيق بنكك أو من أي فرع لبنك مصر، ثم أرسل لنا صورة الإيصال على واتساب.',
    en: 'Transfer from your banking app or any Banque Misr branch, then send us a photo of the receipt on WhatsApp.',
  },

  steps: [
    { title: { ar: 'اختر الحساب', en: 'Choose an account' }, text: { ar: 'الحساب العام لأي غرض، أو حساب مخصص لباب بعينه.', en: 'Use the general account for any purpose, or a dedicated account for a specific cause.' } },
    { title: { ar: 'حوّل أو أودع', en: 'Transfer or deposit' }, text: { ar: 'من تطبيق بنكك أو أي فرع لبنك مصر، بالجنيه المصري.', en: 'From your banking app or any Banque Misr branch, in Egyptian pounds.' } },
    { title: { ar: 'أرسل الإيصال', en: 'Send the receipt' }, text: { ar: 'صوّر الإيصال وأرسله على واتساب لنسجّل تبرعك ونرسل لك إيصالاً رسمياً.', en: 'Send a photo of the receipt on WhatsApp so we can record your gift and send an official receipt.' } },
  ],
  currency: { ar: 'العملة', en: 'Currency' },
  holder: { ar: 'اسم المستفيد', en: 'Beneficiary' },
  primary: { ar: 'الحساب الرئيسي', en: 'Main account' },
  ibanNote: {
    ar: '<strong>للتحويل من خارج مصر:</strong> استخدم رقم الآيبان (IBAN) المعروض مع الحساب. وإن لم يظهر آيبان لحساب ما، فاستخدم الحساب العام أو تواصل معنا.',
    en: '<strong>Transferring from abroad?</strong> Use the IBAN shown with the account. If an account shows no IBAN, please use the general account or contact us.',
  },
  safety: {
    ar: '<strong>للأمان:</strong> تبرّع فقط عبر الحسابات المعلنة على هذه الصفحة باسم جمعية أخوين الخيرية، وتأكد من الرقم قبل التحويل.',
    en: '<strong>Stay safe:</strong> only donate to the accounts listed on this page in the name of Akhawein Charity, and double-check the number before you transfer.',
  },
  receiptTitle: { ar: 'بعد التحويل أو الإيداع', en: 'After you transfer' },
  receiptText: { ar: 'أرسل لنا صورة إيصال التحويل على واتساب، لنسجّل تبرعك ونرسل لك الإيصال الرسمي.', en: 'Send us a photo of your transfer receipt on WhatsApp so we can record your gift and send you an official receipt.' },
  receiptBtn: { ar: 'إرسال الإيصال على واتساب', en: 'Send receipt on WhatsApp' },
};

const accountIcon = { general: 'heart-handshake', aftercare: 'house-heart', meals: 'utensils', 'food-parcels': 'shopping-basket', udhiyah: 'gift', dialysis: 'activity', brides: 'sparkles' };

const donateI18n = {
  pay: { ar: 'تبرّع الآن', en: 'Donate now' },
  verifying: { ar: 'جارٍ التحقق من عملية الدفع…', en: 'Verifying your payment…' },
  loading: { ar: 'جارٍ تجهيز الدفع الآمن…', en: 'Preparing secure checkout…' },
  redirecting: { ar: 'جارٍ تحويلك إلى صفحة الدفع الآمنة…', en: 'Redirecting you to the secure payment page…' },
  notConfigured: {
    ar: 'الدفع الإلكتروني قيد التفعيل حالياً. يمكنك التبرع عبر الحسابات البنكية الرسمية بالأسفل.',
    en: 'Online payment is being activated. Please donate through the official bank accounts below.',
  },
  configError: {
    ar: 'تعذر تحميل خدمة الدفع. حدّث الصفحة أو تبرع عبر الحسابات البنكية بالأسفل.',
    en: 'Could not load the payment service. Refresh the page or donate through the bank accounts below.',
  },
  required: { ar: 'يرجى استكمال الحقول المطلوبة.', en: 'Please complete the required fields.' },
  amountInvalid: { ar: `أدخل مبلغاً بين ${donationConfig.minAmount} و${donationConfig.maxAmount.toLocaleString('en-US')} جنيه.`, en: `Enter an amount between EGP ${donationConfig.minAmount} and EGP ${donationConfig.maxAmount.toLocaleString('en-US')}.` },
  phoneInvalid: { ar: 'أدخل رقم موبايل مصري صحيح، مثال: 01012345678.', en: 'Enter a valid Egyptian mobile number, e.g. 01012345678.' },
  emailInvalid: { ar: 'أدخل بريداً إلكترونياً صحيحاً أو اتركه فارغاً.', en: 'Enter a valid email address or leave it empty.' },
  offline: { ar: 'تعذر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.', en: 'Connection problem. Check your internet and try again.' },
  serverError: { ar: 'حدث خطأ غير متوقع. حاول مرة أخرى أو تبرع عبر الحسابات البنكية.', en: 'Something went wrong. Try again or use a bank transfer.' },
  successTitle: { ar: 'تقبّل الله منك', en: 'May Allah accept your giving' },
  successText: { ar: 'تم استلام تبرعك بنجاح. احتفظ بالرقم المرجعي أدناه للمتابعة.', en: 'Your donation was received successfully. Keep the reference below for follow-up.' },
  pendingTitle: { ar: 'الدفع قيد التأكيد', en: 'Payment under review' },
  pendingText: { ar: 'ما زال Paymob يؤكد العملية. سنسجّلها فور اكتمالها، فاحتفظ بالرقم المرجعي.', en: 'Paymob is still confirming this payment. We will record it as soon as it clears; keep your reference.' },
  failedTitle: { ar: 'لم تكتمل عملية الدفع', en: 'The payment did not complete' },
  failedText: { ar: 'لم يُخصم أي مبلغ. يمكنك المحاولة مرة أخرى أو استخدام الحساب البنكي.', en: 'No amount was deducted. You can try again or use a bank transfer.' },
  verifyErrorTitle: { ar: 'تعذر التحقق من عملية الدفع', en: 'We could not verify this payment' },
  verifyErrorText: { ar: 'إذا تم خصم المبلغ، تواصل معنا على واتساب مع الرقم المرجعي وسنطابقه يدوياً.', en: 'If you were charged, contact us on WhatsApp with the reference and we will reconcile it manually.' },
  reference: { ar: 'الرقم المرجعي', en: 'Reference' },
  amount: { ar: 'المبلغ', en: 'Amount' },
  cause: { ar: 'الباب', en: 'Cause' },
  retry: { ar: 'المحاولة مرة أخرى', en: 'Try again' },
  again: { ar: 'تبرع مرة أخرى', en: 'Donate again' },
  chat: { ar: 'تواصل على واتساب', en: 'Chat on WhatsApp' },
  egp: { ar: 'ج.م', en: 'EGP' },
  step: { ar: 'خطوة', en: 'Step' },
  close: { ar: 'إغلاق', en: 'Close' },
};

function fmtAmount(n) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export default function donations(ctx) {
  // These icons are injected by the client-side checkout result panel.
  ['circle-check', 'clock', 'triangle-alert'].forEach((name) => ctx.usedIcons.add(name));
  const receiptMsg = ctx.lang === 'ar' ? 'السلام عليكم، أود إرسال إيصال تحويل تبرع لجمعية أخوين الخيرية' : 'Hello, I would like to send the receipt for my donation to Akhawein Charity';
  const helpMsg = ctx.lang === 'ar' ? 'السلام عليكم، أحتاج مساعدة في التبرع الإلكتروني لجمعية أخوين الخيرية' : 'Hello, I need help with an online donation to Akhawein Charity';
  const defaultCause = donationConfig.causes.find((c) => c.default) || donationConfig.causes[0];
  const waHelp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(helpMsg)}`;

  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'meal-box' })}

<section class="section section--tight donate-section" id="donate-online" aria-labelledby="donate-online-title">
  <div class="container">
    <div class="donate-result" data-donate-result hidden aria-live="polite">
      <span class="donate-result__icon" data-result-icon></span>
      <h2 data-result-title></h2>
      <p data-result-text></p>
      <dl class="donate-result__meta" data-result-meta hidden>
        <div><dt>${ctx.t(donateI18n.amount)}</dt><dd data-result-amount></dd></div>
        <div><dt>${ctx.t(donateI18n.cause)}</dt><dd data-result-cause></dd></div>
        <div><dt>${ctx.t(donateI18n.reference)}</dt><dd data-result-reference dir="ltr"></dd></div>
      </dl>
      <div class="donate-result__actions">
        <button type="button" class="btn btn--primary" data-result-retry hidden>${ctx.t(donateI18n.retry)}</button>
        <a class="btn btn--whatsapp" href="${waHelp}" target="_blank" rel="noopener" data-result-help hidden>${icon(ctx, 'brand-whatsapp')}<span>${ctx.t(donateI18n.chat)}</span></a>
      </div>
    </div>

    <div class="donate-grid" data-donate-grid>
      <form class="donate-form" data-donate-form novalidate>
        <header class="donate-form__head">
          <p class="eyebrow">${ctx.t(T.onlineEyebrow)}</p>
          <h2 id="donate-online-title">${ctx.t(T.onlineTitle)}</h2>
          <p>${ctx.t(T.onlineLead)}</p>
        </header>

        <fieldset class="donate-step">
          <legend><span class="donate-step__num">${ctx.num(1)}</span>${ctx.t(T.causeLegend)}</legend>
          <div class="cause-picker">
            ${donationConfig.causes.map((c) => html`<label class="cause-option">
              <input type="radio" name="cause" value="${c.id}"${c.id === defaultCause.id ? raw(' checked') : ''}>
              <span class="cause-option__icon">${icon(ctx, c.icon)}</span>
              <span class="cause-option__text"><strong>${ctx.t(c.label)}</strong><small>${ctx.t(c.desc)}</small></span>
              <span class="cause-option__check">${icon(ctx, 'check')}</span>
            </label>`)}
          </div>
        </fieldset>

        <fieldset class="donate-step">
          <legend><span class="donate-step__num">${ctx.num(2)}</span>${ctx.t(T.amountLegend)}</legend>
          <div class="amount-presets" role="group" aria-label="${ctx.t(T.amountLegend)}">
            ${donationConfig.suggested.map((amount, i) => html`<button type="button" class="amount-preset${i === 2 ? ' is-active' : ''}" data-amount="${amount}" aria-pressed="${i === 2 ? 'true' : 'false'}">
              <span>${ctx.num(amount)}</span><small>${ctx.t(T.egp)}</small>
            </button>`)}
          </div>
          <div class="amount-custom">
            <label for="donate-amount">${ctx.t(T.amountOther)}</label>
            <div class="amount-input">
              <input id="donate-amount" name="amount" type="text" inputmode="decimal" autocomplete="off" value="${donationConfig.suggested[2]}" aria-describedby="donate-amount-hint" required>
              <span>${ctx.t(T.egp)}</span>
            </div>
            <p id="donate-amount-hint" class="donate-hint">${ctx.t(T.amountHint)}</p>
          </div>
        </fieldset>

        <fieldset class="donate-step">
          <legend><span class="donate-step__num">${ctx.num(3)}</span>${ctx.t(T.detailsLegend)}</legend>
          <p class="donate-hint donate-hint--top">${ctx.t(T.requiredNote)}</p>
          <div class="form-grid">
            <div class="field">
              <label for="donate-first">${ctx.t(T.firstName)} <span class="req">*</span></label>
              <input id="donate-first" name="firstName" type="text" autocomplete="given-name" minlength="2" maxlength="60" required>
            </div>
            <div class="field">
              <label for="donate-last">${ctx.t(T.lastName)} <span class="req">*</span></label>
              <input id="donate-last" name="lastName" type="text" autocomplete="family-name" minlength="2" maxlength="60" required>
            </div>
            <div class="field">
              <label for="donate-phone">${ctx.t(T.phone)} <span class="req">*</span></label>
              <input id="donate-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="01012345678" aria-describedby="donate-phone-hint" required>
              <small id="donate-phone-hint" class="donate-hint">${ctx.t(T.phoneHint)}</small>
            </div>
            <div class="field">
              <label for="donate-email">${ctx.t(T.email)} <span class="donate-hint-inline">${ctx.t(T.emailOptional)}</span></label>
              <input id="donate-email" name="email" type="email" autocomplete="email" dir="ltr" maxlength="160">
            </div>
            <div class="field field--full">
              <label for="donate-message">${ctx.t(T.message)} <span class="donate-hint-inline">${ctx.t(T.messageOptional)}</span></label>
              <textarea id="donate-message" name="message" rows="2" maxlength="300" data-donate-message></textarea>
              <small class="donate-counter" data-donate-counter>0 / 300</small>
            </div>
          </div>
          <label class="checkline">
            <input type="checkbox" name="anonymous" value="true">
            <span><strong>${ctx.t(T.anonymous)}</strong><small>${ctx.t(T.anonymousHint)}</small></span>
          </label>
          <div class="donate-hp" aria-hidden="true">
            <label for="donate-company">Company</label>
            <input id="donate-company" name="company" type="text" tabindex="-1" autocomplete="off">
          </div>
        </fieldset>

        <div class="donate-summary">
          <div class="donate-summary__total">
            <span>${ctx.t(T.summaryLabel)}</span>
            <strong data-donate-total>${ctx.num(500)} ${ctx.t(T.egp)}</strong>
          </div>
          <p>${ctx.t(T.summaryNote)}</p>
        </div>

        <button type="submit" class="btn btn--primary btn--lg btn--block donate-submit" data-donate-submit disabled>
          ${icon(ctx, 'lock')}<span data-donate-submit-label>${ctx.t(T.pay)}</span>
        </button>

        <p class="donate-status" data-donate-status role="status" aria-live="polite"></p>
        <p class="donate-secure">${icon(ctx, 'shield-check')}<span>${ctx.t(T.secure)}</span></p>
        <p class="donate-terms">${ctx.t(T.terms)}</p>
      </form>

      <aside class="donate-aside" aria-label="${ctx.t(T.methodsTitle)}">
        <div class="donate-panel">
          <h3>${ctx.t(T.methodsTitle)}</h3>
          <ul class="method-list">
            ${T.methods.map((m) => html`<li><span class="method-list__icon">${icon(ctx, m.icon)}</span><span><strong>${ctx.t(m.label)}</strong><small>${ctx.t(m.note)}</small></span></li>`)}
          </ul>
          <p class="donate-hint">${ctx.t(T.methodsNote)}</p>
        </div>

        <div class="donate-panel donate-panel--trust">
          <h3>${icon(ctx, 'shield-check')}<span>${ctx.t(T.trustTitle)}</span></h3>
          <ul class="trust-list">
            ${T.trust.map((t) => html`<li>${icon(ctx, t.icon)}<span>${ctx.t(t.text)}</span></li>`)}
          </ul>
        </div>

        <div class="donate-panel donate-panel--help">
          <h3>${ctx.t(T.helpTitle)}</h3>
          <p>${ctx.t(T.helpText)}</p>
          ${button(ctx, { href: waHelp, label: T.helpBtn, iconName: 'brand-whatsapp', variant: 'whatsapp', size: 'sm', external: true })}
        </div>

        <div class="donate-panel donate-panel--bank">
          <h3>${icon(ctx, 'landmark')}<span>${ctx.t(T.orBank)}</span></h3>
          <p>${ctx.t(T.bankLead)}</p>
          <a class="link-arrow" href="#bank-accounts">${ctx.t(T.bankTitle)}${icon(ctx, 'arrow-right')}</a>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--tint" id="bank-accounts" aria-labelledby="bank-title">
  <div class="container">
    <header class="section-head">
      <div class="section-head__text">
        <p class="eyebrow">${ctx.t(T.orBank)}</p>
        <h2 class="section-title" id="bank-title">${ctx.t(T.bankTitle)}</h2>
        <p class="lead">${ctx.t(T.bankLead)}</p>
      </div>
    </header>
    <ol class="steps">
      ${T.steps.map((s, i) => html`<li class="step reveal"><span class="step__num">${ctx.num(i + 1)}</span><h2>${ctx.t(s.title)}</h2><p>${ctx.t(s.text)}</p></li>`)}
    </ol>
    <div class="bank-stack">
    ${banks.map((bank) => html`<article class="bank" id="${bank.id}">
      <header class="bank__head">
        <div class="bank__brand">
          <span class="bank__logo">${img(ctx, bank.logo, { alt: ctx.t(bank.name) })}</span>
          <h2 class="bank__name">${ctx.t(bank.name)}</h2>
        </div>
        <div class="bank__meta">
          <span class="pill">${icon(ctx, 'user')}${ctx.t(T.holder)}: ${ctx.t(bank.holder)}</span>
          <span class="pill">${icon(ctx, 'wallet')}${ctx.t(T.currency)}: ${ctx.t(bank.currency)}</span>
        </div>
      </header>
      <ul class="accounts">
        ${bank.accounts.map((a) => {
          const iban = publishableIban(a);
          return html`<li class="account" id="acc-${a.id}">
            <div class="account__purpose">
              ${icon(ctx, accountIcon[a.id] || 'landmark')}
              <div>
                <h3 class="account__title">${ctx.t(a.purpose)}${a.primary ? html`<span class="badge">${ctx.t(T.primary)}</span>` : ''}</h3>
                <p class="account__branch">${ctx.t(bank.name)} · ${ctx.t(a.branch)}</p>
                ${a.note ? html`<p class="account__note">${ctx.t(a.note)}</p>` : ''}
              </div>
            </div>
            <div class="account-details">
              ${copyValue(ctx, { label: ui.accountNo, value: a.number })}
              ${iban ? copyValue(ctx, { label: ui.iban, value: iban, kind: 'iban' }) : ''}
            </div>
          </li>`;
        })}
      </ul>
    </article>`)}
    </div>
    <div class="notices">
      <div class="notice">${icon(ctx, 'globe')}<p>${raw(ctx.t(T.ibanNote))}</p></div>
      <div class="notice">${icon(ctx, 'shield-check')}<p>${raw(ctx.t(T.safety))}</p></div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="receipt reveal">
      <div>
        <h2>${ctx.t(T.receiptTitle)}</h2>
        <p>${ctx.t(T.receiptText)}</p>
      </div>
      ${button(ctx, { href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(receiptMsg)}`, label: T.receiptBtn, iconName: 'brand-whatsapp', variant: 'whatsapp', size: 'lg', external: true })}
    </div>
  </div>
</section>

<script type="application/json" id="donation-i18n">${raw(JSON.stringify({
    lang: ctx.lang,
    minAmount: donationConfig.minAmount,
    maxAmount: donationConfig.maxAmount,
    currency: donationConfig.currency,
    causes: Object.fromEntries(donationConfig.causes.map((c) => [c.id, c.label])),
    strings: donateI18n,
  }).replace(/</g, '\\u003c'))}</script>`;

  return { title: T.title, description: T.description, body };
}
