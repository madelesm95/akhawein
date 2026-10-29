import { html } from '../lib/html.mjs';
import { icon, img, button, verse, largestImage } from '../lib/components.mjs';
import { stories, storiesVerse } from '../content/stories.mjs';
import { site, ui } from '../content/site.mjs';

const T = {
  title: { ar: 'قصص من الميدان', en: 'Stories from the field' },
  description: {
    ar: 'خمس حالات حقيقية وثّقتها جمعية أخوين الخيرية بملفاتها الطبية: مؤيد، صابر، جيهان، تمارا، سناء. قصص علاج ورعاية تحوّلت إلى حياة جديدة.',
    en: 'Five real cases documented by Akhawein Charity with their medical files: Moayad, Saber, Gehan, Tamara and Sanaa — stories of treatment and care that became new lives.',
  },
  eyebrow: { ar: 'ملفات موثّقة', en: 'Documented cases' },
  heroTitle: { ar: 'قصص تستحق أن تُروى', en: 'Stories worth telling' },
  heroLead: {
    ar: 'خلف كل ملف طبي اسم ووجه وحياة. خمس حالات وصلت إلينا، فتحنا ملفها، وتابعنا علاجها حتى عادت إلى الحياة. هذه ليست أرقاماً؛ هذه قصصهم.',
    en: 'Behind every medical file is a name, a face and a life. Five cases reached us, we opened their files and followed their treatment until they returned to life. These are not numbers — these are their stories.',
  },
  readCases: { ar: 'اقرأ الحالات', en: 'Read the cases' },
  supportCase: { ar: 'ساهم في حالة جديدة', en: 'Support the next case' },
  heroNote: { ar: 'ملفات وتقارير علاج موثّقة لدى الجمعية', en: 'Case files and treatment reports on record' },
  indexLabel: { ar: 'فهرس الحالات', en: 'Case index' },
  listEyebrow: { ar: 'الحالات الخمس', en: 'The five cases' },
  listTitle: { ar: 'من الحادث إلى الحياة', en: 'From injury to life' },
  listLead: {
    ar: 'كل حالة هنا مرّت بالمسار نفسه: بلاغ، ثم تقرير طبي، ثم تدخّل عاجل، ثم متابعة. نعرض الملف كما هو، بلا تهويل ولا اختصار.',
    en: 'Each case here followed the same path: a report, a medical assessment, urgent intervention, then follow-up. We present the file as it is — nothing exaggerated, nothing left out.',
  },
  casesCount: { ar: 'حالات موثّقة', en: 'documented cases' },
  fileLabel: { ar: 'ملف الحالة', en: 'Case file' },
  fileNote: { ar: 'الملصق الأصلي للحالة', en: 'The original case poster' },
  zoom: { ar: 'تكبير الملف', en: 'View the file' },
  outcomeLabel: { ar: 'النتيجة', en: 'Outcome' },
  storyCta: { ar: 'ساهم في حالة مشابهة', en: 'Support a similar case' },
  causesLink: { ar: 'حالات التبرع', en: 'Donation causes' },
  howEyebrow: { ar: 'كيف نعمل', en: 'How we work' },
  howTitle: { ar: 'من البلاغ إلى الحياة', en: 'From the first report to a life resumed' },
  howLead: {
    ar: 'لا نتعامل مع الحالات كأرقام. لكل ملف مسار واضح، وكل خطوة موثّقة قبلها وبعدها.',
    en: 'We do not treat cases as numbers. Every file has a clear path, and every step is documented before and after.',
  },
  steps: [
    {
      icon: 'clipboard-list',
      title: { ar: 'نفتح الملف', en: 'We open the file' },
      text: {
        ar: 'نستلم الحالة ونراجع التقارير الطبية والأوراق الرسمية قبل أي قرار، ونتأكد من الاحتياج الحقيقي.',
        en: 'We receive the case, review the medical reports and official papers before any decision, and confirm the real need.',
      },
    },
    {
      icon: 'stethoscope',
      title: { ar: 'نتحمّل العلاج', en: 'We cover the treatment' },
      text: {
        ar: 'نتكفّل بالجراحة أو العلاج أو التأهيل كاملاً، ونتابع مع المستشفى خطوة بخطوة حتى اكتمال الرعاية.',
        en: 'We cover surgery, treatment or rehabilitation in full, and follow every step with the hospital until care is complete.',
      },
    },
    {
      icon: 'house-heart',
      title: { ar: 'نعود إلى الحياة', en: 'A return to life' },
      text: {
        ar: 'لا ينتهي الملف عند خروج المريض؛ نتابع النتيجة ونوثّقها، ثم نفتح ملفاً جديداً لحالة تنتظر.',
        en: 'The file does not close when the patient leaves; we follow and document the outcome, then open the next file for someone waiting.',
      },
    },
  ],
  verseEyebrow: { ar: 'لماذا نفعله', en: 'Why we do it' },
  verseNote: {
    ar: 'حياة واحدة تستحق كل هذا. تبرعك هو ما يجعل الملف القادم ممكناً.',
    en: 'One life is worth all of this. Your gift is what makes the next file possible.',
  },
  ctaEyebrow: { ar: 'القصة القادمة', en: 'The next story' },
  ctaTitle: { ar: 'قصتهم القادمة تبدأ بتبرعك', en: 'Their next story starts with your gift' },
  ctaText: {
    ar: 'حوّل إلى الحساب العام للجمعية لدى بنك مصر، أو تبرع أونلاين، ثم أرسل صورة الإيصال على واتساب لنوثّق تبرعك ونرسل لك إيصالاً رسمياً.',
    en: 'Transfer to our general account at Banque Misr, or give online, then send your receipt on WhatsApp so we can record your gift and send an official receipt.',
  },
  donateNow: { ar: 'تبرع الآن', en: 'Donate now' },
  sendReceipt: { ar: 'أرسل الإيصال على واتساب', en: 'Send your receipt on WhatsApp' },
  viewCauses: { ar: 'تصفح حالات التبرع', en: 'Browse the causes' },
  storyNav: { ar: 'انتقل بين الحالات', en: 'Jump to a case' },
};

const pad = (ctx, n) => ctx.num(n);
const posterAlt = (ctx, story) => (ctx.lang === 'ar' ? `ملف حالة ${story.name.ar}` : `Case file: ${story.name.en}`);
const posterCaption = (ctx, story) => `${ctx.t(story.name)} — ${ctx.t(story.headline)}`;

function posterButton(ctx, story, { cls, sizes, eager = false }) {
  const id = ctx.t(story.poster);
  return html`<button type="button" class="${cls}" data-lightbox-item data-type="image" data-src="${largestImage(id)}" data-caption="${posterCaption(ctx, story)}" aria-label="${ctx.t(T.zoom)} — ${ctx.t(story.name)}">
    ${img(ctx, id, { alt: posterAlt(ctx, story), sizes, eager })}
  </button>`;
}

export default function storiesPage(ctx) {
  const receiptText = ctx.lang === 'ar'
    ? 'السلام عليكم، أرسل لكم إيصال تحويل تبرع لجمعية أخوين الخيرية'
    : 'Hello, I am sending the receipt for my donation to Akhawein Charity';

  const body = html`
<section class="stories-hero">
  <div class="container">
    <nav class="breadcrumb" aria-label="${ctx.t(ui.breadcrumb)}">
      <ol>
        <li><a href="${ctx.url('home')}">${ctx.t(ui.home)}</a></li>
        <li>${icon(ctx, 'chevron-right')}<span aria-current="page">${ctx.t(T.title)}</span></li>
      </ol>
    </nav>
    <div class="stories-hero__grid">
      <div class="stories-hero__text reveal">
        <p class="eyebrow">${ctx.t(T.eyebrow)}</p>
        <h1 class="stories-hero__title">${ctx.t(T.heroTitle)}</h1>
        <p class="stories-hero__lead">${ctx.t(T.heroLead)}</p>
        <div class="stories-hero__actions">
          ${button(ctx, { href: '#case-index', label: T.readCases, iconEnd: 'arrow-right', size: 'lg' })}
          ${button(ctx, { href: ctx.url('donations'), label: T.supportCase, variant: 'ghost', iconName: 'heart', size: 'lg' })}
        </div>
        <p class="stories-hero__note">${icon(ctx, 'shield-check')}<span>${ctx.t(T.heroNote)}</span></p>
      </div>
      <div class="stories-hero__collage reveal" style="--reveal-delay: 150ms" data-lightbox-group>
        ${posterButton(ctx, stories[3], { cls: 'stories-hero__poster stories-hero__poster--a', sizes: '(min-width: 1100px) 210px, 34vw', eager: true })}
        ${posterButton(ctx, stories[0], { cls: 'stories-hero__poster stories-hero__poster--b', sizes: '(min-width: 1100px) 250px, 40vw', eager: true })}
        ${posterButton(ctx, stories[2], { cls: 'stories-hero__poster stories-hero__poster--c', sizes: '(min-width: 1100px) 200px, 32vw', eager: true })}
        <p class="stories-hero__count"><span>${ctx.num(stories.length)}</span>${ctx.t(T.casesCount)}</p>
      </div>
    </div>
  </div>
</section>

<nav class="case-nav" id="case-index" aria-label="${ctx.t(T.storyNav)}">
  <div class="container case-nav__inner">
    <span class="case-nav__label">${ctx.t(T.indexLabel)}</span>
    <ul>
      ${stories.map((s, i) => html`<li><a href="#story-${s.id}" data-case-link><span>${pad(ctx, i + 1)}</span>${ctx.t(s.name)}</a></li>`)}
    </ul>
  </div>
</nav>

<section class="section stories-list" aria-labelledby="cases-title">
  <div class="container">
    <header class="stories-list__head">
      <div>
        <p class="eyebrow">${ctx.t(T.listEyebrow)}</p>
        <h2 class="section-title" id="cases-title">${ctx.t(T.listTitle)}</h2>
        <p class="lead">${ctx.t(T.listLead)}</p>
      </div>
      <p class="stories-list__count"><span>${ctx.num(stories.length)}</span>${ctx.t(T.casesCount)}</p>
    </header>

    <div class="case-stack" data-lightbox-group>
      ${stories.map((s, i) => html`<article class="case-story reveal" id="story-${s.id}" aria-labelledby="story-${s.id}-title">
        <div class="case-story__media">
          <figure class="case-file">
            <div class="case-file__tab">
              <span>${icon(ctx, 'clipboard-list')}${ctx.t(T.fileLabel)}</span>
              <span>${pad(ctx, i + 1)}</span>
            </div>
            <button type="button" class="case-file__frame" data-lightbox-item data-type="image" data-src="${largestImage(ctx.t(s.poster))}" data-caption="${posterCaption(ctx, s)}" aria-label="${ctx.t(T.zoom)} — ${ctx.t(s.name)}">
              ${img(ctx, ctx.t(s.poster), { alt: posterAlt(ctx, s), sizes: '(min-width: 1100px) 460px, (min-width: 821px) 42vw, 92vw', width: 1080 })}
              <span class="case-file__zoom">${icon(ctx, 'zoom-in')}${ctx.t(T.zoom)}</span>
            </button>
            <figcaption><span>${ctx.t(T.fileNote)}</span><span>${ctx.t(s.meta)}</span></figcaption>
          </figure>
        </div>

        <div class="case-story__body">
          <div class="case-story__head">
            <span class="case-story__kind">${icon(ctx, s.icon)}${ctx.t(s.kind)}</span>
          </div>
          <p class="case-story__name">${ctx.t(s.name)}<span>${ctx.t(s.meta)}</span></p>
          <h3 class="case-story__title" id="story-${s.id}-title">${ctx.t(s.headline)}</h3>
          <p class="case-story__lead">${ctx.t(s.lead)}</p>
          <div class="case-story__text">${s.body.map((p) => html`<p>${ctx.t(p)}</p>`)}</div>
          <dl class="case-facts">
            ${s.facts.map((f) => html`<div><dt>${icon(ctx, f.icon)}${ctx.t(f.label)}</dt><dd>${ctx.t(f.value)}</dd></div>`)}
          </dl>
          <div class="case-outcome">
            ${icon(ctx, 'circle-check')}
            <div><strong>${ctx.t(T.outcomeLabel)}</strong><p>${ctx.t(s.outcome)}</p></div>
          </div>
          <div class="case-story__actions">
            ${button(ctx, { href: ctx.url('donations'), label: T.storyCta, variant: 'secondary', iconEnd: 'arrow-right' })}
            <a class="link-arrow" href="${ctx.url('causes')}">${ctx.t(T.causesLink)}${icon(ctx, 'arrow-right')}</a>
          </div>
        </div>
      </article>`)}
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="how-title">
  <div class="container">
    <header class="section-head">
      <div class="section-head__text">
        <p class="eyebrow">${ctx.t(T.howEyebrow)}</p>
        <h2 class="section-title" id="how-title">${ctx.t(T.howTitle)}</h2>
        <p class="lead">${ctx.t(T.howLead)}</p>
      </div>
    </header>
    <ol class="story-steps">
      ${T.steps.map((s, i) => html`<li class="story-step reveal" style="--reveal-delay: ${i * 90}ms">
        <span class="story-step__icon">${icon(ctx, s.icon)}</span>
        <h3>${ctx.t(s.title)}</h3>
        <p>${ctx.t(s.text)}</p>
      </li>`)}
    </ol>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="stories-verse reveal">
      <p class="eyebrow eyebrow--light">${ctx.t(T.verseEyebrow)}</p>
      ${verse(ctx, storiesVerse)}
      <p class="stories-verse__note">${ctx.t(T.verseNote)}</p>
    </div>
  </div>
</section>

<section class="cta-band cta-band--stories" aria-labelledby="stories-cta-title">
  <div class="container cta-band__grid">
    <div>
      <p class="eyebrow eyebrow--light">${ctx.t(T.ctaEyebrow)}</p>
      <h2 class="cta-band__title" id="stories-cta-title">${ctx.t(T.ctaTitle)}</h2>
      <p class="cta-band__text">${ctx.t(T.ctaText)}</p>
      <div class="cta-band__actions">
        ${button(ctx, { href: ctx.url('donations'), label: T.donateNow, iconName: 'heart' })}
        ${button(ctx, { href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(receiptText)}`, label: T.sendReceipt, iconName: 'brand-whatsapp', variant: 'ghost-light', external: true })}
        ${button(ctx, { href: ctx.url('causes'), label: T.viewCauses, variant: 'ghost-light', iconEnd: 'arrow-right' })}
      </div>
    </div>
  </div>
</section>`;

  return { title: T.title, description: T.description, body };
}
