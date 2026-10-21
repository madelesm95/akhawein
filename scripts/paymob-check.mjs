#!/usr/bin/env node
/**
 * Paymob configuration doctor.
 *
 *   node scripts/paymob-check.mjs
 *   node scripts/paymob-check.mjs --auth
 *   node scripts/paymob-check.mjs --intention   # creates a 1 EGP test intention
 *
 * It never prints secret values. Run it locally, never in CI with live keys.
 */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.resolve('.env.local'));
loadEnvFile(path.resolve('.env'));

const args = new Set(process.argv.slice(2));
const ok = (label) => console.log(`  \u2713 ${label}`);
const bad = (label) => console.log(`  \u2717 ${label}`);
const warn = (label) => console.log(`  ! ${label}`);

console.log('\nAkhawein · Paymob configuration check\n');

const env = (name) => (process.env[name] || '').trim();
const secret = env('PAYMOB_SECRET_KEY');
const publicKey = env('PAYMOB_PUBLIC_KEY');
const ids = env('PAYMOB_INTEGRATION_IDS').split(',').map((v) => v.trim()).filter(Boolean);
const hmac = env('PAYMOB_HMAC_SECRET');
const sheetsUrl = env('SHEETS_WEBHOOK_URL');
const sheetsSecret = env('SHEETS_WEBHOOK_SECRET');
const siteUrl = env('SITE_URL');

let failures = 0;
const check = (condition, label, hint) => {
  if (condition) ok(label);
  else {
    bad(label);
    if (hint) console.log(`      ${hint}`);
    failures += 1;
  }
};

check(Boolean(secret), 'PAYMOB_SECRET_KEY is set', 'Dashboard → Settings → API Keys → Secret Key');
check(secret.startsWith('egy_sk_'), 'Secret key has the expected egy_sk_ prefix');
check(Boolean(publicKey), 'PAYMOB_PUBLIC_KEY is set', 'Dashboard → Settings → API Keys → Public Key');
check(publicKey.startsWith('egy_pk_'), 'Public key has the expected egy_pk_ prefix');
check(ids.length > 0, 'PAYMOB_INTEGRATION_IDS is set', 'Comma separated IDs from Dashboard → Developers → Payment Integrations');
check(ids.every((v) => /^\d+$/.test(v)), 'Every integration ID is numeric');
check(Boolean(hmac) && hmac.length >= 32, 'PAYMOB_HMAC_SECRET looks valid', 'Dashboard → Settings → API Keys → HMAC Secret');
check(Boolean(sheetsUrl) && sheetsUrl.startsWith('https://script.google.com/'), 'SHEETS_WEBHOOK_URL is an Apps Script URL');
check(Boolean(sheetsSecret) && sheetsSecret.length >= 32, 'SHEETS_WEBHOOK_SECRET looks valid', 'Run setup() in the Apps Script editor');
check(Boolean(siteUrl) && siteUrl.startsWith('https://'), 'SITE_URL is an https URL');
check(siteUrl === 'https://www.akhawein.org' || siteUrl === 'https://akhawein.org', 'SITE_URL matches the production domain');

const testKey = secret.includes('_test_');
const liveKey = secret.includes('_live_');
console.log('');
if (testKey) warn('Mode: TEST keys — no real money will be charged.');
else if (liveKey) warn('Mode: LIVE keys — a test intention still creates a real payable order (1 EGP).');
else warn('Mode: unknown (secret key prefix not recognised).');

const apiKey = env('PAYMOB_API_KEY');
if (apiKey) {
  try {
    const payload = JSON.parse(Buffer.from(apiKey.split('.')[1], 'base64url').toString('utf8'));
    console.log(`\nLegacy API key claims: name=${payload.name || '?'} profile=${payload.profile_pkg || '?'} exp=${payload.exp || '?'}`);
    if (payload.exp && payload.exp * 1000 < Date.now()) warn('The legacy API key is expired.');
  } catch {
    warn('PAYMOB_API_KEY is not a JWT (fine if you use Intention API only).');
  }
}

if (args.has('--auth')) {
  if (!apiKey) {
    bad('--auth needs PAYMOB_API_KEY');
    failures += 1;
  } else {
    console.log('\nAuthenticating with the legacy API...');
    try {
      const res = await fetch('https://accept.paymob.com/api/auth/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        ok('Legacy authentication succeeded (60-minute token received).');
      } else {
        bad(`Legacy authentication failed (HTTP ${res.status})`);
        failures += 1;
      }
    } catch (err) {
      bad(`Network error: ${err.message}`);
      failures += 1;
    }
  }
}

if (args.has('--intention')) {
  console.log('\nCreating a 1 EGP intention (no charge until the checkout page is paid)...');
  try {
    const paymob = require('../lib/paymob.js');
    const result = await paymob.createIntention({
      amountPiasters: 100,
      reference: `AKH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-TEST01`,
      cause: { id: 'general', ar: 'اختبار', en: 'Test' },
      donor: { firstName: 'Test', lastName: 'Donor', email: 'test@akhawein.org', phone: '+201000000000', anonymous: false },
      notificationUrl: `${siteUrl || 'https://www.akhawein.org'}/api/donations/webhook`,
      redirectionUrl: `${siteUrl || 'https://www.akhawein.org'}/donations?payment=return&ref=TEST`,
    });
    ok(`Intention created: ${result.intentionOrderId}`);
    console.log(`\n  Checkout URL:\n  ${result.checkoutUrl}\n`);
    console.log('  Open it in a private window and pay with your test card. Do not share this URL.');
  } catch (err) {
    bad(`Intention failed: ${err.message}`);
    failures += 1;
  }
}

console.log('');
if (failures) {
  console.log(`${failures} check(s) failed. See docs/PAYMENTS.md for the setup guide.`);
  process.exitCode = 1;
} else {
  console.log('Configuration looks ready. Next: npm run build, then deploy.');
}
