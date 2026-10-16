import { html } from '../lib/html.mjs';
import { icon, img, sectionHead, button, accountDetails, verse, telHref, largestImage } from '../lib/components.mjs';
import { causeCard, programCard, mediaTile } from '../lib/cards.mjs';
import { site, ui } from '../content/site.mjs';
import { causes } from '../content/causes.mjs';
import { programs, pillars } from '../content/programs.mjs';
import { gallery } from '../content/gallery.mjs';
import { protocols, partnerLogos } from '../content/partners.mjs';
import { findAccount } from '../content/accounts.mjs';
import { intro } from '../content/about.mjs';
import certificates from '../content/certificates.json' with { type: 'json' };

const T = {
  title: { ar: 'الرئيسية', en: 'Home' },
  description: {
    ar: 'جمعية أخوين الخيرية، جمعية أهلية مصرية مشهرة برقم ٧٧٠٢ لسنة ٢٠٠٩ وذات نفع عام، تعمل على كفالة الأيتام ورعاية الأسر الأكثر احتياجاً والخدمات الصحية والتعليمية.',
    en: 'Akhawein Charity is a registered Egyptian non-profit (No. 7702 of 2009) with public-benefit status, sponsoring orphans and supporting families in need with health and education programmes.',
  },
  kicker: { ar: 'يدٌ بالعطاء · يدٌ بالنماء · يدٌ بالدعاء', en: 'A hand that gives · a hand that builds · a hand that prays' },
  heroTitleA: { ar: 'معاً نصنع', en: 'Together, we build' },
  heroTitleB: { ar: 'الأمل', en: 'hope' },
  heroLead: {
    ar: 'نعمل يداً بيد لرفع المستوى المعيشي والتعليمي والصحي للأسر الأكثر احتياجاً، وكفالة الأيتام ورعاية كبار السن في محافظات مصر.',
    en: 'Hand in hand, we improve the living, education and health conditions of families in need, sponsor orphans and care for the elderly across Egypt.',
  },
  ourWork: { ar: 'تعرّف على عملنا', en: 'See our work' },
  years: { ar: 'عاماً من العطاء', en: 'years of giving' },
  heroCaption: { ar: 'متطوعو أخوين في جولة ميدانية', en: 'Akhawein volunteers on a field round' },
  impactEyebrow: { ar: 'أثرنا بالأرقام', en: 'Our impact' },
  impactTitle: { ar: 'عطاء يُقاس بحياة الناس', en: 'Giving measured in people’s lives' },
  impactNote: { ar: 'وفق سجلات الجمعية المعلنة', en: 'As published in Akhawein’s records' },
  aboutEyebrow: { ar: 'من نحن', en: 'Who we are' },
  aboutTitle: { ar: 'جمعية أهلية مصرية تعمل بجوار الدولة لخدمة الأسر الأولى بالرعاية', en: 'An Egyptian charity working alongside the state for families who need it most' },
  aboutCta: { ar: 'قصتنا ومجلس الإدارة', en: 'Our story and board' },
  causesEyebrow: { ar: 'أبواب الخير', en: 'Ways to give' },
  causesTitle: { ar: 'اختر الباب الذي تحب أن تساهم فيه', en: 'Choose where your gift goes' },
  causesLead: {
    ar: 'لكثير من الأبواب حساب بنكي رسمي مخصص، فيصل تبرعك مباشرة إلى الغرض الذي اخترته.',
    en: 'Many causes have their own official bank account, so your gift goes straight to the purpose you choose.',
  },
  allCauses: { ar: 'كل حالات التبرع', en: 'All causes' },
  programsEyebrow: { ar: 'ميادين العمل', en: 'Our work' },
  programsTitle: { ar: '١٦ ميداناً لخدمة الإنسان والمجتمع', en: '16 fields of work for people and community' },
  programsLead: { ar: 'من رعاية الطفولة إلى التمكين الاقتصادي، نغطي محاور التنمية المجتمعية كافة.', en: 'From childhood care to economic empowerment, we work across every area of community development.' },
  allPrograms: { ar: 'كل الميادين', en: 'All fields' },
  mediaEyebrow: { ar: 'من الميدان', en: 'From the field' },
  mediaTitle: { ar: 'لحظات حقيقية من عملنا اليومي', en: 'Real moments from our daily work' },
  allMedia: { ar: 'المركز الإعلامي', en: 'Media centre' },
  trustEyebrow: { ar: 'الثقة والشفافية', en: 'Trust and transparency' },
  trustTitle: { ar: 'جمعية مشهرة تعمل بشفافية ورقابة', en: 'Registered, supervised and transparent' },
  facts: [
    { icon: 'landmark', title: { ar: 'إشهار رسمي', en: 'Officially registered' }, text: { ar: 'مشهرة برقم ٧٧٠٢ لسنة ٢٠٠٩ تحت إشراف وزارة التضامن الاجتماعي', en: 'Registered under No. 7702 of 2009, supervised by the Ministry of Social Solidarity' } },
    { icon: 'scroll-text', title: { ar: 'نفع عام', en: 'Public-benefit status' }, text: { ar: 'بالقرار الوزاري رقم ١٦٠ لسنة ٢٠١٣', en: 'By Ministerial Decree No. 160 of 2013' } },
    { icon: 'badge-check', title: { ar: 'اعتماد دولي', en: 'International validation' }, text: { ar: 'حصلت على اعتماد CAF International الدولي في أبريل ٢٠٢٣', en: 'Validated by CAF International in April 2023' } },
    { icon: 'shield-check', title: { ar: 'رقابة مالية', en: 'Financial oversight' }, text: { ar: 'مراجعة دورية من الوزارة ومحاسب قانوني معتمد', en: 'Regular reviews by the Ministry and a certified accountant' } },
  ],
  partnersTitle: { ar: 'شركاء النجاح', en: 'Our partners' },
  honorsTitle: { ar: 'سجل الشرف', en: 'Wall of honour' },
  honorsText: { ar: 'شهادة شكر وتقدير توثّق مسيرة العطاء منذ ٢٠١١', en: 'certificates of appreciation recording our journey since 2011' },
  honorsCta: { ar: 'تصفح الشهادات', en: 'Browse certificates' },
  partnersCta: { ar: 'الشراكات والبروتوكولات', en: 'Partnerships and protocols' },
  ctaTitle: { ar: 'تبرعك يصل إلى من يستحقه', en: 'Your gift reaches those who need it' },
  ctaText: {
    ar: 'حوّل إلى الحساب العام للجمعية لدى بنك مصر، ثم أرسل صورة الإيصال على واتساب لنسجل تبرعك ونرسل لك إيصالاً رسمياً.',
    en: 'Transfer to our general account at Banque Misr, then send a photo of the receipt on WhatsApp so we can record your gift and send you an official receipt.',
  },
  sendReceipt: { ar: 'أرسل الإيصال على واتساب', en: 'Send your receipt on WhatsApp' },
  allAccounts: { ar: 'كل الحسابات البنكية', en: 'All bank accounts' },
  generalAccount: { ar: 'الحساب العام · بنك مصر · فرع صلاح سالم', en: 'General account · Banque Misr · Salah Salem' },
};

export default function home(ctx) {
  const years = new Date().getFullYear() - site.founded;
  const general = findAccount('general');
  const caf = protocols.find((p) => p.id === 'caf');
  const featuredMedia = ['volunteers-walk', 'meals-prep', 'fayoum-honoring', 'orphan-tanoura', 'fayoum-graduates']
    .map((id) => gallery.find((g) => g.image === id));
  const video = gallery.find((g) => g.type === 'video');
  const receiptText = ctx.lang === 'ar' ? 'السلام عليكم، أرسل لكم إيصال تحويل تبرع لجمعية أخوين الخيرية' : 'Hello, I am sending the receipt for my donation to Akhawein Charity';
  const honorsCount = certificates.filter((c) => c.group !== 'memorial').length;

  const body = html`
<section class="hero">
  <div class="container hero__grid">
    <div class="hero__content">
      <p class="hero__kicker">${ctx.t(T.kicker)}</p>
      <h1 class="hero__title">${ctx.t(T.heroTitleA)} <span class="hero__accent">${ctx.t(T.heroTitleB)}</span></h1>
      <p class="hero__lead">${ctx.t(T.heroLead)}</p>
      <div class="hero__actions">
        ${button(ctx, { href: ctx.url('donations'), label: ui.donateLong, iconName: 'heart', size: 'lg' })}
        ${button(ctx, { href: ctx.url('activities'), label: T.ourWork, variant: 'ghost', iconEnd: 'arrow-right', size: 'lg' })}
      </div>
      <ul class="hero__trust">
        <li>${icon(ctx, 'landmark')}<span>${ctx.t(site.registration)}</span></li>
        <li>${icon(ctx, 'scroll-text')}<span>${ctx.t(site.publicBenefit)}</span></li>
        <li>${icon(ctx, 'shield-check')}<span>${ctx.t(site.supervisor)}</span></li>
      </ul>
    </div>
    <div class="hero__media">
      <figure class="hero__photo hero__photo--main">${img(ctx, 'volunteers-walk', { alt: ctx.t(T.heroCaption), sizes: '(min-width: 1100px) 340px, 50vw', eager: true })}</figure>
      <figure class="hero__photo hero__photo--a">${img(ctx, 'meals-prep', { alt: '', sizes: '(min-width: 1100px) 280px, 40vw' })}</figure>
      <figure class="hero__photo hero__photo--b">${img(ctx, 'volunteers-group', { alt: '', sizes: '(min-width: 1100px) 280px, 40vw' })}</figure>
      <div class="hero__badge">
        <span class="hero__badge-num">${ctx.num(years)}+</span>
        <span class="hero__badge-text">${ctx.t(T.years)}</span>
      </div>
    </div>
  </div>
</section>

<section class="impact" aria-labelledby="impact-title">
  <div class="container">
    <div class="impact__head">
      <p class="eyebrow eyebrow--light">${ctx.t(T.impactEyebrow)}</p>
      <h2 class="impact__title" id="impact-title">${ctx.t(T.impactTitle)}</h2>
    </div>
    <ul class="impact__grid">
      ${site.stats.map((s) => html`<li class="stat">
        <span class="stat__value"><span data-count="${s.value}">${ctx.num(s.value)}</span>${s.plus ? '+' : ''}</span>
        <span class="stat__label">${ctx.t(s.label)}</span>
      </li>`)}
    </ul>
    <p class="impact__note">${ctx.t(T.impactNote)}</p>
  </div>
</section>

<section class="section about-intro">
  <div class="container about-intro__grid">
    <div class="about-intro__media reveal">
      ${img(ctx, 'senior-hands', { alt: '', sizes: '(min-width: 1100px) 520px, 92vw' })}
      ${verse(ctx, site.verse, { cls: 'verse--card' })}
    </div>
    <div class="about-intro__text reveal">
      <p class="eyebrow">${ctx.t(T.aboutEyebrow)}</p>
      <h2 class="section-title">${ctx.t(T.aboutTitle)}</h2>
      <p class="lead">${ctx.t(intro)}</p>
      <ul class="pillars">
        ${pillars.map((p) => html`<li>${icon(ctx, p.icon)}<span>${ctx.t(p.text)}</span></li>`)}
      </ul>
      ${button(ctx, { href: ctx.url('about'), label: T.aboutCta, variant: 'secondary', iconEnd: 'arrow-right' })}
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="causes-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: T.causesEyebrow, title: T.causesTitle, lead: T.causesLead, id: 'causes-title', action: button(ctx, { href: ctx.url('causes'), label: T.allCauses, variant: 'secondary', iconEnd: 'arrow-right' }) })}
    <div class="cause-grid">
      ${causes.slice(0, 6).map((c) => causeCard(ctx, c))}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="programs-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: T.programsEyebrow, title: T.programsTitle, lead: T.programsLead, id: 'programs-title', action: button(ctx, { href: ctx.url('activities'), label: T.allPrograms, variant: 'secondary', iconEnd: 'arrow-right' }) })}
    <div class="program-grid program-grid--compact">
      ${programs.slice(0, 8).map((p) => programCard(ctx, p, { withText: false }))}
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="media-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: T.mediaEyebrow, title: T.mediaTitle, id: 'media-title', action: button(ctx, { href: ctx.url('gallery'), label: T.allMedia, variant: 'secondary', iconEnd: 'arrow-right' }) })}
    <div class="mosaic" data-lightbox-group>
      ${mediaTile(ctx, video, { cls: 'mosaic__a', sizes: '(min-width: 1100px) 640px, 100vw' })}
      ${featuredMedia.map((m, i) => mediaTile(ctx, m, { cls: `mosaic__${'bcdef'[i]}`, sizes: '(min-width: 1100px) 320px, 50vw' }))}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="trust-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: T.trustEyebrow, title: T.trustTitle, id: 'trust-title', align: 'center' })}
    <ul class="facts">
      ${T.facts.map((f) => html`<li class="fact">${icon(ctx, f.icon)}<h3>${ctx.t(f.title)}</h3><p>${ctx.t(f.text)}</p></li>`)}
    </ul>
    <div class="trust-row">
      <a class="caf-card" href="${ctx.url('protocols')}">
        <span class="caf-card__img">${img(ctx, caf.image, { alt: ctx.t(caf.title), sizes: '160px', width: 480 })}</span>
        <span class="caf-card__body">
          <span class="caf-card__kind">${ctx.t(caf.kind)}</span>
          <span class="caf-card__title">${ctx.t(caf.title)}</span>
          <span class="caf-card__meta">${ctx.t(caf.meta)}</span>
          <span class="link-arrow">${ctx.t(T.partnersCta)}${icon(ctx, 'arrow-right')}</span>
        </span>
      </a>
      <a class="honors-card" href="${ctx.url('certificates')}">
        <span class="honors-card__icon">${icon(ctx, 'award')}</span>
        <span class="honors-card__num">${ctx.num(honorsCount)}</span>
        <span class="honors-card__text">${ctx.t(T.honorsText)}</span>
        <span class="link-arrow">${ctx.t(T.honorsCta)}${icon(ctx, 'arrow-right')}</span>
      </a>
    </div>
    <div class="partners">
      <h3 class="partners__title">${ctx.t(T.partnersTitle)}</h3>
      <ul class="partners__list">
        ${partnerLogos.map((p) => html`<li title="${p.name}">${img(ctx, p.logo, { alt: p.name, sizes: '160px' })}</li>`)}
      </ul>
    </div>
  </div>
</section>

<section class="cta-band" aria-labelledby="cta-title">
  <div class="container cta-band__grid">
    <div>
      <p class="eyebrow eyebrow--light">${ctx.t(ui.donateLong)}</p>
      <h2 class="cta-band__title" id="cta-title">${ctx.t(T.ctaTitle)}</h2>
      <p class="cta-band__text">${ctx.t(T.ctaText)}</p>
      <div class="cta-band__actions">
        ${button(ctx, { href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(receiptText)}`, label: T.sendReceipt, iconName: 'brand-whatsapp', external: true })}
        ${button(ctx, { href: ctx.url('donations'), label: T.allAccounts, variant: 'ghost-light', iconEnd: 'arrow-right' })}
      </div>
    </div>
    <div class="cta-band__account">
      <p class="cta-band__account-title">${icon(ctx, 'landmark')}${ctx.t(T.generalAccount)}</p>
      ${accountDetails(ctx, general)}
    </div>
  </div>
</section>`;

  return { title: T.title, description: T.description, body, isHome: true };
}
