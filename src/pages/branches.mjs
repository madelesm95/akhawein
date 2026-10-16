import { html } from '../lib/html.mjs';
import { pageHero, icon, filterBar, telHref, phoneDisplay } from '../lib/components.mjs';
import { branches, governorates } from '../content/branches.mjs';
import { ui } from '../content/site.mjs';

const T = {
  title: { ar: 'الفروع والمراكز', en: 'Branches' },
  description: {
    ar: 'عناوين وأرقام فروع ومراكز تدريب جمعية أخوين الخيرية في القاهرة الكبرى والشرقية والقليوبية.',
    en: 'Addresses and phone numbers of Akhawein Charity’s branches and training centres in Greater Cairo, Sharqia and Qalyubia.',
  },
  eyebrow: { ar: 'شبكة الفروع', en: 'Our network' },
  heroTitle: { ar: 'الفروع ومراكز التدريب', en: 'Branches and training centres' },
  heroLead: {
    ar: 'فروع ومراكز الجمعية في القاهرة الكبرى والشرقية والقليوبية، لتقديم الدعم والخدمات التعليمية والتنموية قريباً منك.',
    en: 'Our branches and training centres in Greater Cairo, Sharqia and Qalyubia bring support, training and development services closer to you.',
  },
  filterLabel: { ar: 'تصفية حسب المحافظة', en: 'Filter by governorate' },
  manager: { ar: 'الإدارة', en: 'Managed by' },
};

export const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export function branchCard(ctx, b, headingLevel = 3) {
  const h = `h${headingLevel}`;
  return html`<article class="branch" data-cats="${b.gov}">
    <p class="branch__area">${icon(ctx, 'map-pin')}${ctx.t(b.area)}</p>
    <${h}>${ctx.t(b.name)}</${h}>
    <ul class="branch__lines">
      <li>${icon(ctx, 'navigation')}<span>${ctx.t(b.address)}</span></li>
      <li>${icon(ctx, 'phone')}<span>${b.phones.map((p, i) => html`${i ? ' · ' : ''}<a href="${telHref(p)}" dir="ltr">${phoneDisplay(p)}</a>`)}</span></li>
      ${b.manager ? html`<li>${icon(ctx, 'user')}<span>${ctx.t(T.manager)}: ${ctx.t(b.manager)}</span></li>` : ''}
    </ul>
    <div class="branch__actions">
      <a class="btn btn--secondary btn--sm" href="${telHref(b.phones[0])}">${icon(ctx, 'phone')}<span>${ctx.t(ui.call)}</span></a>
      <a class="btn btn--ghost btn--sm" href="${mapsUrl(b.mapQuery)}" target="_blank" rel="noopener">${icon(ctx, 'map-pin')}<span>${ctx.t(ui.directions)}</span></a>
    </div>
  </article>`;
}

export default function branchesPage(ctx) {
  const items = governorates.map((g) => ({ ...g, count: branches.filter((b) => b.gov === g.id).length }));
  const body = html`
${pageHero(ctx, {
    eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'volunteers-team',
    children: html`<div class="page-hero__stats"><span class="pill">${icon(ctx, 'building-2')}${ctx.num(branches.length)} ${ctx.t({ ar: 'فروع ومراكز', en: 'branches' })}</span><span class="pill">${icon(ctx, 'map-pin')}${ctx.t({ ar: 'القاهرة الكبرى والشرقية والقليوبية', en: 'Greater Cairo, Sharqia and Qalyubia' })}</span></div>`,
  })}
<section class="section">
  <div class="container">
    ${filterBar(ctx, { group: 'branches', items, total: branches.length, label: T.filterLabel })}
    <div class="branch-groups" data-filter-scope="branches">
      ${governorates.map((g) => html`<section class="branch-group" data-filter-section aria-labelledby="gov-${g.id}">
        <h2 class="branch-group__title" id="gov-${g.id}">${ctx.t(g.label)} <span class="count">${ctx.num(branches.filter((b) => b.gov === g.id).length)}</span></h2>
        <div class="branch-grid">${branches.filter((b) => b.gov === g.id).map((b) => branchCard(ctx, b))}</div>
      </section>`)}
    </div>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
