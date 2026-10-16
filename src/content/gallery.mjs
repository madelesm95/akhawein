export const galleryCategories = [
  { id: 'meals', label: { ar: 'الإطعام', en: 'Hot meals' } },
  { id: 'orphans', label: { ar: 'يوم اليتيم والرحلات', en: 'Orphans’ Day & trips' } },
  { id: 'palestine', label: { ar: 'إغاثة فلسطين', en: 'Palestine relief' } },
  { id: 'ismailia', label: { ar: 'قوافل الإسماعيلية', en: 'Ismailia convoys' } },
  { id: 'fayoum', label: { ar: 'تأهيل الفيوم', en: 'Fayoum training' } },
  { id: 'volunteers', label: { ar: 'المتطوعون', en: 'Volunteers' } },
  { id: 'videos', label: { ar: 'فيديو', en: 'Videos' } },
];

const dec24 = { ar: 'ديسمبر ٢٠٢٤', en: 'Dec 2024' };
const dec13 = { ar: '١٣ ديسمبر ٢٠٢٤', en: '13 Dec 2024' };
const apr24 = { ar: 'أبريل ٢٠٢٤', en: 'Apr 2024' };
const may24 = { ar: 'مايو ٢٠٢٤', en: 'May 2024' };

export const gallery = [
  { type: 'video', youtube: 'Y7_7ypKtO1o', image: 'video-Y7_7ypKtO1o', cats: ['orphans', 'videos'], title: { ar: 'حفلة يوم اليتيم: رسم البسمة على وجوه الأطفال', en: 'Orphans’ Day: putting smiles on children’s faces' } },
  { type: 'video', youtube: 'Cg4xn8M6Dvw', image: 'video-Cg4xn8M6Dvw', cats: ['orphans', 'videos'], title: { ar: 'رحلة الأقصر التثقيفية لأبناء الجمعية', en: 'An educational trip to Luxor' } },
  { type: 'video', youtube: '0CEpTudfVnM', image: 'video-0CEpTudfVnM', cats: ['orphans', 'videos'], title: { ar: 'يوم ترفيهي في البحر الأحمر للأيتام والشباب', en: 'A day out at the Red Sea for orphans and youth' } },

  { image: 'meals-prep', cats: ['meals'], date: dec24, title: { ar: 'تحضير وجبات الأرز والدجاج والخضار في مطبخ الجمعية', en: 'Preparing rice, chicken and vegetable meals in our kitchen' } },
  { image: 'elderly-meal', cats: ['meals'], date: dec24, title: { ar: 'تسليم الوجبات الساخنة لكبار السن وذوي الهمم', en: 'Delivering hot meals to the elderly and people with disabilities' } },
  { image: 'street-distribution', cats: ['meals'], date: dec24, title: { ar: 'توزيع الوجبات الساخنة على المستحقين في الشارع', en: 'Handing out hot meals on the street' } },
  { image: 'meals-batch', cats: ['meals'], date: dec24, title: { ar: 'وجبات ساخنة مغلّفة وجاهزة للتوزيع', en: 'Sealed hot meals ready for distribution' } },
  { image: 'meal-box', cats: ['meals'], date: dec24, title: { ar: 'علبة الوجبة بالملصق الرسمي للجمعية', en: 'A meal box carrying the Akhawein label' } },
  { image: 'volunteers-walk', cats: ['volunteers'], date: dec24, title: { ar: 'جولة ميدانية لمتطوعي أخوين بالزي الموحد', en: 'Akhawein volunteers on a field round' } },
  { image: 'kids-park', cats: ['orphans', 'volunteers'], date: { ar: 'يناير ٢٠٢٥', en: 'Jan 2025' }, title: { ar: 'احتفالية ترفيهية لأبناء الجمعية ومتطوعيها', en: 'A park celebration with our children and volunteers' } },
  { image: 'ismailia-meals', cats: ['ismailia', 'meals'], date: dec13, title: { ar: 'قوافل الإسماعيلية: وجبات ساخنة للأطفال والأسر', en: 'Ismailia convoy: hot meals for children and families' } },
  { image: 'volunteers-group', cats: ['ismailia', 'volunteers'], date: dec13, title: { ar: 'قوافل الإسماعيلية: فريق متطوعي أخوين', en: 'Ismailia convoy: our volunteer team' } },
  { image: 'volunteers-team', cats: ['ismailia', 'volunteers'], date: dec13, title: { ar: 'قوافل الإسماعيلية: شباب أخوين بالسترات الرسمية', en: 'Ismailia convoy: Akhawein youth in uniform' } },
  { image: 'ismailia-loading', cats: ['ismailia', 'meals', 'volunteers'], date: dec13, title: { ar: 'قوافل الإسماعيلية: تنظيم الوجبات وتوزيعها', en: 'Ismailia convoy: organising and handing out meals' } },
  { image: 'palestine-blankets', cats: ['palestine'], date: { ar: 'شتاء ٢٠٢٤', en: 'Winter 2024' }, title: { ar: 'إغاثة فلسطين: بطاطين الشتاء للأسر النازحة', en: 'Palestine relief: winter blankets for displaced families' } },
  { image: 'palestine-supplies', cats: ['palestine'], date: dec24, title: { ar: 'إغاثة فلسطين: مواقد طهي وأدوات معيشة لمراكز الإيواء', en: 'Palestine relief: cooking stoves and supplies for shelters' } },
  { image: 'palestine-shelter', cats: ['palestine'], date: dec24, title: { ar: 'إغاثة فلسطين: طرود أجهزة ومستلزمات منزلية', en: 'Palestine relief: appliances and household parcels' } },
  { image: 'palestine-pediatric', cats: ['palestine'], title: { ar: 'إغاثة فلسطين: كراسٍ متحركة ورعاية طبية للأطفال المصابين', en: 'Palestine relief: wheelchairs and care for injured children' } },
  { image: 'fayoum-assignment', cats: ['fayoum'], title: { ar: 'الفيوم: توقيع إسناد مركز أخوين للتكوين المهني', en: 'Fayoum: receiving the official assignment of the Akhawein vocational centre' } },
  { image: 'fayoum-graduates', cats: ['fayoum', 'volunteers'], title: { ar: 'الفيوم: شهادات إتمام الدورات التدريبية', en: 'Fayoum: certificates for training graduates' } },
  { image: 'fayoum-certificate', cats: ['fayoum', 'volunteers'], date: may24, title: { ar: 'الفيوم: تكريم إحدى خريجات التكوين المهني', en: 'Fayoum: honouring a vocational-training graduate' } },
  { image: 'fayoum-honoring', cats: ['fayoum'], date: may24, title: { ar: 'الفيوم: تكريم قيادات إدارة التكوين المهني', en: 'Fayoum: honouring vocational-training officials' } },
  { image: 'orphan-train', cats: ['orphans'], date: apr24, title: { ar: 'يوم اليتيم: قطار البهجة وألعاب الأطفال', en: 'Orphans’ Day: the joy train and games' } },
  { image: 'orphan-clown', cats: ['orphans'], date: apr24, title: { ar: 'يوم اليتيم: عروض المهرج ورسم البسمة', en: 'Orphans’ Day: clown shows and smiles' } },
  { image: 'orphan-folklore', cats: ['orphans'], date: apr24, title: { ar: 'يوم اليتيم: الفنون الشعبية ورقصة التحطيب', en: 'Orphans’ Day: folk arts and tahtib' } },
  { image: 'orphan-tanoura', cats: ['orphans'], date: apr24, title: { ar: 'يوم اليتيم: استعراض التنورة المصرية', en: 'Orphans’ Day: an Egyptian tanoura show' } },
  { image: 'orphan-dignitaries', cats: ['orphans', 'volunteers'], date: apr24, title: { ar: 'يوم اليتيم: كبار الزوار والجهات الداعمة', en: 'Orphans’ Day: guests of honour and supporters' } },
  { image: 'orphan-leadership', cats: ['orphans', 'volunteers'], date: apr24, title: { ar: 'يوم اليتيم: قيادات الجمعية ومجلس إدارتها', en: 'Orphans’ Day: Akhawein’s leadership and board' } },
];
