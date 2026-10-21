'use strict';

const MAX_BODY_BYTES = 64 * 1024;

const env = (name) => (process.env[name] || '').trim();

function siteUrl() {
  return (env('SITE_URL') || 'https://www.akhawein.org').replace(/\/+$/, '');
}

function json(res, status, body, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [key, value] of Object.entries(extraHeaders)) res.setHeader(key, value);
  res.end(JSON.stringify(body));
}

function fail(res, status, code, ar, en, extra = {}) {
  return json(res, status, { ok: false, code, error: { ar, en }, ...extra });
}

async function readJsonBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const err = new Error('Body too large');
      err.statusCode = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.headers['x-real-ip'] || '').trim() || req.socket?.remoteAddress || 'unknown';
}

function isSameOrigin(req) {
  const origin = String(req.headers.origin || '').trim();
  const referer = String(req.headers.referer || '').trim();
  const candidate = origin || (referer ? new URL(referer).origin : '');
  if (!candidate) return true; // privacy browsers may strip it; rate limits still apply

  const allowed = new Set([
    siteUrl(),
    'https://akhawein.org',
    'https://www.akhawein.org',
  ]);
  if (allowed.has(candidate)) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(candidate) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(candidate)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(candidate) && env('ALLOW_VERCEL_PREVIEWS') === 'true') return true;
  return false;
}

/* Simple in-memory limiter. Serverless instances are short-lived, but this
 * still stops accidental double-submits and most scripted abuse cheaply.
 * For hard guarantees, put a WAF/rate-limit rule in front of /api/donations/*. */
const buckets = new Map();

function rateLimit(key, { limit = 10, windowMs = 10 * 60 * 1000 } = {}) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  bucket.count += 1;
  if (bucket.count > limit) return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

function sanitizeText(value, maxLength = 300) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Normalise Egyptian mobile numbers to +201xxxxxxxxx. Returns '' if invalid. */
function normalizeEgyptPhone(input) {
  let s = sanitizeText(input, 24).replace(/[\s\-().]/g, '');
  if (!s) return '';
  s = s.replace(/^00/, '+');
  if (/^01[0125]\d{8}$/.test(s)) return `+20${s.slice(1)}`;
  if (/^1[0125]\d{8}$/.test(s)) return `+20${s}`;
  if (/^\+201[0125]\d{8}$/.test(s)) return s;
  if (/^201[0125]\d{8}$/.test(s)) return `+${s}`;
  return '';
}

function isEmail(input) {
  const s = sanitizeText(input, 160);
  return s.length > 3 && s.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

const REFERENCE_RE = /^AKH-\d{8}-[A-Z0-9]{6}$/;

function newReference(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  for (const byte of require('node:crypto').randomBytes(6)) tail += alphabet[byte % alphabet.length];
  return `AKH-${y}${m}${d}-${tail}`;
}

module.exports = {
  siteUrl,
  json,
  fail,
  readJsonBody,
  clientIp,
  isSameOrigin,
  rateLimit,
  sanitizeText,
  normalizeEgyptPhone,
  isEmail,
  newReference,
  REFERENCE_RE,
};
