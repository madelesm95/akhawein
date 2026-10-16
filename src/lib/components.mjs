import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, raw, attrs } from './html.mjs';
import { ui } from '../content/site.mjs';
import { ibanIsValid } from '../content/accounts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const ICONS = JSON.parse(readFileSync(path.join(root, 'src/data/icons.json'), 'utf8'));
export const IMAGES = JSON.parse(readFileSync(path.join(root, 'src/data/images.json'), 'utf8'));

const FLIP = new Set(['arrow-left', 'arrow-right', 'chevron-left', 'chevron-right', 'arrow-up-right', 'send']);

export function icon(ctx, name, { cls = '', label } = {}) {
  if (!ICONS[name]) throw new Error(`Unknown icon "${name}" (add it to src/icons.mjs)`);
  ctx.usedIcons.add(name);
  const classes = ['i', `i-${name}`, FLIP.has(name) ? 'i-flip' : '', cls].filter(Boolean).join(' ');
  const a11y = label ? attrs({ role: 'img', 'aria-label': label }) : raw(' aria-hidden="true" focusable="false"');
  return html`<svg class="${classes}"${a11y}><use href="#i-${name}"></use></svg>`;
}

export function spriteFor(ctx) {
  const symbols = [...ctx.usedIcons].sort().map((name) => {
    const { kind, body } = ICONS[name];
    const paint = kind === 'fill'
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
    return `<symbol id="i-${name}" viewBox="0 0 24 24" ${paint}>${body}</symbol>`;
  });
  return raw(`<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true">${symbols.join('')}</svg>`);
}

export const imgUrl = (id, w) => `/assets/img/${id}-${w}.webp`;

export function img(ctx, id, { alt = '', sizes = '100vw', cls = '', eager = false, width } = {}) {
  const meta = IMAGES[id];
  if (!meta) throw new Error(`Unknown image "${id}" (add it to src/images.mjs and run npm run images)`);
  const widths = width ? meta.widths.filter((w) => w <= width) : meta.widths;
  const list = widths.length ? widths : [meta.widths[0]];
  const largest = list[list.length - 1];
  return html`<img${attrs({
    class: cls || null,
    src: imgUrl(id, largest),
    srcset: list.length > 1 ? list.map((w) => `${imgUrl(id, w)} ${w}w`).join(', ') : null,
    sizes: list.length > 1 ? sizes : null,
    width: meta.w,
    height: meta.h,
    alt: ctx.t(alt),
    loading: eager ? 'eager' : 'lazy',
    fetchpriority: eager ? 'high' : null,
    decoding: 'async',
  })}>`;
}

export const largestImage = (id) => imgUrl(id, IMAGES[id].widths[IMAGES[id].widths.length - 1]);

export function sectionHead(ctx, { eyebrow, title, lead, align = 'start', action, id }) {
  return html`<header class="section-head section-head--${align}">
    <div class="section-head__text">
      ${eyebrow ? html`<p class="eyebrow">${ctx.t(eyebrow)}</p>` : ''}
      <h2 class="section-title"${id ? attrs({ id }) : ''}>${ctx.t(title)}</h2>
      ${lead ? html`<p class="lead">${ctx.t(lead)}</p>` : ''}
    </div>
    ${action || ''}
  </header>`;
}

export function button(ctx, { href, label, variant = 'primary', iconName, iconEnd, size, external, cls = '' }) {
  const classes = ['btn', `btn--${variant}`, size ? `btn--${size}` : '', cls].filter(Boolean).join(' ');
  return html`<a${attrs({ class: classes, href, target: external ? '_blank' : null, rel: external ? 'noopener' : null })}>${iconName ? icon(ctx, iconName) : ''}<span>${ctx.t(label)}</span>${iconEnd ? icon(ctx, iconEnd) : ''}</a>`;
}

const groupDigits = (v) => v.replace(/(.{4})(?=.)/g, '$1 ');

export function copyValue(ctx, { label, value, mono = true, kind }) {
  return html`<div class="copy-row">
    <span class="copy-row__label">${ctx.t(label)}</span>
    <span class="copy-row__value${mono ? ' mono' : ''}"${kind ? attrs({ 'data-kind': kind }) : ''} dir="ltr" translate="no">${groupDigits(value)}</span>
    <button type="button" class="copy-btn" data-copy="${value}" aria-label="${ctx.t(ui.copy)} ${ctx.t(label)}">
      ${icon(ctx, 'copy', { cls: 'copy-btn__idle' })}${icon(ctx, 'check', { cls: 'copy-btn__done' })}<span class="copy-btn__text">${ctx.t(ui.copy)}</span>
    </button>
  </div>`;
}

const ibanWarnings = new Set();
export function publishableIban(account) {
  if (!account.iban) return null;
  if (ibanIsValid(account.iban)) return account.iban;
  if (!ibanWarnings.has(account.iban)) {
    ibanWarnings.add(account.iban);
    console.warn(`  ! IBAN ${account.iban} (${account.number}) fails the mod-97 check — not published`);
  }
  return null;
}

export function accountDetails(ctx, account, { compact = false } = {}) {
  const iban = publishableIban(account);
  return html`<div class="account-details${compact ? ' account-details--compact' : ''}">
    ${copyValue(ctx, { label: ui.accountNo, value: account.number })}
    ${iban && !compact ? copyValue(ctx, { label: ui.iban, value: iban, kind: 'iban' }) : ''}
  </div>`;
}

export function pageHero(ctx, { eyebrow, title, lead, crumbs = [], image, children }) {
  return html`<section class="page-hero${image ? ' page-hero--image' : ''}">
    <div class="container page-hero__inner">
      <div class="page-hero__text">
      <nav class="breadcrumb" aria-label="${ctx.t(ui.breadcrumb)}">
        <ol>
          <li><a href="${ctx.url('home')}">${ctx.t(ui.home)}</a></li>
          ${crumbs.map((c) => html`<li>${icon(ctx, 'chevron-right')}${c.key ? html`<a href="${ctx.url(c.key)}">${ctx.t(c.label)}</a>` : html`<span aria-current="page">${ctx.t(c.label)}</span>`}</li>`)}
        </ol>
      </nav>
      ${eyebrow ? html`<p class="eyebrow">${ctx.t(eyebrow)}</p>` : ''}
      <h1 class="page-title">${ctx.t(title)}</h1>
      ${lead ? html`<p class="page-lead">${ctx.t(lead)}</p>` : ''}
      ${children || ''}
      </div>
      ${image ? html`<figure class="page-hero__figure">${img(ctx, image, { alt: '', sizes: '(min-width: 1100px) 440px, 0px', eager: true, width: 960 })}</figure>` : ''}
    </div>
  </section>`;
}

export function filterBar(ctx, { group, items, total, label }) {
  return html`<div class="filters" role="toolbar" aria-label="${ctx.t(label)}" data-filter-group="${group}">
    <button type="button" class="chip is-active" data-filter="all" aria-pressed="true">${ctx.t(ui.all)} <span class="chip__count">${ctx.num(total)}</span></button>
    ${items.map((f) => html`<button type="button" class="chip" data-filter="${f.id}" aria-pressed="false">${ctx.t(f.label)} <span class="chip__count">${ctx.num(f.count)}</span></button>`)}
  </div>`;
}

export function verse(ctx, v, { cls = '' } = {}) {
  return html`<figure class="verse ${cls}">
    <blockquote lang="ar" dir="rtl"><p>﴿ ${v.ar} ﴾</p></blockquote>
    ${ctx.lang === 'en' ? html`<p class="verse__translation">${v.en}</p>` : ''}
    <figcaption>${ctx.t(v.ref)}</figcaption>
  </figure>`;
}

export const telHref = (n) => `tel:${n.startsWith('0') ? `+2${n}` : n}`;
const NBSP = '\u00A0';
export function phoneDisplay(n) {
  if (/^01\d{9}$/.test(n)) return [n.slice(0, 4), n.slice(4, 7), n.slice(7)].join(NBSP);
  if (/^02\d{8}$/.test(n)) return [n.slice(0, 2), n.slice(2, 6), n.slice(6)].join(NBSP);
  if (/^0\d{2}\d{7}$/.test(n)) return [n.slice(0, 3), n.slice(3, 6), n.slice(6)].join(NBSP);
  return n;
}
