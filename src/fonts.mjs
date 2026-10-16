// Downloads the site's Google Fonts (OFL licensed) into assets/fonts/ so pages load them
// from our own domain, and writes the matching @font-face rules to src/data/fonts-<lang>.css.
// Usage: npm run fonts   (only needed when the font families or weights change)
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './content/site.mjs';
import { mealsVerse } from './content/causes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'assets/fonts');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const KEEP_SUBSETS = new Set(['arabic', 'latin']);

// Amiri is only used for Quran verses, so it is subset to exactly the characters they contain.
const verseChars = [...new Set([...`${site.verse.ar}${mealsVerse.ar}﴿﴾ `])].join('');
const FAMILIES = {
  ar: 'family=Alexandria:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
  en: 'family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;600&display=swap',
  verse: `family=Amiri&display=swap&text=${encodeURIComponent(verseChars)}`,
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

await mkdir(OUT, { recursive: true });
for (const [lang, query] of Object.entries(FAMILIES)) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`, { headers: { 'User-Agent': UA } })).text();
  const blocks = lang === 'verse'
    ? [...css.matchAll(/(@font-face\s*{[^}]+})/g)].map((m) => [m[0], 'verse', m[1]])
    : [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*{[^}]+})/g)];
  if (!blocks.length) throw new Error(`No @font-face rules returned for ${lang}`);
  const groups = new Map();
  for (const [, subset, block] of blocks) {
    if (subset !== 'verse' && !KEEP_SUBSETS.has(subset)) continue;
    const family = block.match(/font-family:\s*'([^']+)'/)[1];
    const weight = Number(block.match(/font-weight:\s*(\d+)/)[1]);
    const url = block.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/)[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1].trim();
    const key = `${family}|${subset}|${url}`;
    if (!groups.has(key)) groups.set(key, { family, subset, url, range, weights: [] });
    groups.get(key).weights.push(weight);
  }
  const rules = [];
  for (const g of groups.values()) {
    const min = Math.min(...g.weights);
    const max = Math.max(...g.weights);
    const file = `${slug(g.family)}-${min === max ? min : `${min}-${max}`}-${g.subset}.woff2`;
    const dest = path.join(OUT, file);
    if (!existsSync(dest)) {
      const res = await fetch(g.url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`Font download failed (${res.status}): ${g.url}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    rules.push(`@font-face{font-family:'${g.family}';font-style:normal;font-weight:${min === max ? min : `${min} ${max}`};font-display:swap;src:url(/assets/fonts/${file}) format('woff2')${g.range ? `;unicode-range:${g.range}` : ''}}`);
  }
  await writeFile(path.join(root, `src/data/fonts-${lang}.css`), rules.join('\n') + '\n');
  console.log(`fonts: ${lang} → ${rules.length} faces`);
}
