// Extracts the icons the site uses (Lucide, ISC; Simple Icons, CC0) into src/data/icons.json.
// Usage: npm run icons   (re-run after adding a name below)
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const lucide = [
  'menu', 'x', 'sun', 'moon', 'languages', 'chevron-down', 'chevron-left', 'chevron-right', 'arrow-left', 'arrow-right',
  'arrow-up-right', 'arrow-up', 'copy', 'check', 'phone', 'mail', 'map-pin', 'clock', 'search', 'play', 'external-link',
  'heart', 'heart-handshake', 'hand-heart', 'shield-check', 'badge-check', 'landmark', 'building-2', 'award', 'users',
  'user', 'calendar', 'quote', 'send', 'message-circle', 'zoom-in', 'info', 'triangle-alert', 'sparkles', 'scale',
  'handshake', 'baby', 'hand-coins', 'house-heart', 'book-open', 'clipboard-list', 'stethoscope', 'trophy',
  'graduation-cap', 'hand-helping', 'shield-half', 'sprout', 'trending-up', 'shopping-bag', 'accessibility',
  'utensils', 'shopping-basket', 'activity', 'snowflake', 'gift', 'globe', 'images', 'film', 'scroll-text', 'navigation',
  'gem', 'circle-check', 'medal', 'star', 'image', 'ribbon', 'wallet', 'leaf', 'school', 'chevron-up',
  'credit-card', 'smartphone', 'store', 'lock', 'loader-circle', 'receipt-text',
];
const brands = { facebook: 'facebook', instagram: 'instagram', x: 'x', youtube: 'youtube', whatsapp: 'whatsapp' };

const icons = {};
for (const name of lucide) {
  const svg = await readFile(path.join(root, 'node_modules/lucide-static/icons', `${name}.svg`), 'utf8');
  const inner = svg.replace(/<!--.*?-->/gs, '').match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1]
    .replace(/\s*\n\s*/g, '').replace(/\s{2,}/g, ' ').trim();
  icons[name] = { kind: 'stroke', body: inner };
}
for (const [id, file] of Object.entries(brands)) {
  const svg = await readFile(path.join(root, 'node_modules/simple-icons/icons', `${file}.svg`), 'utf8');
  const d = svg.match(/<path d="([^"]+)"/)[1];
  icons[`brand-${id}`] = { kind: 'fill', body: `<path d="${d}"/>` };
}

await writeFile(path.join(root, 'src/data/icons.json'), JSON.stringify(icons, null, 1) + '\n');
console.log(`icons: ${Object.keys(icons).length}`);
