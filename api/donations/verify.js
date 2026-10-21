'use strict';

const {
  json,
  fail,
  readJsonBody,
  clientIp,
  rateLimit,
  sanitizeText,
  REFERENCE_RE,
} = require('../../lib/http');
const { verifyRedirectHmac, getConfig } = require('../../lib/paymob');
const { saveDonation, getDonation, isConfigured: sheetsConfigured } = require('../../lib/sheets');

function parseQuery(input) {
  const raw = typeof input === 'string' ? input.replace(/^\?/, '') : '';
  if (!raw || raw.length > 8192) return null;
  const q = {};
  try {
    const params = new URLSearchParams(raw);
    for (const [key, value] of params) {
      if (!(key in q)) q[key] = value;
    }
  } catch {
    return null;
  }
  return q;
}

/**
 * Paymob has shipped the response redirect with slightly different key names
 * over time (`order` vs `order_id`, `source_data.pan` vs `source_data_pan`).
 * Normalise both shapes before HMAC verification; the signed values are what
 * matter, not the spelling of the key in the browser URL.
 */
function normaliseQuery(q) {
  return {
    ...q,
    id: q.id !== undefined ? q.id : q['obj.id'],
    order_id: q.order_id !== undefined ? q.order_id : q.order !== undefined ? q.order : q['order.id'],
    source_data_pan: q.source_data_pan !== undefined ? q.source_data_pan : q['source_data.pan'],
    source_data_sub_type: q.source_data_sub_type !== undefined ? q.source_data_sub_type : q['source_data.sub_type'],
    source_data_type: q.source_data_type !== undefined ? q.source_data_type : q['source_data.type'],
  };
}

function bool(value) {
  return value === true || value === 'true' || value === '1';
}

function statusFor(q) {
  if (bool(q.pending)) return 'pending';
  if (!bool(q.success)) return 'failed';
  if (bool(q.is_refunded)) return 'refunded';
  if (bool(q.is_voided)) return 'voided';
  return 'paid';
}

function referenceFrom(...candidates) {
  for (const candidate of candidates) {
    const value = sanitizeText(candidate, 40);
    if (REFERENCE_RE.test(value)) return value;
  }
  return '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
  }

  if (!getConfig().hmacSecret) {
    return fail(res, 503, 'not_configured', 'الخدمة غير مفعّلة.', 'Service not configured.');
  }

  const limit = rateLimit(`verify:${clientIp(req)}`, { limit: 40, windowMs: 60 * 1000 });
  if (!limit.allowed) {
    return fail(res, 429, 'rate_limited', 'محاولات كثيرة. حاول بعد قليل.', 'Too many attempts. Try again shortly.');
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return fail(res, 400, 'bad_request', 'طلب غير صالح.', 'Invalid request.');
  }

  const q = parseQuery(body && (body.query || body.search));
  if (!q) {
    return fail(res, 400, 'bad_request', 'بيانات التحقق غير مكتملة.', 'Verification data is incomplete.');
  }

  const normalised = normaliseQuery(q);
  const receivedHmac = q.hmac || '';
  const hmacOk =
    verifyRedirectHmac(q, receivedHmac) ||
    verifyRedirectHmac(normalised, receivedHmac);

  const reference = referenceFrom(q.ref, q.merchant_order_id, normalised.merchant_order_id);

  let row = null;
  if (reference && sheetsConfigured()) {
    const stored = await getDonation(reference, { timeoutMs: 5000, retries: 0 }).catch(() => ({ ok: false }));
    row = stored && stored.ok && stored.record ? stored.record : null;
  }

  /*
   * Path A — the redirect carries a valid Paymob HMAC: it is safe to use its
   * values. Still cross-check the order against the sheet when possible.
   */
  if (hmacOk) {
    const status = statusFor(normalised);
    const amount = Number(normalised.amount_cents) / 100;
    const orderId = sanitizeText(normalised.order_id, 40);
    const transactionId = sanitizeText(normalised.id, 40);

    let trustedReference = reference;
    if (row && row.paymob_order_id && orderId && String(row.paymob_order_id) !== orderId) {
      trustedReference = '';
      row = null;
    }

    if (trustedReference && sheetsConfigured()) {
      await saveDonation(
        {
          reference: trustedReference,
          status,
          amount_egp: Number.isFinite(amount) ? amount.toFixed(2) : '',
          currency: sanitizeText(normalised.currency, 8),
          paymob_order_id: orderId,
          paymob_transaction_id: transactionId,
          payment_method: sanitizeText(
            [normalised.source_data_type, normalised.source_data_sub_type].filter(Boolean).join(' / '),
            80,
          ),
          masked_pan: sanitizeText(normalised.source_data_pan, 12),
          hmac_verified: 'TRUE',
          error_message: status === 'failed'
            ? sanitizeText(q.data_message || q.txn_response_code || 'declined', 200)
            : '',
        },
        { timeoutMs: 5000, retries: 0 },
      ).catch(() => {});
    }

    return json(res, 200, {
      ok: true,
      verified: true,
      source: 'redirect',
      status,
      success: status === 'paid',
      pending: status === 'pending',
      amount: Number.isFinite(amount) ? amount : null,
      currency: sanitizeText(normalised.currency, 8) || 'EGP',
      reference: trustedReference,
      orderId,
      transactionId,
      method: sanitizeText(normalised.source_data_sub_type || normalised.source_data_type, 40),
      maskedPan: sanitizeText(normalised.source_data_pan, 8),
      cause: row
        ? {
            id: sanitizeText(row.cause_id, 40),
            ar: sanitizeText(row.cause_ar, 80),
            en: sanitizeText(row.cause_en, 80),
          }
        : null,
    });
  }

  /*
   * Path B — the redirect is unsigned (some Paymob flows omit the HMAC). The
   * webhook is the source of truth, so only report a status that a verified
   * webhook already wrote to the sheet. Never trust the URL params here.
   */
  if (row && String(row.hmac_verified).toUpperCase() === 'TRUE' && ['paid', 'pending', 'failed', 'refunded', 'voided'].includes(row.status)) {
    const orderFromUrl = sanitizeText(normalised.order_id, 40);
    if (row.paymob_order_id && orderFromUrl && String(row.paymob_order_id) !== orderFromUrl) {
      return fail(res, 400, 'invalid_hmac', 'تعذر التحقق من عملية الدفع.', 'Could not verify the payment.');
    }

    const amount = Number(row.amount_egp);
    return json(res, 200, {
      ok: true,
      verified: false,
      source: 'sheet',
      status: row.status,
      success: row.status === 'paid',
      pending: row.status === 'pending',
      amount: Number.isFinite(amount) ? amount : null,
      currency: sanitizeText(row.currency, 8) || 'EGP',
      reference,
      orderId: sanitizeText(row.paymob_order_id, 40),
      transactionId: sanitizeText(row.paymob_transaction_id, 40),
      method: sanitizeText(row.payment_method, 40),
      maskedPan: sanitizeText(row.masked_pan, 8),
      cause: {
        id: sanitizeText(row.cause_id, 40),
        ar: sanitizeText(row.cause_ar, 80),
        en: sanitizeText(row.cause_en, 80),
      },
    });
  }

  return fail(res, 400, 'invalid_hmac', 'تعذر التحقق من عملية الدفع.', 'Could not verify the payment.');
};
