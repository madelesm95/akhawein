'use strict';

const {
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
  siteUrl,
} = require('../../lib/http');
const { parseEgpAmount, toPiasters, findCause, minAmount, maxAmount } = require('../../lib/causes');
const { createIntention, getConfig } = require('../../lib/paymob');
const { saveDonation, isConfigured: sheetsConfigured } = require('../../lib/sheets');

const NAME_RE = /^[\p{L}\p{M}\s'’\-.]+$/u;

const MESSAGES = {
  bad_request: ['طلب غير صالح.', 'Invalid request.'],
  forbidden: ['تعذر التحقق من مصدر الطلب.', 'Could not verify the request origin.'],
  rate_limited: ['محاولات كثيرة في وقت قصير. حاول بعد عشر دقائق.', 'Too many attempts. Please try again in ten minutes.'],
  not_configured: ['الدفع الإلكتروني غير مفعّل حالياً. يمكنك التبرع عبر الحسابات البنكية.', 'Online payment is not enabled right now. You can still donate by bank transfer.'],
  amount_invalid: ['أدخل مبلغاً صحيحاً.', 'Enter a valid amount.'],
  amount_range: [`المبلغ يجب أن يكون بين ${minAmount()} و${maxAmount()} جنيه.`, `The amount must be between EGP ${minAmount()} and EGP ${maxAmount()}.`],
  cause_invalid: ['اختر باب التبرع من القائمة.', 'Choose a donation cause from the list.'],
  name_invalid: ['اكتب الاسم الأول واسم العائلة (حرفان على الأقل).', 'Enter your first and last name (at least two characters each).'],
  phone_invalid: ['أدخل رقم موبايل مصري صحيح، مثال: 01012345678.', 'Enter a valid Egyptian mobile number, e.g. 01012345678.'],
  email_invalid: ['أدخل بريداً إلكترونياً صحيحاً أو اتركه فارغاً.', 'Enter a valid email address or leave it empty.'],
  intention_failed: ['تعذر بدء عملية الدفع. حاول مرة أخرى بعد قليل.', 'Could not start the payment. Please try again shortly.'],
  storage_failed: ['تعذر تجهيز عملية الدفع بأمان. حاول بعد قليل أو تبرع عبر الحساب البنكي.', 'Could not prepare the payment securely. Please try again shortly or use a bank transfer.'],
};

const msg = (key) => ({ ar: MESSAGES[key][0], en: MESSAGES[key][1] });

function validName(value) {
  const s = sanitizeText(value, 60);
  return s.length >= 2 && s.length <= 60 && NAME_RE.test(s);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return fail(res, 405, 'method_not_allowed', 'طريقة غير مسموح بها', 'Method not allowed');
  }

  if (!isSameOrigin(req)) {
    return fail(res, 403, 'forbidden', ...MESSAGES.forbidden);
  }

  const ip = clientIp(req);
  const limit = rateLimit(`create:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))));
    return fail(res, 429, 'rate_limited', ...MESSAGES.rate_limited);
  }

  if (!getConfig().configured || !sheetsConfigured()) {
    return fail(res, 503, 'not_configured', ...MESSAGES.not_configured);
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    if (err && err.statusCode === 413) {
      return fail(res, 413, 'payload_too_large', 'الطلب كبير جداً.', 'Request is too large.');
    }
    throw err;
  }
  if (!body || typeof body !== 'object') {
    return fail(res, 400, 'bad_request', ...MESSAGES.bad_request);
  }

  // Honeypot: real visitors never fill this hidden field.
  if (sanitizeText(body.company, 80)) {
    return json(res, 200, { ok: false, code: 'ignored' });
  }

  const amountEgp = parseEgpAmount(body.amount);
  if (amountEgp === null) return fail(res, 400, 'amount_invalid', ...MESSAGES.amount_invalid);
  if (amountEgp < minAmount() || amountEgp > maxAmount()) {
    return fail(res, 400, 'amount_range', ...MESSAGES.amount_range);
  }
  if (Math.round(amountEgp * 100) < 100) {
    return fail(res, 400, 'amount_range', ...MESSAGES.amount_range);
  }

  const cause = findCause(body.cause);
  if (!cause) return fail(res, 400, 'cause_invalid', ...MESSAGES.cause_invalid);

  const firstName = sanitizeText(body.firstName, 60);
  const lastName = sanitizeText(body.lastName, 60);
  if (!validName(firstName) || !validName(lastName)) {
    return fail(res, 400, 'name_invalid', ...MESSAGES.name_invalid);
  }

  const rawEmail = sanitizeText(body.email, 160);
  if (rawEmail && !isEmail(rawEmail)) {
    return fail(res, 400, 'email_invalid', ...MESSAGES.email_invalid);
  }

  const phone = normalizeEgyptPhone(body.phone);
  if (!phone) return fail(res, 400, 'phone_invalid', ...MESSAGES.phone_invalid);

  const lang = body.lang === 'en' ? 'en' : 'ar';
  const anonymous = body.anonymous === true || body.anonymous === 'true';
  const message = sanitizeText(body.message, 300);
  const reference = newReference();
  const origin = siteUrl();

  const donor = {
    firstName,
    lastName,
    email: rawEmail,
    phone,
    anonymous,
  };

  let intention;
  try {
    intention = await createIntention({
      amountPiasters: toPiasters(amountEgp),
      reference,
      cause: { id: cause.id, ar: cause.label.ar, en: cause.label.en },
      donor,
      notificationUrl: `${origin}/api/donations/webhook`,
      redirectionUrl: `${origin}${lang === 'en' ? '/en/donations' : '/donations'}?payment=return&ref=${reference}`,
    });
  } catch (err) {
    console.error('[donations/create] paymob', err && err.code, err && err.message);
    return fail(res, 502, 'intention_failed', ...MESSAGES.intention_failed);
  }

  // Persist BEFORE redirecting to checkout: we never take money we cannot
  // record. If Sheets is unavailable the donor is asked to retry.
  const saved = await saveDonation(
    {
      reference,
      status: 'pending',
      amount_egp: amountEgp.toFixed(2),
      currency: 'EGP',
      cause_id: cause.id,
      cause_ar: cause.label.ar,
      cause_en: cause.label.en,
      donor_first: firstName,
      donor_last: lastName,
      donor_email: rawEmail,
      donor_phone: phone,
      anonymous: anonymous ? 'TRUE' : 'FALSE',
      message,
      paymob_order_id: intention.intentionOrderId || '',
      paymob_intention_id: intention.intentionId || '',
      payment_method: '',
      masked_pan: '',
      lang,
      hmac_verified: 'FALSE',
      error_message: '',
      raw_json: JSON.stringify({ stage: 'intention-created', intentionOrderId: intention.intentionOrderId || null }),
    },
    { timeoutMs: 8000, retries: 1 },
  );

  if (!saved.ok) {
    console.error('[donations/create] sheets', saved.error || saved.reason || 'unknown');
    return fail(res, 503, 'storage_failed', ...MESSAGES.storage_failed);
  }

  return json(res, 200, {
    ok: true,
    reference,
    amount: amountEgp,
    currency: 'EGP',
    cause: cause.id,
    checkoutUrl: intention.checkoutUrl,
  });
};
