'use strict';

/**
 * Paymob (Accept) client — Intention API + Unified Checkout.
 *
 * All secrets stay on the server. The browser only ever receives the
 * one-time `clientSecret` checkout URL created for a single intention.
 *
 * Docs: https://developers.paymob.com/paymob-docs/intention-apis/create-intention
 */

const crypto = require('node:crypto');

const DEFAULT_API_BASE = 'https://accept.paymob.com';
const DEFAULT_CHECKOUT_BASE = 'https://eg.checkout.paymob.com/';
const REQUEST_TIMEOUT_MS = 15000;

const env = (name) => (process.env[name] || '').trim();

function readIntegrationIds() {
  return env('PAYMOB_INTEGRATION_IDS')
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v > 0);
}

function getConfig() {
  const secretKey = env('PAYMOB_SECRET_KEY');
  const publicKey = env('PAYMOB_PUBLIC_KEY');
  const integrationIds = readIntegrationIds();
  const missing = [];
  if (!secretKey) missing.push('PAYMOB_SECRET_KEY');
  if (!publicKey) missing.push('PAYMOB_PUBLIC_KEY');
  if (!integrationIds.length) missing.push('PAYMOB_INTEGRATION_IDS');

  return {
    secretKey,
    publicKey,
    integrationIds,
    hmacSecret: env('PAYMOB_HMAC_SECRET'),
    apiBase: (env('PAYMOB_API_BASE') || DEFAULT_API_BASE).replace(/\/+$/, ''),
    checkoutBase: env('PAYMOB_CHECKOUT_URL') || DEFAULT_CHECKOUT_BASE,
    configured: missing.length === 0,
    missing,
    mode: secretKey.includes('_test_') ? 'test' : secretKey.includes('_live_') ? 'live' : 'unknown',
  };
}

/** Human-readable mode used by /api/donations/health (never exposes secrets). */
function getMode() {
  const { mode, configured } = getConfig();
  return configured ? mode : 'not-configured';
}

function checkoutUrl(clientSecret) {
  const { publicKey, checkoutBase } = getConfig();
  const url = new URL(checkoutBase);
  url.searchParams.set('publicKey', publicKey);
  url.searchParams.set('clientSecret', clientSecret);
  return url.toString();
}

async function postJson(url, body, headers) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text.slice(0, 500) };
    }
    return { ok: res.ok, status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Create a Paymob intention and return the Unified Checkout URL.
 * The caller must pass an already validated amount in piasters.
 */
async function createIntention({ amountPiasters, reference, cause, donor, billing, notificationUrl, redirectionUrl }) {
  const cfg = getConfig();
  if (!cfg.configured) {
    const err = new Error('Paymob is not configured');
    err.code = 'PAYMOB_NOT_CONFIGURED';
    throw err;
  }

  const fullName = [donor.firstName, donor.lastName].filter(Boolean).join(' ').trim();

  const payload = {
    amount: amountPiasters,
    currency: 'EGP',
    payment_methods: cfg.integrationIds,
    items: [
      {
        name: `تبرع - ${cause.ar}`.slice(0, 120),
        amount: amountPiasters,
        quantity: 1,
        description: `Akhawein Charity donation (${cause.id})`,
      },
    ],
    billing_data: {
      first_name: donor.firstName,
      last_name: donor.lastName,
      email: donor.email || 'no-reply@akhawein.org',
      phone_number: donor.phone,
      country: 'EGY',
      city: 'Cairo',
      state: 'Cairo',
      postal_code: 'NA',
      street: 'NA',
      building: 'NA',
      floor: 'NA',
      apartment: 'NA',
      shipping_method: 'NA',
    },
    customer: {
      first_name: donor.firstName,
      last_name: donor.lastName,
      email: donor.email || 'no-reply@akhawein.org',
    },
    extras: {
      reference,
      cause: cause.id,
      donor_name: fullName,
      anonymous: donor.anonymous ? 'true' : 'false',
    },
    special_reference: reference,
    notification_url: notificationUrl,
    redirection_url: redirectionUrl,
  };

  const { ok, status, data } = await postJson(`${cfg.apiBase}/v1/intention/`, payload, {
    Authorization: `Token ${cfg.secretKey}`,
  });

  if (!ok || !data || !data.client_secret) {
    const detail =
      (data && (data.detail || (Array.isArray(data.message) ? data.message.join(', ') : data.message))) ||
      `HTTP ${status}`;
    const err = new Error(`Paymob intention failed: ${String(detail).slice(0, 240)}`);
    err.code = 'PAYMOB_INTENTION_FAILED';
    err.status = status;
    throw err;
  }

  return {
    intentionId: data.id,
    intentionOrderId: data.intention_order_id,
    clientSecret: data.client_secret,
    checkoutUrl: checkoutUrl(data.client_secret),
  };
}

/* ------------------------------------------------------------------ *
 * HMAC verification
 *
 * Paymob signs every transaction callback with HMAC-SHA512 over 20
 * fields, concatenated with no separator, in this exact order:
 *
 *   amount_cents, created_at, currency, error_occured,
 *   has_parent_transaction, id, integration_id, is_3d_secure,
 *   is_auth, is_capture, is_refunded, is_standalone_payment,
 *   is_voided, order.id, owner, pending, source_data.pan,
 *   source_data.sub_type, source_data.type, success
 *
 * POST webhooks nest the object under `obj`; the browser redirect sends
 * flattened query params (order_id, source_data_pan, ...).
 * ------------------------------------------------------------------ */

function hasNullHmacField(obj) {
  return [
    obj.amount_cents, obj.created_at, obj.currency, obj.error_occured,
    obj.has_parent_transaction, obj.id, obj.integration_id, obj.is_3d_secure,
    obj.is_auth, obj.is_capture, obj.is_refunded, obj.is_standalone_payment,
    obj.is_voided, obj.order && obj.order.id, obj.owner, obj.pending,
    obj.source_data && obj.source_data.pan,
    obj.source_data && obj.source_data.sub_type,
    obj.source_data && obj.source_data.type,
    obj.success,
  ].some((v) => v === null || v === undefined);
}

function hmacString(obj, nullAsEmpty) {
  const v = (x) => {
    if (x === null || x === undefined) return nullAsEmpty ? '' : String(x);
    return String(x);
  };
  return [
    v(obj.amount_cents), v(obj.created_at), v(obj.currency), v(obj.error_occured),
    v(obj.has_parent_transaction), v(obj.id), v(obj.integration_id), v(obj.is_3d_secure),
    v(obj.is_auth), v(obj.is_capture), v(obj.is_refunded), v(obj.is_standalone_payment),
    v(obj.is_voided), v(obj.order && obj.order.id), v(obj.owner), v(obj.pending),
    v(obj.source_data && obj.source_data.pan),
    v(obj.source_data && obj.source_data.sub_type),
    v(obj.source_data && obj.source_data.type),
    v(obj.success),
  ].join('');
}

function redirectHmacString(q) {
  const v = (x) => (x === null || x === undefined ? '' : String(x));
  return [
    v(q.amount_cents), v(q.created_at), v(q.currency), v(q.error_occured),
    v(q.has_parent_transaction), v(q.id), v(q.integration_id), v(q.is_3d_secure),
    v(q.is_auth), v(q.is_capture), v(q.is_refunded), v(q.is_standalone_payment),
    v(q.is_voided), v(q.order_id), v(q.owner), v(q.pending),
    v(q.source_data_pan), v(q.source_data_sub_type), v(q.source_data_type),
    v(q.success),
  ].join('');
}

function safeEqual(expectedHex, receivedHex) {
  const a = Buffer.from(String(expectedHex || ''), 'utf8');
  const b = Buffer.from(String(receivedHex || ''), 'utf8');
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}

function sign(payloadString, secret) {
  return crypto.createHmac('sha512', secret).update(payloadString, 'utf8').digest('hex');
}

/** Verify a POST Transaction Processed callback. */
function verifyTransactionHmac(obj, receivedHmac, secret = getConfig().hmacSecret) {
  if (!obj || !secret || !receivedHmac) return false;
  // Paymob has historically stringified missing optional fields differently
  // across payment methods. Accepting both deterministic encodings is safe:
  // the signature still requires the merchant HMAC secret.
  if (safeEqual(sign(hmacString(obj, true), secret), receivedHmac)) return true;
  if (hasNullHmacField(obj) && safeEqual(sign(hmacString(obj, false), secret), receivedHmac)) return true;
  return false;
}

/** Verify the GET redirect made by Unified Checkout. */
function verifyRedirectHmac(query, receivedHmac, secret = getConfig().hmacSecret) {
  if (!query || !secret || !receivedHmac) return false;
  return safeEqual(sign(redirectHmacString(query), secret), receivedHmac);
}

module.exports = {
  getConfig,
  getMode,
  createIntention,
  verifyTransactionHmac,
  verifyRedirectHmac,
  hmacString,
  redirectHmacString,
  sign,
  checkoutUrl,
};
