export const PAGES = {
  home: '',
  about: 'about',
  activities: 'activities',
  causes: 'causes',
  donations: 'donations',
  gallery: 'gallery',
  protocols: 'protocols',
  certificates: 'certificates',
  branches: 'branches',
  contact: 'contact',
};

export function pagePath(lang, key, hash = '') {
  const slug = PAGES[key];
  if (slug === undefined) throw new Error(`Unknown page "${key}"`);
  const base = lang === 'ar' ? `/${slug}` : `/en${slug ? `/${slug}` : ''}`;
  return base + (hash ? `#${hash}` : '');
}

export function outputFile(lang, key) {
  const slug = PAGES[key] || 'index';
  return lang === 'ar' ? `${slug}.html` : `en/${slug}.html`;
}

const isText = (v) => v && typeof v === 'object' && !Array.isArray(v) && ('ar' in v || 'en' in v);

export function createContext(lang, page) {
  const ctx = {
    lang,
    page,
    other: lang === 'ar' ? 'en' : 'ar',
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    usedIcons: new Set(),
    t(value) {
      if (isText(value)) {
        if (value[lang] === undefined) throw new Error(`Missing ${lang} text: ${JSON.stringify(value).slice(0, 100)}`);
        return value[lang];
      }
      return value;
    },
    num(n, opts) {
      return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', opts).format(n);
    },
    url(key, hash) {
      return pagePath(lang, key, hash);
    },
  };
  return ctx;
}
