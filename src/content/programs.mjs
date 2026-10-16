export const programCategories = [
  { id: 'social', label: { ar: 'الرعاية والتكافل', en: 'Social care' } },
  { id: 'health-edu', label: { ar: 'الصحة والتعليم', en: 'Health & education' } },
  { id: 'dev', label: { ar: 'التنمية والتمكين', en: 'Development' } },
];

export const programs = [
  {
    id: 'childcare', icon: 'baby', cats: ['social'],
    title: { ar: 'رعاية الطفولة والأمومة', en: 'Childhood and maternal care' },
    text: {
      ar: 'دور حضانة نموذجية، ودور لرعاية الأيتام والأسر البديلة، وحدائق ومكتبات للأطفال تنشئهم في بيئة تربوية آمنة وصحية.',
      en: 'Model nurseries, orphan care homes and foster families, and children’s parks and libraries for a safe, healthy upbringing.',
    },
  },
  {
    id: 'social-aid', icon: 'hand-coins', cats: ['social'],
    title: { ar: 'المساعدات الاجتماعية', en: 'Social assistance' },
    text: {
      ar: 'كفالة الأيتام والأسر المعيلة، وتوزيع صكوك ولحوم الأضاحي، ودعم أصحاب الحرف اليدوية، والمساعدات العاجلة وفك كرب الغارمين.',
      en: 'Sponsoring orphans and single-parent households, distributing udhiyah meat, supporting artisans, emergency aid and debt relief.',
    },
  },
  {
    id: 'family', icon: 'house-heart', cats: ['social'],
    title: { ar: 'رعاية الأسرة', en: 'Family care' },
    text: {
      ar: 'دور آمنة للمغتربات، ومعارض لمنتجات الأسر المنتجة محلياً ودولياً، ومناهضة العنف الأسري، وتيسير زواج الفتيات اليتيمات.',
      en: 'Safe housing for women living away from home, fairs for family-made products, combating domestic violence, and helping orphan girls marry.',
    },
  },
  {
    id: 'culture', icon: 'book-open', cats: ['health-edu'],
    title: { ar: 'الخدمات الثقافية والعلمية والدينية', en: 'Cultural, scientific and religious services' },
    text: {
      ar: 'ندوات ومحاضرات توعوية، ومكتبات عامة وعلمية، ومسابقات لحفظ القرآن الكريم وتكريم المتميزين.',
      en: 'Awareness seminars and lectures, public and academic libraries, and Quran memorisation competitions honouring outstanding students.',
    },
  },
  {
    id: 'friendship', icon: 'globe', cats: ['dev'],
    title: { ar: 'الصداقة بين الشعوب', en: 'Friendship between peoples' },
    text: {
      ar: 'رحلات ثقافية وسياحية، وبرامج وأفلام تعرّف بالحضارة والتراث المصري وتمد جسور التعايش والسلام بين الثقافات.',
      en: 'Cultural trips, and programmes and films that celebrate Egyptian heritage and build bridges between cultures.',
    },
  },
  {
    id: 'governance', icon: 'clipboard-list', cats: ['dev'],
    title: { ar: 'التنظيم والإدارة', en: 'Organisation and governance' },
    text: {
      ar: 'مكافحة الفساد والإصلاح الإداري، وتطبيق نظم الإدارة الحديثة والحوكمة المؤسسية، وتدريب الكوادر على التحول الرقمي.',
      en: 'Anti-corruption and administrative reform, modern management and governance systems, and digital-skills training for staff.',
    },
  },
  {
    id: 'rights', icon: 'scale', cats: ['dev'],
    title: { ar: 'حقوق الإنسان', en: 'Human rights' },
    text: {
      ar: 'نشر مبادئ حقوق الإنسان والدستور، والتوعية المجتمعية والمشاركة في مراقبة الانتخابات، والاستشارات القانونية للفئات المستحقة.',
      en: 'Promoting human-rights and constitutional principles, civic awareness and election monitoring, and free legal advice.',
    },
  },
  {
    id: 'health', icon: 'stethoscope', cats: ['health-edu'],
    title: { ar: 'الخدمات الصحية', en: 'Health services' },
    text: {
      ar: 'وحدات الغسيل الكلوي المجانية، ومراكز طبية متخصصة، وحضانات للأطفال المبتسرين، وأدوية ومستلزمات طبية لغير القادرين.',
      en: 'Free dialysis units, specialised clinics, incubators for premature babies, and medicines and supplies for those in need.',
    },
  },
  {
    id: 'sports', icon: 'trophy', cats: ['health-edu'],
    title: { ar: 'الأنشطة الرياضية', en: 'Sports' },
    text: {
      ar: 'تجهيز الساحات والملاعب، وتنظيم البطولات والدورات للشباب، واكتشاف المواهب الرياضية الواعدة ورعايتها.',
      en: 'Equipping sports grounds, organising youth tournaments and courses, and nurturing promising young athletes.',
    },
  },
  {
    id: 'education', icon: 'graduation-cap', cats: ['health-edu'],
    title: { ar: 'الخدمات التعليمية', en: 'Education' },
    text: {
      ar: 'فصول تقوية مجانية، وسداد المصروفات المدرسية والجامعية، وصيانة المدارس، وتوفير الحقائب والأدوات المدرسية.',
      en: 'Free tutoring classes, school and university fees, school maintenance, and school bags and supplies.',
    },
  },
  {
    id: 'elderly', icon: 'hand-helping', cats: ['social'],
    title: { ar: 'رعاية كبار السن', en: 'Care for the elderly' },
    text: {
      ar: 'دور إيواء ورعاية صحية شاملة للمسنين، ورحلات ترفيهية دورية، وأدوية ومستلزمات طبية ومعاشات شهرية تكافلية.',
      en: 'Residential homes and full healthcare for the elderly, regular outings, medicines, and monthly solidarity pensions.',
    },
  },
  {
    id: 'youth', icon: 'shield-half', cats: ['social', 'dev'],
    title: { ar: 'الدفاع الاجتماعي وحماية النشء', en: 'Protecting children and youth' },
    text: {
      ar: 'إيواء أطفال الشوارع وتأهيلهم، وحملات التوعية بأخطار المخدرات والإدمان، وبرامج العلاج وإعادة الدمج الأسري والمجتمعي.',
      en: 'Shelter and rehabilitation for street children, anti-drug awareness campaigns, and treatment and reintegration programmes.',
    },
  },
  {
    id: 'environment', icon: 'sprout', cats: ['dev'],
    title: { ar: 'حماية البيئة', en: 'Protecting the environment' },
    text: {
      ar: 'تطوير القرى الأكثر فقراً، وتدوير المخلفات، ومبادرات التشجير، وتوصيل مياه الشرب النظيفة، وبناء أسقف آمنة للمنازل.',
      en: 'Upgrading the poorest villages, recycling, tree planting, clean drinking water, and safe roofs for homes.',
    },
  },
  {
    id: 'economic', icon: 'trending-up', cats: ['dev'],
    title: { ar: 'التنمية الاقتصادية والتمكين', en: 'Economic empowerment' },
    text: {
      ar: 'تمويل المشروعات متناهية الصغر، وتدريب المرأة المعيلة وربات البيوت وتشغيلهن، وتوفير ماكينات الخياطة ومنافذ التسويق.',
      en: 'Funding micro-enterprises, training and employing women breadwinners, and providing sewing machines and market outlets.',
    },
  },
  {
    id: 'consumer', icon: 'shopping-bag', cats: ['dev'],
    title: { ar: 'حماية المستهلك', en: 'Consumer protection' },
    text: {
      ar: 'محاربة الغش التجاري والسلع المقلدة، والتوعية بمخاطر التهرب الضريبي والاحتكار، وتعريف المواطنين بحقوقهم.',
      en: 'Fighting fraud and counterfeit goods, raising awareness of tax evasion and monopolies, and informing citizens of their rights.',
    },
  },
  {
    id: 'special-needs', icon: 'accessibility', cats: ['social', 'health-edu'],
    title: { ar: 'ذوو الهمم والفئات الخاصة', en: 'People with disabilities' },
    text: {
      ar: 'جلسات التخاطب وتعديل السلوك وتنمية المهارات، وتوزيع الأجهزة التعويضية والكراسي المتحركة، ودعم الدمج الكامل في المجتمع.',
      en: 'Speech therapy and skills sessions, prosthetics and wheelchairs, and support for full inclusion in society.',
    },
  },
];

export const pillars = [
  { icon: 'graduation-cap', text: { ar: 'تنمية المهارات والكوادر البشرية', en: 'Developing skills and people' } },
  { icon: 'trending-up', text: { ar: 'محاربة الفقر والنهوض بالتعليم', en: 'Fighting poverty, advancing education' } },
  { icon: 'users', text: { ar: 'تمكين المرأة المعيلة والشباب', en: 'Empowering women and young people' } },
  { icon: 'heart-handshake', text: { ar: 'تعزيز التكافل والتنمية المستدامة', en: 'Solidarity and lasting development' } },
];
