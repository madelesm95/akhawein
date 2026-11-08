import { html } from '../lib/html.mjs';
import { pageHero, icon, button } from '../lib/components.mjs';
import { site } from '../content/site.mjs';

const T = {
  title: { ar: 'سياسة الاسترداد والإلغاء', en: 'Refund & Cancellation Policy' },
  description: {
    ar: 'سياسة الاسترداد والإلغاء لتبرعات جمعية أخوين الخيرية: متى يمكن استرداد مبلغ تبرع، وكيف تطلب الاسترداد، ومدة المعالجة.',
    en: 'Akhawein Charity donation refund and cancellation policy: when a donation can be refunded, how to request one, and processing times.',
  },
  eyebrow: { ar: 'عطاء مسؤول وشفافية كاملة', en: 'Responsible giving, full transparency' },
  heroTitle: { ar: 'سياسة الاسترداد والإلغاء', en: 'Refund & Cancellation Policy' },
  heroLead: {
    ar: 'تبرعاتكم هبات تطوعية توجّه إلى الأسر الأولى بالرعاية. هنا نشرح متى يمكن استرداد تبرع، ومتى لا يمكن، وكيف تتم المعالجة.',
    en: 'Your donations are voluntary gifts directed to the families who need them most. Here we explain when a donation can be refunded, when it cannot, and how the process works.',
  },
  updated: { ar: 'آخر تحديث: ٨ نوفمبر ٢٠٢٦', en: 'Last updated: 8 November 2026' },
  contactTitle: { ar: 'طلب استرداد أو إلغاء', en: 'Request a refund or cancellation' },
  relatedTitle: { ar: 'سياسات أخرى', en: 'Other policies' },
  related: [
    { key: 'privacy', ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    { key: 'delivery', ar: 'سياسة التوصيل والشحن', en: 'Delivery & Shipping Policy' },
    { key: 'contact', ar: 'تواصل معنا', en: 'Contact us' },
  ],
  sections: [
    {
      h: { ar: '١. نطاق هذه السياسة', en: '1. What this policy covers' },
      p: [
        {
          ar: 'تنطبق هذه السياسة على التبرعات التي تتم عبر موقعنا بوسائل الدفع الإلكتروني (Paymob: فيزا / ماستركارد / ميزة، والمحافظ الإلكترونية، وفوري) وعلى التحويلات البنكية إلى حسابات الجمعية المعلنة لدى بنك مصر. جميع المبالغ المعروضة في الموقع بالجنيه المصري (EGP).',
          en: 'This policy covers donations made through our website by online payment (Paymob: Visa / Mastercard / Meeza, mobile wallets and Fawry) and bank transfers to the charity’s published Banque Misr accounts. All amounts shown on the website are in Egyptian Pounds (EGP).',
        },
      ],
    },
    {
      h: { ar: '٢. القاعدة العامة', en: '2. The general rule' },
      p: [
        {
          ar: 'التبرع هبة تطوعية كاملة، وبمجرد أن يكتمل ويُسجَّل ويُصرف في برامج المساعدة أو يرسل في طريقه إلى المستفيدين لا يمكن استرداده. يهدف ذلك إلى ضمان وصول العطاء إلى مستحقيه بسرعة وبما يتوافق مع شروط مانحيها وضوابط الزكاة والصدقة عند توافرها.',
          en: 'A donation is a complete voluntary gift, and once it is completed, recorded and spent on aid programmes or dispatched to beneficiaries it cannot be refunded. This ensures your gift reaches the people it was intended for quickly and in line with the donor’s wishes and, where applicable, zakat and charity conditions.',
        },
      ],
    },
    {
      h: { ar: '٣. متى يمكن النظر في الاسترداد؟', en: '3. When a refund may be considered' },
      p: [
        {
          ar: 'ننظر في طلب الاسترداد فقط في الحالات التالية، وبشرط ألا يكون التبرع قد صُرف أو نُفذ بعد:',
          en: 'We consider a refund request only in the following cases, provided the donation has not yet been spent or implemented:',
        },
      ],
      list: [
        {
          ar: 'الدفع المكرر أو الخصم المزدوج لنفس التبرع.',
          en: 'A duplicate payment or double debit for the same donation.',
        },
        {
          ar: 'إدخال مبلغ غير مقصود أو اختيار باب تبرع خاطئ، وطلب الاسترداد أو التصحيح قبل التنفيذ.',
          en: 'An unintentionally entered amount or a wrongly selected cause, with a refund or correction request made before implementation.',
        },
        {
          ar: 'عملية دفع فاشلة أو معلّقة تم خصمها فعلاً من حسابك أو بطاقتك وظهرت لدينا كمدفوعة بعد المطابقة.',
          en: 'A failed or pending payment that was actually charged to your account or card and appears as paid after reconciliation.',
        },
        {
          ar: 'حالة خاصة مثل صك أضحية لم يُذبح أو لم تُنفّذ بسبب موسمي—وفي هذه الحالة نتواصل معك لاختيار إما الاسترداد أو توجيه المبلغ إلى باب آخر.',
          en: 'A special case such as an udhiyah voucher that was not slaughtered or implemented for seasonal reasons — in which case we will contact you to choose either a refund or redirecting the amount to another cause.',
        },
      ],
    },
    {
      h: { ar: '٤. متى لا يمكن الاسترداد؟', en: '4. When a refund is not possible' },
      list: [
        {
          ar: 'إذا كان التبرع قد صُرف فعلاً في برامج المساعدة، أو وُزّع على المستفيدين، أو اكتمل تنفيذ الغرض.',
          en: 'If the donation has already been spent on aid programmes, distributed to beneficiaries, or its purpose has been completed.',
        },
        {
          ar: 'إذا انقضت مهلة الطلب دون تزويدنا بالرقم المرجعي أو مستندات الإثبات اللازمة للمطابقة.',
          en: 'If the request deadline has passed without providing the reference number or the proof documents needed for reconciliation.',
        },
        {
          ar: 'إذا ثبت من سجلات Paymob أو البنك أن العملية غير مكتملة أو غير مخصومة أصلاً (وفي هذه الحالة لا يوجد مبلغ لاسترداده).',
          en: 'If Paymob or bank records show the transaction never completed or was never charged (in which case there is no amount to refund).',
        },
      ],
    },
    {
      h: { ar: '٥. مهلة وطريقة طلب الاسترداد', en: '5. How and when to request a refund' },
      p: [
        {
          ar: 'لطلب الاسترداد تواصل معنا خلال ١٤ يوماً من تاريخ الدفع، برجاء إرسال:',
          en: 'To request a refund, contact us within 14 days of the payment date, please including:',
        },
      ],
      list: [
        {
          ar: 'الاسم الكامل ورقم الموبايل كما أدخلته في التبرع.',
          en: 'Your full name and mobile number exactly as entered for the donation.',
        },
        {
          ar: 'الرقم المرجعي للعملية (إن ظهر) وصورة إيصال الدفع أو كشف البنك الذي يوضح الخصم.',
          en: 'The transaction reference number (if shown) and a photo of the payment receipt or bank statement showing the debit.',
        },
        {
          ar: 'شخصية مستخدم الحساب أو البطاقة الذي تم الخصم منه.',
          en: 'The identity of the account or card holder who was charged.',
        },
      ],
      p2: {
        ar: 'نراجع الطلب والتحقق من سجلاتنا (Paymob والسجل الداخلي وكشف البنك) ثم نرد عليك خلال ١٠ أيام عمل. التبرعات البنكية تُطابق يدوياً وتحتاج مستند الإثبات دائماً.',
        en: 'We review the request and verify it against our records (Paymob, our internal ledger and bank statements), then reply within 10 business days. Bank-transfer donations are reconciled manually and always require proof.',
      },
    },
    {
      h: { ar: '٦. طريقة ومدة الاسترداد', en: '6. How and when refunds are issued' },
      p: [
        {
          ar: 'عند قبول الاسترداد يتم رده عبر وسيلة الدفع الأصلية قدر الإمكان: إلغاء أو عكس عملية Paymob، أو تحويل بنكي إلى ذات الحساب الذي تم الخصم منه. بعد الاعتماد عادة خلال ٥ إلى ١٠ أيام عمل مضافة إلى المدة التي يستغرقها البنك أو المحفظة أو فوري لظهور المبلغ. إذا تعذّر الرد إلى الوسيلة الأصلية لأسباب تقنية أو بنكية، نتواصل معك لترتيب التحويل إلى حسابك البنكي.',
          en: 'When a refund is approved it is returned via the original payment method where possible: a Paymob reversal, or a bank transfer to the same account that was charged. After approval it normally takes a further 5–10 business days for the bank, wallet or Fawry to post the amount. If returning to the original method is not technically or bankingly possible, we will contact you to arrange a transfer to your bank account.',
        },
        {
          ar: 'قد لا يمكن استرداد رسوم تُحصّلها جهة خارجية (مثل رسوم بنكية أو رسوم وسيطة) إن كانت منطبقة عند عملية الدفع.',
          en: 'Any fees imposed by an external party (such as bank or intermediary fees) may not be refundable if they applied at the time of payment.',
        },
      ],
    },
    {
      h: { ar: '٧. إلغاء التبرع', en: '7. Cancelling a donation' },
      p: [
        {
          ar: 'إذا بدأت تبرعاً أونلاين ولم تدفع بعد (أو اخترت فوري ولم تسدد الرقم المرجعي)، فلا يوجد ما يُلغى—اترك العملية دون إتمام وستمتهي مهلتها تلقائياً. إذا كنت تريد إلغاء تبرع مكتمل، يسري عليه ما في البنود ٣ إلى ٦ أعلاه.',
          en: 'If you started an online donation but have not yet paid (or chose Fawry and did not pay the reference), there is nothing to cancel — just leave the transaction incomplete and it will lapse automatically. If you wish to cancel a completed donation, sections 3–6 above apply.',
        },
      ],
    },
    {
      h: { ar: '٨. مبالغ بالعملات غير الجنيه المصري', en: '8. Amounts sent in currencies other than EGP' },
      p: [
        {
          ar: 'يتم تسجيل جميع التبرعات بالجنيه المصري. إذا حوّلت من خارج مصر بالآيبان بعملة أخرى، يتم تنفيذ التحويل بسعر الصرف لدى البنك المراسل وقت التنفيذ، ويُسجَّل بالجنيه المستلم فعلياً. أي فرق بسبب رسوم التحويل أو سعر الصرف لا يمكن استرداده بعد تنفيذ التحويل.',
          en: 'All donations are recorded in Egyptian Pounds. If you transfer from outside Egypt by IBAN in another currency, the transfer is executed at the correspondent bank’s exchange rate at execution and recorded at the EGP amount actually received. Any difference due to transfer fees or exchange rates cannot be refunded after the transfer has been executed.',
        },
      ],
    },
  ],
};

export default function refundPage(ctx) {
  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }] })}
<section class="section">
  <div class="container policy-layout">
    <div class="policy-content reveal">
      <p class="policy-updated">${ctx.t(T.updated)} · ${ctx.t(site.name)} · ${ctx.t(site.registration)}</p>
      ${T.sections.map((s) => html`
      <section class="policy-section">
        <h2>${ctx.t(s.h)}</h2>
        ${s.p ? s.p.map((para) => html`<p>${ctx.t(para)}</p>`) : ''}
        ${s.list ? html`<ul class="policy-list">${s.list.map((li) => html`<li>${ctx.t(li)}</li>`)}</ul>` : ''}
        ${s.p2 ? html`<p>${ctx.t(s.p2)}</p>` : ''}
      </section>`)}
      <div class="policy-contact">
        <h2>${ctx.t(T.contactTitle)}</h2>
        <ul class="policy-list">
          <li><a href="mailto:${site.email}">${site.email}</a> · <a href="tel:${site.phoneIntl}" dir="ltr">${site.phone}</a> · <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${ctx.t({ ar: 'واتساب', en: 'WhatsApp' })}</a></li>
          <li>${ctx.t(site.address)}</li>
          <li>${ctx.t(site.hours)}</li>
        </ul>
        <p>${ctx.t({ ar: 'يرجى ذكر الرقم المرجعي أو إرفاق صورة الإيصال في كل طلب استرداد لسرعة المعالجة.', en: 'Please include the reference number or attach the receipt photo with every refund request for faster processing.' })}</p>
      </div>
    </div>
    <aside class="policy-aside reveal" style="--reveal-delay: 120ms">
      <div class="policy-card">
        <h2>${ctx.t(T.relatedTitle)}</h2>
        <ul>${T.related.map((r) => html`<li><a href="${ctx.url(r.key)}">${ctx.t(r)}</a></li>`)}</ul>
      </div>
      <div class="policy-card policy-card--contact">
        <h2>${ctx.t(site.name)}</h2>
        <p>${ctx.t(site.addressShort)}</p>
        <p><a href="tel:${site.phoneIntl}" dir="ltr">${site.phone}</a></p>
        <p><a href="mailto:${site.email}">${site.email}</a></p>
        ${button(ctx, { href: ctx.url('contact'), label: { ar: 'تواصل معنا', en: 'Contact us' }, variant: 'primary', size: 'sm' })}
      </div>
    </aside>
  </div>
</section>`;
  return { title: T.title, description: T.description, body };
}
