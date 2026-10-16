import { html, attrs } from '../lib/html.mjs';
import { pageHero, icon, img, largestImage, filterBar } from '../lib/components.mjs';
import { ui } from '../content/site.mjs';
import certificates from '../content/certificates.json' with { type: 'json' };

const T = {
  title: { ar: 'شهادات التقدير', en: 'Wall of honour' },
  description: {
    ar: 'سجل شهادات الشكر والتقدير الصادرة عن جمعية أخوين الخيرية منذ عام ٢٠١١ لشركاء المسيرة وأعضاء مجلس الإدارة والمتطوعين والداعمين.',
    en: 'Certificates of appreciation issued by Akhawein Charity since 2011 to partners, board members, volunteers and supporters.',
  },
  eyebrow: { ar: 'سجل الشرف والتكريم', en: 'Honours and appreciation' },
  heroTitle: { ar: 'شهادات الشكر والتقدير', en: 'Certificates of appreciation' },
  heroLead: {
    ar: 'توثيق واعتزاز بشركاء المسيرة وداعمي العمل الأهلي وأصحاب الأيادي البيضاء في مسيرة الجمعية على مدار السنوات.',
    en: 'A record of gratitude to the partners, supporters and generous hands who have shaped our journey over the years.',
  },
  search: { ar: 'ابحث بالاسم…', en: 'Search by name in Arabic…' },
  searchLabel: { ar: 'ابحث عن شهادة بالاسم', en: 'Search certificates by name (names are in Arabic)' },
  filterLabel: { ar: 'تصفية حسب السنة', en: 'Filter by year' },
  memorialTitle: { ar: 'بصمات خالدة', en: 'Lasting legacies' },
  memorialText: {
    ar: 'تكريم ووفاء لمن تركوا أثراً لا يُمحى في مسيرة جمعية أخوين الخيرية، رحمهم الله جميعاً.',
    en: 'In grateful memory of those who left a lasting mark on Akhawein Charity. May God have mercy on them all.',
  },
  official: { ar: 'شهادات رسمية', en: 'Official' },
  appreciation: { ar: 'شهادة شكر وتقدير', en: 'Certificate of appreciation' },
  yearLabel: { ar: 'عام', en: '' },
};

const ROLES = {
  'عضو مجلس ادارة': 'Board member',
  'نائب رئيس مجلس الادارة': 'Vice Chair',
  'سكرتيرة تنفيذية': 'Executive secretary',
  'سكرتيرة إدارية': 'Administrative secretary',
  'عضوية فخرية': 'Honorary member',
  'رئيس مجلس ادارة': 'Chair of the Board',
  'امين الصندوق': 'Treasurer',
  'مدير عام الجمعية': 'General Manager',
  'مدير الشئون القانونية': 'Head of Legal Affairs',
  'المدير التنفيذي': 'Executive Director',
  'عضو فخرى': 'Honorary member',
  'المدير الإداري': 'Administrative Manager',
  'مدير فرع الثورة': 'El-Thawra Branch Manager',
  'مدير إدارة مصر الجديدة للتضامن': 'Director, Heliopolis Social Solidarity Directorate',
  'عضو مجلس ادارة (الامين العام)': 'Board member (Secretary-General)',
  'عضو مجلس ادارة (امين الصندوق)': 'Board member (Treasurer)',
  'عضو مجلس ادارة (نائب رئيس مجلس الادارة)': 'Board member (Vice Chair)',
  'الامين العام': 'Secretary-General',
  'عضوية فخرية (رحمه الله)': 'Honorary member (may he rest in peace)',
  'عضوية فخرية (رحمها الله)': 'Honorary member (may she rest in peace)',
};

function roleText(ctx, role) {
  if (!role) return '';
  if (ctx.lang === 'ar') return role;
  if (!ROLES[role]) throw new Error(`Missing English translation for certificate role "${role}"`);
  return ROLES[role];
}

function certCard(ctx, c, { grouped = true } = {}) {
  const isOfficial = c.group === 'official';
  const name = c.name || ctx.t(T.appreciation);
  const year = c.group === 'memorial' ? '' : isOfficial ? ctx.t(T.official) : `${ctx.t(T.yearLabel)} ${ctx.num(Number(c.group), { useGrouping: false })}`.trim();
  const role = roleText(ctx, c.role);
  const caption = [name, role, year].filter(Boolean).join(' · ');
  return html`<figure class="cert"${grouped ? attrs({ 'data-cats': c.group, 'data-search': `${c.name || ''} ${c.role || ''}` }) : ''}>
    <button type="button" class="cert__btn" data-lightbox-item data-type="image" data-src="${largestImage(c.id)}" data-caption="${caption}" aria-label="${ctx.t(ui.enlarge)}: ${name}">
      ${img(ctx, c.id, { alt: `${ctx.t(T.appreciation)}: ${name}`, sizes: '(min-width: 1100px) 260px, (min-width: 640px) 45vw, 92vw' })}
    </button>
    <figcaption>
      <span class="cert__name">${c.name ? html`<bdi lang="ar">${name}</bdi>` : name}</span>
      ${role ? html`<span class="cert__role">${role}</span>` : ''}
      ${year ? html`<span class="cert__year">${year}</span>` : ''}
    </figcaption>
  </figure>`;
}

export default function certificatesPage(ctx) {
  const memorial = certificates.filter((c) => c.group === 'memorial');
  const main = certificates.filter((c) => c.group !== 'memorial')
    .sort((a, b) => (b.group === 'official' ? -1 : Number(b.group)) - (a.group === 'official' ? -1 : Number(a.group)));
  const years = [...new Set(main.map((c) => c.group).filter((g) => g !== 'official'))].sort((a, b) => b - a);
  const items = [
    ...years.map((y) => ({ id: y, label: { ar: ctx.num(Number(y), { useGrouping: false }), en: y }, count: main.filter((c) => c.group === y).length })),
    { id: 'official', label: T.official, count: main.filter((c) => c.group === 'official').length },
  ];
  const body = html`
${pageHero(ctx, {
    eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'fayoum-honoring',
    children: html`<div class="page-hero__stats">
      <span class="pill">${icon(ctx, 'award')}${ctx.num(main.length)} ${ctx.t({ ar: 'شهادة', en: 'certificates' })}</span>
      <span class="pill">${icon(ctx, 'calendar')}${ctx.t({ ar: `منذ ${ctx.num(2011, { useGrouping: false })}`, en: 'Since 2011' })}</span>
    </div>`,
  })}
<section class="section">
  <div class="container">
    ${memorial.length ? html`<section class="memorial reveal" aria-labelledby="memorial-title" data-lightbox-group>
      <h2 id="memorial-title">${icon(ctx, 'star')} ${ctx.t(T.memorialTitle)}</h2>
      <p>${ctx.t(T.memorialText)}</p>
      <div class="cert-grid">${memorial.map((c) => certCard(ctx, c, { grouped: false }))}</div>
    </section>` : ''}
    <div class="cert-tools">
      <div class="search">
        ${icon(ctx, 'search')}
        <label class="visually-hidden" for="cert-search">${ctx.t(T.searchLabel)}</label>
        <input id="cert-search" type="search" placeholder="${ctx.t(T.search)}" data-search="certs" autocomplete="off">
      </div>
      ${filterBar(ctx, { group: 'certs', items, total: main.length, label: T.filterLabel })}
      <p class="result-count" data-count-for="certs" aria-live="polite"></p>
    </div>
    <div class="cert-grid" data-filter-scope="certs" data-lightbox-group>
      ${main.map((c) => certCard(ctx, c))}
    </div>
    <div class="empty-state" data-empty-for="certs" hidden>${icon(ctx, 'search')}<p>${ctx.t(ui.noResults)}</p></div>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
