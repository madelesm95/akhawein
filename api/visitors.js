'use strict';

/**
 * Visitor counter endpoint.
 *
 *   GET  /api/visitors  → { ok: true, count }           (read-only)
 *   POST /api/visitors  → { ok: true, count }           (increment by 1)
 *
 * The counter itself lives in the Apps Script gateway (see
 * google-apps-script/Code.gs, seeded from VISITOR_SEED). The browser
 * calls POST once per session (sessionStorage guard in assets/js/site.js);
 * repeat page views within the same session only read the value.
 */

const { json, fail, clientIp, isSameOrigin, rateLimit } = require('../lib/http');
const {
  isConfigured,
  getVisitorCount,
  incrementVisitorCount,
} = require('../lib/sheets');

// Local development fallback only — never active on Vercel (VERCEL env is
// set there, and NODE_ENV=production). When the Apps Script gateway is
// missing or not yet redeployed, serve a clearly-flagged simulated count so
// the footer widget can be previewed. The number resets on every restart;
// it is not a real count and is never shown in production.
const DEV_SEED = 128500;
let devVisitors = DEV_SEED;
const devFallback = !process.env.VERCEL && process.env.NODE_ENV !== 'production';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
  }

  if (!isConfigured()) {
    if (devFallback) return json(res, 200, { ok: true, count: devVisitors, simulated: true });
    return fail(res, 503, 'not_configured', 'العداد غير مُعد حالياً.', 'The counter is not configured.');
  }

  if (req.method === 'GET') {
    const result = await getVisitorCount();
    if (!result.ok) {
      if (devFallback) return json(res, 200, { ok: true, count: devVisitors, simulated: true });
      return fail(res, 503, 'counter_unavailable', 'تعذر قراءة العداد حالياً.', 'The counter is unavailable right now.');
    }
    return json(res, 200, { ok: true, count: result.count }, {
      'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
    });
  }

  // POST — increment. Best-effort protections; the Apps Script lock keeps the count consistent.
  if (!isSameOrigin(req)) {
    return fail(res, 403, 'forbidden', 'تعذر التحقق من مصدر الطلب.', 'Could not verify the request origin.');
  }

  const ip = clientIp(req);
  const limit = rateLimit(`visitors:${ip}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    // Do not error the UI — just report the current number without incrementing.
    const current = await getVisitorCount();
    if (current.ok) return json(res, 200, { ok: true, count: current.count, throttled: true });
    if (devFallback) return json(res, 200, { ok: true, count: devVisitors, throttled: true, simulated: true });
    return json(res, 200, { ok: true, count: null, throttled: true });
  }

  const result = await incrementVisitorCount();
  if (!result.ok) {
    if (devFallback) {
      devVisitors += 1;
      return json(res, 200, { ok: true, count: devVisitors, simulated: true });
    }
    return fail(res, 503, 'counter_unavailable', 'تعذر تحديث العداد حالياً.', 'The counter is unavailable right now.');
  }
  return json(res, 200, { ok: true, count: result.count });
};
