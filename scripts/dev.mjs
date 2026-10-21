#!/usr/bin/env node
/**
 * Local development server with .env.local loading.
 *   npm run dev
 */
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

function loadEnvFile(file) {
  if (!existsSync(file)) return false;
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
  return true;
}

const loadedLocal = loadEnvFile(path.resolve('.env.local'));
if (!loadedLocal) loadEnvFile(path.resolve('.env'));

const { default: handler } = await import('../index.js');
const port = Number(process.env.PORT) || 5500;

createServer(handler).listen(port, () => {
  console.log(`Akhawein dev server: http://localhost:${port}/`);
  console.log(`Payment API:        http://localhost:${port}/api/donations/health`);
  if (!loadedLocal) console.log('Tip: copy .env.example to .env.local to test Paymob locally.');
});
