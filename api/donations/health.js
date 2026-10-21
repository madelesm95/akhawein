'use strict';

const { json, fail, siteUrl } = require('../../lib/http');
const { getConfig, getMode } = require('../../lib/paymob');
const { isConfigured: sheetsConfigured } = require('../../lib/sheets');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
  }

  const token = process.env.HEALTH_TOKEN ? String(process.env.HEALTH_TOKEN) : '';
  if (token) {
    const url = new URL(req.url || '/', 'http://localhost');
    if (url.searchParams.get('token') !== token) {
      return fail(res, 404, 'not_found', 'غير موجود.', 'Not found.');
    }
  }

  const paymob = getConfig();
  const sheets = sheetsConfigured();

  const checks = {
    secretKey: Boolean(paymob.secretKey),
    publicKey: Boolean(paymob.publicKey),
    integrationIds: paymob.integrationIds.length > 0,
    hmacSecret: Boolean(paymob.hmacSecret),
    sheetsUrl: Boolean(process.env.SHEETS_WEBHOOK_URL),
    sheetsSecret: Boolean(process.env.SHEETS_WEBHOOK_SECRET),
    siteUrl: Boolean(process.env.SITE_URL),
  };

  const ready = paymob.configured && sheets && checks.hmacSecret;

  return json(res, 200, {
    ok: true,
    service: 'donations',
    ready,
    mode: getMode(),
    site: siteUrl(),
    checks,
    paymentMethods: paymob.integrationIds.length,
    timestamp: new Date().toISOString(),
  });
};
