# Sugoi Haven — website (development build)

A Japanese/anime-inspired print shop, launched on ukiyo-e woodblock landscapes by
Hokusai and Hiroshige. Built to the `sugoi-haven-website-blueprint.md` spec.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # static production build -> dist/
SINGLEFILE=1 npm run build   # one self-contained HTML file -> dist/index.html
```

The included `sugoi-haven-preview.html` is the single-file build — double-click it
to browse the whole site offline (artwork placeholders load from Wikimedia when online).

## Stack

Vite + React, Tailwind v4 (tokens in `src/index.css`), GSAP + ScrollTrigger
(hero wordmark/wave parallax, scroll reveals, timeline draw-on), React Router.
Skills applied during design/build: `frontend-design`, `awesome-design-skills`
(paper / editorial / riso / shadcn), `ui-ux-pro-max` (design-system generator run
with the blueprint's query — its Noto Serif JP + Noto Sans JP pairing was adopted),
and the official `gsap-skills` (core + ScrollTrigger modules).

## The data model (blueprint §3)

```
Series (src/data/catalog.js)  — historical edition / shop set
  └─ Design (src/data/designs.json, generated) — canonical artwork, ONE page + ONE tile, always
       └─ Listing (src/data/catalog.js)        — a sellable physical print with its OWN photos
```

- `scripts/build-data.mjs` regenerates `designs.json` from the seed CSV:
  `node scripts/build-data.mjs path/to/sugoi-haven-tokaido-53-stations-seed.csv`
- The 16 listings in `catalog.js` are **demo data** (flagged `demo: true`), including
  the blueprint's Ōtsu worked example. Replace them as real inventory is tagged
  (design, publisher, era, condition) and photographed.
- Hard rule already enforced in the UI: a Listing should not be published without
  photos of the exact physical sheet. `PrintPage` labels reference-scan fallbacks.

## Performance: image resolution cache

- The fallback waterfall now runs **at most once per browser**: the winning
  candidate index per design is cached in memory + `localStorage`
  (`sugoi-haven-img-cache-v1`), so revisits load every tile in one request.
- Offscreen shop tiles skip layout/paint via `content-visibility: auto`.
- **Best fix — run once before launch:** `node scripts/verify-images.mjs`
  (on your own machine, where Wikimedia is reachable). It HEAD-checks every
  candidate, bakes the single working file into the data, and reports any
  design that needs manual sourcing. After that there is no waterfall at all.

## SEO — pre-rendered pages, sitemap, and social previews

Every build now runs `npm run build` → fetch inventory → build the client
bundle → build a small server-side bundle → render all 121 real routes to
static HTML (see `scripts/prerender.mjs`). This is automatic; you don't run
anything extra. It gives you:

- **Real content for crawlers and link previews**, not an empty
  `<div id="root">`. Pasting a print-page URL into iMessage/Slack/Twitter now
  shows a proper title, description, and image card.
- **Per-page titles and descriptions** (`src/lib/seo.js` is the single source
  of truth — used both at build time and for in-app navigation via
  `src/lib/useSEO.js`, so they can never drift apart).
- **Product structured data** (JSON-LD) on every print page — name, artist,
  and live price/availability per publisher, pulled straight from your
  Google Sheet at build time.
- **`sitemap.xml`** and **`robots.txt`**, generated automatically and listing
  every route.

### Deep-optimization pass (round 2)

- **True 404s**: every unknown URL now serves a designed 404 page with a real
  404 status (no more soft-404 homepage-with-200). The SPA catch-all redirect
  was removed on purpose — all real routes exist as prerendered files.
- **`noindex` on cart/checkout/search** (and the 404 page); all four excluded
  from the sitemap.
- **Product JSON-LD now includes the required `image`** (listing photo >
  verified reference scan > brand card) — without it Google rejects product
  rich results entirely.
- **BreadcrumbList JSON-LD** on print pages; **WebSite + Organization**
  JSON-LD (incl. sitelinks SearchAction) on the homepage.
- **og:type=product** on print pages; verified artwork scans used as
  og:image; sitemap gains `lastmod`.

**Once you have a custom domain**, set the `SITE_URL` environment variable on
Netlify (e.g. `https://sugoihaven.com`) — canonical links, Open Graph tags,
and the sitemap all pick it up automatically on the next deploy. Until then
everything defaults to your `.netlify.app` address.

After your first deploy with this live, submit `https://your-domain/sitemap.xml`
to Google Search Console and Bing Webmaster Tools — that's what actually gets
the site crawled and indexed, prerendering alone doesn't do it automatically.

## Checkout — Snipcart

Checkout is handled entirely by Snipcart (snipcart.com), a cart/checkout
overlay that needs no backend of its own — it adds a slide-in cart panel and
full checkout flow on top of this static site. There are no more custom
`/cart` or `/checkout` pages; the header's Cart button opens Snipcart's own
panel from any page.

**Setup (your side, ~15 minutes):**
1. Create a free Snipcart account at snipcart.com.
2. In their dashboard, connect a payment processor (Stripe is the simplest —
   you'll need a Stripe account too, free to create).
3. Copy your **Public API Key** from Snipcart's dashboard. Use the **Test**
   key first — test mode is free forever and lets you place fake orders with
   fake card numbers (4242 4242 4242 4242) to confirm everything works before
   any money is real.
4. On Netlify: **Site configuration → Environment variables → Add a
   variable** — Key: `VITE_SNIPCART_API_KEY`, Value: your key. (Note the
   `VITE_` prefix — required for Vite to expose it, unlike `SITE_URL` or
   `INVENTORY_CSV_URL` which don't need it.)
5. **Trigger deploy → Clear cache and deploy site.**
6. Test a full purchase with the test key and a fake card. When ready to
   accept real money, swap the env var to your **Live** key and redeploy —
   that's the only change needed.

**Pricing** (verify current numbers at snipcart.com/pricing before relying on
this): roughly 2% per transaction, or a flat ~$20/month if you're under
$1,000 in monthly sales — whichever is cheaper. Testing/development mode is
free indefinitely. Stripe/PayPal's own processing fees apply on top,
separately.

**How listings map to Snipcart items:** each print page renders one
`snipcart-add-item` button per Listing (publisher/condition/price), all
present in the page's HTML — CSS hides all but the currently-selected one.
This is intentional, not a bug: Snipcart verifies every price by re-crawling
the item's page, so every possible listing needs to be findable on that page
regardless of which one was showing when the page was generated. `qty` is
capped at 1 per listing (`data-item-max-quantity="1"`) since each is a unique
physical print — Snipcart's own inventory tracking then marks a listing sold
out the instant it's purchased, so the same print can't be sold twice.
**Snipcart does not know about your Google Sheet** — if you mark something
`sold` there, also delete/cancel its abandoned listing in Snipcart's
dashboard if it was ever added to a cart, to avoid the two systems disagreeing.

### Reskinning it further

Snipcart's own colors are set via CSS custom properties at the bottom of
`src/index.css` (search "Snipcart theme override"), matched to the site's
washi/aizuri/ume tokens. This is Snipcart's officially documented theming
surface (docs.snipcart.com/v3/setup/theming) — safe to extend since it
overrides their defaults rather than editing their stylesheet directly. A
few things are NOT controllable this way (notably the empty vertical space
in a side-cart with only 1 item) — that's Snipcart's own layout stretching
to fill the panel height, not a bug, and fixing it would mean fragile
structural CSS overrides fighting their responsive layout. Not recommended.

### Before accepting real money

- **Shipping**: Store Configuration → Shipping — nothing is configured out
  of the box; unshipped orders currently wouldn't be charged for postage.
- **Tax**: Store Configuration → Taxes (Stripe Tax / TaxJar / manual rates).
  Not tax advice — check with an accountant on your actual obligations.
- **Order notifications**: Store Configuration → Notifications, so you get
  emailed when an order comes in, not just the customer.
- **Domains**: Store Configuration → Domains & URLs must list your real
  domain(s) or order validation fails with "URL of some products could not
  be reached" (this bit us once — see git history / ask Claude if it recurs).
- Swap `VITE_SNIPCART_API_KEY` from your Test to your Live key, redeploy.

## Live inventory via Google Sheets

Inventory is no longer hard-coded — `scripts/fetch-inventory.mjs` runs before
every build and writes `src/data/listings.json`:

1. **Create the Sheet.** Import `sugoi-haven-inventory-template.csv` into a new
   Google Sheet (File → Import). Columns: `design_id, publisher, condition,
   price, print_year, notes, photo_urls, status, sku, qty`. One row per
   physical print; `photo_urls` takes multiple URLs separated by `|`;
   `status` is `active`, `sold`, or `draft` (only `active` publishes).
2. **Publish it as CSV.** File → Share → Publish to web → select the sheet →
   CSV → copy the URL. (This makes the sheet readable by anyone with that
   URL — fine for inventory, but don't put private data in it.)
3. **Point the build at it.** Set env var `INVENTORY_CSV_URL` to that URL on
   your host (Netlify/Vercel → Site settings → Environment variables), or
   locally: `INVENTORY_CSV_URL=... npm run build`. You can also test any CSV
   directly: `node scripts/fetch-inventory.mjs path-or-url`.
4. **Add a deploy hook.** On Netlify: Site settings → Build & deploy → Build
   hooks → create one, bookmark its URL. Your update loop becomes:
   *edit Sheet → open bookmark → live in ~2 minutes.*

Validation is strict on purpose: unknown `design_id`s, bad conditions,
non-numeric prices, or malformed photo URLs **fail the build with the exact
Sheet row number** — a typo can never silently drop or corrupt a listing.
With no `INVENTORY_CSV_URL` set, the demo data in `scripts/demo-listings.json`
is used, so local dev works before the Sheet exists.

## Placeholder imagery — read before going live

- Browse images hotlink public-domain Wikimedia Commons scans via
  `Special:FilePath`. Candidates for ~10 stations were **verified** against the
  Commons category listing; the rest are **pattern-based guesses**
  (`imageVerified: false` in `designs.json`) with an automatic fallback chain
  ending in an on-brand SVG placeholder — a wrong guess degrades gracefully,
  never breaks the page.
- Tōkaidō candidates now walk a 23-deep chain of museum-suffix variants
  (MFA/BM/MIA/Honolulu/MET/ETM/Harvard/LOC/Wisconsin, including suffixless
  forms like `-BM.jpg`, which is how Ōiso is actually named). ~16 stations are
  filename-verified; the rest resolve via the chain or fall back to the SVG
  placeholder. Fuji designs use the classic descriptive-English Commons set
  plus MET files where verified (see `imageVerified` per design).
- Manually click through the `commonsCategory` links before bulk-downloading;
  macron-sensitive names use macron-less forms on Commons (already reflected
  in the data), and a few file names may still differ.
- These scans are development placeholders only. Production listings must use
  your own photography of the physical prints (blueprint §3c).

## Deploying for real

The two routing modes are now automatic — nothing to hand-edit:
- `npm run build` → deploy build: `BrowserRouter`, clean URLs
  (`/shop/print/otsu`), root-relative asset paths. This is what you push to
  Netlify/Vercel/etc.
- `SINGLEFILE=1 npm run build` → the double-click-able preview: `HashRouter`,
  relative paths, everything inlined into one `index.html`.
- `public/_redirects` (already included) tells Netlify to serve `index.html`
  for any path, so deep links like `/shop/print/otsu` work on refresh, not
  just when clicked from within the app. Vercel/Cloudflare Pages auto-detect
  SPAs and don't need this file, but it's harmless to leave in.

**Steps, in order:**
1. Push this folder to a GitHub repository (GitHub Desktop is the easiest
   route if you don't use git from the command line).
2. Create a free Netlify account, "Add new site → Import an existing
   project," and point it at that repo.
3. Build settings: a `netlify.toml` file is already included in this project
   and sets the build command (`npm run build`) and publish directory
   (`dist`) automatically — Netlify's onboarding may auto-detect these too
   and skip asking; either way `netlify.toml` wins, so nothing to type here.
4. Add the environment variable `INVENTORY_CSV_URL` (Site settings →
   Environment variables) with your published Sheet's CSV link — this is what
   makes `npm run build` pull live inventory during every deploy.
5. Add a **Build hook** (Site settings → Build & deploy → Build hooks) and
   bookmark its URL — visiting it triggers a rebuild without a code push, so
   editing the Sheet and hitting that bookmark is your whole inventory-update
   workflow once live.
6. (Optional) Connect a custom domain under Domain settings.

- **Checkout is real, via Snipcart** — see "Checkout — Snipcart" below.
- **Contact form and waitlist are real, via Netlify Forms** (free tier: 100
  submissions/month across both). Submissions appear in Netlify → your site →
  **Forms** tab. ONE-TIME SETUP REQUIRED: (1) Netlify → Site configuration →
  Forms → **Enable form detection**, then trigger a deploy so the forms get
  registered; (2) under Forms (or Notifications) add an **email notification**
  to yourself for new submissions, or you'll only see them when you remember
  to check the dashboard.
- Hokusai's *Thirty-Six Views* is fully seeded: all 46 designs (36 originals +
  10 supplements) generated by `scripts/build-fuji-data.mjs` from the series'
  canonical print list.

## Still to do (per blueprint §7)

- Real inventory tagging pass + listing photography (the "real unlock").
- Phase-2 compare toggle on the print page (§3b.5).
- The Level-7 design-extraction pass against a reference museum-shop site.
