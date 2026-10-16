import { html, attrs } from '../lib/html.mjs';
import { pageHero, icon, button, telHref, phoneDisplay } from '../lib/components.mjs';
import { site, ui } from '../content/site.mjs';
import { branches } from '../content/branches.mjs';

const T = {
  title: { ar: 'تواصل معنا', en: 'Contact us' },
  description: {
    ar: 'تواصل مع جمعية أخوين الخيرية: المقر الرئيسي ٢٤ عمارات العبور – طريق صلاح سالم، القاهرة. هاتف وواتساب ٠١٢٨١٧٦٩٦٨٥، والبريد info@akhawein.org.',
    en: 'Contact Akhawein Charity: head office at 24 Al-Obour Buildings, Salah Salem Road, Cairo. Phone and WhatsApp +20 128 176 9685, email info@akhawein.org.',
  },
  eyebrow: { ar: 'يسعدنا تواصلكم', en: 'We would love to hear from you' },
  heroTitle: { ar: 'تواصل معنا', en: 'Get in touch' },
  heroLead: {
    ar: 'فريق الجمعية في خدمتكم للإجابة عن الاستفسارات، واستقبال التبرعات، وطلبات التطوع والمساعدة.',
    en: 'Our team is here to answer questions and to welcome donations, volunteers and requests for help.',
  },
  hq: { ar: 'المقر الرئيسي', en: 'Head office' },
  phone: { ar: 'الهاتف وواتساب', en: 'Phone and WhatsApp' },
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  hours: { ar: 'مواعيد العمل', en: 'Opening hours' },
  formTitle: { ar: 'أرسل لنا رسالة', en: 'Send us a message' },
  formLead: { ar: 'املأ النموذج وسيتواصل معك فريقنا في أقرب وقت.', en: 'Fill in the form and our team will get back to you soon.' },
  name: { ar: 'الاسم بالكامل', en: 'Full name' },
  phoneField: { ar: 'رقم الهاتف أو الواتساب', en: 'Phone or WhatsApp number' },
  emailField: { ar: 'البريد الإلكتروني (اختياري)', en: 'Email (optional)' },
  type: { ar: 'نوع الطلب', en: 'Type of request' },
  types: [
    { v: 'donation', ar: 'استفسار عن التبرع وطرق الدفع', en: 'Question about donating' },
    { v: 'volunteer', ar: 'الرغبة في التطوع مع الجمعية', en: 'I would like to volunteer' },
    { v: 'help', ar: 'طلب مساعدة أو حالة إنسانية', en: 'Request for help' },
    { v: 'training', ar: 'استفسار عن الفروع والتدريب', en: 'Branches and training' },
    { v: 'partnership', ar: 'شراكة مؤسسية أو بروتوكول تعاون', en: 'Partnership or protocol' },
  ],
  message: { ar: 'رسالتك أو تفاصيل الحالة', en: 'Your message' },
  send: { ar: 'إرسال الرسالة', en: 'Send message' },
  sending: { ar: 'جارٍ الإرسال…', en: 'Sending…' },
  success: { ar: 'تم إرسال رسالتك بنجاح، شكراً لتواصلك.', en: 'Thank you — your message has been sent.' },
  fallback: { ar: 'تعذّر الإرسال بالبريد الآن. يمكنك إرسال رسالتك مباشرة عبر واتساب:', en: 'We couldn’t send your message by email just now. You can send it straight to us on WhatsApp:' },
  fallbackLink: { ar: 'إرسال عبر واتساب', en: 'Send on WhatsApp' },
  note: { ar: 'نستخدم بياناتك للرد على رسالتك فقط.', en: 'We only use your details to reply to your message.' },
  subject: { ar: 'رسالة من موقع جمعية أخوين', en: 'Message from the Akhawein website' },
  branchesTitle: { ar: 'لدينا ٧ فروع ومراكز', en: 'We have 7 branches' },
  branchesText: { ar: 'في القاهرة الكبرى والشرقية والقليوبية. اعثر على أقرب فرع إليك.', en: 'Across Greater Cairo, Sharqia and Qalyubia. Find the one nearest you.' },
  branchesBtn: { ar: 'عناوين الفروع', en: 'Find a branch' },
  mapTitle: { ar: 'خريطة المقر الرئيسي', en: 'Map of the head office' },
};

export default function contactPage(ctx) {
  const mapQuery = encodeURIComponent('24 عمارات العبور شارع صلاح سالم القاهرة');
  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'volunteers-walk' })}
<section class="section">
  <div class="container contact-grid">
    <div class="contact-cards">
      <div class="contact-card">${icon(ctx, 'map-pin')}<div><h2>${ctx.t(T.hq)}</h2><p>${ctx.t(site.address)}</p><a class="link-arrow" href="${site.mapsUrl}" target="_blank" rel="noopener">${ctx.t(ui.directions)}${icon(ctx, 'arrow-right')}</a></div></div>
      <div class="contact-card">${icon(ctx, 'phone')}<div><h2>${ctx.t(T.phone)}</h2><a href="${telHref(site.phone)}" dir="ltr">${phoneDisplay(site.phone)}</a><small><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${ctx.t(ui.chatWhatsapp)}</a></small></div></div>
      <div class="contact-card">${icon(ctx, 'mail')}<div><h2>${ctx.t(T.email)}</h2><a href="mailto:${site.email}">${site.email}</a></div></div>
      <div class="contact-card">${icon(ctx, 'clock')}<div><h2>${ctx.t(T.hours)}</h2><p>${ctx.t(site.hours)}</p></div></div>
      <div class="contact-card contact-card--branches">${icon(ctx, 'building-2')}<div><h2>${ctx.t(T.branchesTitle)}</h2><p class="contact-card__plain">${ctx.t(T.branchesText)}</p><a class="link-arrow" href="${ctx.url('branches')}">${ctx.t(T.branchesBtn)}${icon(ctx, 'arrow-right')}</a></div></div>
    </div>
    <form class="form-card" data-contact-form novalidate${attrs({
      'data-email': site.email,
      'data-whatsapp': site.whatsapp,
      'data-sending': ctx.t(T.sending),
      'data-success': ctx.t(T.success),
      'data-fallback': ctx.t(T.fallback),
      'data-fallback-link': ctx.t(T.fallbackLink),
      'data-subject': ctx.t(T.subject),
      'data-l-name': ctx.t(T.name),
      'data-l-phone': ctx.t(T.phoneField),
      'data-l-email': ctx.t(T.email),
      'data-l-type': ctx.t(T.type),
      'data-l-message': ctx.t(T.message),
    })}>
      <h2>${ctx.t(T.formTitle)}</h2>
      <p>${ctx.t(T.formLead)}</p>
      <div class="form-grid">
        <div class="field"><label for="f-name">${ctx.t(T.name)} <span class="req" aria-hidden="true">*</span></label><input id="f-name" name="name" type="text" required maxlength="100" autocomplete="name"></div>
        <div class="field"><label for="f-phone">${ctx.t(T.phoneField)} <span class="req" aria-hidden="true">*</span></label><input id="f-phone" name="phone" type="tel" required maxlength="25" autocomplete="tel" dir="ltr" inputmode="tel" pattern="[0-9\u0660-\u0669+\\(\\)\\s\\-]{7,25}"></div>
        <div class="field"><label for="f-email">${ctx.t(T.emailField)}</label><input id="f-email" name="email" type="email" maxlength="100" autocomplete="email" dir="ltr"></div>
        <div class="field"><label for="f-type">${ctx.t(T.type)}</label><select id="f-type" name="type">${T.types.map((o) => html`<option value="${o.v}">${o[ctx.lang]}</option>`)}</select></div>
        <div class="field field--full"><label for="f-message">${ctx.t(T.message)} <span class="req" aria-hidden="true">*</span></label><textarea id="f-message" name="message" required maxlength="3000"></textarea></div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn--primary btn--lg">${icon(ctx, 'send')}<span>${ctx.t(T.send)}</span></button>
        <p class="form-status" data-form-status role="status" aria-live="polite"></p>
      </div>
      <p class="form-note">${ctx.t(T.note)}</p>
    </form>
  </div>
</section>
<section class="section section--tight section--tint">
  <div class="container">
    <div class="map-embed">
      <iframe title="${ctx.t(T.mapTitle)}" src="https://maps.google.com/maps?q=${mapQuery}&t=m&z=15&output=embed&hl=${ctx.lang}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
