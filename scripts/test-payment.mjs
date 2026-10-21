#!/usr/bin/env node
/**
 * Offline tests for the payment layer (no network, no secrets).
 *   node scripts/test-payment.mjs
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
process.env.PAYMOB_HMAC_SECRET = 'offline-test-secret';
process.env.SITE_URL = 'https://www.akhawein.org';

const paymob = require('../lib/paymob.js');
const causes = require('../lib/causes.js');
const http = require('../lib/http.js');

let passed = 0;
const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`  \u2713 ${name}`);
};

console.log('\nPayment layer tests\n');

const example = {
  amount_cents: 100,
  created_at: '2020-03-25T18:39:44.719228',
  currency: 'EGP',
  error_occured: false,
  has_parent_transaction: false,
  id: 2556706,
  integration_id: 6741,
  is_3d_secure: true,
  is_auth: false,
  is_capture: false,
  is_refunded: false,
  is_standalone_payment: true,
  is_voided: false,
  order: { id: 4778239 },
  owner: 4705,
  pending: false,
  source_data: { pan: '2346', sub_type: 'MasterCard', type: 'card' },
  success: true,
};

const expectedString = '1002020-03-25T18:39:44.719228EGPfalsefalse25567066741truefalsefalsefalsetruefalse47782394705false2346MasterCardcardtrue';

test('POST callback concatenation matches the Paymob documentation example', () => {
  assert.equal(paymob.hmacString(example, true), expectedString);
});

test('A valid POST signature is accepted', () => {
  const signature = paymob.sign(expectedString, process.env.PAYMOB_HMAC_SECRET);
  assert.equal(paymob.verifyTransactionHmac(example, signature), true);
});

test('A tampered amount is rejected', () => {
  const signature = paymob.sign(expectedString, process.env.PAYMOB_HMAC_SECRET);
  const tampered = { ...example, amount_cents: 999900 };
  assert.equal(paymob.verifyTransactionHmac(tampered, signature), false);
});

test('A signature from another secret is rejected', () => {
  const signature = paymob.sign(expectedString, 'wrong-secret');
  assert.equal(paymob.verifyTransactionHmac(example, signature), false);
});

test('Missing signature is rejected', () => {
  assert.equal(paymob.verifyTransactionHmac(example, ''), false);
  assert.equal(paymob.verifyTransactionHmac(example, 'abc'), false);
});

test('GET redirect concatenation uses flattened keys', () => {
  const q = {
    amount_cents: '100',
    created_at: '2020-03-25T18:39:44.719228',
    currency: 'EGP',
    error_occured: 'false',
    has_parent_transaction: 'false',
    id: '2556706',
    integration_id: '6741',
    is_3d_secure: 'true',
    is_auth: 'false',
    is_capture: 'false',
    is_refunded: 'false',
    is_standalone_payment: 'true',
    is_voided: 'false',
    order_id: '4778239',
    owner: '4705',
    pending: 'false',
    source_data_pan: '2346',
    source_data_sub_type: 'MasterCard',
    source_data_type: 'card',
    success: 'true',
  };
  assert.equal(paymob.redirectHmacString(q), expectedString);
  const signature = paymob.sign(expectedString, process.env.PAYMOB_HMAC_SECRET);
  assert.equal(paymob.verifyRedirectHmac(q, signature), true);
  assert.equal(paymob.verifyRedirectHmac({ ...q, amount_cents: '999900' }, signature), false);
});

test('Missing optional source_data fields can be encoded as empty strings', () => {
  const wallet = {
    ...example,
    source_data: { pan: null, sub_type: null, type: 'wallet' },
    success: false,
  };
  const signature = paymob.sign(paymob.hmacString(wallet, true), process.env.PAYMOB_HMAC_SECRET);
  assert.equal(paymob.verifyTransactionHmac(wallet, signature), true);
});

test('parseEgpAmount accepts Arabic digits, commas and decimals', () => {
  assert.equal(causes.parseEgpAmount('500'), 500);
  assert.equal(causes.parseEgpAmount('1,000'), 1000);
  assert.equal(causes.parseEgpAmount('٥٠٠'), 500);
  assert.equal(causes.parseEgpAmount('500٫50'), 500.5);
  assert.equal(causes.parseEgpAmount(' 250.5 '), 250.5);
  assert.equal(causes.parseEgpAmount('0'), 0);
  assert.equal(causes.parseEgpAmount('abc'), null);
  assert.equal(causes.parseEgpAmount('-10'), null);
  assert.equal(causes.parseEgpAmount('1.234'), null);
  assert.equal(causes.parseEgpAmount(''), null);
});

test('toPiasters rounds correctly', () => {
  assert.equal(causes.toPiasters(500.5), 50050);
  assert.equal(causes.toPiasters(0.1 + 0.2), 30);
});

test('References follow AKH-YYYYMMDD-XXXXXX', () => {
  const ref = http.newReference(new Date('2026-10-20T12:00:00Z'));
  assert.match(ref, /^AKH-20261020-[A-Z0-9]{6}$/);
  assert.equal(new Set(Array.from({ length: 50 }, () => http.newReference())).size, 50);
});

test('Egyptian phone numbers are normalised', () => {
  assert.equal(http.normalizeEgyptPhone('01012345678'), '+201012345678');
  assert.equal(http.normalizeEgyptPhone('+20 101 234 5678'), '+201012345678');
  assert.equal(http.normalizeEgyptPhone('00201012345678'), '+201012345678');
  assert.equal(http.normalizeEgyptPhone('12345678'), '');
  assert.equal(http.normalizeEgyptPhone(''), '');
});

test('Email validation', () => {
  assert.equal(http.isEmail('donor@example.com'), true);
  assert.equal(http.isEmail('bad@'), false);
  assert.equal(http.isEmail(''), false);
});

test('Donation catalogue exposes every cause and a default', () => {
  const catalog = causes.publicCatalog();
  assert.ok(catalog.causes.length >= 5);
  assert.equal(catalog.causes.filter((c) => c.default).length, 1);
  assert.ok(catalog.causes.every((c) => c.label.ar && c.label.en));
});

console.log(`\n${passed} tests passed.\n`);
