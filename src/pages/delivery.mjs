import { html } from '../lib/html.mjs';
import { pageHero, icon, button } from '../lib/components.mjs';
import { site } from '../content/site.mjs';

const T = {
  title: { ar: 'سياسة التوصيل والشحن', en: 'Delivery & Shipping Policy' },
  description: {
    ar: 'جمعية أخوين الخيرية: لا نقدم خدمة توصيل أو شحن — لا توجد مبيعات إلكترونية ولا شحنات للمتبرعين. المساعدات تُسلَّم مباشرة للمستفيدين عبر فروعنا وفرقنا الميدانية.',
    en: 'Akhawein Charity: we offer no delivery or shipping service — no e-commerce sales and no shipments to donors. Aid is handed directly to beneficiaries through our branches and field teams.',
  },
  eyebrow: { ar: 'لا يوجد توصيل أو شحن', en: 'No delivery or shipping' },
  heroTitle: { ar: 'سياسة التوصيل والشحن', en: 'Delivery & Shipping Policy' },
  heroLead: {
    ar: 'جمعية أخوين الخيرية لا توصّل ولا تشحن: لا نبيع منتجات ولا نرسل طلبات، وتبرعاتكم ليست منتجات تُشحن.',
    en: 'Akhawein Charity offers no delivery or shipping: we do not sell products or ship orders, and your donations are not goods to be shipped.',
  },
  updated: { ar: 'آخر تحديث: ٨ نوفمبر ٢٠٢٦', en: 'Last updated: 8 November 2026' },
  contactTitle: { ar: 'استفسار عن التسليم', en: 'Ask about delivery' },
  relatedTitle: { ar: 'سياسات أخرى', en: 'Other policies' },
  related: [
    { key: 'privacy', ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    { key: 'refund', ar: 'سياسة الاسترداد والإلغاء', en: 'Refund & Cancellation Policy' },
    { key: 'causes', ar: 'حالات التبرع', en: 'Causes' },
    { key: 'donations', ar: 'وسائل التبرع', en: 'How to donate' },
  ],
  sections: [
    {
      h: { ar: '١. لا يوجد توصيل أو شحن', en: '1. We have no delivery or shipping' },
      p: [
        {
          ar: 'نحن جمعية خيرية، لا نقدم أي خدمة توصيل أو شحن. لا نبيع منتجات أو خدمات مدفوعة على موقعنا، ولا نرسل أي شحنات أو طرود إلى المتبرعين أو غيرهم، ولا تتوفر عندنا شركات شحن أو أرقام تتبع أو رسوم شحن.',
          en: 'We are a charity and offer no delivery or shipping service at all. We do not sell products or paid services on our website, we send no shipments or parcels to donors or anyone else, and we have no couriers, tracking numbers or shipping fees.',
        },
      ],
    },
    {
      h: { ar: '٢. لماذا لا ينطبق الشحن على نشاطنا؟', en: '2. Why shipping does not apply to us' },
      p: [
        {
          ar: 'تبرعاتكم هبات تطوعية بالجنيه المصري (EGP) تموّل برامج مساعدة، وليست عمليات شراء لمنتجات تُحفظ أو تُغلّف أو تُشحن. لذلك سياسة الشحن التجاري (رسوم شحن، مدة شحن، تتبع شحنة، استلام منتج) غير منطبقة على جمعية أخوين الخيرية.',
          en: 'Your donations are voluntary gifts in Egyptian Pounds (EGP) that fund aid programmes — they are not purchases of products to be packed or shipped. A commercial shipping policy (shipping fees, delivery time, shipment tracking, receiving an item) therefore does not apply to Akhawein Charity.',
        },
      ],
    },
    {
      h: { ar: '٣. كيف تصل المساعدات بدون شحن؟', en: '3. How aid reaches people without shipping' },
      p: [
        {
          ar: 'لا يتم شحن المساعدات بطرود بريدية. المساعدات تصل إلى الأسر المستفيدة مباشرة وبشكل شخصي عبر فروعنا وفرقنا الميدانية داخل مصر (القاهرة الكبرى، الشرقية، القليوبية، الفيوم): وجبات تُوزَّع يومياً، شنط شهرية، كفالات داخل الدور، وأجهزة وبطاطين تُسلَّم للمستفيدين بعد البحث والتوثيق. لا تسليم بالبريد ولا استلام عن بُعد.',
          en: 'Aid is never shipped as postal parcels. It reaches beneficiary families directly and in person through our branches and field teams inside Egypt (Greater Cairo, Sharqia, Qalyubia, Fayoum): daily meal distributions, monthly parcels, care inside homes, and devices or blankets handed to beneficiaries after assessment and documentation. There is no postal delivery or remote pickup.',
        },
      ],
    },
    {
      h: { ar: '٤. صك الأضحية — استلام بدون شحن', en: '4. Udhiyah share — pickup, not shipping' },
      p: [
        {
          ar: 'حصة المضحّي الشرعية (٩ كجم صافي) لا تُشحن بالبريد. يتم استلامها يقظةً في أيام عيد الأضحى وفق ترتيب الاستلام المعلن قبل العيد. لمعرفة مكان ووقت الاستلام تواصل معنا.',
          en: 'The donor’s udhiyah share (9 kg net) is not shipped by post. It is collected in person during Eid al-Adha under the collection arrangement announced before Eid. For the collection place and time, please contact us.',
        },
      ],
    },
    {
      h: { ar: '٥. رسوم وتتبع', en: '5. Fees and tracking' },
      list: [
        {
          ar: 'لا توجد رسوم توصيل أو شحن على أي تبرع، ولا على المستفيدين.',
          en: 'There are no delivery or shipping fees on any donation, and none for beneficiaries.',
        },
        {
          ar: 'لا يوجد رقم تتبع شحنة لأنه لا توجد شحنة. يمكنك متابعة حالة تبرعك بالرقم المرجعي أو رقم هاتفك الذي أدخلته.',
          en: 'There is no tracking number because there is no shipment. You can follow up on your donation with the reference number or phone number you entered.',
        },
      ],
    },
  ],
};

export default function deliveryPage(ctx) {
  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }] })}
<section class="section">
  <div class="container policy-layout">
    <div class="policy-content reveal">
      <p class="policy-updated">${ctx.t(T.updated)} · ${ctx.t(site.name)} · ${ctx.t(site.registration)}</p>
      <div class="notice" style="margin-bottom:1.5rem">${icon(ctx, 'info')}<p><strong>${ctx.t({ ar: 'نصيحة سريعة: لا يوجد توصيل.', en: 'In short: we have no delivery.' })}</strong> ${ctx.t({ ar: 'لا نشحن طلبات ولا نرسل طروداً؛ التوزيع يتم شخصياً عبر فروعنا وفرقنا الميدانية.', en: 'We ship no orders and send no parcels; distribution happens in person through our branches and field teams.' })}</p></div>
      ${T.sections.map((s) => html`
      <section class="policy-section">
        <h2>${ctx.t(s.h)}</h2>
        ${s.p ? s.p.map((para) => html`<p>${ctx.t(para)}</p>`) : ''}
        ${s.list ? html`<ul class="policy-list">${s.list.map((li) => html`<li>${ctx.t(li)}</li>`)}</ul>` : ''}
      </section>`)}
      <div class="policy-contact">
        <h2>${ctx.t(T.contactTitle)}</h2>
        <ul class="policy-list">
          <li><a href="tel:${site.phoneIntl}" dir="ltr">${site.phone}</a> · <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${ctx.t({ ar: 'واتساب', en: 'WhatsApp' })}</a> · <a href="mailto:${site.email}">${site.email}</a></li>
          <li>${ctx.t(site.address)}</li>
          <li>${ctx.t(site.hours)}</li>
        </ul>
      </div>
    </div>
    <aside class="policy-aside reveal" style="--reveal-delay: 120ms">
      <div class="policy-card">
        <h2>${ctx.t(T.relatedTitle)}</h2>
        <ul>${T.related.map((r) => html`<li><a href="${ctx.url(r.key)}">${ctx.t(r)}</a></li>`)}</ul>
      </div>
      <div class="policy-card policy-card--contact">
        <h2>${ctx.t(site.name)}</h2>
        <p>${ctx.t(site.addressShort)}</p>
        <p><a href="tel:${site.phoneIntl}" dir="ltr">${site.phone}</a></p>
        <p><a href="mailto:${site.email}">${site.email}</a></p>
        ${button(ctx, { href: ctx.url('contact'), label: { ar: 'تواصل معنا', en: 'Contact us' }, variant: 'primary', size: 'sm' })}
      </div>
    </aside>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
