/**
 * fetch-inventory.mjs — the Google Sheet → site inventory pipeline.
 *
 * USAGE
 *   node scripts/fetch-inventory.mjs <csv-url-or-local-path>
 *   INVENTORY_CSV_URL=https://docs.google.com/....../pub?output=csv npm run build
 *
 * Runs automatically before every build (see "prebuild" in package.json):
 *   - If INVENTORY_CSV_URL (or an argument) is set, fetches the published
 *     Google Sheet CSV, VALIDATES every row, and writes src/data/listings.json.
 *     Any invalid row FAILS THE BUILD with its row number — a typo in the
 *     Sheet can never silently drop a listing or ship bad data.
 *   - If no URL is configured: keeps the existing listings.json, or seeds it
 *     from scripts/demo-listings.json on first run. Local dev keeps working
 *     before the Sheet exists.
 *
 * SHEET COLUMNS (header row, exact names; extra columns are ignored)
 *   design_id   required  must match a design in designs.json / fuji-designs.json
 *   publisher   required  e.g. "Yuyudo"
 *   condition   required  Fine | Good | Fair
 *   price       required  number, USD, no symbol
 *   print_year  optional  e.g. "c. 1950s"
 *   notes       optional  the copy-specific description shown on the page
 *   photo_urls  optional  one or more image URLs separated by | (pipe)
 *   status      required  active | sold | draft   (only "active" is published)
 *   sku         optional  your own unique ID; generated if blank
 *   qty         optional  defaults to 1 (each listing = one unique sheet)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(dir, '../src/data/listings.json');
const DEMO = resolve(dir, 'demo-listings.json');
const source = process.argv[2] ?? process.env.INVENTORY_CSV_URL ?? null;

// ---------- no source configured: demo/local mode ----------
if (!source) {
  if (existsSync(OUT)) {
    console.log('[inventory] No INVENTORY_CSV_URL set — keeping existing src/data/listings.json');
  } else {
    writeFileSync(OUT, readFileSync(DEMO));
    console.log('[inventory] No INVENTORY_CSV_URL set — seeded listings.json from demo data');
  }
  process.exit(0);
}

// ---------- load valid design ids ----------
const designIds = new Set(
  ['../src/data/designs.json', '../src/data/fuji-designs.json']
    .flatMap(p => JSON.parse(readFileSync(resolve(dir, p), 'utf8')))
    .map(d => d.id),
);

// ---------- fetch or read the CSV ----------
let text;
if (/^https?:\/\//.test(source)) {
  const res = await fetch(source, { redirect: 'follow' });
  if (!res.ok) { console.error(`[inventory] FAILED to fetch CSV (${res.status}) from ${source}`); process.exit(1); }
  text = await res.text();
  if (text.trimStart().startsWith('<')) {
    console.error('[inventory] Got HTML instead of CSV — is the Sheet published to the web as CSV? (File → Share → Publish to web → CSV)');
    process.exit(1);
  }
} else {
  text = readFileSync(source, 'utf8');
}

// ---------- parse (quoted fields, BOM, CRLF) ----------
function parseCSV(t) {
  t = t.replace(/^\uFEFF/, '');
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inQ) { if (c === '"') { if (t[i + 1] === '"') { field += '"'; i++; } else inQ = false; } else field += c; }
    else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && t[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(f => f !== '')) rows.push(row); row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(f => f !== '')) rows.push(row); }
  const header = rows.shift().map(h => h.trim().toLowerCase());
  return rows.map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const rows = parseCSV(text);
const errors = [];
const listings = [];
const seenIds = new Set();
const CONDITIONS = new Set(['Fine', 'Good', 'Fair']);
const STATUSES = new Set(['active', 'sold', 'draft']);

rows.forEach((r, i) => {
  const rowNo = i + 2; // 1-based + header row, matches what you see in Sheets
  const status = (r.status ?? '').toLowerCase();
  if (!STATUSES.has(status)) { errors.push(`Row ${rowNo}: status "${r.status}" must be active, sold, or draft`); return; }
  if (status !== 'active') return; // sold/draft rows are simply not published

  if (!designIds.has(r.design_id)) errors.push(`Row ${rowNo}: unknown design_id "${r.design_id}"`);
  if (!r.publisher) errors.push(`Row ${rowNo}: publisher is required`);
  const condition = r.condition ? r.condition[0].toUpperCase() + r.condition.slice(1).toLowerCase() : '';
  if (!CONDITIONS.has(condition)) errors.push(`Row ${rowNo}: condition "${r.condition}" must be Fine, Good, or Fair`);
  const price = Number(r.price);
  if (!Number.isFinite(price) || price <= 0) errors.push(`Row ${rowNo}: price "${r.price}" must be a positive number`);
  const photos = (r.photo_urls ?? '').split('|').map(s => s.trim()).filter(Boolean);
  for (const p of photos) if (!/^https?:\/\//.test(p)) errors.push(`Row ${rowNo}: photo url "${p}" must start with http(s)://`);

  let id = r.sku || `${r.design_id}--${(r.publisher || 'x').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let n = 2; const base = id;
  while (seenIds.has(id)) id = `${base}-${n++}`;
  seenIds.add(id);

  listings.push({
    id, designId: r.design_id, publisher: r.publisher, condition,
    price, printYear: r.print_year || '', qty: Number(r.qty) || 1,
    notes: r.notes || '', photos, demo: false,
  });
});

if (errors.length) {
  console.error(`[inventory] ${errors.length} problem(s) in the Sheet — build stopped so nothing bad ships:\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify(listings, null, 2));
console.log(`[inventory] OK — ${listings.length} active listing(s) published (${rows.length} rows read; sold/draft rows excluded)`);
