import causesDetails from '../data/causes-details.json' with { type: 'json' };
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

const MAP_QUERY = encodeURIComponent('جمعية أخوين الخيرية');

const DRAWER_ORDER = ['home', 'about', 'stories', 'activities', 'causes', 'gallery', 'protocols', 'certificates', 'branches', 'contact'];
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


function causeDetailsModal(ctx) {
  return html`
  <div class="cause-modal-overlay" id="causeModalOverlay" onclick="if(event.target === this) closeCauseModal()" aria-hidden="true">
    <div class="cause-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="causeModalTitle">
      <div class="cause-modal-header">
        <div class="cause-modal-badges">
          <span class="cause-modal-badge" id="causeModalBadge">${icon(ctx, 'tag')} <span id="causeModalBadgeText"></span></span>
          <span class="cause-modal-status-badge">${icon(ctx, 'circle-check')} ${ctx.t({ ar: 'حالة معتمدة ومفتوحة للتبرع', en: 'Verified cause open for donations' })}</span>
        </div>
        <button type="button" class="cause-modal-close-btn" onclick="closeCauseModal()" aria-label="${ctx.t(ui.close)}" title="${ctx.t({ ar: 'إغلاق (Esc)', en: 'Close (Esc)' })}">
          ${icon(ctx, 'x')}
        </button>
      </div>

      <div class="cause-modal-body" id="causeModalBody">
        <div class="cause-modal-hero">
          <img src="" id="causeModalHeroImg" alt="" class="cause-modal-hero-img">
          <div class="cause-modal-hero-overlay">
            <h2 class="cause-modal-title" id="causeModalTitle"></h2>
            <div id="causeModalCategoryPill">
              ${icon(ctx, 'hand-heart')}
              <span id="causeModalSubtitle">${ctx.t({ ar: 'مشروع إنساني معتمد لدى جمعية أخوين الخيرية', en: 'Accredited humanitarian project by Akhawein Charity' })}</span>
            </div>
          </div>
        </div>

        <div class="cause-modal-metrics">
          <div class="cause-modal-stats-grid">
            <div class="cause-modal-stat-box">
              <span class="stat-label">${ctx.t({ ar: 'تم جمع حتى الآن', en: 'Raised so far' })}</span>
              <span class="stat-val" id="causeModalRaised">0 ج.م</span>
            </div>
            <div class="cause-modal-stat-box highlight">
              <span class="stat-label" id="causeModalGoalLabel">${ctx.t({ ar: 'المستهدف المطلوب', en: 'Target goal' })}</span>
              <span class="stat-val" id="causeModalGoal">0 ج.م</span>
            </div>
            <div class="cause-modal-stat-box">
              <span class="stat-label">${ctx.t({ ar: 'نسبة الإنجاز', en: 'Progress rate' })}</span>
              <span class="stat-val" id="causeModalPercent" style="color: #059669;">0%</span>
            </div>
            <div class="cause-modal-stat-box">
              <span class="stat-label">${ctx.t({ ar: 'المتبقي للاكتمال', en: 'Remaining' })}</span>
              <span class="stat-val" id="causeModalRemaining">0 ج.م</span>
            </div>
          </div>
          <div class="cause-modal-progress-wrap">
            <div class="cause-modal-progress-bar">
              <div class="cause-modal-progress-fill" id="causeModalProgressBar" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <div class="cause-modal-section">
          <h4 class="cause-modal-section-title">
            ${icon(ctx, 'book-open')}
            <span>${ctx.t({ ar: 'تفاصيل الحالة والبرنامج الإنساني', en: 'Case details & humanitarian program' })}</span>
          </h4>
          <div class="cause-modal-description" id="causeModalDesc"></div>
          <div class="cause-modal-verse-card" id="causeModalVerse" style="display: none;"></div>
        </div>

        <div class="cause-modal-section" id="causeModalSharesSection">
          <h4 class="cause-modal-section-title">
            ${icon(ctx, 'hand-coins')}
            <span>${ctx.t({ ar: 'أسهم وباقات المساهمة والتبرع المتاحة', en: 'Available shares & donation packages' })}</span>
          </h4>
          <div class="cause-modal-shares-grid" id="causeModalSharesGrid"></div>
        </div>

        <div class="cause-modal-section" id="causeModalBeneficiariesSection">
          <h4 class="cause-modal-section-title">
            ${icon(ctx, 'users')}
            <span>${ctx.t({ ar: 'الفئات المستفيدة والمستهدفة', en: 'Target beneficiary groups' })}</span>
          </h4>
          <div class="cause-modal-chips-wrap" id="causeModalChips"></div>
        </div>

        <div class="cause-modal-bank-box">
          <div class="cause-modal-bank-header">
            <div class="cause-modal-bank-brand">
              <img src="/assets/img/bank-banque-misr-285.webp" alt="${ctx.t({ ar: 'بنك مصر', en: 'Banque Misr' })}" class="cause-modal-bank-logo">
              <div>
                <h5 class="cause-modal-bank-title" id="causeModalBankTitle">${ctx.t({ ar: 'حساب بنك مصر الرسمي المعتمد', en: 'Official Banque Misr Account' })}</h5>
                <span class="cause-modal-bank-branch" id="causeModalBankBranch"></span>
              </div>
            </div>
            <span class="cause-modal-bank-badge">
              ${icon(ctx, 'shield-check')} <span>${ctx.t({ ar: 'حساب معتمد', en: 'Verified account' })}</span>
            </span>
          </div>

          <div class="cause-modal-acc-display">
            <div>
              <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 0.2rem;">${ctx.t({ ar: 'رقم الحساب المخصص للحالة:', en: 'Account number for this cause:' })}</div>
              <div class="cause-modal-acc-num" id="causeModalAccNum"></div>
            </div>
            <button type="button" class="cause-modal-acc-copy-btn" id="causeModalCopyBtn" onclick="copyCurrentCauseAccount()">
              ${icon(ctx, 'copy')}
              <span>${ctx.t(ui.copy)}</span>
            </button>
          </div>

          <div class="cause-modal-iban-wrap" id="causeModalIbanWrap">
            <span>${ctx.t({ ar: 'رقم الآيبان الدولي (IBAN):', en: 'International IBAN:' })}</span>
            <span class="cause-modal-iban-code" id="causeModalIban"></span>
          </div>
        </div>
      </div>

      <div class="cause-modal-footer">
        <div class="cause-modal-nav-btns">
          <button type="button" class="cause-modal-nav-btn" onclick="navigateCauseModal(-1)" title="${ctx.t({ ar: 'الحالة السابقة', en: 'Previous cause' })}">
            ${icon(ctx, ctx.lang === 'ar' ? 'chevron-right' : 'chevron-left')}
            <span>${ctx.t({ ar: 'السابقة', en: 'Previous' })}</span>
          </button>
          <button type="button" class="cause-modal-nav-btn" onclick="navigateCauseModal(1)" title="${ctx.t({ ar: 'الحالة التالية', en: 'Next cause' })}">
            <span>${ctx.t({ ar: 'التالية', en: 'Next' })}</span>
            ${icon(ctx, ctx.lang === 'ar' ? 'chevron-left' : 'chevron-right')}
          </button>
        </div>

        <div class="cause-modal-cta-btns">
          <button type="button" class="cause-modal-share-btn" onclick="shareCurrentCause()" title="${ctx.t({ ar: 'مشاركة رابط الحالة', en: 'Share cause link' })}">
            ${icon(ctx, 'send')}
            <span>${ctx.t({ ar: 'مشاركة', en: 'Share' })}</span>
          </button>
          <a href="#" id="causeModalWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="cause-modal-whatsapp-btn" title="${ctx.t({ ar: 'تواصل عبر واتساب للاستفسار والتبرع', en: 'Contact via WhatsApp' })}">
            ${icon(ctx, 'brand-whatsapp')}
            <span>${ctx.t({ ar: 'استفسار وتبرع عبر واتساب', en: 'Inquire & donate on WhatsApp' })}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  <script id="causes-data" type="application/json">${raw(JSON.stringify(causesDetails))}</script>`;
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
        <img class="site-footer__qr" src="/assets/img/donation-qr.png" width="160" height="141" alt="${ctx.t({ ar: 'رمز الاستجابة السريعة للتبرع', en: 'Donation QR code' })}" loading="lazy" decoding="async">
      </div>
      ${footer.groups.map((g) => html`<nav class="site-footer__col" aria-label="${ctx.t(g.title)}">
        <h2 class="site-footer__title">${ctx.t(g.title)}</h2>
        <ul>${g.links.map((l) => html`<li><a href="${ctx.url(l.key, l.hash)}">${ctx.t(l.label)}</a></li>`)}</ul>
      </nav>`)}
      <div class="site-footer__col">
        <h2 class="site-footer__title">${ctx.t(footer.contactTitle)}</h2>
        <div class="site-footer__map">
          <iframe title="${ctx.t({ ar: 'خريطة المقر الرئيسي', en: 'Map of the head office' })}" src="https://maps.google.com/maps?q=${MAP_QUERY}&t=m&z=15&output=embed&hl=${ctx.lang}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <ul class="site-footer__contact">
          <li>${icon(ctx, 'map-pin')}<a href="${site.mapsUrl}" target="_blank" rel="noopener">${ctx.t(site.addressShort)}</a></li>
          <li>${icon(ctx, 'phone')}<a href="${telHref(site.phone)}" dir="ltr">${phoneDisplay(site.phone)}</a></li>
          <li>${icon(ctx, 'mail')}<a href="mailto:${site.email}">${site.email}</a></li>
          <li>${icon(ctx, 'clock')}<span>${ctx.t(site.hours)}</span></li>
        </ul>
      </div>
    </div>
    <div class="visitor-counter" data-visitor-counter hidden>
      ${icon(ctx, 'eye')}
      <span class="visitor-counter__label">${ctx.t(footer.visitors)}</span>
      <span class="visitor-counter__num" data-visitor-count dir="ltr">0</span>
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
${causeDetailsModal(ctx)}
</footer>`;
}

function breadcrumbLd(ctx, canonical, title) {
  const homeName = ctx.t(navItems.find((i) => i.key === 'home')?.label || { ar: 'الرئيسية', en: 'Home' });
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: site.origin + pagePath(ctx.lang, 'home') },
      { '@type': 'ListItem', position: 2, name: ctx.t(title), item: canonical },
    ],
  };
  return raw(`<script type="application/ld+json">${JSON.stringify(data)}</script>`);
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
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ''}<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${ctx.t({ ar: 'شعار جمعية أخوين الخيرية — معاً نصنع الأمل', en: 'Akhawein Charity — Together, we build hope' })}">
<meta property="og:locale:alternate" content="${ctx.lang === 'ar' ? 'en_US' : 'ar_EG'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${html`${fullTitle}`}">
<meta name="twitter:description" content="${html`${desc}`}">
<meta name="twitter:image" content="${site.origin}/assets/og-image.jpg">
<link rel="manifest" href="/assets/site.webmanifest">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
${PRELOAD_FONTS[ctx.lang].map((f) => `<link rel="preload" href="/assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<style>${assets.fonts[ctx.lang].trim()}</style>
<link rel="stylesheet" href="/assets/css/site.min.css?v=${assets.css}">
<script src="/assets/js/site.min.js?v=${assets.js}" defer></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js" defer></script>
${isHome ? jsonLd(ctx) : (canonical ? breadcrumbLd(ctx, canonical, title) : '')}
</head>
<body class="page-${ctx.page}">
${sprite}
<div class="scroll-progress" data-scroll-progress aria-hidden="true"><span></span></div>
${headerHtml}
<main id="main" tabindex="-1">
${body}
</main>
${footerHtml}
<a href="#" class="floating-btn back-to-top" aria-label="${ctx.t({ ar: 'العودة إلى الأعلى', en: 'Back to top' })}" title="${ctx.t({ ar: 'العودة إلى الأعلى', en: 'Back to top' })}">
  <svg class="i" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true"><path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 54.6 374.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
</a>
<div class="donate-bar" data-donate-bar aria-label="${ctx.t({ ar: 'تبرع سريع', en: 'Quick donate' })}">
  <a class="btn btn--primary donate-bar__btn" href="${ctx.url('donations')}">${icon(ctx, 'heart')}<span>${ctx.t(ui.donate)}</span></a>
  <a class="donate-bar__call" href="${telHref(site.phone)}" aria-label="${ctx.t({ ar: 'اتصل بالجمعية', en: 'Call the charity' })}" title="${ctx.t({ ar: 'اتصل بالجمعية', en: 'Call the charity' })}">${icon(ctx, 'phone')}</a>
</div>
<script type="application/json" id="i18n">${JSON.stringify(strings)}</script>
</body>
</html>
`;
}
