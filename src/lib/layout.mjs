import { html, raw, attrs } from './html.mjs';
import { pagePath } from './context.mjs';
import { icon, spriteFor, img, telHref, phoneDisplay } from './components.mjs';
import { site, nav, ui, footer } from '../content/site.mjs';

const PRELOAD_FONTS = {
  ar: ['ibm-plex-sans-arabic-400-arabic.woff2', 'alexandria-500-700-arabic.woff2'],
  en: ['ibm-plex-sans-400-600-latin.woff2', 'fraunces-500-600-latin.woff2'],
};

const THEME_BOOT = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.akhReady)d.classList.remove('js')},2500);try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t}catch(e){d.dataset.theme='light'}})();`;

const waLink = (ctx) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(ctx.lang === 'ar' ? 'السلام عليكم، أود التواصل مع جمعية أخوين الخيرية' : 'Hello, I would like to get in touch with Akhawein Charity')}`;

const DRAWER_ORDER = ['home', 'about', 'activities', 'causes', 'gallery', 'protocols', 'certificates', 'branches', 'contact'];
const navItems = nav.flatMap((item) => (item.children ? item.children : [item]));

function isActive(ctx, item) {
  if (item.key) return item.key === ctx.page;
  return item.children?.some((c) => c.key === ctx.page);
}

function navItem(ctx, item, i) {
  if (!item.children) {
    return html`<li><a class="nav-link" href="${ctx.url(item.key)}"${item.key === ctx.page ? raw(' aria-current="page"') : ''}>${ctx.t(item.label)}</a></li>`;
  }
  const id = `menu-${i}`;
  return html`<li class="has-menu${isActive(ctx, item) ? ' is-active' : ''}">
    <button type="button" class="nav-link nav-link--menu" aria-expanded="false" aria-controls="${id}">${ctx.t(item.label)}${icon(ctx, 'chevron-down')}</button>
    <div class="menu" id="${id}">
      <ul>
        ${item.children.map((c) => html`<li><a class="menu__link" href="${ctx.url(c.key)}"${c.key === ctx.page ? raw(' aria-current="page"') : ''}>
          <span class="menu__icon">${icon(ctx, c.icon)}</span>
          <span><span class="menu__label">${ctx.t(c.label)}</span><span class="menu__desc">${ctx.t(c.desc)}</span></span>
        </a></li>`)}
      </ul>
    </div>
  </li>`;
}

function themeButton(ctx) {
  return html`<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="${ctx.t(ui.themeToggle)}" title="${ctx.t(ui.themeToggle)}">${icon(ctx, 'moon', { cls: 'theme-toggle__moon' })}${icon(ctx, 'sun', { cls: 'theme-toggle__sun' })}</button>`;
}

function langLink(ctx, cls = 'lang-link') {
  const target = ctx.page === '404' ? pagePath(ctx.other, 'home') : pagePath(ctx.other, ctx.page);
  return html`<a class="${cls}" href="${target}" hreflang="${ctx.other}" lang="${ctx.other}" title="${ctx.t(ui.langSwitchLabel)}" data-lang-switch="${ctx.other}">${icon(ctx, 'languages')}<span>${ctx.t(ui.langSwitch)}</span></a>`;
}

function header(ctx) {
  return html`<a class="skip-link" href="#main">${ctx.t(ui.skip)}</a>
<aside class="utility-bar" aria-label="${ctx.t(ui.utilityLabel)}">
  <div class="container utility-bar__inner">
    <p class="utility-bar__trust">${icon(ctx, 'shield-check')}<span>${ctx.t(site.registration)}</span><span class="dot" aria-hidden="true"></span><span>${ctx.t(site.supervisor)}</span></p>
    <ul class="utility-bar__links">
      <li><a href="${telHref(site.phone)}">${icon(ctx, 'phone')}<span dir="ltr">${phoneDisplay(site.phone)}</span></a></li>
      <li><a href="mailto:${site.email}">${icon(ctx, 'mail')}<span>${site.email}</span></a></li>
      ${site.socials.map((s) => html`<li><a class="utility-bar__social" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${icon(ctx, `brand-${s.id}`)}</a></li>`)}
    </ul>
  </div>
</aside>
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="${ctx.url('home')}">
      ${img(ctx, 'logo', { alt: '', cls: 'brand__logo', eager: true })}
      <span class="brand__text"><span class="brand__name">${ctx.t(site.name)}</span><span class="brand__meta">${ctx.t(site.registration)}</span></span>
    </a>
    <nav class="primary-nav" aria-label="${ctx.t(ui.mainNav)}">
      <ul>${nav.map((item, i) => navItem(ctx, item, i))}</ul>
    </nav>
    <div class="header-actions">
      ${langLink(ctx)}
      ${themeButton(ctx)}
      <a class="btn btn--primary btn--sm header-donate" href="${ctx.url('donations')}"${ctx.page === 'donations' ? raw(' aria-current="page"') : ''}>${icon(ctx, 'heart')}<span>${ctx.t(ui.donate)}</span></a>
      <button type="button" class="icon-btn menu-toggle" data-drawer-open aria-controls="drawer" aria-expanded="false" aria-label="${ctx.t(ui.menu)}">${icon(ctx, 'menu')}</button>
    </div>
  </div>
<dialog class="drawer" id="drawer" aria-label="${ctx.t(ui.menu)}">
  <div class="drawer__head">
    <span class="drawer__title">${ctx.t(ui.menu)}</span>
    <button type="button" class="icon-btn" data-drawer-close aria-label="${ctx.t(ui.close)}">${icon(ctx, 'x')}</button>
  </div>
  <nav aria-label="${ctx.t(ui.mobileNav)}">
    <ul class="drawer__nav">
      ${DRAWER_ORDER.map((key) => navItems.find((i) => i.key === key)).map((item) => html`<li><a href="${ctx.url(item.key)}"${item.key === ctx.page ? raw(' aria-current="page"') : ''}>${ctx.t(item.label)}${icon(ctx, 'chevron-right')}</a></li>`)}
    </ul>
  </nav>
  <a class="btn btn--primary btn--block" href="${ctx.url('donations')}">${icon(ctx, 'heart')}<span>${ctx.t(ui.donateLong)}</span></a>
  <div class="drawer__tools">${langLink(ctx, 'lang-link lang-link--wide')}${themeButton(ctx)}</div>
  <ul class="drawer__contact">
    <li><a href="${telHref(site.phone)}">${icon(ctx, 'phone')}<span dir="ltr">${phoneDisplay(site.phone)}</span></a></li>
    <li><a href="mailto:${site.email}">${icon(ctx, 'mail')}<span>${site.email}</span></a></li>
  </ul>
</dialog>
</header>`;
}

function siteFooter(ctx) {
  const year = new Date().getFullYear();
  return html`<footer class="site-footer">
  <div class="container">
    <div class="site-footer__grid">
      <div class="site-footer__brand">
        <a class="brand brand--footer" href="${ctx.url('home')}">
          ${img(ctx, 'logo', { alt: '', cls: 'brand__logo' })}
          <span class="brand__text"><span class="brand__name">${ctx.t(site.name)}</span><span class="brand__meta">${ctx.t(site.registration)}</span></span>
        </a>
        <p>${ctx.t(footer.about)}</p>
        <ul class="socials">
          ${site.socials.map((s) => html`<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${icon(ctx, `brand-${s.id}`)}</a></li>`)}
        </ul>
      </div>
      ${footer.groups.map((g) => html`<nav class="site-footer__col" aria-label="${ctx.t(g.title)}">
        <h2 class="site-footer__title">${ctx.t(g.title)}</h2>
        <ul>${g.links.map((l) => html`<li><a href="${ctx.url(l.key, l.hash)}">${ctx.t(l.label)}</a></li>`)}</ul>
      </nav>`)}
      <div class="site-footer__col">
        <h2 class="site-footer__title">${ctx.t(footer.contactTitle)}</h2>
        <ul class="site-footer__contact">
          <li>${icon(ctx, 'map-pin')}<a href="${site.mapsUrl}" target="_blank" rel="noopener">${ctx.t(site.addressShort)}</a></li>
          <li>${icon(ctx, 'phone')}<a href="${telHref(site.phone)}" dir="ltr">${phoneDisplay(site.phone)}</a></li>
          <li>${icon(ctx, 'mail')}<a href="mailto:${site.email}">${site.email}</a></li>
          <li>${icon(ctx, 'clock')}<span>${ctx.t(site.hours)}</span></li>
        </ul>
      </div>
    </div>
    <div class="site-footer__legal">
      <p>© ${ctx.num(year, { useGrouping: false })} ${ctx.t(site.name)}. ${ctx.t(footer.rights)}.</p>
      <p>${ctx.t(site.registration)} · ${ctx.t(site.publicBenefit)}</p>
    </div>
  </div>
<a class="wa-fab" href="${waLink(ctx)}" target="_blank" rel="noopener" aria-label="${ctx.t(ui.chatWhatsapp)}" title="${ctx.t(ui.chatWhatsapp)}">${icon(ctx, 'brand-whatsapp')}</a>
<div class="toast" role="status" aria-live="polite" data-toast></div>
<dialog class="lightbox" data-lightbox aria-label="${ctx.t(ui.enlarge)}">
  <div class="lightbox__stage" data-lightbox-stage></div>
  <p class="lightbox__caption" data-lightbox-caption></p>
  <button type="button" class="lightbox__btn lightbox__close" data-lightbox-close autofocus aria-label="${ctx.t(ui.close)}">${icon(ctx, 'x')}</button>
  <button type="button" class="lightbox__btn lightbox__prev" data-lightbox-prev aria-label="${ctx.t(ui.prev)}">${icon(ctx, 'chevron-left')}</button>
  <button type="button" class="lightbox__btn lightbox__next" data-lightbox-next aria-label="${ctx.t(ui.next)}">${icon(ctx, 'chevron-right')}</button>
</dialog>
</footer>`;
}

function jsonLd(ctx) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: site.name.ar,
    alternateName: site.name.en,
    url: site.origin,
    logo: `${site.origin}/assets/icon-192.png`,
    foundingDate: String(site.founded),
    email: site.email,
    telephone: site.phoneIntl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.en,
      addressLocality: 'Cairo',
      addressCountry: 'EG',
    },
    sameAs: site.socials.map((s) => s.url),
  };
  return raw(`<script type="application/ld+json">${JSON.stringify(data)}</script>`);
}

export function documentShell(ctx, { title, description, body, assets, isHome = false, noindex = false }) {
  const fullTitle = isHome ? `${ctx.t(site.name)} | ${ctx.t(site.tagline)}` : `${ctx.t(title)} | ${ctx.t(site.name)}`;
  const desc = ctx.t(description);
  const canonical = ctx.page === '404' ? null : site.origin + pagePath(ctx.lang, ctx.page);
  const strings = {
    copied: ctx.t(ui.copiedToast),
    copiedShort: ctx.t(ui.copied),
    copy: ctx.t(ui.copy),
    results: ui.results[ctx.lang],
  };
  const headerHtml = header(ctx);
  const footerHtml = siteFooter(ctx);
  const sprite = spriteFor(ctx);
  return `<!doctype html>
<html lang="${ctx.lang}" dir="${ctx.dir}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${html`${fullTitle}`}</title>
<meta name="description" content="${html`${desc}`}">
<script>${THEME_BOOT}</script>
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FBF8F4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B1322" media="(prefers-color-scheme: dark)">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}${canonical ? `<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="ar" href="${site.origin + pagePath('ar', ctx.page)}">
<link rel="alternate" hreflang="en" href="${site.origin + pagePath('en', ctx.page)}">
<link rel="alternate" hreflang="x-default" href="${site.origin + pagePath('ar', ctx.page)}">
` : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="${html`${ctx.t(site.name)}`}">
<meta property="og:title" content="${html`${fullTitle}`}">
<meta property="og:description" content="${html`${desc}`}">
<meta property="og:locale" content="${ctx.lang === 'ar' ? 'ar_EG' : 'en_US'}">
<meta property="og:image" content="${site.origin}/assets/og-image.jpg">
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ''}<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
${PRELOAD_FONTS[ctx.lang].map((f) => `<link rel="preload" href="/assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<style>${assets.fonts[ctx.lang].trim()}</style>
<link rel="stylesheet" href="/assets/css/site.min.css?v=${assets.css}">
<script src="/assets/js/site.min.js?v=${assets.js}" defer></script>
${isHome ? jsonLd(ctx) : ''}
</head>
<body class="page-${ctx.page}">
${sprite}
${headerHtml}
<main id="main" tabindex="-1">
${body}
</main>
${footerHtml}
<script type="application/json" id="i18n">${JSON.stringify(strings)}</script>
</body>
</html>
`;
}
