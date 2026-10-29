// Five documented cases from the field. Copy is based on the original
// case posters and the medical reports shown on them; no figures are invented.
export const stories = [
  {
    id: 'moayad',
    name: { ar: 'مؤيد', en: 'Moayad' },
    meta: { ar: '٧ سنوات · غزة', en: '7 years old · Gaza' },
    kind: { ar: 'جراحة ورعاية', en: 'Surgery and care' },
    icon: 'baby',
    poster: { ar: 'story-moayad-ar', en: 'story-moayad-en' },
    headline: { ar: 'أنقذنا يد الطفولة', en: 'We saved a child’s hand' },
    lead: {
      ar: 'طفل في السابعة من عمره، أصابته شظايا في غزة فتركت تشوهات وفقداً في أنسجة يده اليسرى.',
      en: 'A seven-year-old boy injured by shrapnel in Gaza, leaving deformities and lost tissue in his left hand.',
    },
    body: [
      {
        ar: 'وصل مؤيد إلى مصر بإصابة لا تحتمل التأجيل: شظايا أحدثت تشوهات وفقداً في أنسجة اليد اليسرى، وكانت الحركة والاستخدام الطبيعي لليد مهددين.',
        en: 'Moayad reached Egypt with an injury that could not wait: shrapnel had caused deformities and tissue loss in his left hand, putting normal movement and use of the hand at risk.',
      },
      {
        ar: 'تابع فريق الجمعية الملف من أول تقرير طبي، وتكفّل بالعملية الجراحية والرعاية الطبية اللازمة كاملة، حتى اكتمل العلاج وعاد مؤيد إلى بيته مبتسماً.',
        en: 'Our team followed the file from the first medical report and covered the surgery and the full medical care needed, until treatment was complete and Moayad went home smiling.',
      },
    ],
    facts: [
      { icon: 'user', label: { ar: 'العمر', en: 'Age' }, value: { ar: '٧ سنوات', en: '7 years' } },
      { icon: 'map-pin', label: { ar: 'المكان', en: 'Place' }, value: { ar: 'غزة', en: 'Gaza' } },
      { icon: 'activity', label: { ar: 'الإصابة', en: 'Injury' }, value: { ar: 'شظايا وفقدان أنسجة في اليد اليسرى', en: 'Shrapnel and tissue loss in the left hand' } },
      { icon: 'hand-heart', label: { ar: 'ما تكفّلت به الجمعية', en: 'What we covered' }, value: { ar: 'العملية الجراحية والرعاية الطبية كاملة', en: 'Surgery and full medical care' } },
    ],
    outcome: {
      ar: 'عاد مؤيد إلى حياته اليومية مبتسماً، بعد أن أصبحت يده قادرة على الحركة من جديد.',
      en: 'Moayad returned to his daily life with a smile, his hand able to move again.',
    },
  },
  {
    id: 'saber',
    name: { ar: 'صابر', en: 'Saber' },
    meta: { ar: 'من غزة · إصابة في الساق', en: 'From Gaza · leg injury' },
    kind: { ar: 'جراحة عظام وأعصاب', en: 'Orthopaedic and nerve surgery' },
    icon: 'stethoscope',
    poster: { ar: 'story-saber-ar', en: 'story-saber-en' },
    headline: { ar: 'أنقذنا ساق صابر', en: 'We saved Saber’s leg' },
    lead: {
      ar: 'كسر مفتّت في الساق اليسرى مع تلف في الأعصاب، نتيجة إصابة في غزة.',
      en: 'A comminuted fracture of the left leg with nerve damage, caused by an injury in Gaza.',
    },
    body: [
      {
        ar: 'كان الكسر المفتّت في الساق اليسرى مصحوباً بتلف في الأعصاب، ما جعل خطر فقدان الساق قريباً. احتاج الأمر تدخلاً جراحياً عاجلاً ثم علاجاً طويلاً.',
        en: 'The shattered left leg came with nerve damage, bringing the risk of losing the leg close. It needed urgent surgery, then a long course of treatment.',
      },
      {
        ar: 'تكفّلت الجمعية بالعملية الجراحية وتركيب الألواح المعدنية والعلاج اللازم. تجاوزت تكلفة الرحلة ٣٧٬٠٠٠ جنيه، وبدأت الساق تستعيد وظيفتها.',
        en: 'We covered the surgery, the metal plates and the treatment required. The cost passed EGP 37,000, and the leg began to regain its function.',
      },
    ],
    facts: [
      { icon: 'map-pin', label: { ar: 'المكان', en: 'Place' }, value: { ar: 'غزة', en: 'Gaza' } },
      { icon: 'activity', label: { ar: 'الإصابة', en: 'Injury' }, value: { ar: 'كسر مفتّت وتلف أعصاب في الساق اليسرى', en: 'Comminuted fracture and nerve damage in the left leg' } },
      { icon: 'stethoscope', label: { ar: 'التدخل', en: 'Treatment' }, value: { ar: 'جراحة عاجلة وتركيب ألواح معدنية', en: 'Urgent surgery and metal plates' } },
      { icon: 'hand-coins', label: { ar: 'التكلفة', en: 'Cost' }, value: { ar: 'أكثر من ٣٧٬٠٠٠ جنيه', en: 'More than EGP 37,000' } },
    ],
    outcome: {
      ar: 'بدأت رحلة الشفاء، والساق تستعيد وظيفتها تدريجياً تحت المتابعة.',
      en: 'The recovery began, with the leg gradually regaining function under follow-up.',
    },
  },
  {
    id: 'gehan',
    name: { ar: 'جيهان', en: 'Gehan' },
    meta: { ar: '٣٣ عاماً', en: '33 years old' },
    kind: { ar: 'جراحة وجه وفك', en: 'Facial and jaw surgery' },
    icon: 'heart-handshake',
    poster: { ar: 'story-gehan-ar', en: 'story-gehan-en' },
    headline: { ar: 'أعدنا رسم البسمة', en: 'We redrew the smile' },
    lead: {
      ar: 'كسر مفتّت في عظمة الوجنة والفك العلوي، استدعى تدخلاً جراحياً عاجلاً لترميم الوجه.',
      en: 'A comminuted fracture of the cheekbone and upper jaw that required urgent surgery to restore her face.',
    },
    body: [
      {
        ar: 'تعرّضت جيهان لكسر مفتّت في عظمة الوجنة والفك العلوي. لم تكن الإصابة شكلية فقط؛ كانت تهدد وظائف الوجه وتحتاج تدخلاً عاجلاً.',
        en: 'Gehan suffered a comminuted fracture of the cheekbone and upper jaw. The injury was not only cosmetic; it threatened the function of her face and needed urgent intervention.',
      },
      {
        ar: 'تكفّلت الجمعية بالعملية الجراحية ورفع العظام وتثبيتها، بتكلفة ٢٠٬٠٠٠ جنيه. نجحت العملية، وعادت جيهان إلى حياتها الطبيعية.',
        en: 'We covered the surgery, the lifting and fixation of the bones, at a cost of EGP 20,000. The operation succeeded and Gehan returned to her normal life.',
      },
    ],
    facts: [
      { icon: 'user', label: { ar: 'العمر', en: 'Age' }, value: { ar: '٣٣ عاماً', en: '33 years' } },
      { icon: 'activity', label: { ar: 'الإصابة', en: 'Injury' }, value: { ar: 'كسر مفتّت في الوجنة والفك العلوي', en: 'Comminuted fracture of the cheekbone and upper jaw' } },
      { icon: 'stethoscope', label: { ar: 'التدخل', en: 'Treatment' }, value: { ar: 'جراحة ترميم ورفع وتثبيت العظام', en: 'Reconstructive surgery and bone fixation' } },
      { icon: 'hand-coins', label: { ar: 'التكلفة', en: 'Cost' }, value: { ar: '٢٠٬٠٠٠ جنيه', en: 'EGP 20,000' } },
    ],
    outcome: {
      ar: 'نجحت العملية وعادت جيهان إلى حياتها الطبيعية.',
      en: 'The operation succeeded and Gehan returned to her normal life.',
    },
  },
  {
    id: 'tamara',
    name: { ar: 'تمارا', en: 'Tamara' },
    meta: { ar: 'طفلة من غزة', en: 'A child from Gaza' },
    kind: { ar: 'تأهيل وحركة', en: 'Rehabilitation and mobility' },
    icon: 'accessibility',
    poster: { ar: 'story-tamara-ar', en: 'story-tamara-en' },
    headline: { ar: 'خطوة بعد خطوة', en: 'Step by step' },
    lead: {
      ar: 'ظروف صحية صعبة حرمت تمارا من الحركة، واحتاجت كرسياً متحركاً وجلسات علاج طبيعي.',
      en: 'Difficult health conditions had taken away Tamara’s mobility; she needed a wheelchair and physiotherapy sessions.',
    },
    body: [
      {
        ar: 'وصلت تمارا من غزة وهي تعاني ظروفاً صحية تحتاج إلى كرسي متحرك وجلسات علاج طبيعي منتظمة، وإلى متابعة تصون ما تبقى من قدرة على الحركة.',
        en: 'Tamara arrived from Gaza with health conditions that required a wheelchair, regular physiotherapy and follow-up to protect the mobility she had left.',
      },
      {
        ar: 'تكفّلت الجمعية بتوفير الكرسي المتحرك وجلسات التأهيل اللازمة، لتستعيد تمارا قدرتها على الحركة وتكمل حياتها.',
        en: 'We provided the wheelchair and the rehabilitation sessions she needed, so Tamara could regain her ability to move and carry on with her life.',
      },
    ],
    facts: [
      { icon: 'map-pin', label: { ar: 'المكان', en: 'Place' }, value: { ar: 'غزة', en: 'Gaza' } },
      { icon: 'accessibility', label: { ar: 'الاحتياج', en: 'Need' }, value: { ar: 'كرسي متحرك وجلسات تأهيل', en: 'A wheelchair and rehabilitation sessions' } },
      { icon: 'hand-heart', label: { ar: 'ما تكفّلت به الجمعية', en: 'What we covered' }, value: { ar: 'الكرسي المتحرك والجلسات اللازمة', en: 'The wheelchair and the sessions needed' } },
      { icon: 'sprout', label: { ar: 'النتيجة', en: 'Result' }, value: { ar: 'استعادة الحركة تدريجياً', en: 'Mobility regained step by step' } },
    ],
    outcome: {
      ar: 'عادت تمارا تتحرك وتكمل حياتها، بعد أن استعادت جزءاً من استقلالها.',
      en: 'Tamara is moving and carrying on with her life again, having regained part of her independence.',
    },
  },
  {
    id: 'sanaa',
    name: { ar: 'سناء', en: 'Sanaa' },
    meta: { ar: 'لاجئة فلسطينية في مصر', en: 'Palestinian refugee in Egypt' },
    kind: { ar: 'رعاية صحية شاملة', en: 'Comprehensive healthcare' },
    icon: 'shield-check',
    poster: { ar: 'story-sanaa-ar', en: 'story-sanaa-en' },
    headline: { ar: 'استعادة الأمان', en: 'Safety, restored' },
    lead: {
      ar: 'لاجئة فلسطينية في مصر، عانت مشاكل حادة في القفص الصدري، واحتاجت رعاية صحية شاملة.',
      en: 'A Palestinian refugee in Egypt who suffered acute chest problems and needed comprehensive healthcare.',
    },
    body: [
      {
        ar: 'لم تكن معاناة سناء مجرد ألم عابر؛ كانت مشاكل حادة في القفص الصدري تحتاج تشخيصاً ومتابعة وتدخلات طبية متتابعة.',
        en: 'Sanaa’s suffering was not passing pain; acute problems in her ribcage needed diagnosis, follow-up and a series of medical interventions.',
      },
      {
        ar: 'تكفّلت الجمعية بتقديم الرعاية الصحية الشاملة والتدخلات الطبية اللازمة، حتى تجاوزت محنتها واستعادت استقرارها الصحي.',
        en: 'We provided comprehensive healthcare and the medical interventions she needed, until she came through her ordeal and regained her health stability.',
      },
    ],
    facts: [
      { icon: 'map-pin', label: { ar: 'المكان', en: 'Place' }, value: { ar: 'مصر · لاجئة فلسطينية', en: 'Egypt · Palestinian refugee' } },
      { icon: 'activity', label: { ar: 'الحالة', en: 'Condition' }, value: { ar: 'مشاكل حادة في القفص الصدري', en: 'Acute problems in the ribcage' } },
      { icon: 'stethoscope', label: { ar: 'الرعاية', en: 'Care' }, value: { ar: 'رعاية صحية شاملة وتدخلات طبية', en: 'Comprehensive healthcare and medical interventions' } },
      { icon: 'circle-check', label: { ar: 'النتيجة', en: 'Result' }, value: { ar: 'استقرار صحي', en: 'Health stability' } },
    ],
    outcome: {
      ar: 'تجاوزت سناء محنتها واستعادت استقرارها الصحي.',
      en: 'Sanaa came through her ordeal and regained her health stability.',
    },
  },
];

export const storiesVerse = {
  ar: 'وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا',
  en: 'Whoever saves a life, it is as if he has saved all of humanity.',
  ref: { ar: 'سورة المائدة: ٣٢', en: 'The Holy Quran, Al-Ma’idah 5:32' },
};
