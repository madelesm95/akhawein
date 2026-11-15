/**
 * Akhawein Charity — Google Sheets gateway for online donations and
 * the site visitor counter.
 *
 * This script is the ONLY component that can write to the donations sheet.
 * Vercel functions call it with a shared secret; the sheet itself is never
 * shared publicly. It also owns the visitor counter stored in Script
 * Properties (no sheet tab required).
 *
 * Announcement ticker:
 *   - Rows live in the ANNOUNCEMENTS_SHEET tab, created on first use.
 *   - `announcements` with op=list returns every row; op=save upserts by id;
 *     op=delete removes a row. All calls require the shared secret.
 *   - The /admin panel writes through Vercel, which then calls these actions.
 *
 * Visitor counter:
 *   - Seeded from VISITOR_SEED below (a deliberately large base number).
 *   - `visit`        increments the counter by 1 and returns the new value.
 *   - `visitorCount` returns the current value without incrementing.
 *   - The counter lives in Script Properties (key VISITOR_COUNT) and uses
 *     the same script lock as donation writes, so counts cannot be lost.
 *
 * Setup (5 minutes):
 *   1. Create a Google Sheet named "Akhawein Donations".
 *   2. Extensions → Apps Script, paste this file, save.
 *   3. Run setup() once and copy the secret printed in the execution log.
 *   4. Deploy → New deployment → Web app
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the /exec URL.
 *   5. In Vercel add:
 *        SHEETS_WEBHOOK_URL     = the /exec URL
 *        SHEETS_WEBHOOK_SECRET  = the secret from step 3
 *
 * Upgrading: after pasting a new version of this file, open
 * Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy.
 * The /exec URL stays the same, so Vercel needs no changes.
 */

const SHEET_NAME = 'Donations';
const SECRET_PROPERTY = 'SHEETS_WEBHOOK_SECRET';
// Base number shown before any real visits are recorded. Change this one
// constant to adjust where the counter starts from.
const VISITOR_SEED = 1002500;
const VISITOR_COUNT_PROPERTY = 'VISITOR_COUNT';

const ANNOUNCEMENTS_SHEET = 'Announcements';
const ANNOUNCEMENTS_LIMIT = 500;
const ANNOUNCEMENT_HEADERS = [
  'id', 'active', 'start', 'end', 'priority', 'tag_ar', 'tag_en',
  'text_ar', 'text_en', 'url', 'link_ar', 'link_en', 'tone', 'updated_at',
];

const HEADERS = [
  'reference', 'created_at', 'updated_at', 'status', 'amount_egp', 'currency',
  'cause_id', 'cause_ar', 'cause_en', 'donor_first', 'donor_last', 'donor_email',
  'donor_phone', 'anonymous', 'message', 'paymob_order_id', 'paymob_intention_id',
  'paymob_transaction_id', 'payment_method', 'masked_pan', 'lang', 'hmac_verified',
  'error_message', 'raw_json',
];

/* ------------------------------------------------------------------ */
/* HTTP entry points                                                   */
/* ------------------------------------------------------------------ */

function doPost(e) {
  try {
    const body = parseBody_(e);
    if (!body) return out_({ ok: false, error: 'invalid-body' });

    const expected = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
    if (!expected || !constantTimeEqual_(String(body.secret || ''), expected)) {
      return out_({ ok: false, error: 'unauthorized' });
    }

    switch (body.action) {
      case 'upsert':
        return out_(upsert_(body.record || {}));
      case 'get':
        return out_(get_(String(body.reference || '')));
      case 'visit':
        return out_(visit_());
      case 'visitorCount':
        return out_(visitorCount_());
      case 'announcements':
        return out_(announcements_(body));
      case 'health':
        return out_({ ok: true, sheet: SHEET_NAME, rows: rowCount_() });
      default:
        return out_({ ok: false, error: 'unknown-action' });
    }
  } catch (err) {
    console.error(err);
    return out_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet(e) {
  const expected = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
  const token = e && e.parameter ? String(e.parameter.token || '') : '';
  if (!expected || !constantTimeEqual_(token, expected)) {
    return out_({ ok: false, error: 'unauthorized' });
  }
  return out_({ ok: true, service: 'akhawein-donations', sheet: SHEET_NAME, rows: rowCount_(), visitors: visitorCount_().count });
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

function upsert_(record) {
  const reference = String(record.reference || '').trim();
  if (!/^AKH-\d{8}-[A-Z0-9]{6}$/.test(reference)) {
    return { ok: false, error: 'invalid-reference' };
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: false, error: 'busy' };

  try {
    const sheet = ensureSheet_();
    const values = sheet.getDataRange().getValues();
    const now = new Date().toISOString();
    let rowIndex = -1;

    for (let i = 1; i < values.length; i += 1) {
      if (String(values[i][0]) === reference) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      const row = new Array(HEADERS.length).fill('');
      row[0] = reference;
      row[1] = now;
      row[2] = now;
      HEADERS.forEach(function (header, i) {
        if (header in record) row[i] = normalise_(record[header]);
      });
      sheet.appendRow(row);
      return { ok: true, created: true, reference: reference, row: sheet.getLastRow() };
    }

    // Merge only the keys supplied by the caller, so the webhook does not
    // wipe donor details captured when the intention was created.
    const row = values[rowIndex].slice();
    HEADERS.forEach(function (header, i) {
      if (header in record) row[i] = normalise_(record[header]);
    });
    row[2] = now;
    sheet.getRange(rowIndex + 1, 1, 1, HEADERS.length).setValues([row]);
    return { ok: true, created: false, reference: reference, row: rowIndex + 1 };
  } finally {
    lock.releaseLock();
  }
}

function get_(reference) {
  if (!/^AKH-\d{8}-[A-Z0-9]{6}$/.test(reference)) {
    return { ok: false, error: 'invalid-reference' };
  }
  const sheet = ensureSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i += 1) {
    if (String(values[i][0]) === reference) {
      const record = {};
      HEADERS.forEach(function (header, j) {
        record[header] = values[i][j] instanceof Date
          ? values[i][j].toISOString()
          : String(values[i][j] === null || values[i][j] === undefined ? '' : values[i][j]);
      });
      return { ok: true, record: record };
    }
  }
  return { ok: false, error: 'not-found' };
}

/* ------------------------------------------------------------------ */
/* Visitor counter                                                      */
/* ------------------------------------------------------------------ */

function visit_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { ok: false, error: 'busy' };

  try {
    const props = PropertiesService.getScriptProperties();
    let count = Number(props.getProperty(VISITOR_COUNT_PROPERTY));
    if (!Number.isFinite(count) || count < VISITOR_SEED) count = VISITOR_SEED;
    count += 1;
    props.setProperty(VISITOR_COUNT_PROPERTY, String(count));
    return { ok: true, count: count };
  } finally {
    lock.releaseLock();
  }
}

function visitorCount_() {
  const props = PropertiesService.getScriptProperties();
  let count = Number(props.getProperty(VISITOR_COUNT_PROPERTY));
  if (!Number.isFinite(count) || count < VISITOR_SEED) count = VISITOR_SEED;
  return { ok: true, count: count };
}

/* ------------------------------------------------------------------ */
/* Announcement ticker rows                                             */
/* ------------------------------------------------------------------ */

function announcements_(body) {
  const op = String(body.op || 'list');
  if (op === 'list') return announcementsList_();
  if (op === 'save') return announcementsSave_(body.item || {});
  if (op === 'delete') return announcementsDelete_(String(body.id || '').trim().toLowerCase());
  return { ok: false, error: 'unknown-op' };
}

function announcementsList_() {
  const sheet = ensureAnnouncementsSheet_();
  const values = sheet.getDataRange().getValues();
  const items = [];

  for (let i = 1; i < values.length && items.length < ANNOUNCEMENTS_LIMIT; i += 1) {
    const row = values[i];
    const hasValue = row.some(function (cell) {
      return String(cell === null || cell === undefined ? '' : cell).trim() !== '';
    });
    if (!hasValue) continue;

    const item = {};
    ANNOUNCEMENT_HEADERS.forEach(function (header, j) {
      item[header] = announcementCell_(row[j], header);
    });
    items.push(item);
  }

  return { ok: true, items: items };
}

function announcementsSave_(item) {
  const id = String(item.id || '').trim().toLowerCase();
  if (!/^ann-[a-z0-9][a-z0-9-]{2,39}$/.test(id)) return { ok: false, error: 'invalid-id' };
  if (!String(item.text_ar || '').trim() && !String(item.text_en || '').trim()) {
    return { ok: false, error: 'text-required' };
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: false, error: 'busy' };

  try {
    const sheet = ensureAnnouncementsSheet_();
    const values = sheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let i = 1; i < values.length; i += 1) {
      if (String(values[i][0]).trim().toLowerCase() === id) {
        rowIndex = i;
        break;
      }
    }

    const record = {};
    ANNOUNCEMENT_HEADERS.forEach(function (header) {
      if (header in item) record[header] = normalise_(item[header]);
    });
    record.id = id;
    record.updated_at = new Date().toISOString();

    if (rowIndex === -1) {
      const row = ANNOUNCEMENT_HEADERS.map(function (header) {
        return header in record ? record[header] : '';
      });
      sheet.appendRow(row);
      return { ok: true, created: true, id: id, row: sheet.getLastRow() };
    }

    const row = values[rowIndex].slice();
    ANNOUNCEMENT_HEADERS.forEach(function (header, j) {
      if (header in record) row[j] = record[header];
    });
    sheet.getRange(rowIndex + 1, 1, 1, ANNOUNCEMENT_HEADERS.length).setValues([row]);
    return { ok: true, created: false, id: id, row: rowIndex + 1 };
  } finally {
    lock.releaseLock();
  }
}

function announcementsDelete_(id) {
  if (!/^ann-[a-z0-9][a-z0-9-]{2,39}$/.test(id)) return { ok: false, error: 'invalid-id' };

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: false, error: 'busy' };

  try {
    const sheet = ensureAnnouncementsSheet_();
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i += 1) {
      if (String(values[i][0]).trim().toLowerCase() === id) {
        sheet.deleteRow(i + 1);
        return { ok: true, deleted: true, id: id };
      }
    }
    return { ok: false, error: 'not-found' };
  } finally {
    lock.releaseLock();
  }
}

/** Sheets may return real dates or booleans, depending on how a cell was typed. */
function announcementCell_(value, header) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    if (header === 'start' || header === 'end') {
      return Utilities.formatDate(value, 'Africa/Cairo', 'yyyy-MM-dd');
    }
    return value.toISOString();
  }
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return String(value);
}

function ensureAnnouncementsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(ANNOUNCEMENTS_SHEET);
  if (!sheet) sheet = ss.insertSheet(ANNOUNCEMENTS_SHEET);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ANNOUNCEMENT_HEADERS);
    sheet.getRange(1, 1, 1, ANNOUNCEMENT_HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#FBEBD6')
      .setFontColor('#13202E');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, ANNOUNCEMENT_HEADERS.length).createFilter();
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(8, 280);
    sheet.setColumnWidth(9, 280);
    sheet.setColumnWidth(10, 220);
  }
  return sheet;
}

/* ------------------------------------------------------------------ */
/* Setup / helpers                                                     */
/* ------------------------------------------------------------------ */

/** Run once from the Apps Script editor. */
function setup() {
  const sheet = ensureSheet_();
  const announcementsSheet = ensureAnnouncementsSheet_();
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty(SECRET_PROPERTY);
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty(SECRET_PROPERTY, secret);
  }
  Logger.log('Sheet ready: ' + sheet.getName() + ' (' + Math.max(0, sheet.getLastRow() - 1) + ' rows)');
  Logger.log('Announcements ready: ' + announcementsSheet.getName() + ' (' + Math.max(0, announcementsSheet.getLastRow() - 1) + ' rows)');
  Logger.log('SHEETS_WEBHOOK_SECRET = ' + secret);
  Logger.log('Copy both values into Vercel → Settings → Environment Variables.');
  return secret;
}

function ensureSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#FBEBD6')
      .setFontColor('#13202E');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).createFilter();
    sheet.setColumnWidth(1, 190);
    sheet.setColumnWidth(2, 170);
    sheet.setColumnWidth(3, 170);
    sheet.setColumnWidth(4, 110);
    sheet.setColumnWidth(5, 110);
    sheet.setColumnWidth(9, 220);
    sheet.setColumnWidth(10, 150);
    sheet.setColumnWidth(11, 150);
    sheet.setColumnWidth(12, 220);
    sheet.setColumnWidth(16, 150);
    sheet.setColumnWidth(23, 240);
  }
  return sheet;
}

function rowCount_() {
  const sheet = ensureSheet_();
  return Math.max(0, sheet.getLastRow() - 1);
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return null;
  }
}

function normalise_(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value).slice(0, 20000);
}

function constantTimeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function out_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
