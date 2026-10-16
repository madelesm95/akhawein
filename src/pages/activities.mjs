import { html } from '../lib/html.mjs';
import { pageHero, filterBar, button, icon } from '../lib/components.mjs';
import { programCard } from '../lib/cards.mjs';
import { programs, programCategories } from '../content/programs.mjs';
import { ui } from '../content/site.mjs';

const T = {
  title: { ar: 'ميادين العمل', en: 'Our work' },
  description: {
    ar: 'ستة عشر ميدان عمل تغطي محاور التنمية المجتمعية: رعاية الطفولة والأسرة، الصحة والتعليم، التمكين الاقتصادي، حقوق الإنسان، وحماية البيئة.',
    en: 'Sixteen fields of work across community development: childhood and family care, health and education, economic empowerment, human rights and the environment.',
  },
  eyebrow: { ar: 'ميادين ورسالة العمل', en: 'What we do' },
  heroTitle: { ar: 'ميادين عمل وأنشطة الجمعية', en: 'Our fields of work' },
  heroLead: {
    ar: 'نغطي محاور التنمية المجتمعية والإنسانية كافة من خلال ١٦ ميدان عمل رئيسياً لخدمة الفئات المستحقة والمجتمع.',
    en: 'We cover every area of community and human development through 16 main fields of work that serve people in need and society as a whole.',
  },
  filterLabel: { ar: 'تصفية الميادين', en: 'Filter fields of work' },
  ctaTitle: { ar: 'هل تريد دعم ميدان بعينه؟', en: 'Want to support a specific field?' },
  ctaText: { ar: 'تواصل معنا لتوجيه تبرعك أو للتطوع في الميدان الأقرب إلى قلبك.', en: 'Get in touch to direct your gift, or to volunteer in the field closest to your heart.' },
  contact: { ar: 'تواصل معنا', en: 'Contact us' },
};

export default function activities(ctx) {
  const items = programCategories.map((c) => ({ ...c, count: programs.filter((p) => p.cats.includes(c.id)).length }));
  const body = html`
${pageHero(ctx, {
    eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'fayoum-graduates',
    children: html`<div class="page-hero__stats"><span class="pill">${icon(ctx, 'sparkles')}${ctx.num(programs.length)} ${ctx.t({ ar: 'ميداناً', en: 'fields' })}</span><span class="pill">${icon(ctx, 'map-pin')}${ctx.t({ ar: 'في محافظات مصر', en: 'Across Egypt' })}</span></div>`,
  })}
<section class="section">
  <div class="container">
    ${filterBar(ctx, { group: 'programs', items, total: programs.length, label: T.filterLabel })}
    <div class="program-grid" data-filter-scope="programs">
      ${programs.map((p) => programCard(ctx, p, { headingLevel: 2 }))}
    </div>
  </div>
</section>
<section class="cta-band cta-band--simple" aria-labelledby="act-cta">
  <div class="cta-band__grid">
    <div>
      <h2 class="cta-band__title" id="act-cta">${ctx.t(T.ctaTitle)}</h2>
      <p class="cta-band__text">${ctx.t(T.ctaText)}</p>
    </div>
    <div class="cta-band__actions cta-band__actions--end">
      ${button(ctx, { href: ctx.url('donations'), label: ui.donateLong, iconName: 'heart', size: 'lg' })}
      ${button(ctx, { href: ctx.url('contact'), label: T.contact, variant: 'ghost-light', size: 'lg' })}
    </div>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
