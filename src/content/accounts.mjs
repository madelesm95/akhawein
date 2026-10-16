// IBANs are validated (ISO 13616 mod-97) at build time; an IBAN that fails the check is
// not published and the build prints a warning, so a typo can never reach donors.
const salahSalem = { ar: 'فرع صلاح سالم', en: 'Salah Salem branch' };
const thawra = { ar: 'فرع الثورة', en: 'El-Thawra branch' };

export const banks = [
  {
    id: 'banque-misr',
    name: { ar: 'بنك مصر', en: 'Banque Misr' },
    logo: 'bank-banque-misr',
    currency: { ar: 'الجنيه المصري', en: 'Egyptian pound (EGP)' },
    holder: { ar: 'جمعية أخوين الخيرية', en: 'Akhawein Charity' },
    accounts: [
      { id: 'general', primary: true, purpose: { ar: 'الحساب العام للجمعية', en: 'General donations' }, note: { ar: 'يُوجَّه إلى أكثر الاحتياجات إلحاحاً', en: 'Directed to the most urgent needs' }, branch: salahSalem, number: '1810001000033972', iban: 'EG020002018101810001000033972' },
      { id: 'aftercare', purpose: { ar: 'دار أخوين للرعاية اللاحقة', en: 'Akhawein Aftercare Home' }, branch: salahSalem, number: '1810001000012735', iban: 'EG340002018101810001000012735' },
      { id: 'meals', purpose: { ar: 'إطعام وجبات ساخنة', en: 'Hot meals' }, branch: thawra, number: '1600001000013658', iban: 'EG660002016001600001000013658' },
      { id: 'food-parcels', purpose: { ar: 'شنط المواد الغذائية', en: 'Food parcels' }, branch: thawra, number: '1600001000013660', iban: 'EG660002016001600001000013660' },
      { id: 'udhiyah', purpose: { ar: 'صك الأضحية', en: 'Udhiyah (sacrifice) vouchers' }, branch: thawra, number: '1600001000013671', iban: 'EG660002016001600001000013671' },
      { id: 'dialysis', purpose: { ar: 'جلسات الغسيل الكلوي', en: 'Dialysis sessions' }, branch: thawra, number: '1600001000013682', iban: 'EG660002016001600001000013682' },
      { id: 'brides', purpose: { ar: 'تجهيز العرائس', en: 'Bridal preparation' }, branch: thawra, number: '1600001000013693', iban: 'EG660002016001600001000013693' },
    ],
  },
];

export function ibanIsValid(iban) {
  const s = iban.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(s)) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const digits = /\d/.test(ch) ? ch : String(ch.charCodeAt(0) - 55);
    for (const d of digits) remainder = (remainder * 10 + Number(d)) % 97;
  }
  return remainder === 1;
}

export const allAccounts = banks.flatMap((bank) => bank.accounts.map((a) => ({ ...a, bank })));
export const findAccount = (id) => allAccounts.find((a) => a.id === id);
