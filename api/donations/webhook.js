'use strict';

const { json, fail, readJsonBody, sanitizeText, REFERENCE_RE } = require('../../lib/http');
const { verifyTransactionHmac, getConfig } = require('../../lib/paymob');
const { saveDonation, isConfigured: sheetsConfigured } = require('../../lib/sheets');

function queryValue(req, name) {
  const direct = req.query && req.query[name];
  if (Array.isArray(direct)) return String(direct[0] || '');
  if (direct !== undefined && direct !== null) return String(direct);
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    return url.searchParams.get(name) || '';
  } catch {
    return '';
  }
}

function statusFor(obj) {
  if (obj.pending === true) return 'pending';
  if (obj.success !== true) return 'failed';
  if (obj.is_refunded === true) return 'refunded';
  if (obj.is_voided === true) return 'voided';
  return 'paid';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
  }

  if (!getConfig().hmacSecret) {
    console.error('[donations/webhook] PAYMOB_HMAC_SECRET is missing');
    return fail(res, 503, 'not_configured', 'الخدمة غير مفعّلة.', 'Service not configured.');
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return fail(res, 400, 'bad_request', 'طلب غير صالح.', 'Invalid request.');
  }

  if (!body || typeof body !== 'object') {
    return fail(res, 400, 'bad_request', 'طلب غير صالح.', 'Invalid request.');
  }

  // Only transaction callbacks are relevant to this endpoint.
  if (body.type && body.type !== 'TRANSACTION') {
    return json(res, 200, { ok: true, ignored: true });
  }

  const obj = body.obj;
  if (!obj || typeof obj !== 'object') {
    return fail(res, 400, 'bad_request', 'طلب غير صالح.', 'Invalid request.');
  }

  const receivedHmac = queryValue(req, 'hmac');
  if (!verifyTransactionHmac(obj, receivedHmac)) {
    console.warn('[donations/webhook] invalid HMAC', { transaction: obj.id || null });
    return fail(res, 401, 'invalid_hmac', 'التوقيع غير صالح.', 'Invalid signature.');
  }

  const reference = sanitizeText(
    (obj.order && obj.order.merchant_order_id) ||
      (obj.order && obj.order.data && obj.order.data.reference) ||
      '',
    40,
  );

  if (!REFERENCE_RE.test(reference)) {
    // Verified but impossible to correlate — acknowledge so Paymob stops retrying.
    console.warn('[donations/webhook] missing reference', { transaction: obj.id || null, order: obj.order && obj.order.id });
    return json(res, 200, { ok: true, unmatched: true });
  }

  const status = statusFor(obj);
  const amountEgp = Number(obj.amount_cents) / 100;

  const record = {
    reference,
    status,
    amount_egp: Number.isFinite(amountEgp) ? amountEgp.toFixed(2) : '',
    currency: sanitizeText(obj.currency, 8),
    paymob_order_id: obj.order && obj.order.id ? String(obj.order.id) : '',
    paymob_transaction_id: obj.id ? String(obj.id) : '',
    payment_method: sanitizeText(
      [obj.source_data && obj.source_data.type, obj.source_data && obj.source_data.sub_type].filter(Boolean).join(' / '),
      80,
    ),
    masked_pan: sanitizeText(obj.source_data && obj.source_data.pan, 12),
    hmac_verified: 'TRUE',
    error_message: status === 'failed'
      ? sanitizeText((obj.data && obj.data.message) || obj.txn_response_code || 'declined', 200)
      : '',
    raw_json: JSON.stringify(obj).slice(0, 20000),
  };

  if (!sheetsConfigured()) {
    console.error('[donations/webhook] sheets not configured');
    return fail(res, 503, 'not_configured', 'الخدمة غير مفعّلة.', 'Service not configured.');
  }

  const saved = await saveDonation(record, { timeoutMs: 7000, retries: 1 });
  if (!saved.ok) {
    // Ask Paymob to retry: losing a successful payment would be worse than
    // a duplicate callback, and the sheet upsert is idempotent by reference.
    console.error('[donations/webhook] save failed', { reference, transaction: obj.id, error: saved.error || saved.reason });
    return fail(res, 503, 'storage_failed', 'تعذر حفظ العملية.', 'Could not persist the transaction.');
  }

  console.log('[donations/webhook]', { reference, status, transaction: obj.id, created: Boolean(saved.created) });
  return json(res, 200, { ok: true, reference, status });
};
