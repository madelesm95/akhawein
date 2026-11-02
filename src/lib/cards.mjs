import { html, attrs } from './html.mjs';
import { icon, img, accountDetails, largestImage, IMAGES } from './components.mjs';
import { findAccount } from '../content/accounts.mjs';
import { ui } from '../content/site.mjs';

const T = {
  giveTo: { ar: 'تبرّع لهذا الباب', en: 'Give to this cause' },
  dedicated: { ar: 'حساب مخصص', en: 'Dedicated account' },
  general: { ar: 'عبر الحساب العام', en: 'Via the general account' },
  beneficiaries: { ar: 'الفئات المستفيدة', en: 'Who benefits' },
};

export function causeCard(ctx, cause, { headingLevel = 3, withBeneficiaries = false, revealDelay } = {}) {
  const account = findAccount(cause.account);
  const dedicated = cause.account !== 'general';
  const h = `h${headingLevel}`;
  const style = revealDelay != null ? ` style="--reveal-delay: ${revealDelay}ms"` : '';
  const altText = `${ctx.t({ ar: 'تفاصيل الحالة', en: 'Case details' })}: ${ctx.t(cause.title)}`;
  return html`<article class="cause-card reveal"${style} id="cause-${cause.id}">
    <div class="cause-card__media" role="button" tabindex="0" onclick="openCauseModal('${cause.id}')" onkeydown="if(event.key==='Enter'||event.key===' ')openCauseModal('${cause.id}')" title="${ctx.t({ ar: `انقر لعرض تفاصيل ${ctx.t(cause.title)}`, en: `Click to view details for ${ctx.t(cause.title)}` })}">
      ${cause.image
        ? img(ctx, cause.image, { alt: altText, sizes: '(min-width: 1100px) 380px, (min-width: 700px) 45vw, 92vw', width: 960 })
        : html`<div class="art">${icon(ctx, cause.icon)}</div>`}
      <span class="cause-card__tag">${icon(ctx, cause.icon)}${ctx.t(cause.tag)}</span>
    </div>
    <div class="cause-card__body">
      <${h} class="cause-card__title"><a href="javascript:void(0)" onclick="openCauseModal('${cause.id}')">${ctx.t(cause.title)}</a></${h}>
      <p class="cause-card__text">${ctx.t(cause.summary)}</p>${withBeneficiaries && cause.beneficiaries?.length
        ? html`
      <div class="cause-card__beneficiaries">
        <p class="cause-card__beneficiaries-label">${icon(ctx, 'users')}${ctx.t(T.beneficiaries)}</p>
        <ul>${cause.beneficiaries.map((b) => html`<li>${ctx.t(b)}</li>`)}</ul>
      </div>`
        : ''}
      ${cause.progress != null ? html`
      <div class="cause-card__progress">
        <div class="cause-card__progress-head">
          <span>${ctx.t({ ar: 'نسبة الإنجاز', en: 'Progress' })}</span>
          <span class="cause-card__progress-pct"><span data-count="${cause.progress}">${ctx.num(cause.progress)}</span>%</span>
        </div>
        <div class="cause-card__progress-track"><span class="cause-card__progress-fill" style="--progress: ${cause.progress}%"></span></div>
        ${cause.raised ? html`
        <div class="cause-card__amounts">
          <div class="cause-card__amount-item">
            <span class="label">${ctx.t(cause.raisedLabel || { ar: 'تم جمع:', en: 'Raised:' })}</span>
            <span class="value">${ctx.t(cause.raised)}</span>
          </div>
          <div class="cause-card__amount-item goal">
            <span class="label">${ctx.t(cause.goalLabel || { ar: 'المستهدف:', en: 'Goal:' })}</span>
            <span class="value">${ctx.t(cause.goal)}</span>
          </div>
        </div>` : ''}
      </div>` : ''}
      <div class="cause-card__actions">
        <a class="btn btn--sm btn--primary" href="${ctx.url('donations', `acc-${account.id}`)}" title="${ctx.t({ ar: `حساب بنك مصر: ${account.number}`, en: `Banque Misr account: ${account.number}` })}">
          ${icon(ctx, 'landmark')}
          <span>${ctx.t({ ar: 'حساب بنك مصر', en: 'Banque Misr' })}</span>
        </a>
        <button type="button" class="btn btn--sm btn--secondary cause-card__details-btn" onclick="openCauseModal('${cause.id}')">
          ${icon(ctx, 'info')}
          <span>${ctx.t({ ar: 'تفاصيل الحالة', en: 'Case details' })}</span>
        </button>
      </div>
    </div>
  </article>`;
}

export function programCard(ctx, p, { headingLevel = 3, withText = true, withImage = false, revealDelay } = {}) {
  const h = `h${headingLevel}`;
  const style = revealDelay != null ? ` style="--reveal-delay: ${revealDelay}ms"` : '';
  if (withImage && p.image) {
    return html`<article class="program-card program-card--media reveal"${style} data-cats="${p.cats.join(' ')}">
      <button type="button" class="program-card__media"${attrs({ 'data-lightbox-item': '', 'data-type': 'image', 'data-src': largestImage(p.image), 'data-caption': ctx.t(p.title), 'aria-label': `${ctx.t(ui.enlarge)}: ${ctx.t(p.title)}` })}>
        ${img(ctx, p.image, { alt: p.title, sizes: '(min-width: 1100px) 380px, (min-width: 700px) 45vw, 92vw', width: 960 })}
        <span class="program-card__badge">${icon(ctx, p.icon)}${ctx.t(p.badge)}</span>
        <span class="program-card__zoom">${icon(ctx, 'zoom-in')}</span>
      </button>
      <div class="program-card__body">
        <${h} class="program-card__title">${ctx.t(p.title)}</${h}>
        ${withText ? html`<p class="program-card__text">${ctx.t(p.text)}</p>` : ''}
        ${p.stat ? html`<p class="program-card__stat"><span class="program-card__stat-label">${ctx.t(p.stat.label)}</span><span class="program-card__stat-value">${ctx.t(p.stat.value)}</span></p>` : ''}
      </div>
    </article>`;
  }
  return html`<article class="program-card reveal"${style} data-cats="${p.cats.join(' ')}">
    <span class="program-card__icon">${icon(ctx, p.icon)}</span>
    <${h} class="program-card__title">${ctx.t(p.title)}</${h}>
    ${withText ? html`<p class="program-card__text">${ctx.t(p.text)}</p>` : ''}
  </article>`;
}

export function mediaTile(ctx, item, { index, sizes = '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw', cls = '', revealDelay } = {}) {
  const isVideo = item.type === 'video';
  // `file` items are MP4s we host ourselves; `youtube` items are embedded by video id.
  const isFile = Boolean(item.file);
  const meta = IMAGES[item.image];
  // Only film posters get the letterboxed treatment; field photos keep their cropped tiles.
  const portrait = Boolean(isVideo && meta && meta.h > meta.w);
  const caption = ctx.t(item.title);
  const trigger = isVideo
    ? attrs({
      'data-lightbox-item': '',
      'data-type': isFile ? 'file' : 'video',
      'data-src': isFile ? item.file : item.youtube,
      'data-caption': caption,
      'data-orientation': portrait ? 'portrait' : null,
      'aria-label': `${ctx.t(ui.play)}: ${caption}`,
    })
    : attrs({ 'data-lightbox-item': '', 'data-type': 'image', 'data-src': largestImage(item.image), 'data-caption': caption, 'aria-label': `${ctx.t(ui.enlarge)}: ${caption}` });
  const mStyle = revealDelay != null ? ` style="--reveal-delay: ${revealDelay}ms"` : '';
  const classes = ['media-tile', 'reveal', cls, isVideo ? 'media-tile--video' : '', portrait ? 'media-tile--portrait' : '']
    .filter(Boolean).join(' ');
  // Portrait posters are letterboxed over a blurred copy of themselves so the artwork
  // is never cropped by the landscape tile.
  const poster = portrait
    ? html`${img(ctx, item.image, { alt: '', sizes, cls: 'media-tile__backdrop' })}${img(ctx, item.image, { alt: '', sizes, cls: 'media-tile__poster' })}`
    : img(ctx, item.image, { alt: '', sizes });
  return html`<figure class="${classes}" data-cats="${item.cats.join(' ')}"${index !== undefined ? attrs({ 'data-index': index }) : ''}${mStyle}>
    <button type="button" class="media-tile__btn"${trigger}>
      ${poster}
      <span class="media-tile__badge">${icon(ctx, isVideo ? 'play' : 'zoom-in')}</span>
    </button>
    <figcaption class="media-tile__caption">
      <span class="media-tile__title">${caption}</span>
      ${item.date ? html`<span class="media-tile__date">${ctx.t(item.date)}</span>` : ''}
    </figcaption>
  </figure>`;
}
