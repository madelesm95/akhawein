import { html, raw } from '../lib/html.mjs';
import { pageHero, icon, img, copyValue, publishableIban, button } from '../lib/components.mjs';
import { banks } from '../content/accounts.mjs';
import { site, ui } from '../content/site.mjs';

const T = {
  title: { ar: 'وسائل التبرع', en: 'How to donate' },
  description: {
    ar: 'الحسابات البنكية الرسمية لجمعية أخوين الخيرية لدى بنك مصر: الحساب العام وحسابات الإطعام والشنط الغذائية وصك الأضحية وتجهيز العرائس والغسيل الكلوي.',
    en: 'Akhawein Charity’s official Banque Misr accounts: general donations, hot meals, food parcels, udhiyah, bridal preparation and dialysis.',
  },
  eyebrow: { ar: 'عطاء يدوم وأجر لا ينقطع', en: 'Giving that lasts' },
  heroTitle: { ar: 'حسابات التبرع الرسمية', en: 'Official donation accounts' },
  heroLead: {
    ar: 'تبرّع بسهولة وأمان عبر حسابات الجمعية المعتمدة لدى بنك مصر، واختر الحساب المخصص للغرض الذي تحب أن تدعمه.',
    en: 'Give simply and securely through our approved Banque Misr accounts, and choose the account for the purpose you want to support.',
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

export default function donations(ctx) {
  const receiptMsg = ctx.lang === 'ar' ? 'السلام عليكم، أود إرسال إيصال تحويل تبرع لجمعية أخوين الخيرية' : 'Hello, I would like to send the receipt for my donation to Akhawein Charity';
  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'meal-box' })}

<section class="section section--tight">
  <div class="container">
    <ol class="steps">
      ${T.steps.map((s, i) => html`<li class="step reveal"><span class="step__num">${ctx.num(i + 1)}</span><h2>${ctx.t(s.title)}</h2><p>${ctx.t(s.text)}</p></li>`)}
    </ol>
  </div>
</section>

<section class="section section--tint" aria-label="${ctx.t(T.heroTitle)}">
  <div class="container">
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
</section>`;
  return { title: T.title, description: T.description, body };
}
