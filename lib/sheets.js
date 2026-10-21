'use strict';

/**
 * Google Sheets gateway (Apps Script Web App).
 *
 * The Vercel functions never talk to Google OAuth directly: a small Apps
 * Script in `google-apps-script/Code.gs` owns the sheet and accepts signed
 * JSON commands. This keeps the integration deployable on a free Vercel
 * plan with zero npm dependencies.
 *
 * Environment:
 *   SHEETS_WEBHOOK_URL     https://script.google.com/macros/s/.../exec
 *   SHEETS_WEBHOOK_SECRET  long random string, also stored in Script Properties
 */

const env = (name) => (process.env[name] || '').trim();

const isConfigured = () => Boolean(env('SHEETS_WEBHOOK_URL') && env('SHEETS_WEBHOOK_SECRET'));

const FIELDS = [
  'reference',
  'status',
  'amount_egp',
  'currency',
  'cause_id',
  'cause_ar',
  'cause_en',
  'donor_first',
  'donor_last',
  'donor_email',
  'donor_phone',
  'anonymous',
  'message',
  'paymob_order_id',
  'paymob_intention_id',
  'paymob_transaction_id',
  'payment_method',
  'masked_pan',
  'lang',
  'hmac_verified',
  'error_message',
  'raw_json',
];

function cleanRecord(record) {
  const out = {};
  for (const key of FIELDS) {
    if (!(key in record)) continue;
    let value = record[key];
    if (value === null || value === undefined) value = '';
    if (typeof value === 'boolean') value = value ? 'TRUE' : 'FALSE';
    if (typeof value === 'object') value = JSON.stringify(value);
    out[key] = String(value).slice(0, key === 'raw_json' ? 20000 : 500);
  }
  out.updated_at = new Date().toISOString();
  return out;
}

function gatewayUrl() {
  return env('SHEETS_WEBHOOK_URL');
}

async function callGateway(payload, { timeoutMs = 8000, retries = 1 } = {}) {
  if (!isConfigured()) return { ok: false, skipped: true, reason: 'not-configured' };

  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(gatewayUrl(), {
        method: 'POST',
        // text/plain avoids a CORS preflight and is required by Apps Script
        // for simple cross-origin POST requests.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...payload, secret: env('SHEETS_WEBHOOK_SECRET') }),
        signal: controller.signal,
        redirect: 'follow',
      });
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
      if (!res.ok || !data || data.ok !== true) {
        lastError = new Error(`Sheets gateway ${res.status}: ${String(text).slice(0, 200)}`);
        if (res.status < 500) break; // 4xx will not fix itself on retry
      } else {
        return { ok: true, ...data };
      }
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) await new Promise((r) => setTimeout(r, 350));
  }
  return { ok: false, error: lastError ? String(lastError.message || lastError).slice(0, 300) : 'unknown' };
}

/** Create or update one donation row, keyed by `reference`. */
function saveDonation(record, options) {
  return callGateway({ action: 'upsert', record: cleanRecord(record) }, options);
}

/** Fetch one donation row by reference (used to validate redirect data). */
function getDonation(reference, options) {
  return callGateway({ action: 'get', reference: String(reference || '') }, options);
}

module.exports = {
  isConfigured,
  saveDonation,
  getDonation,
  cleanRecord,
  FIELDS,
};
