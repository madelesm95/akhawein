'use strict';

const { json, fail } = require('../../lib/http');
const { publicCatalog } = require('../../lib/causes');
const { getConfig, getMode } = require('../../lib/paymob');
const { isConfigured: sheetsConfigured } = require('../../lib/sheets');

const METHODS = [
  { id: 'card', icon: 'credit-card', label: { ar: 'فيزا / ماستركارد / ميزة', en: 'Visa / Mastercard / Meeza' }, note: { ar: 'مدعومة بـ 3-D Secure', en: 'Protected by 3-D Secure' } },
  { id: 'wallet', icon: 'smartphone', label: { ar: 'المحافظ الإلكترونية', en: 'Mobile wallets' }, note: { ar: 'فودافون كاش وأورنج كاش وغيرها', en: 'Vodafone Cash, Orange Cash and more' } },
  { id: 'kiosk', icon: 'store', label: { ar: 'فوري والكشك', en: 'Fawry & kiosks' }, note: { ar: 'ادفع نقداً من أقرب منفذ', en: 'Pay cash at a nearby outlet' } },
  { id: 'installments', icon: 'calendar', label: { ar: 'التقسيط', en: 'Installments' }, note: { ar: 'حسب المتاح في حساب الجمعية', en: 'Subject to availability' } },
];

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
  }

  const paymob = getConfig();
  const enabled = paymob.configured && sheetsConfigured();
  const catalog = publicCatalog();

  return json(res, 200, {
    ok: true,
    enabled,
    mode: enabled ? getMode() : 'not-configured',
    reason: !paymob.configured
      ? 'paymob-not-configured'
      : !sheetsConfigured()
        ? 'sheets-not-configured'
        : null,
    ...catalog,
    methods: METHODS,
    checkout: { hosted: true, provider: 'Paymob' },
    limits: {
      min: catalog.minAmount,
      max: catalog.maxAmount,
    },
  });
};
