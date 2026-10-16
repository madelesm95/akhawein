import { html } from '../lib/html.mjs';
import { icon, img, sectionHead, pageHero, button, verse } from '../lib/components.mjs';
import { site, ui } from '../content/site.mjs';
import { board, principles, story, governance } from '../content/about.mjs';

const T = {
  title: { ar: 'من نحن', en: 'About us' },
  description: {
    ar: 'تعرّف على جمعية أخوين الخيرية: قصتنا ورؤيتنا ورسالتنا وقيمنا، ومجلس الإدارة، والوضع القانوني للجمعية المشهرة برقم ٧٧٠٢ لسنة ٢٠٠٩.',
    en: 'About Akhawein Charity: our story, vision, mission and values, our board of directors, and our legal status as an NGO registered under No. 7702 of 2009.',
  },
  eyebrow: { ar: 'الهوية والرسالة', en: 'Who we are' },
  heroTitle: { ar: 'عن جمعية أخوين الخيرية', en: 'About Akhawein Charity' },
  heroLead: {
    ar: 'مسيرة عمل أهلي وتنمية مجتمعية ممتدة منذ عام ٢٠٠٩، لخدمة الأسر الأولى بالرعاية في جمهورية مصر العربية.',
    en: 'Community work and development since 2009, serving the families who need it most across Egypt.',
  },
  legalTitle: { ar: 'البيانات الرسمية', en: 'Official status' },
  legal: [
    { k: { ar: 'رقم الإشهار', en: 'Registration' }, v: site.registration },
    { k: { ar: 'صفة النفع العام', en: 'Public benefit' }, v: { ar: 'قرار وزاري رقم ١٦٠ لسنة ٢٠١٣', en: 'Ministerial Decree No. 160 of 2013' } },
    { k: { ar: 'القانون المنظم', en: 'Governing law' }, v: site.law },
    { k: { ar: 'الجهة المشرفة', en: 'Supervising body' }, v: { ar: 'وزارة التضامن الاجتماعي', en: 'Ministry of Social Solidarity' } },
    { k: { ar: 'الاعتماد الدولي', en: 'International validation' }, v: { ar: 'CAF International – أبريل ٢٠٢٣', en: 'CAF International, April 2023' } },
  ],
  storyEyebrow: { ar: 'قصتنا', en: 'Our story' },
  principlesEyebrow: { ar: 'المبادئ', en: 'Our principles' },
  principlesTitle: { ar: 'رؤيتنا ورسالتنا وقيمنا', en: 'Vision, mission and values' },
  principlesLead: { ar: 'مبادئ ثابتة تضمن وصول الدعم إلى مستحقيه بأمانة وكفاءة.', en: 'Steady principles that make sure help reaches the right people, honestly and efficiently.' },
  boardEyebrow: { ar: 'مجلس الإدارة', en: 'Leadership' },
  boardTitle: { ar: 'أعضاء مجلس الإدارة', en: 'Board of directors' },
  boardLead: { ar: 'التشكيل المعتمد لمجلس إدارة الجمعية وفقاً لقرارات القيد والإشهار.', en: 'The board as approved under the association’s registration.' },
  facts: [
    { v: { ar: '٢٠٠٩', en: '2009' }, l: { ar: 'سنة التأسيس والإشهار', en: 'Founded and registered' } },
    { v: { ar: '١٦٠ / ٢٠١٣', en: '160 / 2013' }, l: { ar: 'قرار النفع العام', en: 'Public-benefit decree' } },
    { v: { ar: '٧', en: '7' }, l: { ar: 'فروع ومراكز في القاهرة الكبرى والشرقية والقليوبية', en: 'Branches in Greater Cairo, Sharqia and Qalyubia' } },
  ],
  ctaTitle: { ar: 'شاركونا مسيرة العطاء', en: 'Join us on this journey' },
  ctaText: { ar: 'مساهمتك تصنع فارقاً حقيقياً في حياة آلاف الأسر والأيتام في مصر.', en: 'Your support makes a real difference to thousands of families and orphans in Egypt.' },
  causes: { ar: 'حالات التبرع', en: 'See causes' },
  contact: { ar: 'تواصل معنا', en: 'Contact us' },
};


export default function about(ctx) {
  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'orphan-leadership' })}

<section class="section">
  <div class="container story">
    <div class="story__text reveal">
      <p class="eyebrow">${ctx.t(T.storyEyebrow)}</p>
      <h2 class="section-title">${ctx.t(story.title)}</h2>
      ${story.paragraphs.map((p) => html`<p>${ctx.t(p)}</p>`)}
      ${verse(ctx, site.verse, { cls: 'verse--inline' })}
    </div>
    <aside class="legal-card reveal" aria-labelledby="legal-title">
      <h3 id="legal-title">${icon(ctx, 'shield-check')}${ctx.t(T.legalTitle)}</h3>
      <dl>${T.legal.map((row) => html`<div><dt>${ctx.t(row.k)}</dt><dd>${ctx.t(row.v)}</dd></div>`)}</dl>
    </aside>
  </div>
</section>

<section class="section section--tint" aria-labelledby="principles-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: T.principlesEyebrow, title: T.principlesTitle, lead: T.principlesLead, id: 'principles-title' })}
    <div class="principles">
      ${principles.map((p) => html`<article class="principle reveal">
        <div class="principle__img">${img(ctx, p.image, { alt: '', sizes: '(min-width: 1100px) 380px, (min-width: 640px) 45vw, 92vw', width: 960 })}</div>
        <div class="principle__body">
          <span class="principle__icon">${icon(ctx, p.icon)}</span>
          <h3>${ctx.t(p.label)}</h3>
          <p>${ctx.t(p.text)}</p>
        </div>
      </article>`)}
    </div>
  </div>
</section>

<section class="section" id="board" aria-labelledby="board-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: T.boardEyebrow, title: T.boardTitle, lead: T.boardLead, id: 'board-title' })}
    <ul class="board">
      ${board.map((m) => html`<li class="member${m.chair ? ' member--chair' : ''} reveal">
        <span class="member__avatar" aria-hidden="true">${icon(ctx, 'user')}</span>
        <div class="member__info">
          <h3 class="member__name">${ctx.t(m.name)}</h3>
          <p class="member__role">${ctx.t(m.role)}</p>
          <p class="member__work">${ctx.t(m.work)}</p>
        </div>
      </li>`)}
    </ul>
  </div>
</section>

<section class="section section--tight section--tint">
  <div class="container">
    <div class="governance reveal">
      <div>
        <p class="eyebrow">${ctx.t({ ar: 'الحوكمة', en: 'Governance' })}</p>
        <h2>${ctx.t(governance.title)}</h2>
        <p>${ctx.t(governance.text)}</p>
      </div>
      <ul class="governance__facts">
        ${T.facts.map((f) => html`<li><strong>${ctx.t(f.v)}</strong><span>${ctx.t(f.l)}</span></li>`)}
      </ul>
    </div>
  </div>
</section>

<section class="cta-band cta-band--simple" aria-labelledby="about-cta">
  <div class="cta-band__grid">
    <div>
      <h2 class="cta-band__title" id="about-cta">${ctx.t(T.ctaTitle)}</h2>
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
