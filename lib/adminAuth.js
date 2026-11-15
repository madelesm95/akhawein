'use strict';

/**
 * Admin authentication for the announcement panel.
 *
 * The password lives only in Vercel environment variables and is compared
 * server-side, so it is never shipped to the browser. A successful login
 * returns a short-lived signed token (HMAC-SHA256) that the panel keeps in
 * sessionStorage and sends as `Authorization: Bearer <token>`.
 *
 * Environment:
 *   ADMIN_PASSWORD       required to enable the panel (16+ random characters)
 *   ADMIN_TOKEN_SECRET   optional; defaults to ADMIN_PASSWORD
 */

const crypto = require('node:crypto');

const PASSWORD_VAR = 'ADMIN_PASSWORD';
const TOKEN_VAR = 'ADMIN_TOKEN_SECRET';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

const env = (name) => String(process.env[name] || '').trim();

const password = () => env(PASSWORD_VAR);
const tokenSecret = () => env(TOKEN_VAR) || password();

const isConfigured = () => password().length > 0;

const digest = (value) => crypto.createHash('sha256').update(String(value), 'utf8').digest();

function checkPassword(input) {
  if (!isConfigured()) return false;
  return crypto.timingSafeEqual(digest(password()), digest(String(input || '')));
}

function sign(expires) {
  return crypto.createHmac('sha256', tokenSecret()).update(String(expires)).digest('base64url');
}

function issueToken(now = Date.now()) {
  if (!tokenSecret()) return '';
  const expires = now + TOKEN_TTL_MS;
  return `${expires}.${sign(expires)}`;
}

function verifyToken(token) {
  const raw = String(token || '').trim();
  const dot = raw.indexOf('.');
  if (dot < 1) return false;

  const expires = Number(raw.slice(0, dot));
  if (!Number.isFinite(expires) || expires <= Date.now()) return false;
  if (!tokenSecret()) return false;

  const provided = Buffer.from(raw.slice(dot + 1));
  const expected = Buffer.from(sign(expires));
  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
}

function bearer(req) {
  const header = String((req && req.headers && req.headers.authorization) || '');
  return /^Bearer\s+/i.test(header) ? header.replace(/^Bearer\s+/i, '').trim() : '';
}

module.exports = {
  isConfigured,
  checkPassword,
  issueToken,
  verifyToken,
  bearer,
  TOKEN_TTL_MS,
};
