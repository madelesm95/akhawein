'use strict';

const { json, fail, readJsonBody, isSameOrigin, rateLimit, clientIp } = require('../../lib/http');
const { isConfigured, checkPassword, issueToken, verifyToken, bearer, TOKEN_TTL_MS } = require('../../lib/adminAuth');

/**
 * GET  /api/admin/login  → is the panel configured, and is this token still valid?
 * POST /api/admin/login  → { password } → { token }
 */
module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      ready: isConfigured(),
      authenticated: verifyToken(bearer(req)),
    });
  }

  if (req.method !== 'POST') {
    return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
  }

  if (!isConfigured()) {
    return fail(
      res,
      503,
      'not_configured',
      'لوحة التحكم غير مهيأة: أضف ADMIN_PASSWORD في إعدادات Vercel ثم أعد النشر.',
      'The admin panel is not configured: add ADMIN_PASSWORD in Vercel and redeploy.',
    );
  }

  if (!isSameOrigin(req)) {
    return fail(res, 403, 'forbidden', 'طلب غير مسموح.', 'Request not allowed.');
  }

  const limit = rateLimit(`admin-login:${clientIp(req)}`, { limit: 6, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return fail(
      res,
      429,
      'too_many_attempts',
      'محاولات كثيرة. انتظر عشر دقائق ثم حاول مرة أخرى.',
      'Too many attempts. Wait ten minutes and try again.',
    );
  }

  let body = null;
  try {
    body = await readJsonBody(req);
  } catch {
    body = null;
  }
  if (!body || typeof body !== 'object') {
    return fail(res, 400, 'invalid_body', 'طلب غير صالح.', 'Invalid request.');
  }

  if (!checkPassword(String(body.password || ''))) {
    return fail(res, 401, 'invalid_password', 'كلمة المرور غير صحيحة.', 'Incorrect password.');
  }

  return json(res, 200, { ok: true, token: issueToken(), expiresIn: Math.floor(TOKEN_TTL_MS / 1000) });
};
