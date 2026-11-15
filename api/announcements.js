'use strict';

const { json, fail, readJsonBody, isSameOrigin, rateLimit, clientIp } = require('../lib/http');
const {
  isConfigured,
  listAnnouncements,
  publicItems,
  normaliseAnnouncement,
  saveAnnouncement,
  deleteAnnouncement,
  ID_RE,
} = require('../lib/announcements');
const { verifyToken, bearer } = require('../lib/adminAuth');

/**
 * GET  /api/announcements
 *   Public: active announcements only, cacheable at the edge.
 *   With a valid admin token: every row, uncached (used by /admin).
 *
 * POST /api/announcements   (admin token required)
 *   { action: 'save', item: {...} }
 *   { action: 'delete', id: 'ann-...' }
 */
module.exports = async function handler(req, res) {
  if (req.method === 'GET') return listRoute(req, res);
  if (req.method === 'POST') return writeRoute(req, res);
  return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
};

async function listRoute(req, res) {
  if (!isConfigured()) {
    return json(res, 503, { ok: false, code: 'not_configured', items: [] }, { 'Cache-Control': 'no-store' });
  }

  const isAdmin = verifyToken(bearer(req));
  const result = await listAnnouncements();

  if (!result.ok) {
    return json(res, 502, { ok: false, code: 'gateway', items: [] }, { 'Cache-Control': 'no-store' });
  }

  const rows = Array.isArray(result.items) ? result.items : [];

  if (isAdmin) {
    return json(res, 200, { ok: true, items: rows, total: rows.length, admin: true }, { 'Cache-Control': 'no-store' });
  }

  const cacheHeader = (req.url && req.url.includes('_=')) || process.env.NODE_ENV !== 'production'
    ? 'no-store'
    : 'public, s-maxage=30, stale-while-revalidate=60';

  return json(
    res,
    200,
    { ok: true, items: publicItems(rows) },
    { 'Cache-Control': cacheHeader },
  );
}

async function writeRoute(req, res) {
  if (!isConfigured()) {
    return fail(res, 503, 'not_configured', 'خدمة الإعلانات غير مهيأة.', 'Announcement storage is not configured.');
  }

  if (!isSameOrigin(req)) {
    return fail(res, 403, 'forbidden', 'طلب غير مسموح.', 'Request not allowed.');
  }

  const limit = rateLimit(`admin-announcements:${clientIp(req)}`, { limit: 90, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return fail(res, 429, 'too_many_requests', 'طلبات كثيرة. حاول بعد قليل.', 'Too many requests. Try again shortly.');
  }

  if (!verifyToken(bearer(req))) {
    return fail(res, 401, 'unauthorized', 'انتهت الجلسة. سجّل الدخول من جديد.', 'Session expired. Please sign in again.');
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

  const action = String(body.action || '');

  if (action === 'save') {
    const normalised = normaliseAnnouncement(body.item);
    if (!normalised.ok) {
      return fail(res, 400, normalised.error, 'بيانات الإعلان غير مكتملة أو غير صحيحة.', 'The announcement data is incomplete or invalid.');
    }
    const result = await saveAnnouncement(normalised.item);
    if (!result.ok) {
      return fail(res, 502, 'gateway', 'تعذّر الحفظ في Google Sheets. حاول مرة أخرى.', 'Could not save to Google Sheets. Please try again.');
    }
    return json(res, 200, { ok: true, item: normalised.item });
  }

  if (action === 'delete') {
    const id = String(body.id || '').trim().toLowerCase();
    if (!ID_RE.test(id)) {
      return fail(res, 400, 'invalid_id', 'معرّف الإعلان غير صالح.', 'Invalid announcement id.');
    }
    const result = await deleteAnnouncement(id);
    if (!result.ok) {
      return fail(res, 502, 'gateway', 'تعذّر الحذف من Google Sheets. حاول مرة أخرى.', 'Could not delete from Google Sheets. Please try again.');
    }
    return json(res, 200, { ok: true, id });
  }

  return fail(res, 400, 'unknown_action', 'إجراء غير معروف.', 'Unknown action.');
}
