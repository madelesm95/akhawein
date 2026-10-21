'use strict';

const data = require('./donation-causes.json');

const causesById = new Map(data.causes.map((c) => [c.id, c]));

function findCause(id) {
  return causesById.get(String(id || '')) || null;
}

function getDefaultCause() {
  return data.causes.find((c) => c.default) || data.causes[0];
}

function minAmount() {
  const v = Number(process.env.DONATION_MIN_EGP);
  return Number.isFinite(v) && v >= 1 ? Math.round(v) : data.minAmount;
}

function maxAmount() {
  const v = Number(process.env.DONATION_MAX_EGP);
  return Number.isFinite(v) && v > 0 ? Math.round(v) : data.maxAmount;
}

/**
 * Parse a user-entered EGP amount. Accepts "500", "500.5", "1,000",
 * Arabic-Indic digits and the Arabic decimal separator.
 * Returns a number rounded to 2 decimals, or null when invalid.
 */
function parseEgpAmount(input) {
  if (typeof input === 'number') {
    return Number.isFinite(input) ? Math.round(input * 100) / 100 : null;
  }
  if (typeof input !== 'string') return null;

  let s = input.trim();
  if (!s || s.length > 24) return null;
  s = s
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/\u066B/g, '.')
    .replace(/[\s,\u066C]/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;

  const value = Number(s);
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100) / 100;
}

function toPiasters(amountEgp) {
  return Math.round(amountEgp * 100);
}

function publicCatalog() {
  return {
    currency: data.currency,
    minAmount: minAmount(),
    maxAmount: maxAmount(),
    suggested: data.suggested,
    causes: data.causes.map((c) => ({
      id: c.id,
      label: c.label,
      desc: c.desc,
      icon: c.icon,
      default: Boolean(c.default),
    })),
  };
}

module.exports = {
  data,
  findCause,
  getDefaultCause,
  minAmount,
  maxAmount,
  parseEgpAmount,
  toPiasters,
  publicCatalog,
};
