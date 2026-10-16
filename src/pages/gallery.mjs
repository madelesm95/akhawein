import { html } from '../lib/html.mjs';
import { pageHero, filterBar, icon } from '../lib/components.mjs';
import { mediaTile } from '../lib/cards.mjs';
import { gallery, galleryCategories } from '../content/gallery.mjs';
import { site, ui } from '../content/site.mjs';

const T = {
  title: { ar: 'المركز الإعلامي', en: 'Media centre' },
  description: {
    ar: 'صور وفيديوهات توثق عمل جمعية أخوين الخيرية في الميدان: قوافل الإطعام، احتفالية يوم اليتيم، إغاثة فلسطين، قوافل الإسماعيلية، ومبادرات التأهيل المهني في الفيوم.',
    en: 'Photos and videos of Akhawein Charity in the field: hot-meal convoys, Orphans’ Day, Palestine relief, the Ismailia convoys and vocational training in Fayoum.',
  },
  eyebrow: { ar: 'من الميدان', en: 'From the field' },
  heroTitle: { ar: 'صور وفيديوهات من عملنا', en: 'Photos and videos of our work' },
  heroLead: {
    ar: 'نافذة توثّق مسيرة العطاء الميداني: قوافل الإطعام، وبسمات الأيتام، ورحلات الأمل، بعدسات فريقنا ومتطوعينا.',
    en: 'A window onto our work on the ground: meal convoys, smiles at Orphans’ Day and journeys of hope, captured by our team and volunteers.',
  },
  filterLabel: { ar: 'تصفية الوسائط', en: 'Filter media' },
  youtube: { ar: 'المزيد على يوتيوب', en: 'More on YouTube' },
  videosTitle: { ar: 'فيديوهات', en: 'Videos' },
  photosTitle: { ar: 'صور من الميدان', en: 'Photos from the field' },
};

export default function galleryPage(ctx) {
  const items = galleryCategories.map((c) => ({ ...c, count: gallery.filter((g) => g.cats.includes(c.id)).length }));
  const youtube = site.socials.find((s) => s.id === 'youtube');
  const body = html`
${pageHero(ctx, {
    eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }], image: 'orphan-tanoura',
    children: html`<div class="page-hero__stats">
      <span class="pill">${icon(ctx, 'images')}${ctx.num(gallery.filter((g) => g.type !== 'video').length)} ${ctx.t({ ar: 'صورة', en: 'photos' })}</span>
      <span class="pill">${icon(ctx, 'film')}${ctx.num(gallery.filter((g) => g.type === 'video').length)} ${ctx.t({ ar: 'فيديو', en: 'videos' })}</span>
      <a class="pill pill--link" href="${youtube.url}" target="_blank" rel="noopener">${icon(ctx, 'brand-youtube')}${ctx.t(T.youtube)}</a>
    </div>`,
  })}
<section class="section">
  <div class="container">
    ${filterBar(ctx, { group: 'media', items, total: gallery.length, label: T.filterLabel })}
    <div class="media-groups" data-filter-scope="media" data-lightbox-group>
      <section class="media-group" data-filter-section aria-labelledby="videos-title">
        <h2 class="media-group__title" id="videos-title">${icon(ctx, 'film')}${ctx.t(T.videosTitle)}</h2>
        <div class="gallery-grid gallery-grid--video">
          ${gallery.filter((g) => g.type === 'video').map((g) => mediaTile(ctx, g, { sizes: '(min-width: 1100px) 380px, (min-width: 640px) 45vw, 92vw' }))}
        </div>
      </section>
      <section class="media-group" data-filter-section aria-labelledby="photos-title">
        <h2 class="media-group__title" id="photos-title">${icon(ctx, 'images')}${ctx.t(T.photosTitle)}</h2>
        <div class="gallery-grid">
          ${gallery.filter((g) => g.type !== 'video').map((g) => mediaTile(ctx, g, { sizes: '(min-width: 1100px) 380px, (min-width: 640px) 45vw, 92vw' }))}
        </div>
      </section>
    </div>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
