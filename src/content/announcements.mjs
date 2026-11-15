// Announcement ticker content.
//
// The ticker is rendered at build time from `fallback` below, then refreshed in
// the browser from `source` (`/api/announcements`, a published Google Sheets
// CSV, or a local CSV file).
//
// Staff add and edit announcements at /admin, which writes to the
// `Announcements` tab of the charity's Google Sheet through the Apps Script
// gateway. Edits appear on the site within minutes — no rebuild or deploy is
// needed after the one-time setup in docs/ANNOUNCEMENTS.md.
// If the source is unavailable, `fallback` stays visible.
export const announcements = {
  enabled: true,

  // Where the ticker reads announcements from.
  //   /api/announcements        → live data written by the /admin panel
  //   ...output=csv             → a "Publish to web" Google Sheets CSV
  // Leave empty to use `fallback` only.
  source: '/api/announcements',

  // Refresh the source at most once per this many minutes, per browser tab.
  refreshMinutes: 1,

  // Maximum number of announcements shown in the ticker.
  maxItems: 12,

  // How long each announcement stays on screen (milliseconds).
  rotateMs: 7000,

  // Server-rendered fallback, built from the causes and stories already
  // published on the site. Keep it in sync with the sheet's current items so
  // visitors still see useful announcements if the sheet cannot be reached.
  // The /admin panel can insert these rows into an empty sheet in one click.
  fallback: [
    {
      id: 'ann-afghani-protocol',
      active: true,
      priority: 100,
      tag: { ar: 'بروتوكول تعاون', en: 'Partnership' },
      text: {
        ar: 'تم اليوم توقيع بروتوكول تعاون بين جمعية اخوين الخيرية وجمعية جمال الدين الافغاني',
        en: 'A cooperation protocol was signed today between Akhawein Charity and Jamal Al-Din Al-Afghani Association',
      },
      url: '/protocols',
      linkLabel: { ar: 'التفاصيل', en: 'Details' },
      tone: 'gold',
    },
    {
      id: 'ann-gaza-relief',
      active: false,
      priority: 100,
      tag: { ar: 'إغاثة', en: 'Relief' },
      text: {
        ar: 'إغاثة عاجلة لأهل غزة: غذاء ودواء وإيواء للأسر المنكوبة والنازحة',
        en: 'Urgent relief for Gaza: food, medicine and shelter for displaced families',
      },
      url: '/causes#cause-gaza-relief',
      linkLabel: { ar: 'تبرّع الآن', en: 'Donate now' },
      tone: 'red',
    },
    {
      id: 'ann-relief',
      active: false,
      priority: 95,
      tag: { ar: 'فك كرب', en: 'Relief' },
      text: {
        ar: 'فك كرب الغارمات وتفريج هم الأسر المهددة بالحبس والعمليات الجراحية الطارئة',
        en: 'Debt relief for mothers facing prison and urgent surgeries for families in crisis',
      },
      url: '/causes#cause-relief',
      linkLabel: { ar: 'فرّج كربة', en: 'Relieve distress' },
      tone: 'red',
    },
    {
      id: 'ann-orphans',
      active: false,
      priority: 90,
      tag: { ar: 'كفالة', en: 'Sponsorship' },
      text: {
        ar: 'كفالة يتيم شهريًا: إقامة وغذاء ورعاية طبية ونفسية شاملة',
        en: 'Sponsor an orphan monthly: shelter, food and full medical and psychological care',
      },
      url: '/causes#cause-orphans',
      linkLabel: { ar: 'اكفل يتيمًا', en: 'Sponsor a child' },
      tone: 'gold',
    },
    {
      id: 'ann-meals',
      active: false,
      priority: 85,
      tag: { ar: 'إطعام', en: 'Hot meals' },
      text: {
        ar: 'إطعام وجبات ساخنة يومية: مطابخ الخير توفر طعاماً طازجاً للأسر المتعففة وكبار السن',
        en: 'Daily hot meals: our charity kitchens provide fresh meals for families and the elderly',
      },
      url: '/causes#cause-meals',
      linkLabel: { ar: 'ساهم بالإطعام', en: 'Donate meals' },
      tone: 'green',
    },
    {
      id: 'ann-dialysis',
      active: false,
      priority: 80,
      tag: { ar: 'صحة', en: 'Health' },
      text: {
        ar: 'تكفّل جلسات الغسيل الكلوي والفلاتر والدواء لمرضى الكلى غير القادرين',
        en: 'Cover dialysis sessions, filters and medication for kidney patients in need',
      },
      url: '/causes#cause-dialysis',
      linkLabel: { ar: 'ساهم', en: 'Contribute' },
      tone: 'green',
    },
    {
      id: 'ann-brides',
      active: false,
      priority: 75,
      tag: { ar: 'عفاف وستر', en: 'Brides' },
      text: {
        ar: 'تجهيز الفتيات اليتيمات بالأجهزة الكهربائية والأساسيات لبدء حياة كريمة ومستقرة',
        en: 'Supporting orphan brides with home appliances and essentials for a dignified start',
      },
      url: '/causes#cause-brides',
      linkLabel: { ar: 'جهّز عروسة', en: 'Support a bride' },
      tone: 'gold',
    },
    {
      id: 'ann-winter',
      active: false,
      priority: 70,
      tag: { ar: 'شتاء', en: 'Winter' },
      text: {
        ar: 'حملة «دفا»: بطاطين وأسقف آمنة تحمي الأسر في القرى من برد الشتاء',
        en: 'The Dafa campaign: blankets and safe roofs protect village families from the cold',
      },
      url: '/causes#cause-winter',
      linkLabel: { ar: 'تبرّع', en: 'Donate' },
      tone: 'navy',
    },
    {
      id: 'ann-mobility',
      active: false,
      priority: 65,
      tag: { ar: 'ذوو الهمم', en: 'Mobility' },
      text: {
        ar: 'أجهزة تعويضية لذوي الهمم: كراسي متحركة وأطراف صناعية وسماعات طبية تمكّنهم من الحركة',
        en: 'Mobility aids for people with disabilities: wheelchairs, prosthetics and hearing aids',
      },
      url: '/causes#cause-mobility',
      linkLabel: { ar: 'وفّر جهازاً', en: 'Provide an aid' },
      tone: 'navy',
    },
    {
      id: 'ann-story-moayad',
      active: false,
      priority: 60,
      tag: { ar: 'قصة أمل', en: 'Story' },
      text: {
        ar: 'مؤيد من غزة استعاد حركة يده بعد جراحة تكفّلت بها الجمعية',
        en: 'Moayad from Gaza regained the use of his hand after surgery we covered',
      },
      url: '/stories#story-moayad',
      linkLabel: { ar: 'اقرأ القصة', en: 'Read story' },
      tone: 'gold',
    },
    {
      id: 'ann-omneya',
      active: false,
      priority: 55,
      tag: { ar: 'أمنية', en: 'Wish' },
      text: {
        ar: 'مبادرة «نفسك في إيه؟»: تحقيق أمنيات أطفال الأورام ورفع روحهم المعنوية خلال رحلة العلاج',
        en: 'Our “What do you wish for?” initiative grants wishes for children fighting cancer',
      },
      url: '/causes#cause-omneya',
      linkLabel: { ar: 'حقّق أمنية', en: 'Grant a wish' },
      tone: 'red',
    },
    {
      id: 'ann-food-parcels',
      active: false,
      priority: 50,
      tag: { ar: 'كرتونة الخير', en: 'Food parcel' },
      text: {
        ar: 'شنط تموينية متكاملة تضم السلع الأساسية تصل شهرياً للأسر المتعففة في القرى والنجوع',
        en: 'Complete food parcels with essential staples delivered monthly to families in need',
      },
      url: '/causes#cause-food-parcels',
      linkLabel: { ar: 'تبرّع بشنطة', en: 'Donate parcel' },
      tone: 'green',
    },
    {
      id: 'ann-story-saber',
      active: false,
      priority: 45,
      tag: { ar: 'قصة نجاح', en: 'Story' },
      text: {
        ar: 'صابر من غزة استعاد قدرته على المشي بعد جراحة عظام وأعصاب دقيقة تكفلت بها الجمعية',
        en: 'Saber from Gaza regained his ability to walk after surgery covered by the charity',
      },
      url: '/stories#story-saber',
      linkLabel: { ar: 'اقرأ القصة', en: 'Read story' },
      tone: 'navy',
    },
  ],
};
