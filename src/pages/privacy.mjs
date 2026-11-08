import { html } from '../lib/html.mjs';
import { pageHero, icon, button } from '../lib/components.mjs';
import { site } from '../content/site.mjs';

const T = {
  title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  description: {
    ar: 'سياسة الخصوصية لجمعية أخوين الخيرية: البيانات التي نجمعها، وكيف نستخدمها ونحميها، وحقوق زوار الموقع والمتبرعين.',
    en: 'Akhawein Charity privacy policy: the data we collect, how we use and protect it, and the rights of website visitors and donors.',
  },
  eyebrow: { ar: 'حماية بياناتك أولوية', en: 'Your data comes first' },
  heroTitle: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  heroLead: {
    ar: 'نحترم خصوصيتك في جمعية أخوين الخيرية. توضّح هذه الصفحة البيانات التي نجمعها عند تواصلك معنا أو تبرعك، وكيف نستخدمها، ومن ياطّلع عليها.',
    en: 'Your privacy matters to us at Akhawein Charity. This page explains what data we collect when you contact or donate to us, how we use it, and who may see it.',
  },
  updated: { ar: 'آخر تحديث: ٨ نوفمبر ٢٠٢٦', en: 'Last updated: 8 November 2026' },
  whoTitle: { ar: 'من نحن؟ ومسؤول البيانات', en: 'Who we are and who is responsible for your data' },
  contactTitle: { ar: 'تواصل معنا بشأن الخصوصية', en: 'Contact us about your privacy' },
  relatedTitle: { ar: 'سياسات أخرى', en: 'Other policies' },
  related: [
    { key: 'refund', ar: 'سياسة الاسترداد والإلغاء', en: 'Refund & Cancellation Policy' },
    { key: 'delivery', ar: 'سياسة التوصيل والشحن', en: 'Delivery & Shipping Policy' },
    { key: 'contact', ar: 'تواصل معنا', en: 'Contact us' },
  ],
  sections: [
    {
      h: { ar: '١. من نحن', en: '1. Who we are' },
      p: [
        {
          ar: 'جمعية أخوين الخيرية جمعية أهلية مصرية مشهرة برقم ٧٧٠٢ لسنة ٢٠٠٩، وذات نفع عام بالقرار الوزاري رقم ١٦٠ لسنة ٢٠١٣، وتعمل تحت إشراف وزارة التضامن الاجتماعي وفق قانون تنظيم ممارسة العمل الأهلي رقم ١٤٩ لسنة ٢٠١٩. نحن مسؤولون عن البيانات التي تقدمها عبر موقعنا www.akhawein.org.',
          en: 'Akhawein Charity is an Egyptian non-profit organisation registered under No. 7702 of 2009, with public-benefit status under Ministerial Decree No. 160 of 2013, supervised by the Ministry of Social Solidarity under NGO Law No. 149 of 2019. We are responsible for the data you share with us through our website www.akhawein.org.',
        },
      ],
    },
    {
      h: { ar: '٢. البيانات التي نجمعها', en: '2. Data we collect' },
      p: [
        {
          ar: 'لا نجمع أي بيانات شخصية منك إلا عندما ترسلها إلينا بنفسك. أبرز ما يمكن أن يصلنا:',
          en: 'We do not collect any personal data from you unless you send it to us yourself. The main things we may receive:',
        },
      ],
      list: [
        {
          ar: 'نموذج التواصل: الاسم بالكامل، رقم الهاتف أو الواتساب، البريد الإلكتروني (اختياري)، نوع الطلب، ورسالتك.',
          en: 'Contact form: full name, phone or WhatsApp number, email (optional), request type and your message.',
        },
        {
          ar: 'نموذج التبرع الإلكتروني: الاسم الأول واسم العائلة، رقم الموبايل، البريد الإلكتروني (اختياري لإرسال الإيصال)، سبب التبرع المختار والمبلغ بالجنيه المصري، والإهداء أو الملاحظة إن كتبته، وخيار إخفاء الاسم عن أي ذكر علني.',
          en: 'Online donation form: first and last name, mobile number, email (optional, for your receipt), chosen cause and amount in Egyptian Pounds (EGP), any dedication or note you write, and the option to hide your name from any public mention.',
        },
        {
          ar: 'التحويل البنكي: إذا حوّلت عبر بنك مصر وأرسلت صورة الإيصال على واتساب، فإننا نستلم صورة الإيصال وبياناتك الظاهرة فيها لغرض تسجيل التبرع وإصدار الإيصال الرسمي.',
          en: 'Bank transfer: if you transfer via Banque Misr and send us a photo of the receipt on WhatsApp, we receive that photo and the details shown on it in order to record your gift and issue your official receipt.',
        },
        {
          ar: 'إعدادات متصفحك المخزّنة محلياً: تفضيل الوضع الليلي، وتفضيل اللغة، وعداد زيارات هو محاكاة محلية في متصفحك فقط ولا يرسل بياناتك إلى أي خادم.',
          en: 'Browser preferences stored locally: your dark-mode choice, language choice, and a site-visitor counter that is simulated locally in your browser and never sends your data to any server.',
        },
      ],
    },
    {
      h: { ar: '٣. كيف نستخدم بياناتك', en: '3. How we use your data' },
      p: [
        {
          ar: 'نستخدم بياناتك فقط للأغراض التالية:',
          en: 'We use your data only for the following purposes:',
        },
      ],
      list: [
        {
          ar: 'الرد على رسالتك أو استفسارك، أو التواصل معك بخصوص طلب مساعدة أو تطوع أو شراكة.',
          en: 'Replying to your message or enquiry, or contacting you about a request for help, volunteering, or a partnership.',
        },
        {
          ar: 'تسجيل تبرعك، وإصدار الإيصال الرسمي، ومطابقته مالياً مع سجلات Paymob والبنك، ومتابعة حالات الدفع المعلّقة.',
          en: 'Recording your donation, issuing your official receipt, reconciling it financially with Paymob and bank records, and following up on pending payments.',
        },
        {
          ar: 'تنفيذ برامج المساعدة وتوجيه تبرعك إلى الباب الذي اخترته، ومتابعة توصيل المساعدة إلى المستفيدين.',
          en: 'Delivering aid programmes and directing your gift to the cause you chose, and following up on aid reaching beneficiaries.',
        },
        {
          ar: 'الوفاء بالالتزامات القانونية وتنظيم العمل الأهلي والمتطلبات المالية والضريبية.',
          en: 'Meeting legal obligations and NGO, financial and tax requirements.',
        },
      ],
    },
    {
      h: { ar: '٤. بيانات الدفع وبطاقاتك', en: '4. Payment and card data' },
      p: [
        {
          ar: 'عند الدفع أونلاين يتم تحويلك إلى صفحة Paymob الآمنة لإتمام الدفع. بيانات بطاقتك (الرقم، تواريخ الصلاحية، الرمز السري) لا تمر على خوادم الجمعية إطلاقاً ولا نراها ولا نخزنها. تستلم خوادمنا فقط تأكيد حالة الدفع الموقّع رقمياً، والمبلغ والباب والرقم المرجعي، لغرض المطابقة والإيصال.',
          en: 'For online payments you are redirected to Paymob’s secure checkout page. Your card details (number, expiry, CVV) never touch the charity’s servers and we neither see nor store them. Our servers only receive a digitally signed payment-status confirmation, plus the amount, cause and reference number, for reconciliation and receipt purposes.',
        },
      ],
    },
    {
      h: { ar: '٥. من ياطّلع على بياناتك؟', en: '5. Who may see your data' },
      p: [
        {
          ar: 'لا نبيع بياناتك ولا نشاركها لأغراض تسويقية إطلاقاً. وقد نمرّر الحد الأدنى اللازم فقط إلى المعالجين التاليين الذين يساعدوننا في تشغيل الموقع وتنفيذ التبرعات:',
          en: 'We never sell your data and never share it for marketing at all. We may pass only the minimum needed to the processors below who help us run the website and process donations:',
        },
      ],
      list: [
        {
          ar: 'Paymob — معالج الدفع: لعرض صفحة الدفع الآمنة واستقبال تأكيدات الدفع.',
          en: 'Paymob — payment processor for the secure checkout page and payment confirmations.',
        },
        {
          ar: 'FormSubmit — وسيط البريد: لنقل رسائل نموذج التواصل إلى بريد الجمعية info@akhawein.org. إذا تعذّر الإرسال، يفتح لك بديل واتساب.',
          en: 'FormSubmit — email relay for contact-form messages to info@akhawein.org. If sending fails, a WhatsApp option opens for you instead.',
        },
        {
          ar: 'Google Sheets عبر بوابة Apps Script — سجل داخلي للمطابقة: لتسجيل التبرعات المعلّقة قبل الدفع وحالات المدفوع أو الفاشل أو المسترد، وهو السجل الداخلي للجمعية فقط.',
          en: 'Google Sheets via an Apps Script gateway — internal reconciliation ledger: to record pending donations before checkout and paid, failed or refunded statuses. This is the charity’s internal ledger only.',
        },
        {
          ar: 'بنك مصر — عند التبرع بالتحويل البنكي: لاستقبال الحوالة وتسجيلها في الحساب الرسمي المعلن على موقعنا.',
          en: 'Banque Misr — for bank-transfer donations: to receive and record the transfer in the official account published on our website.',
        },
        {
          ar: 'خدمات خارجية اختيارية تظهر للزائر عند تفعيلها: خرائط Google المدمجة في صفحات العناوين، وWhatsApp عندما تختار التواصل عبره، وصفحات التواصل الاجتماعي المرتبطة من موقعنا. يخضع كل منها لسياسة الخصوصية الخاصة به.',
          en: 'Optional third-party services shown when you use them: embedded Google Maps on address pages, WhatsApp when you choose to message us, and social pages linked from our site. Each is governed by its own privacy policy.',
        },
      ],
    },
    {
      h: { ar: '٦. ملفات تعريف الارتباط والتخزين المحلي', en: '6. Cookies and local storage' },
      p: [
        {
          ar: 'لا نستخدم ملفات تعريف ارتباط إعلانية أو أدوات تتبّع أو تحليلات خارجية. نستخدم التخزين المحلي فقط لحفظ تفضيلك للوضع الليلي واللغة وعداد الزيارات المحلي — وتظل هذه البيانات على جهازك ولا تُرسل إلى أي جهة.',
          en: 'We do not use advertising cookies, tracking tools or external analytics. Local storage is used only to remember your dark-mode and language choices and the local visitor counter — this data stays on your device and is never sent anywhere.',
        },
      ],
    },
    {
      h: { ar: '٧. مدة الاحتفاظ ببياناتك', en: '7. How long we keep your data' },
      p: [
        {
          ar: 'نحتفظ ببيانات التواصل والتبرع والإيصالات طوال المدة اللازمة لتحقيق أغراضها، وللوفاء بالتزاماتنا القانونية والمالية كجمعية أهلية. عند انتهاء الغرض القانوني أو الإداري نعمل على حذفها أو أرشفتها بما يتوافق مع القانون.',
          en: 'We keep contact, donation and receipt data for as long as needed to fulfil their purposes and to meet our legal and financial duties as an NGO. Once the legal or administrative need has ended, we delete or securely archive it as the law requires.',
        },
      ],
    },
    {
      h: { ar: '٨. حقوقك', en: '8. Your rights' },
      p: [
        {
          ar: 'يمكنك في أي وقت طلب الاطلاع على البيانات التي لدينا عنك، أو تصحيحها، أو حذفها (في حدود ما تسمح به الالتزامات القانونية للجمعية). يكفي أن تراسلنا على البريد info@akhawein.org أو تتصل بنا على 0128 176 9685 أو تراسلنا على العنوان بالأسفل، وسنرد خلال مدة معقولة بعد التحقق من هويتك.',
          en: 'At any time you may ask to see the data we hold about you, to correct it, or to delete it (to the extent the charity’s legal duties allow). Just email info@akhawein.org, call 0128 176 9685, or write to the address below; we will respond within a reasonable time after verifying your identity.',
        },
        {
          ar: 'يمكنك أيضاً اختيار إخفاء اسمك عن أي ذكر علني عند التبرع، ويظل اسمك مسجلاً بشكل خاص فقط لإصدار الإيصال الرسمي والمطابقة المالية كما ذكرت في نموذج التبرع.',
          en: 'You may also choose to hide your name from any public mention when you donate; your name is then recorded privately only for the official receipt and financial reconciliation, as stated in the donation form.',
        },
      ],
    },
    {
      h: { ar: '٩. أمان البيانات', en: '9. Data security' },
      p: [
        {
          ar: 'نحمي البيانات بوسائل منها: تشفير الاتصال (HTTPS)، والدفع عبر صفحة Paymob الآمنة بتقنية 3-D Secure، والتحقق من تأكيدات الدفع بالتوقيع الرقمي، وعدم تخزين بيانات البطاقات، وتقييد الوصول إلى السجلات الداخلية على الموظفين المختصين.',
          en: 'We protect data with measures including encrypted connections (HTTPS), secure Paymob checkout with 3-D Secure, verification of payment confirmations with a digital signature, never storing card data, and restricting access to internal records to authorised staff.',
        },
      ],
    },
    {
      h: { ar: '١٠. تغييرات هذه السياسة', en: '10. Changes to this policy' },
      p: [
        {
          ar: 'قد نحدّث هذه السياسة من وقت لآخر لتتوافق مع تغييرات خدماتنا أو القانون. عند أي تحديث جوهري سننشر النسخة الجديدة على هذه الصفحة مع تحديث تاريخ آخر تحديث في أعلاها، ويسري التحديث من تاريخ نشره.',
          en: 'We may update this policy from time to time to match changes in our services or the law. For any material update we will publish the new version on this page with an updated “Last updated” date at the top, effective from the date of publication.',
        },
      ],
    },
  ],
};

export default function privacyPage(ctx) {
  const body = html`
${pageHero(ctx, { eyebrow: T.eyebrow, title: T.heroTitle, lead: T.heroLead, crumbs: [{ label: T.title }] })}
<section class="section">
  <div class="container policy-layout">
    <div class="policy-content reveal">
      <p class="policy-updated">${ctx.t(T.updated)} · ${ctx.t(site.name)} · ${ctx.t(site.registration)}</p>
      ${T.sections.map((s) => html`
      <section class="policy-section">
        <h2>${ctx.t(s.h)}</h2>
        ${s.p.map((para) => html`<p>${ctx.t(para)}</p>`)}
        ${s.list ? html`<ul class="policy-list">${s.list.map((li) => html`<li>${ctx.t(li)}</li>`)}</ul>` : ''}
      </section>`)}
      <div class="policy-contact">
        <h2>${ctx.t(T.contactTitle)}</h2>
        <ul class="policy-list">
          <li><strong>${ctx.t(site.address)}</strong></li>
          <li><a href="tel:${site.phoneIntl}" dir="ltr">${site.phone}</a> · <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${ctx.t({ ar: 'واتساب', en: 'WhatsApp' })}</a></li>
          <li><a href="mailto:${site.email}">${site.email}</a></li>
          <li>${ctx.t(site.hours)}</li>
        </ul>
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
