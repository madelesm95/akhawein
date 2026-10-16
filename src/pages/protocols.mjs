import { html } from '../lib/html.mjs';
import { pageHero, icon, img, sectionHead, largestImage } from '../lib/components.mjs';
import { protocols, partnerLogos } from '../content/partners.mjs';
import { ui } from '../content/site.mjs';

const T = {
  title: { ar: 'الشراكات والاعتمادات', en: 'Partnerships' },
  description: {
    ar: 'بروتوكولات التعاون والاعتمادات الموقعة بين جمعية أخوين الخيرية والمؤسسات الشريكة، ومنها اعتماد منظمة CAF الدولية.',
    en: 'Cooperation protocols and accreditations between Akhawein Charity and its partners, including validation by CAF International.',
  },
  eyebrow: { ar: 'بروتوكولات التعاون', en: 'Cooperation protocols' },
  heroTitle: { ar: 'الشراكات والاعتمادات', en: 'Partnerships and accreditation' },
  heroLead: {
    ar: 'بروتوكولات تعاون موقعة بين جمعية أخوين الخيرية ومؤسسات وجهات شريكة في مسيرة البناء والتنمية المجتمعية.',
    en: 'Protocols signed between Akhawein Charity and the institutions that share our commitment to community development.',
  },
  view: { ar: 'عرض الشهادة', en: 'View certificate' },
  protocolsEyebrow: { ar: 'البروتوكولات', en: 'Protocols' },
  protocolsTitle: { ar: 'شراكات تخدم الإنسان', en: 'Partnerships that serve people' },
  via: { ar: 'من خلال', en: 'Through' },
  partnersTitle: { ar: 'شركاء النجاح', en: 'Our partners' },
  ended: { ar: 'مدة منتهية', en: 'Term ended' },
};

const hasEnded = (p) => p.endDate && new Date(`${p.endDate}T23:59:59`) < new Date();

export default function protocolsPage(ctx) {
  const caf = protocols.find((p) => p.featured);
  const rest = protocols.filter((p) => !p.featured);
  const body = html`
${pageHero(ctx, {
    eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'fayoum-assignment',
    children: html`<div class="page-hero__stats"><span class="pill">${icon(ctx, 'handshake')}${ctx.num(protocols.length)} ${ctx.t({ ar: 'شراكات واعتمادات موثقة', en: 'documented partnerships' })}</span></div>`,
  })}
<section class="section">
  <div class="container">
    <article class="caf-feature reveal" data-lightbox-group>
      <div class="caf-feature__img">
        <button type="button" data-lightbox-item data-type="image" data-src="${largestImage(caf.image)}" data-caption="${ctx.t(caf.title)}" aria-label="${ctx.t(T.view)}: ${ctx.t(caf.title)}">
          ${img(ctx, caf.image, { alt: ctx.t(caf.title), sizes: '(min-width: 1100px) 420px, 90vw' })}
        </button>
      </div>
      <div>
        <p class="eyebrow">${icon(ctx, caf.icon)}${ctx.t(caf.kind)}</p>
        <h2>${ctx.t(caf.title)}</h2>
        <p>${ctx.t(caf.text)}</p>
        <p class="protocol__meta">${icon(ctx, 'calendar')}${ctx.t(caf.meta)}${hasEnded(caf) ? html` <span class="status-chip">${ctx.t(T.ended)}</span>` : ''}</p>
      </div>
    </article>
  </div>
</section>
<section class="section section--tint" aria-labelledby="protocols-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: T.protocolsEyebrow, title: T.protocolsTitle, id: 'protocols-title' })}
    <div class="protocol-grid">
      ${rest.map((p) => html`<article class="protocol reveal" id="${p.id}">
        <div class="protocol__head">
          <span class="protocol__logo">${p.logo ? img(ctx, p.logo, { alt: ctx.t(p.title) }) : icon(ctx, p.icon)}</span>
          <div>
            <p class="protocol__kind">${ctx.t(p.kind)}</p>
            <h3>${ctx.t(p.title)}</h3>
          </div>
        </div>
        ${p.meta ? html`<p class="protocol__meta">${icon(ctx, 'calendar')}${ctx.t(p.meta)}${hasEnded(p) ? html` <span class="status-chip">${ctx.t(T.ended)}</span>` : ''}</p>` : ''}
        ${p.via ? html`<p class="protocol__meta">${icon(ctx, 'building-2')}${ctx.t(T.via)}: ${ctx.t(p.via)}</p>` : ''}
        ${p.text ? html`<p>${ctx.t(p.text)}</p>` : ''}
        ${p.points ? html`<ul class="ticks">${p.points.map((pt) => html`<li>${icon(ctx, 'circle-check')}<span>${ctx.t(pt)}</span></li>`)}</ul>` : ''}
      </article>`)}
    </div>
  </div>
</section>
<section class="section section--tight">
  <div class="container partners">
    <h2 class="partners__title">${ctx.t(T.partnersTitle)}</h2>
    <ul class="partners__list">
      ${partnerLogos.map((p) => html`<li title="${p.name}">${img(ctx, p.logo, { alt: p.name, sizes: '160px' })}</li>`)}
    </ul>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
