/**
 * build-data.mjs
 * Converts sugoi-haven-tokaido-53-stations-seed.csv -> src/data/designs.json
 *
 * Image strategy (dev placeholders ONLY — see README):
 *   Each design gets an ordered list of candidate Wikimedia Commons filenames.
 *   The site resolves them at runtime via Special:FilePath (a stable redirect),
 *   falling back to the next candidate on error, and finally to an on-brand
 *   SVG placeholder. Candidates marked "verified" were confirmed against the
 *   Commons category listing; the rest are pattern-based guesses that follow
 *   the dominant "Hiroshige-53-Stations-Hoeido-NN-Name-MUSEUM-XX.jpg" naming.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV = process.argv[2] ?? '/mnt/user-data/uploads/sugoi-haven-tokaido-53-stations-seed.csv';
const OUT = resolve(__dirname, '../src/data/designs.json');

// --- tiny CSV parser (handles quoted fields, BOM, CRLF) ---
function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(f => f !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(f => f !== '')) rows.push(row); }
  const header = rows.shift();
  return rows.map(r => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

// Filenames confirmed against the Commons category listing (best candidate first).
const VERIFIED = {
  1: ['Hiroshige-53-Stations-Hoeido-01-Nihonbashi-BM-03.jpg', 'Hiroshige-53-Stations-Hoeido-01-Nihonbashi-MFA-02.jpg'],
  2: ['Hiroshige-53-Stations-Hoeido-02-Shinagawa-MIA-01.jpg', 'Hiroshige-53-Stations-Hoeido-02-Shinagawa-Wisconsin-02.jpg'],
  3: ['Hiroshige-53-Stations-Hoeido-03-Kawasaki-BM-01.jpg', 'Hiroshige-53-Stations-Hoeido-03-Kawasaki-BM-02.jpg'],
  4: ['Hiroshige-53-Stations-Hoeido-04-Kanagawa-MIA-02.jpg', 'Hiroshige-53-Stations-Hoeido-04-Kanagawa-BM-01.jpg'],
  9: ['Hiroshige-53-Stations-Hoeido-09-Oiso-BM.jpg'], // note: no numeric suffix
  11: ['Hiroshige-53-Stations-Hoeido-11-Hakone-MFA-01.jpg', 'Hiroshige-53-Stations-Hoeido-11-Hakone-MFA-02.jpg'],
  12: ['Hiroshige-53-Stations-Hoeido-12-Mishima-MFA-02.jpg'],
  17: ['Hiroshige-53-Stations-Hoeido-17-Yui-BM-02.jpg', 'Hiroshige-53-Stations-Hoeido-17-Yui-ETM-01.jpg', 'Hiroshige-53-Stations-Hoeido-17-Yui-Harvard-03.jpg'],
  18: ['Hiroshige-53-Stations-Hoeido-18-Okitsu-MFA-01.jpg', 'Hiroshige-53-Stations-Hoeido-18-Okitsu-Tokyo-MET-02.jpg'],
  19: ['Hiroshige-53-Stations-Hoeido-19-Eijiri-MFA-01.jpg', 'Hiroshige-53-Stations-Hoeido-19-Eijiri-Tokyo-Met-02.jpg'],
  20: ['Hiroshige-53-Stations-Hoeido-20-Fuchu-MFA-02.jpg', 'Hiroshige-53-Stations-Hoeido-20-Fuchu-BM-01.jpg'],
  21: ['Hiroshige-53-Stations-Hoeido-21-Mariko-MFA-03.jpg', 'Hiroshige-53-Stations-Hoeido-21-Mariko-BM-01.jpg'],
  24: ['Hiroshige-53-Stations-Hoeido-24-Shimada-MFA-01.jpg', 'Hiroshige-53-Stations-Hoeido-24-Shimada-Library-of-Congress-03.jpg'],
  25: ['Hiroshige-53-Stations-Hoeido-25-Kanaya-MFA-02.jpg', 'Hiroshige-53-Stations-Hoeido-25-Kanaya-Honululu-01.jpg'],
  26: ['Hiroshige-53-Stations-Hoeido-26-Nissaka-MFA-01.jpg', 'Hiroshige-53-Stations-Hoeido-26-Nissaka-BM-02.jpg'],
  46: [
    'Utagawa Hiroshige (the first) - Shono from the Fifty-three Stations on Tokaido Highway, Hoeido version - Google Art Project.jpg',
    'Shono-Rijksmuseum RP-P-2010-310-95-46.jpeg',
  ],
};

// Alternate Commons spellings for pattern guessing.
const NAME_VARIANTS = { ejiri: ['Eijiri', 'Ejiri'], kanbara: ['Kanbara', 'Kambara'], otsu: ['Otsu'] };

// Museum suffixes observed across the 315-file Hoeido category. Not every
// station has every museum (Yui has no MFA copy; Ōiso only a bare -BM), so
// unverified stations walk this list until one loads; the UI's onError chain
// makes each miss a fast, invisible fallthrough.
const MUSEUM_SUFFIXES = [
  'MFA-02', 'MFA-01', 'MFA-03', 'BM-01', 'BM-02', 'BM-03', 'BM', 'MFA',
  'MIA-01', 'MIA-02', 'Honolulu-01', 'Honolulu-02', 'Honululu-01',
  'Tokyo-MET-02', 'Tokyo-Met-02', 'ETM-01', 'Harvard-01', 'Harvard-03',
  'Library-of-Congress-01', 'Library-of-Congress-03', 'Wisconsin-01', 'Wisconsin-02',
];

function candidatesFor(seq, slugName) {
  const nn = String(seq).padStart(2, '0');
  const base = slugName.charAt(0).toUpperCase() + slugName.slice(1);
  const names = NAME_VARIANTS[slugName] ?? [base];
  const files = [...(VERIFIED[seq] ?? [])];
  for (const name of names) {
    for (const suffix of MUSEUM_SUFFIXES) {
      const f = `Hiroshige-53-Stations-Hoeido-${nn}-${name}-${suffix}.jpg`;
      if (!files.includes(f)) files.push(f);
    }
    files.push(`${name}-Rijksmuseum RP-P-2010-310-95-${seq}.jpeg`);
  }
  return files;
}

const rows = parseCSV(readFileSync(CSV, 'utf8'));
const designs = rows.map(r => {
  const seq = Number(r.sequence_no);
  const slugName = r.design_id.replace(/^tokaido-\d+-/, '');
  return {
    id: r.design_id,
    slug: slugName,
    sequenceNo: seq,
    role: r.role, // departure | station | terminus
    stationNo: r.station_no ? Number(r.station_no) : null,
    displayLabel: r.display_label,
    titleEn: r.english_name,
    titleJp: r.japanese_name,
    romaji: r.romaji,
    artist: 'hiroshige',
    theme: 'tokaido',
    themeLabel: r.theme,
    commonsCategory: r.reference_commons_category,
    // dev placeholders only — never product photos (see README + blueprint §3c)
    imageCandidates: candidatesFor(seq, slugName),
    imageVerified: Boolean(VERIFIED[seq]),
    referenceImageStatus: r.reference_image_status,
    notes: r.notes || null,
  };
});

if (designs.length !== 55) throw new Error(`Expected 55 designs, got ${designs.length}`);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(designs, null, 2));
console.log(`Wrote ${designs.length} Tōkaidō designs -> ${OUT}`);
