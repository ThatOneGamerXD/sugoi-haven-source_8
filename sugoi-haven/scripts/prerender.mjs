/**
 * prerender.mjs — runs automatically after `vite build` (see package.json's
 * "postbuild" script). For every real route on the site it:
 *   1. Renders the page to an HTML string server-side (no headless browser —
 *      just React's own renderToString, via the SSR bundle built below), so
 *      search engines and link-preview bots (iMessage, Slack, Twitter/X, etc.)
 *      see real content immediately instead of an empty <div id="root">.
 *   2. Injects the right <title>, meta description, canonical link, Open
 *      Graph/Twitter tags, and Product JSON-LD (price + availability) for
 *      that specific page.
 *   3. Writes the result to dist/<route>/index.html, so the URL structure
 *      matches exactly (e.g. /shop/print/otsu/index.html).
 * Also writes dist/sitemap.xml and dist/robots.txt.
 *
 * Skipped automatically for SINGLEFILE builds (the double-click preview) —
 * prerendering a single self-contained file doesn't apply.
 *
 * Set SITE_URL as an env var (e.g. on Netlify) once you have a custom domain
 * — everything here (canonical URLs, OG tags, sitemap) uses it automatically.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const ssrOut = resolve(root, 'dist-ssr');

if (process.env.SINGLEFILE) {
  console.log('[prerender] SINGLEFILE build — skipping (not applicable to the single-file preview).');
  process.exit(0);
}
if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('[prerender] dist/index.html not found — run `vite build` first (this script expects to run via the "postbuild" hook).');
  process.exit(1);
}

console.log('[prerender] Building SSR bundle...');
execSync(`npx vite build --ssr src/entry-server.jsx --outDir dist-ssr`, { cwd: root, stdio: 'inherit' });

const { render, allRoutes, sitemapRoutes } = await import(resolve(ssrOut, 'entry-server.js'));
// Same default as src/lib/seo.js; SITE_URL env var overrides both.
const siteUrl = process.env.SITE_URL || 'https://cheery-cactus-eac4da.netlify.app';

const shell = readFileSync(resolve(dist, 'index.html'), 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function pageFor(path, { html, seo }) {
  const url = `${siteUrl}${path === '/' ? '' : path}`;
  const title = esc(seo?.title ?? 'Sugoi Haven');
  const desc = esc(seo?.description ?? '');
  const image = seo?.image ? (seo.image.startsWith('http') ? seo.image : `${siteUrl}${seo.image}`) : `${siteUrl}/og-default.png`;

  const imageAttr = esc(image);
  const jsonLdBlocks = seo?.jsonLd
    ? (Array.isArray(seo.jsonLd) ? seo.jsonLd : [seo.jsonLd])
        .map(d => `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`)
    : [];

  let out = shell
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/s, `<meta name="description" content="${desc}" />`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const extraTags = [
    seo?.noindex ? `<meta name="robots" content="noindex, follow" />` : '',
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${seo?.ogType ?? 'website'}" />`,
    `<meta property="og:site_name" content="Sugoi Haven" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${imageAttr}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${imageAttr}" />`,
    ...jsonLdBlocks,
  ].filter(Boolean).join('\n    ');

  return out.replace('</head>', `    ${extraTags}\n  </head>`);
}

const routes = allRoutes();
console.log(`[prerender] Rendering ${routes.length} routes...`);
let written = 0;
for (const path of routes) {
  const result = render(path);
  if (!result.seo) { console.warn(`[prerender]   SKIP ${path} — no SEO data found for this route`); continue; }
  const html = pageFor(path, result);
  if (path === '/404') {
    // Netlify serves dist/404.html natively, with a real 404 status,
    // for any URL that doesn't match a prerendered file.
    writeFileSync(resolve(dist, '404.html'), html);
  } else {
    const outDir = path === '/' ? dist : resolve(dist, path.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, 'index.html'), html);
  }
  written++;
}
console.log(`[prerender] Wrote ${written} static HTML pages (incl. 404.html).`);

// ---- sitemap.xml (indexable routes only; search/cart/checkout/404 excluded (cart/checkout routes removed entirely — Snipcart owns that flow)) ----
const indexable = sitemapRoutes();
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(p => `  <url><loc>${siteUrl}${p === '/' ? '' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(resolve(dist, 'sitemap.xml'), sitemap);

// ---- robots.txt ----
writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`[prerender] sitemap.xml (${indexable.length} indexable urls) and robots.txt written.`);
console.log(`[prerender] Using SITE_URL = ${siteUrl}${process.env.SITE_URL ? '' : ' (default — set the SITE_URL env var once you have a custom domain)'}`);

rmSync(ssrOut, { recursive: true, force: true });
