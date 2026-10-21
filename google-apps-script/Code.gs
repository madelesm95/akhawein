/**
 * Akhawein Charity — Google Sheets gateway for online donations.
 *
 * This script is the ONLY component that can write to the donations sheet.
 * Vercel functions call it with a shared secret; the sheet itself is never
 * shared publicly.
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
 */

const SHEET_NAME = 'Donations';
const SECRET_PROPERTY = 'SHEETS_WEBHOOK_SECRET';

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
  return out_({ ok: true, service: 'akhawein-donations', sheet: SHEET_NAME, rows: rowCount_() });
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
/* Setup / helpers                                                     */
/* ------------------------------------------------------------------ */

/** Run once from the Apps Script editor. */
function setup() {
  const sheet = ensureSheet_();
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty(SECRET_PROPERTY);
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty(SECRET_PROPERTY, secret);
  }
  Logger.log('Sheet ready: ' + sheet.getName() + ' (' + Math.max(0, sheet.getLastRow() - 1) + ' rows)');
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
