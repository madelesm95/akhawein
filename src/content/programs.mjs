export const programCategories = [
  { id: 'social', label: { ar: 'الرعاية والتكافل', en: 'Social care' } },
  { id: 'health-edu', label: { ar: 'الصحة والتعليم', en: 'Health & education' } },
  { id: 'dev', label: { ar: 'التنمية والتمكين', en: 'Development' } },
];

export const programs = [
  {
    id: 'childcare', icon: 'baby', cats: ['social'],
    image: 'program-childcare',
    badge: { ar: 'رعاية وأمومة', en: 'Child & maternal care' },
    title: { ar: 'رعاية الطفولة والأمومة', en: 'Childhood and maternal care' },
    text: {
      ar: 'إنشاء دور الحضانة النموذجية، دور رعاية الأيتام والأسر البديلة، وتأسيس حدائق ومكتبات الأطفال لتنشئتهم في بيئة تربوية آمنة وصحية.',
      en: 'Model nurseries, orphan care homes and foster families, plus children’s parks and libraries so every child grows up in a safe, healthy and caring environment.',
    },
    stat: {
      label: { ar: 'أطفال وحضانات مستفيدة', en: 'Children and nurseries reached' },
      value: { ar: '+500 طفل', en: '500+ children' },
    },
  },
  {
    id: 'social-aid', icon: 'hand-coins', cats: ['social'],
    image: 'program-social-aid',
    badge: { ar: 'مساعدات إنسانية', en: 'Humanitarian aid' },
    title: { ar: 'المساعدات الاجتماعية', en: 'Social assistance' },
    text: {
      ar: 'كفالة الأيتام والأسر المعيلة، توزيع صكوك ولحوم الأضاحي، دعم أصحاب الحرف اليدوية، وتقديم المساعدات العاجلة وفك كرب الغارمين.',
      en: 'Sponsoring orphans and single-parent households, distributing udhiyah meat, supporting artisans, delivering emergency relief and releasing debt prisoners.',
    },
    stat: {
      label: { ar: 'مساعدات تم تقديمها', en: 'Assistance packages delivered' },
      value: { ar: '+13,251 أسرة', en: '13,251+ families' },
    },
  },
  {
    id: 'family', icon: 'house-heart', cats: ['social'],
    image: 'program-family',
    badge: { ar: 'استقرار أسري', en: 'Family stability' },
    title: { ar: 'رعاية الأسرة', en: 'Family care' },
    text: {
      ar: 'توفير دور للمغتربات لسكن ملائم وآمن، إقامة معارض منتجات الأسر المنتجة محلياً ودولياً، مناهضة العنف الأسري، وتيسير زواج الفتيات اليتيمات.',
      en: 'Safe housing for women living away from home, local and international fairs for family-made products, combating domestic violence, and helping orphan girls marry.',
    },
    stat: {
      label: { ar: 'أسر مدعومة ومستفيدة', en: 'Families supported' },
      value: { ar: '+1,500 أسرة', en: '1,500+ families' },
    },
  },
  {
    id: 'culture', icon: 'book-open', cats: ['health-edu'],
    image: 'program-culture',
    badge: { ar: 'ثقافة وتوعية', en: 'Culture & awareness' },
    title: { ar: 'الخدمات الثقافية والعلمية والدينية', en: 'Cultural, scientific and religious services' },
    text: {
      ar: 'إقامة الندوات والمحاضرات الثقافية والدينية للتوعية، إنشاء المكتبات العامة والعلمية، وتنظيم مسابقات حفظ القرآن الكريم وتكريم المتميزين.',
      en: 'Cultural and religious seminars and lectures, public and academic libraries, and Quran memorisation competitions that honour outstanding students.',
    },
    stat: {
      label: { ar: 'ندوات وفعاليات ثقافية', en: 'Cultural events held' },
      value: { ar: '+500 فعالية', en: '500+ events' },
    },
  },
  {
    id: 'friendship', icon: 'globe', cats: ['dev'],
    image: 'program-friendship',
    badge: { ar: 'تبادل وتواصل', en: 'Exchange & outreach' },
    title: { ar: 'الصداقة بين الشعوب', en: 'Friendship between peoples' },
    text: {
      ar: 'تنظيم الرحلات الثقافية والسياحية، وإنتاج برامج وأفلام تعرف بالحضارة والتراث المصري العريق وتعزز جسور التعايش والسلام بين الثقافات.',
      en: 'Cultural and tourist trips, plus programmes and films that celebrate Egypt’s heritage and build bridges of coexistence and peace between cultures.',
    },
    stat: {
      label: { ar: 'أنشطة وبرامج تبادلية', en: 'Exchange activities' },
      value: { ar: '+500 مستفيد', en: '500+ beneficiaries' },
    },
  },
  {
    id: 'governance', icon: 'clipboard-list', cats: ['dev'],
    image: 'program-governance',
    badge: { ar: 'حوكمة وتطوير', en: 'Governance & growth' },
    title: { ar: 'التنظيم والإدارة', en: 'Organisation and governance' },
    text: {
      ar: 'مكافحة الفساد والإصلاح الإداري، تطبيق أحدث نظم الإدارة الحديثة والحوكمة المؤسسية، وتدريب الكوادر على التحول الرقمي ورفع الكفاءة.',
      en: 'Anti-corruption and administrative reform, modern management and corporate-governance systems, and training staff in digital transformation and efficiency.',
    },
    stat: {
      label: { ar: 'كوادر تم تدريبها', en: 'Staff trained' },
      value: { ar: '+500 كادر', en: '500+ professionals' },
    },
  },
  {
    id: 'rights', icon: 'scale', cats: ['dev'],
    image: 'program-rights',
    badge: { ar: 'عدالة وتوعية', en: 'Justice & awareness' },
    title: { ar: 'حقوق الإنسان', en: 'Human rights' },
    text: {
      ar: 'نشر ثقافة ومبادئ حقوق الإنسان والدستور، التوعية المجتمعية والمشاركة في مراقبة الانتخابات، وتقديم الاستشارات القانونية للفئات المستحقة.',
      en: 'Promoting human-rights and constitutional principles, civic awareness and election monitoring, and providing free legal advice to those who qualify.',
    },
    stat: {
      label: { ar: 'جلسات واستشارات قانونية', en: 'Legal sessions and consultations' },
      value: { ar: '+500 مستفيد', en: '500+ beneficiaries' },
    },
  },
  {
    id: 'health', icon: 'stethoscope', cats: ['health-edu'],
    image: 'program-health',
    badge: { ar: 'صحة وعلاج', en: 'Health & treatment' },
    title: { ar: 'الخدمات الصحية', en: 'Health services' },
    text: {
      ar: 'وحدات الغسيل الكلوي المجانية، المراكز الطبية المتخصصة، حضانات الأطفال المبتسرين، وتوفير الأدوية والمستلزمات الطبية لغير القادرين.',
      en: 'Free dialysis units, specialised medical centres, incubators for premature babies, and medicines and medical supplies for people unable to afford them.',
    },
    stat: {
      label: { ar: 'فحوصات ورعاية طبية', en: 'Medical check-ups and care' },
      value: { ar: '+500 حالة شهرياً', en: '500+ cases a month' },
    },
  },
  {
    id: 'sports', icon: 'trophy', cats: ['health-edu'],
    image: 'program-sports',
    badge: { ar: 'رياضة وشباب', en: 'Sport & youth' },
    title: { ar: 'الأنشطة الرياضية', en: 'Sports' },
    text: {
      ar: 'إنشاء وتجهيز الساحات والملاعب لكافة الألعاب الرياضية، تنظيم البطولات والدورات للشباب، واكتشاف ورعاية المواهب الرياضية الواعدة.',
      en: 'Building and equipping grounds and pitches for every sport, running youth tournaments and courses, and discovering and nurturing promising athletic talent.',
    },
    stat: {
      label: { ar: 'مشاركون في الدورات', en: 'Course participants' },
      value: { ar: '+500 شاب', en: '500+ young people' },
    },
  },
  {
    id: 'education', icon: 'graduation-cap', cats: ['health-edu'],
    image: 'program-education',
    badge: { ar: 'تعليم وتأهيل', en: 'Education & training' },
    title: { ar: 'الخدمات التعليمية', en: 'Education' },
    text: {
      ar: 'إنشاء فصول تقوية مجانية لأبناء الأسر غير القادرة، سداد المصروفات المدرسية والجامعية، صيانة المدارس وتوفير الحقائب والأدوات المدرسية.',
      en: 'Free tutoring classes for children of low-income families, school and university fees, school maintenance, and school bags and supplies.',
    },
    stat: {
      label: { ar: 'المستفيدون المسجلون', en: 'Registered beneficiaries' },
      value: { ar: '+3,680 طالب', en: '3,680+ students' },
    },
  },
  {
    id: 'elderly', icon: 'hand-helping', cats: ['social'],
    image: 'program-elderly',
    badge: { ar: 'كبار السن', en: 'Older people' },
    title: { ar: 'رعاية الشيخوخة وكبار السن', en: 'Care for older people' },
    text: {
      ar: 'توفير دور إيواء ورعاية صحية شاملة للمسنين، تنظيم رحلات ترفيهية دورية، وتوفير الأدوية والمستلزمات الطبية والمعاشات الشهرية التكافلية.',
      en: 'Residential homes with full healthcare for the elderly, regular recreational trips, medicines and medical supplies, and monthly solidarity pensions.',
    },
    stat: {
      label: { ar: 'الحالات المكفولة', en: 'Cases sponsored' },
      value: { ar: '+500 مسن', en: '500+ elderly people' },
    },
  },
  {
    id: 'youth', icon: 'shield-half', cats: ['social', 'dev'],
    image: 'program-youth',
    badge: { ar: 'حماية النشء', en: 'Child protection' },
    title: { ar: 'الدفاع الاجتماعي وحماية النشء', en: 'Protecting children and youth' },
    text: {
      ar: 'إيواء وتأهيل أطفال الشوارع، حملات التوعية ضد أخطار المخدرات والإدمان، وتقديم برامج العلاج والتأهيل وإعادة الدمج الأسري والمجتمعي.',
      en: 'Shelter and rehabilitation for street children, anti-drug and anti-addiction awareness campaigns, and treatment, rehabilitation and family reintegration.',
    },
    stat: {
      label: { ar: 'حملات التوعية والإيواء', en: 'Awareness and shelter cases' },
      value: { ar: '+500 مستفيد', en: '500+ beneficiaries' },
    },
  },
  {
    id: 'environment', icon: 'sprout', cats: ['dev'],
    image: 'program-environment',
    badge: { ar: 'تنمية وبيئة', en: 'Development & environment' },
    title: { ar: 'حماية البيئة والمحافظة عليها', en: 'Protecting and preserving the environment' },
    text: {
      ar: 'مشاريع تطوير القرى الفقيرة، تدوير المخلفات، مبادرات التشجير، توصيل شبكات مياه الشرب النظيفة، وبناء الأسقف الآمنة للمنازل.',
      en: 'Projects to develop poor villages, waste recycling, tree-planting initiatives, clean drinking-water connections, and safe roofs for homes.',
    },
    stat: {
      label: { ar: 'منازل وقرى مطورة', en: 'Homes and villages upgraded' },
      value: { ar: '+500 منزل وقرية', en: '500+ homes and villages' },
    },
  },
  {
    id: 'economic', icon: 'trending-up', cats: ['dev'],
    image: 'program-economic',
    badge: { ar: 'تمكين وإنتاج', en: 'Empowerment & production' },
    title: { ar: 'التنمية الاقتصادية والتمكين', en: 'Economic development and empowerment' },
    text: {
      ar: 'تمويل وإقامة مشروعات متناهية الصغر، تشغيل وتدريب المرأة المعيلة وربات البيوت، وتوفير ماكينات الخياطة ومنافذ الإنتاج والتسويق المنزلي.',
      en: 'Funding and launching micro-enterprises, training and employing women breadwinners and homemakers, and providing sewing machines and home-production outlets.',
    },
    stat: {
      label: { ar: 'أسر تم تمكينها', en: 'Families empowered' },
      value: { ar: '+1,200 مشروع', en: '1,200+ projects' },
    },
  },
  {
    id: 'consumer', icon: 'shopping-bag', cats: ['dev'],
    image: 'program-consumer',
    badge: { ar: 'توعية وحماية', en: 'Awareness & protection' },
    title: { ar: 'حماية المستهلك والوعي التجاري', en: 'Consumer protection and commercial awareness' },
    text: {
      ar: 'محاربة الغش التجاري والسلع المقلدة، التوعية المجتمعية بمكافحة التهرب الضريبي والاحتكار، وإرشاد المواطنين بحقوقهم الاستهلاكية.',
      en: 'Fighting commercial fraud and counterfeit goods, raising awareness against tax evasion and monopolies, and guiding citizens on their consumer rights.',
    },
    stat: {
      label: { ar: 'حملات توعية للمستهلك', en: 'Consumer awareness campaigns' },
      value: { ar: '+500 حملة', en: '500+ campaigns' },
    },
  },
  {
    id: 'special-needs', icon: 'accessibility', cats: ['social', 'health-edu'],
    image: 'program-special-needs',
    badge: { ar: 'ذوو الهمم', en: 'People with disabilities' },
    title: { ar: 'الفئات الخاصة وذوو الهمم', en: 'People with special needs and disabilities' },
    text: {
      ar: 'جلسات التخاطب وتعديل السلوك وتنمية المهارات، توفير وتوزيع الأجهزة التعويضية والكراسي المتحركة، ودعم دمجهم الشامل في المجتمع.',
      en: 'Speech therapy, behaviour modification and skills sessions, prosthetics and wheelchairs, and support for their full inclusion in society.',
    },
    stat: {
      label: { ar: 'أجهزة تعويضية وتأهيل', en: 'Assistive devices and rehabilitation' },
      value: { ar: '+850 مستفيد', en: '850+ beneficiaries' },
    },
  },
];

export const pillars = [
  { icon: 'graduation-cap', text: { ar: 'تنمية المهارات والكوادر البشرية', en: 'Developing skills and people' } },
  { icon: 'trending-up', text: { ar: 'محاربة الفقر والنهوض بالتعليم', en: 'Fighting poverty, advancing education' } },
  { icon: 'users', text: { ar: 'تمكين المرأة المعيلة والشباب', en: 'Empowering women and young people' } },
  { icon: 'heart-handshake', text: { ar: 'تعزيز التكافل والتنمية المستدامة', en: 'Solidarity and lasting development' } },
];
