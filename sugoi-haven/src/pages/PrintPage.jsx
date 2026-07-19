import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { designBySlug, designs, listingsForDesign, artists, series, CONDITION_MEANING } from '../data/catalog';
import PrintImage from '../components/PrintImage';
import DesignCard from '../components/DesignCard';
import { Badge, Button, Card, inputCls } from '../components/ui';
import { usePageReveals } from '../lib/animations';
import { SITE_URL } from '../lib/seo';

/**
 * Blueprint §3b, walked exactly:
 *   - page loads on the cheapest in-stock Listing (or the Design reference image)
 *   - selectable CARDS (not a bare <select>) list every Listing: publisher / condition / price
 *   - selecting a listing SWAPS the photo — each is a different physical object
 *   - condition badge + per-copy note come from the Listing itself
 *   - add-to-cart activates for that specific Listing
 * Plus: zoom lightbox, multi-photo listings, waitlist capture, related prints.
 */
const conditionTone = { Fine: 'indigo', Good: 'mist', Fair: 'paper' }; // palette, not stock green/red

export default function PrintPage() {
  const { designSlug } = useParams();
  const design = designBySlug[designSlug];
  const ls = useMemo(
    () => (design ? [...listingsForDesign(design.id)].sort((a, b) => a.price - b.price) : []),
    [design],
  );
  const [selectedId, setSelectedId] = useState(() => ls[0]?.id ?? null);
  const selected = ls.find(l => l.id === selectedId) ?? null;
  const [photoIdx, setPhotoIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => { setPhotoIdx(0); }, [selectedId, designSlug]);
  usePageReveals([designSlug]);

  if (!design) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-sumi">Print not found</h1>
        <p className="mt-3 text-sm text-sumi-soft">That design isn't in the catalogue. <Link className="text-aizuri underline" to="/shop">Back to the shop.</Link></p>
      </div>
    );
  }

  const inSeries = series.filter(s => s.designIds.includes(design.id));
  const photos = selected?.photos ?? [];
  const listingPhoto = photos[Math.min(photoIdx, Math.max(photos.length - 1, 0))] ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-xs text-sumi-soft">
        <Link to="/shop" className="hover:text-aizuri">Shop</Link>
        <span className="mx-1.5">/</span>
        <Link to={`/shop/artist/${design.artist}`} className="hover:text-aizuri">{artists[design.artist].name}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-sumi">{design.displayLabel}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* photo — swaps with the selected listing; click to zoom */}
        <div>
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="block w-full cursor-zoom-in overflow-hidden rounded-md border border-sumi/12 bg-bokashi"
            aria-label="Zoom image"
          >
            <PrintImage
              key={`${selected?.id ?? 'reference'}-${photoIdx}`}
              design={design}
              src={listingPhoto}
              width={1100}
              alt={
                selected
                  ? `${design.displayLabel} — the ${selected.publisher} copy being sold (${selected.condition.toLowerCase()} condition)`
                  : `${design.displayLabel} — reference scan`
              }
              className="aspect-[3/2] w-full"
            />
          </button>
          {photos.length > 1 && (
            <div className="mt-2 flex gap-2" role="tablist" aria-label="Listing photos">
              {photos.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={i === photoIdx}
                  onClick={() => setPhotoIdx(i)}
                  className={`h-14 w-20 cursor-pointer overflow-hidden rounded border ${i === photoIdx ? 'border-aizuri' : 'border-sumi/15 opacity-70 hover:opacity-100'}`}
                >
                  <img src={p} alt={`Photo ${i + 1} of this copy`} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-sumi-soft">
            {selected && !listingPhoto
              ? 'Showing the public-domain reference scan — this listing\u2019s own photograph is being prepared. Real listings always show the exact copy you\u2019ll receive.'
              : selected
                ? 'Photograph of the exact physical print in this listing.'
                : 'Public-domain reference scan of the design (development placeholder).'}
            {' '}Click the image to zoom.{' '}
            <a href={design.commonsCategory} target="_blank" rel="noreferrer" className="text-aizuri underline">Source scans →</a>
          </p>
        </div>
        {zoomed && (
          <Lightbox onClose={() => setZoomed(false)}>
            <PrintImage
              key={`zoom-${selected?.id ?? 'ref'}-${photoIdx}`}
              design={design}
              src={listingPhoto}
              width={2000}
              alt={`${design.displayLabel} — enlarged view`}
              className="max-h-[88vh] w-auto max-w-[92vw] rounded shadow-2xl"
            />
          </Lightbox>
        )}

        {/* details + listing selector */}
        <div>
          <p className="text-xs tracking-[0.25em] text-aizuri-deep">{design.themeLabel?.toUpperCase()}</p>
          <h1 className="mt-1 font-display text-3xl leading-tight text-sumi">{design.displayLabel}</h1>
          <p className="mt-1 text-sm text-sumi-soft">{design.titleJp} · {design.romaji} · {artists[design.artist].name}</p>

          <div className="mt-6">
            <h2 className="mb-2 text-sm font-medium tracking-wide text-sumi">
              {ls.length ? `In stock — ${ls.length} ${ls.length === 1 ? 'copy' : 'copies'} of this design` : 'Availability'}
            </h2>

            {ls.length ? (
              <div className="space-y-2" role="radiogroup" aria-label="Choose a physical copy">
                {ls.map(l => {
                  const active = l.id === selectedId;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedId(l.id)}
                      className={`w-full cursor-pointer rounded-md border p-3 text-left transition-colors ${active ? 'border-aizuri bg-washi-deep/60' : 'border-sumi/15 bg-washi hover:border-aizuri/50'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-sumi">{l.publisher}</span>
                        <span className="text-sm font-semibold text-ume">${l.price}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-sumi-soft">
                        <Badge tone={conditionTone[l.condition]}>{l.condition}</Badge>
                        <span>{l.printYear}</span>
                        {l.demo && <span className="opacity-60">demo listing</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <Waitlist design={design} />
            )}
          </div>

          {selected && (
            <div className="mt-5 rounded-md border border-sumi/12 bg-washi-deep/50 p-4">
              <div className="mb-1 flex items-center gap-2">
                <Badge tone={conditionTone[selected.condition]}>{selected.condition}</Badge>
                <span className="text-xs text-sumi-soft">{CONDITION_MEANING[selected.condition]}</span>
              </div>
              <p className="text-sm leading-relaxed text-sumi">
                <span className="font-medium">This copy:</span> {selected.notes}
              </p>
            </div>
          )}

          <SnipcartAddToCart design={design} listings={ls} selectedId={selectedId} />

          {inSeries.length > 0 && (
            <p className="mt-8 text-xs text-sumi-soft">
              Appears in:{' '}
              {inSeries.map((s, i) => (
                <span key={s.slug}>
                  {i > 0 && ' · '}
                  <Link to={`/shop/set/${s.slug}`} className="text-aizuri underline">{s.title}</Link>
                </span>
              ))}
            </p>
          )}
          <p className="mt-2 text-xs text-sumi-soft">
            New to condition grades and reprints? Read the{' '}
            <Link to="/history/authentication" className="text-aizuri underline">authentication & condition guide</Link>.
          </p>
        </div>
      </div>

      <RelatedPrints design={design} />
    </div>
  );
}

/**
 * Snipcart validates every price by re-fetching the item's `data-item-url`
 * and checking a matching data-item-id/price element actually exists on that
 * page. Because this page defaults to showing the CHEAPEST listing, a
 * customer who picks a pricier publisher needs THAT listing's button to also
 * exist in the page's real HTML — not just the one selected at prerender
 * time. So every listing gets a real button here; CSS `hidden` shows only
 * the one matching the current selection. All of them survive to the
 * prerendered static HTML (hidden ≠ removed), so Snipcart's crawl always
 * finds a match, whichever publisher the customer actually bought.
 */
function SnipcartAddToCart({ design, listings, selectedId }) {
  if (!listings.length) return null;
  const url = `${SITE_URL}/shop/print/${design.slug}`;
  return (
    <div className="mt-5">
      {listings.map(l => (
        <button
          key={l.id}
          type="button"
          hidden={l.id !== selectedId}
          className="snipcart-add-item w-full cursor-pointer rounded px-5 py-2.5 text-sm font-medium tracking-wide text-washi transition-colors duration-200 sm:w-auto bg-ume hover:bg-ume-deep"
          data-item-id={l.id}
          data-item-name={`${design.displayLabel} — ${l.publisher} (${l.condition})`}
          data-item-price={l.price}
          data-item-url={url}
          data-item-image={l.photos?.[0] ?? undefined}
          data-item-description={l.notes}
          data-item-quantity="1"
          data-item-max-quantity="1"
          data-item-custom1-name="Publisher"
          data-item-custom1-type="readonly"
          data-item-custom1-value={l.publisher}
          data-item-custom2-name="Condition"
          data-item-custom2-type="readonly"
          data-item-custom2-value={l.condition}
          data-item-custom3-name="Print year"
          data-item-custom3-type="readonly"
          data-item-custom3-value={l.printYear || 'unknown'}
        >
          Add to cart — ${l.price}
        </button>
      ))}
      <p className="mt-2 text-xs text-sumi-soft">You're buying this exact copy; each listing is a unique physical print.</p>
    </div>
  );
}


/** Full-screen zoom overlay; closes on backdrop click or Escape. */
function Lightbox({ onClose, children }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-sumi/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged print image"
    >
      {children}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close zoom"
        className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-washi/90 text-sumi hover:bg-washi"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          <path d="M4 4 L16 16 M16 4 L4 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/** Per-design waitlist capture — a real Netlify Form ("waitlist"): submissions
 *  land in the Netlify dashboard (Forms tab) and can email the owner. */
function Waitlist({ design }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function submit() {
    setStatus('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'waitlist',
          email,
          design: design.titleEn,
          design_id: design.id,
        }).toString(),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <Card className="p-4 text-sm text-sumi-soft">
        Noted — you're on the list for <span className="font-medium text-sumi">{design.titleEn}</span>.
        We'll email you when a copy is photographed and listed.
      </Card>
    );
  }
  return (
    <Card className="p-4">
      <p className="text-sm leading-relaxed text-sumi-soft">
        No copies of this design are photographed and listed yet.
        Leave your email and we'll tell you the moment one arrives — nothing else, no newsletter.
      </p>
      <form
        name="waitlist"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={e => { e.preventDefault(); if (valid) submit(); }}
        className="mt-3 flex gap-2"
      >
        <input type="hidden" name="form-name" value="waitlist" />
        <input type="hidden" name="design" value={design.titleEn} />
        <input type="hidden" name="design_id" value={design.id} />
        <p className="hidden"><label>Don't fill this out: <input name="bot-field" /></label></p>
        <input
          type="email"
          name="email"
          className={inputCls}
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-label={`Waitlist email for ${design.titleEn}`}
        />
        <Button variant="indigo" type="submit" disabled={!valid || status === 'sending'}>
          {status === 'sending' ? 'Adding…' : 'Notify me'}
        </Button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs text-ume-deep">That didn't go through — please try again in a moment.</p>
      )}
    </Card>
  );
}

/** Related prints: neighboring stations on the road / adjacent views in the
 *  series — thematically the journey continues. */
function RelatedPrints({ design }) {
  const related = useMemo(() => {
    const sameTheme = designs
      .filter(d => d.theme === design.theme && d.id !== design.id)
      .sort((a, b) => Math.abs(a.sequenceNo - design.sequenceNo) - Math.abs(b.sequenceNo - design.sequenceNo));
    return sameTheme.slice(0, 4).sort((a, b) => a.sequenceNo - b.sequenceNo);
  }, [design]);
  if (!related.length) return null;
  const isRoad = design.theme === 'tokaido';
  return (
    <section className="mt-16 border-t rule pt-10">
      <h2 className="font-display text-2xl text-sumi">{isRoad ? 'Continue along the road' : 'More views of Fuji'}</h2>
      <p className="mt-1 text-sm text-sumi-soft">
        {isRoad
          ? 'The stations just before and after this one on the Tōkaidō.'
          : 'Neighboring views in Hokusai\u2019s series.'}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" data-reveal-group>
        {related.map(d => <DesignCard key={d.id} design={d} />)}
      </div>
    </section>
  );
}
