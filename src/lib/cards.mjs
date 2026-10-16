import { html, attrs } from './html.mjs';
import { icon, img, accountDetails, largestImage } from './components.mjs';
import { findAccount } from '../content/accounts.mjs';
import { ui } from '../content/site.mjs';

const T = {
  giveTo: { ar: 'تبرّع لهذا الباب', en: 'Give to this cause' },
  dedicated: { ar: 'حساب مخصص', en: 'Dedicated account' },
  general: { ar: 'عبر الحساب العام', en: 'Via the general account' },
};

export function causeCard(ctx, cause, { headingLevel = 3 } = {}) {
  const account = findAccount(cause.account);
  const dedicated = cause.account !== 'general';
  const h = `h${headingLevel}`;
  return html`<article class="cause-card" id="cause-${cause.id}">
    <div class="cause-card__media">
      ${cause.image
        ? img(ctx, cause.image, { alt: '', sizes: '(min-width: 1100px) 380px, (min-width: 700px) 45vw, 92vw', width: 960 })
        : html`<div class="art">${icon(ctx, cause.icon)}</div>`}
      <span class="cause-card__tag">${icon(ctx, cause.icon)}${ctx.t(cause.tag)}</span>
    </div>
    <div class="cause-card__body">
      <${h} class="cause-card__title">${ctx.t(cause.title)}</${h}>
      <p class="cause-card__text">${ctx.t(cause.summary)}</p>
      <div class="cause-card__account">
        <p class="cause-card__account-label">${icon(ctx, dedicated ? 'badge-check' : 'landmark')}${ctx.t(dedicated ? T.dedicated : T.general)} · ${ctx.t(account.bank.name)}</p>
        ${accountDetails(ctx, account, { compact: true })}
      </div>
      <a class="link-arrow" href="${ctx.url('donations', `acc-${account.id}`)}">${ctx.t(T.giveTo)}${icon(ctx, 'arrow-right')}</a>
    </div>
  </article>`;
}

export function programCard(ctx, p, { headingLevel = 3, withText = true } = {}) {
  const h = `h${headingLevel}`;
  return html`<article class="program-card" data-cats="${p.cats.join(' ')}">
    <span class="program-card__icon">${icon(ctx, p.icon)}</span>
    <${h} class="program-card__title">${ctx.t(p.title)}</${h}>
    ${withText ? html`<p class="program-card__text">${ctx.t(p.text)}</p>` : ''}
  </article>`;
}

export function mediaTile(ctx, item, { index, sizes = '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw', cls = '' } = {}) {
  const isVideo = item.type === 'video';
  const caption = ctx.t(item.title);
  const trigger = isVideo
    ? attrs({ 'data-lightbox-item': '', 'data-type': 'video', 'data-src': item.youtube, 'data-caption': caption, 'aria-label': `${ctx.t(ui.play)}: ${caption}` })
    : attrs({ 'data-lightbox-item': '', 'data-type': 'image', 'data-src': largestImage(item.image), 'data-caption': caption, 'aria-label': `${ctx.t(ui.enlarge)}: ${caption}` });
  return html`<figure class="media-tile ${cls}${isVideo ? ' media-tile--video' : ''}" data-cats="${item.cats.join(' ')}"${index !== undefined ? attrs({ 'data-index': index }) : ''}>
    <button type="button" class="media-tile__btn"${trigger}>
      ${img(ctx, item.image, { alt: '', sizes })}
      <span class="media-tile__badge">${icon(ctx, isVideo ? 'play' : 'zoom-in')}</span>
    </button>
    <figcaption class="media-tile__caption">
      <span class="media-tile__title">${caption}</span>
      ${item.date ? html`<span class="media-tile__date">${ctx.t(item.date)}</span>` : ''}
    </figcaption>
  </figure>`;
}
