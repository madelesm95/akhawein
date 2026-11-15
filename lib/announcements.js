'use strict';

/**
 * Announcement ticker data.
 *
 * Rows live in the `Announcements` tab of the same Google Sheet used for the
 * donation ledger. Writes go through the Apps Script gateway in
 * `google-apps-script/Code.gs`; the site itself never talks to Google from the
 * browser, and no spreadsheet credentials reach the client.
 *
 * Public reads are filtered and sorted here (not in the browser) so the
 * published payload only contains what the ticker may show.
 */

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { callGateway, isConfigured: isSheetsConfigured } = require('./sheets');

const LOCAL_DATA_PATH = path.join(__dirname, '..', 'data', 'announcements.json');

function hasLocalFallback() {
  return fs.existsSync(LOCAL_DATA_PATH);
}

function isConfigured() {
  return isSheetsConfigured() || hasLocalFallback();
}

function loadLocalAnnouncements() {
  try {
    if (fs.existsSync(LOCAL_DATA_PATH)) {
      const raw = fs.readFileSync(LOCAL_DATA_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load local announcements fallback:', err && err.message);
  }
  return null;
}

function writeLocalAnnouncements(items) {
  try {
    const dir = path.dirname(LOCAL_DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write local announcements:', err && err.message);
    return false;
  }
}

function saveLocalAnnouncement(item) {
  const items = loadLocalAnnouncements() || [];
  const idx = items.findIndex((x) => x.id === item.id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...item };
  } else {
    items.unshift(item);
  }
  return writeLocalAnnouncements(items);
}

function deleteLocalAnnouncement(id) {
  const items = loadLocalAnnouncements() || [];
  const filtered = items.filter((x) => x.id !== id);
  return writeLocalAnnouncements(filtered);
}

const TONES = ['gold', 'green', 'red', 'navy'];
const MAX_PUBLIC_ITEMS = 12;

const ID_RE = /^ann-[a-z0-9][a-z0-9-]{2,39}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const clip = (value, max) => String(value === null || value === undefined ? '' : value).trim().slice(0, max);

function isActive(value) {
  const v = clip(value, 12).toLowerCase();
  return !/^(false|0|no|off|لا|معطل|مغلق)$/.test(v);
}

function normaliseUrl(value) {
  const url = clip(value, 500);
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (/^\/(?!\/)/.test(url)) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^mailto:[^@\s]+@[^@\s]+$/i.test(url)) return url;
  if (/^tel:[+\d\s()-]{3,24}$/i.test(url)) return url;
  if (/^#[\w-]*$/.test(url)) return url;
  return '';
}

function validDate(value) {
  const v = clip(value, 10);
  if (!v) return '';
  if (!DATE_RE.test(v)) return '';
  const [year, month, day] = v.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  return v;
}

function newId() {
  return `ann-${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
}

/**
 * Validate and normalise one announcement coming from the panel.
 * Returns `{ ok: true, item }` with exactly the sheet columns, or an error code.
 */
function normaliseAnnouncement(input) {
  const source = input && typeof input === 'object' ? input : {};

  const textAr = clip(source.text_ar, 600);
  const textEn = clip(source.text_en, 600);
  if (!textAr && !textEn) return { ok: false, error: 'text_required' };

  const suppliedId = clip(source.id, 40).toLowerCase();
  if (suppliedId && !ID_RE.test(suppliedId)) return { ok: false, error: 'invalid_id' };

  const start = validDate(source.start);
  const end = validDate(source.end);
  if (clip(source.start) && !start) return { ok: false, error: 'invalid_start' };
  if (clip(source.end) && !end) return { ok: false, error: 'invalid_end' };
  if (start && end && start > end) return { ok: false, error: 'invalid_range' };

  const tone = clip(source.tone, 10).toLowerCase();
  const priority = Number(source.priority);

  const item = {
    id: suppliedId || newId(),
    active: source.active === false || String(source.active).toLowerCase() === 'false' ? 'FALSE' : 'TRUE',
    start,
    end,
    priority: String(Number.isFinite(priority) ? Math.min(1000, Math.max(0, Math.round(priority))) : 0),
    tag_ar: clip(source.tag_ar, 40),
    tag_en: clip(source.tag_en, 40),
    text_ar: textAr,
    text_en: textEn,
    url: normaliseUrl(source.url),
    link_ar: clip(source.link_ar, 40),
    link_en: clip(source.link_en, 40),
    tone: TONES.includes(tone) ? tone : 'gold',
    updated_at: new Date().toISOString(),
  };

  return { ok: true, item };
}

/** The shape the ticker consumes (camelCase, already filtered). */
function toPublicItem(row) {
  const tone = clip(row.tone, 10).toLowerCase();
  return {
    id: clip(row.id, 40),
    textAr: clip(row.text_ar, 600),
    textEn: clip(row.text_en, 600),
    tagAr: clip(row.tag_ar, 40),
    tagEn: clip(row.tag_en, 40),
    url: normaliseUrl(row.url),
    linkAr: clip(row.link_ar, 40),
    linkEn: clip(row.link_en, 40),
    tone: TONES.includes(tone) ? tone : 'gold',
    priority: Number(row.priority) || 0,
  };
}

/** Cairo's calendar date, so scheduling matches the charity's timezone. */
function cairoToday(now = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

/** Active, in-window announcements ordered by priority (highest first). */
function publicItems(rows, now = new Date()) {
  const today = cairoToday(now);
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && isActive(row.active))
    .filter((row) => clip(row.text_ar, 600) || clip(row.text_en, 600))
    .filter((row) => {
      const start = validDate(row.start);
      const end = validDate(row.end);
      return (!start || start <= today) && (!end || end >= today);
    })
    .sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0))
    .slice(0, MAX_PUBLIC_ITEMS)
    .map(toPublicItem);
}

const LIST_OPTIONS = { timeoutMs: 6000, retries: 0 };
const WRITE_OPTIONS = { timeoutMs: 8000, retries: 1 };

async function listAnnouncements(options) {
  try {
    const res = await callGateway({ action: 'announcements', op: 'list' }, { ...LIST_OPTIONS, ...options });
    if (res && res.ok && Array.isArray(res.items)) {
      return res;
    }
    const local = loadLocalAnnouncements();
    if (local) {
      return { ok: true, items: local, fallback: true };
    }
    return res;
  } catch (err) {
    const local = loadLocalAnnouncements();
    if (local) {
      return { ok: true, items: local, fallback: true };
    }
    return { ok: false, error: err && err.message ? err.message : 'gateway' };
  }
}

async function saveAnnouncement(item, options) {
  let gatewayOk = false;
  let gatewayRes = null;
  try {
    gatewayRes = await callGateway({ action: 'announcements', op: 'save', item }, { ...WRITE_OPTIONS, ...options });
    if (gatewayRes && gatewayRes.ok) {
      gatewayOk = true;
    }
  } catch {
    // Gateway call failed
  }
  const localOk = saveLocalAnnouncement(item);
  if (gatewayOk) {
    return gatewayRes;
  }
  if (localOk) {
    return { ok: true, item, localFallback: true };
  }
  return gatewayRes || { ok: false, error: 'gateway' };
}

async function deleteAnnouncement(id, options) {
  let gatewayOk = false;
  let gatewayRes = null;
  try {
    gatewayRes = await callGateway({ action: 'announcements', op: 'delete', id }, { ...WRITE_OPTIONS, ...options });
    if (gatewayRes && gatewayRes.ok) {
      gatewayOk = true;
    }
  } catch {
    // Gateway call failed
  }
  const localOk = deleteLocalAnnouncement(id);
  if (gatewayOk) {
    return gatewayRes;
  }
  if (localOk) {
    return { ok: true, id, localFallback: true };
  }
  return gatewayRes || { ok: false, error: 'gateway' };
}

module.exports = {
  isConfigured,
  normaliseAnnouncement,
  publicItems,
  toPublicItem,
  listAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  newId,
  validDate,
  cairoToday,
  ID_RE,
  TONES,
  MAX_PUBLIC_ITEMS,
};
