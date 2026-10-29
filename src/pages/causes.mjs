import { html } from '../lib/html.mjs';
import { pageHero, icon, img, verse, button } from '../lib/components.mjs';
import { causeCard } from '../lib/cards.mjs';
import { causes, mealsVerse } from '../content/causes.mjs';
import { stories } from '../content/stories.mjs';
import { ui } from '../content/site.mjs';

const T = {
  title: { ar: 'حالات التبرع', en: 'Causes' },
  description: {
    ar: 'حالات ومشاريع التبرع في جمعية أخوين الخيرية: الإطعام، كفالة الأيتام، تجهيز العرائس، الغسيل الكلوي، أطفال الأورام، ذوو الهمم، فك كرب الغارمين، حملة الشتاء، صكوك الأضاحي، إغاثة غزة والرفق بالحيوان.',
    en: 'Causes you can support at Akhawein Charity: hot meals, orphan sponsorship, bridal preparation, dialysis, children with cancer, mobility aids, debt relief, the winter campaign, udhiyah vouchers, Gaza relief and animal welfare.',
  },
  eyebrow: { ar: 'أبواب الخير مفتوحة', en: 'Ways to give' },
  heroTitle: { ar: 'حالات ومشاريع التبرع', en: 'Choose a cause to support' },
  heroLead: {
    ar: 'اختر الحالة أو المشروع الذي تحب أن تدعمه، وحوّل مباشرة إلى حسابه البنكي الرسمي لدى بنك مصر.',
    en: 'Pick the cause you would like to support and transfer directly to its official Banque Misr account.',
  },
  howTitle: { ar: 'كيف يصل تبرعك؟', en: 'How your gift arrives' },
  howText: {
    ar: 'الأبواب التي تحمل علامة «حساب مخصص» لها حساب مستقل بالغرض نفسه. وباقي الأبواب تُموَّل من الحساب العام للجمعية؛ اذكر اسم الباب عند إرسال الإيصال على واتساب ليُوجَّه تبرعك إليه.',
    en: 'Causes marked “Dedicated account” have their own account for that purpose. Others are funded from our general account; mention the cause when you send your receipt on WhatsApp and we will direct your gift to it.',
  },
  accounts: { ar: 'كل الحسابات وطريقة التحويل', en: 'All accounts and how to transfer' },
  storiesEyebrow: { ar: 'خلف كل باب', en: 'Behind every cause' },
  storiesTitle: { ar: 'خلف كل باب من أبواب الخير قصة', en: 'Behind every cause is a story' },
  storiesText: {
    ar: 'خمس حالات موثّقة بملفاتها الطبية: علاج، وتأهيل، وعودة إلى الحياة. اقرأ القصص كاملة.',
    en: 'Five cases documented with their medical files: treatment, rehabilitation and a return to life. Read the full stories.',
  },
  storiesCta: { ar: 'قصص من الميدان', en: 'Stories from the field' },
};

export default function causesPage(ctx) {
  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'elderly-meal' })}
<section class="section">
  <div class="container">
    <div class="notice notice--intro">
      ${icon(ctx, 'info')}
      <p><strong>${ctx.t(T.howTitle)}</strong> ${ctx.t(T.howText)}</p>
    </div>
    <div class="cause-grid cause-grid--page">
      ${causes.map((c, i) => causeCard(ctx, c, { headingLevel: 2, withBeneficiaries: true, revealDelay: i * 60 }))}
    </div>
    <aside class="stories-callout reveal" aria-labelledby="causes-stories-title">
      <div class="stories-callout__stack" aria-hidden="true">
        ${stories.slice(0, 3).map((s) => html`<span>${img(ctx, ctx.t(s.poster), { alt: '', sizes: '90px', width: 480 })}</span>`)}
      </div>
      <div class="stories-callout__body">
        <p class="eyebrow">${ctx.t(T.storiesEyebrow)}</p>
        <h2 class="stories-callout__title" id="causes-stories-title">${ctx.t(T.storiesTitle)}</h2>
        <p>${ctx.t(T.storiesText)}</p>
      </div>
      ${button(ctx, { href: ctx.url('stories'), label: T.storiesCta, variant: 'secondary', iconEnd: 'arrow-right' })}
    </aside>
  </div>
</section>
<section class="section section--tight section--tint">
  <div class="container verse-banner">
    ${verse(ctx, mealsVerse)}
    ${button(ctx, { href: ctx.url('donations'), label: T.accounts, iconEnd: 'arrow-right' })}
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
