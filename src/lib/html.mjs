class Raw {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

export const raw = (value) => new Raw(String(value));

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ESC[ch]);

function render(value) {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  if (typeof value === 'object') {
    throw new TypeError(`Unrendered object in template (missing t()?): ${JSON.stringify(value).slice(0, 120)}`);
  }
  return esc(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new Raw(out);
}

export function attrs(map) {
  return raw(Object.entries(map)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join(''));
}
