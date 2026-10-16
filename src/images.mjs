// Converts source images in images/ into responsive WebP files in assets/img/
// and records their dimensions in src/data/images.json for the page builder.
// Usage: npm run images   (re-run after adding or replacing a source image)
import sharp from 'sharp';
import { readFile, writeFile, mkdir, stat, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'assets/img');
const MANIFEST = path.join(root, 'src/data/images.json');

const PHOTO = [480, 720, 1080, 1600];
const CARD = [480, 720, 960];
const LOGO = [240, 480];

const sources = {
  logo: { src: 'images/logo.png', widths: [177] },

  'volunteers-walk': { src: 'images/gallery/volunteers-field-walk.jpg', widths: PHOTO },
  'volunteers-group': { src: 'images/gallery/ismailia-volunteers-group.jpg', widths: PHOTO },
  'volunteers-team': { src: 'images/gallery/ismailia-youth-team.jpg', widths: PHOTO },
  // trimBottom removes the phone-camera date stamp burned into these photos
  'meals-prep': { src: 'images/gallery/hot-meals-prep.jpg', widths: PHOTO, trimBottom: 0.11 },
  'meals-batch': { src: 'images/gallery/meals-batch-ready.jpg', widths: PHOTO, trimBottom: 0.09 },
  'meal-box': { src: 'images/gallery/meal-box-label.jpg', widths: PHOTO, trimBottom: 0.11 },
  'elderly-meal': { src: 'images/gallery/elderly-meal-handover.jpg', widths: PHOTO },
  'street-distribution': { src: 'images/gallery/street-distribution.jpg', widths: PHOTO },
  'kids-park': { src: 'images/gallery/kids-park-celebration.jpg', widths: PHOTO },
  'palestine-blankets': { src: 'images/gallery/palestine-winter-blankets.jpg', widths: PHOTO },
  'palestine-supplies': { src: 'images/gallery/palestine-living-supplies.jpg', widths: PHOTO },
  'palestine-shelter': { src: 'images/gallery/palestine-shelter-aid.jpg', widths: PHOTO },
  'palestine-pediatric': { src: 'images/gallery/palestine-pediatric-care.jpg', widths: PHOTO },
  'ismailia-meals': { src: 'images/gallery/ismailia-meal-distribution.jpg', widths: PHOTO },
  'ismailia-loading': { src: 'images/gallery/ismailia-meals-loading.jpg', widths: PHOTO },
  'fayoum-assignment': { src: 'images/gallery/fayoum-center-assignment.jpg', widths: PHOTO },
  'fayoum-graduates': { src: 'images/gallery/fayoum-training-graduates.jpg', widths: PHOTO },
  'fayoum-certificate': { src: 'images/gallery/fayoum-trainee-certificate.jpg', widths: PHOTO },
  'fayoum-honoring': { src: 'images/gallery/fayoum-appreciation-honoring.jpg', widths: PHOTO },
  'orphan-train': { src: 'images/gallery/orphan-kids-train-game.jpg', widths: PHOTO },
  'orphan-clown': { src: 'images/gallery/orphan-clown-show.jpg', widths: PHOTO },
  'orphan-folklore': { src: 'images/gallery/orphan-folklore-stick-dance.jpg', widths: PHOTO },
  'orphan-tanoura': { src: 'images/gallery/orphan-tanoura-dance.jpg', widths: PHOTO },
  'orphan-dignitaries': { src: 'images/gallery/orphan-vip-dignitaries.jpg', widths: PHOTO },
  'orphan-leadership': { src: 'images/gallery/orphan-celebration-group.jpg', widths: PHOTO },
  'senior-hands': { src: 'images/close-up-senior-couple-holding-hands.jpg', widths: PHOTO },
  'video-Y7_7ypKtO1o': { src: 'images/videos/Y7_7ypKtO1o.jpg', widths: [480, 960, 1280] },
  'video-Cg4xn8M6Dvw': { src: 'images/videos/Cg4xn8M6Dvw.jpg', widths: [480, 960, 1280] },
  'video-0CEpTudfVnM': { src: 'images/videos/0CEpTudfVnM.jpg', widths: [480, 960, 1280] },

  'cause-food-parcel': { src: 'images/causes/food-parcel.jpg', widths: CARD },
  'cause-orphans': { src: 'images/causes/orphans-elderly.jpg', widths: CARD },
  'cause-dialysis': { src: 'images/causes/dialysis.jpg', widths: CARD },
  'cause-relief': { src: 'images/causes/relief-hands.jpg', widths: CARD },
  'cause-winter': { src: 'images/causes/winter-blankets.png', widths: CARD },
  'cause-omneya': { src: 'images/omneya-girl.jpg', widths: CARD },

  'bank-banque-misr': { src: 'images/banque-misr-logo.png', widths: [285] },
  'caf-certificate': { src: 'images/protocols/protocol-cert-caf.jpeg', widths: [480, 886] },

  'partner-phoenix-academy': { src: 'images/protocols/phoenix-logo.png', widths: [215] },
  'partner-cambridge': { src: 'images/protocols/cambridge-logo.png', widths: [215] },
  'partner-bac': { src: 'images/protocols/bac-logo.png', widths: [215] },
  'partner-realdeal': { src: 'images/protocols/realdeal-logo.png', widths: [215] },
  'partner-ihostu': { src: 'images/protocols/ihostu-logo.png', widths: [215] },
  'partner-ibusiness': { src: 'images/protocols/ibusiness-logo.png', widths: [215] },
  'partner-caf-america': { src: 'images/partners/caf-america.png', widths: [154] },
  'partner-orange-cash': { src: 'images/partners/orange-cash.png', widths: LOGO },
  'partner-orange': { src: 'images/partners/orange.png', widths: [240] },
  'partner-banque-misr': { src: 'images/partners/banque-misr.png', widths: [285] },
  'partner-albaraka': { src: 'images/partners/albaraka.png', widths: [240, 480] },
  'partner-fawry': { src: 'images/partners/fawry.png', widths: [300] },
};

const certificates = JSON.parse(await readFile(path.join(root, 'src/content/certificates.json'), 'utf8'));
for (const c of certificates) sources[c.id] = { src: c.src, widths: [360, 659] };

async function newer(out, src) {
  if (!existsSync(out)) return false;
  return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
}

await mkdir(OUT, { recursive: true });
const manifest = {};
let written = 0;
for (const [id, { src, widths, trimBottom = 0 }] of Object.entries(sources)) {
  const file = path.join(root, src);
  if (!existsSync(file)) throw new Error(`Missing source image for "${id}": ${src}`);
  const meta = await sharp(file).rotate().metadata();
  const turned = meta.orientation >= 5 ? { w: meta.height, h: meta.width } : { w: meta.width, h: meta.height };
  const oriented = { w: turned.w, h: Math.round(turned.h * (1 - trimBottom)) };
  const pipeline = () => {
    const img = sharp(file).rotate();
    return trimBottom ? img.extract({ left: 0, top: 0, width: oriented.w, height: oriented.h }) : img;
  };
  const usable = [...new Set(widths.map((w) => Math.min(w, oriented.w)))].sort((a, b) => a - b);
  for (const w of usable) {
    const out = path.join(OUT, `${id}-${w}.webp`);
    if (await newer(out, file)) continue;
    await pipeline().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(out);
    written++;
  }
  manifest[id] = { w: oriented.w, h: oriented.h, widths: usable };
}

const favicon = path.join(root, 'images/logo-square.png');
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192]]) {
  const out = path.join(root, 'assets', name);
  if (await newer(out, favicon)) continue;
  await sharp(favicon).resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(out);
  written++;
}
const og = path.join(root, 'assets/og-image.jpg');
const ogSrc = path.join(root, 'images/gallery/ismailia-volunteers-group.jpg');
if (!(await newer(og, ogSrc))) {
  await sharp(ogSrc).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
  written++;
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
const expected = new Set(Object.entries(manifest).flatMap(([id, m]) => m.widths.map((w) => `${id}-${w}.webp`)));
let removed = 0;
for (const file of await readdir(OUT)) {
  if (!expected.has(file)) { await unlink(path.join(OUT, file)); removed++; }
}
console.log(`images: ${Object.keys(manifest).length} sources, ${written} files written, ${removed} stale removed`);
