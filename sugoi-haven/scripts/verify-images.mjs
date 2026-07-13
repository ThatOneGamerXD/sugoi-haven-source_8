/**
 * verify-images.mjs — run ONCE on a machine with open internet:
 *
 *     node scripts/verify-images.mjs
 *
 * For every design in src/data/designs.json and src/data/fuji-designs.json,
 * sends lightweight HEAD requests to each Wikimedia Commons candidate in
 * order, finds the first that actually exists, and rewrites the data so that
 * winner is the ONLY candidate (marking imageVerified: true). After this, the
 * live site never runs a fallback waterfall at all — every tile is a single
 * request. Designs with no working candidate keep their list and fall back to
 * the branded SVG placeholder (they're reported at the end for manual fixing).
 *
 * Re-run any time you add designs. Polite to Wikimedia: sequential requests,
 * small delay, HEAD only.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const FILES = ['../src/data/designs.json', '../src/data/fuji-designs.json'].map(p => resolve(dir, p));
const filePath = name => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function exists(name) {
  try {
    const res = await fetch(filePath(name), { method: 'HEAD', redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

for (const file of FILES) {
  const designs = JSON.parse(readFileSync(file, 'utf8'));
  const unresolved = [];
  for (const d of designs) {
    let winner = null;
    for (const cand of d.imageCandidates) {
      // eslint-disable-next-line no-await-in-loop
      if (await exists(cand)) { winner = cand; break; }
      // eslint-disable-next-line no-await-in-loop
      await sleep(120);
    }
    if (winner) {
      d.imageCandidates = [winner];
      d.imageVerified = true;
      d.referenceImageStatus = 'verified by verify-images.mjs';
      console.log(`OK   ${d.id} -> ${winner}`);
    } else {
      unresolved.push(d.id);
      console.log(`MISS ${d.id} (keeps fallback placeholder)`);
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(120);
  }
  writeFileSync(file, JSON.stringify(designs, null, 2));
  console.log(`\nWrote ${file}`);
  if (unresolved.length) console.log(`Unresolved (fix manually via their Commons category): ${unresolved.join(', ')}`);
}
