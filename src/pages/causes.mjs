import { html } from '../lib/html.mjs';
import { pageHero, icon, verse, button } from '../lib/components.mjs';
import { causeCard } from '../lib/cards.mjs';
import { causes, mealsVerse } from '../content/causes.mjs';
import { ui } from '../content/site.mjs';

const T = {
  title: { ar: 'حالات التبرع', en: 'Causes' },
  description: {
    ar: 'حالات ومشاريع التبرع في جمعية أخوين الخيرية: الإطعام، كفالة الأيتام، تجهيز العرائس، الغسيل الكلوي، أطفال الأورام، ذوو الهمم، فك كرب الغارمين وحملة الشتاء.',
    en: 'Causes you can support at Akhawein Charity: hot meals, orphan sponsorship, bridal preparation, dialysis, children with cancer, mobility aids, debt relief and the winter campaign.',
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
      ${causes.map((c) => causeCard(ctx, c, { headingLevel: 2 }))}
    </div>
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
