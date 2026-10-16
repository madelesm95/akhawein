import { html } from '../lib/html.mjs';
import { button, icon } from '../lib/components.mjs';
import { ui } from '../content/site.mjs';

const T = {
  title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
  description: { ar: 'عذراً، الصفحة التي تبحث عنها غير موجودة.', en: 'Sorry, the page you are looking for does not exist.' },
  text: { ar: 'ربما تغيّر الرابط أو حُذفت الصفحة. يمكنك العودة إلى الرئيسية أو التواصل معنا.', en: 'The link may have changed or the page may have moved. Head back home or get in touch.' },
  contact: { ar: 'تواصل معنا', en: 'Contact us' },
};

export default function notFound(ctx) {
  const body = html`<section class="not-found">
  <div class="container">
    <p class="not-found__code">${ctx.num(404, { useGrouping: false })}</p>
    <h1>${ctx.t(T.title)}</h1>
    <p>${ctx.t(T.text)}</p>
    <div class="not-found__actions">
      ${button(ctx, { href: ctx.url('home'), label: ui.home, iconName: 'arrow-left' })}
      ${button(ctx, { href: ctx.url('contact'), label: T.contact, variant: 'secondary' })}
    </div>
    ${ctx.lang === 'ar' ? html`<div class="not-found__alt" lang="en" dir="ltr">
      <p><strong>${T.title.en}.</strong> ${T.text.en}</p>
      <a class="link-arrow" href="/en">English home${icon(ctx, 'arrow-right')}</a>
    </div>` : ''}
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
