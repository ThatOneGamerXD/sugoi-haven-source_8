import { useEffect, useState } from 'react';

/**
 * PrintImage — dev-placeholder image resolver with a persistent cache.
 *
 * Tries each Wikimedia Commons candidate via the stable Special:FilePath
 * redirect; on error it advances to the next candidate, and finally renders
 * an on-brand SVG placeholder. The index of the WINNING candidate is cached
 * (in-memory + localStorage) per cache key, so the fallback waterfall runs at
 * most once per browser — revisits and re-renders load the right file
 * immediately. Listings with real photos bypass all of this via `src`.
 *
 * To eliminate the waterfall entirely, run `node scripts/verify-images.mjs`
 * once on a machine with open internet — it bakes verified winners into the
 * data (see README).
 */
const filePath = (name, width) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=${width}`;

const CACHE_KEY = 'sugoi-haven-img-cache-v1';
const memCache = (() => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {}; } catch { return {}; }
})();
let persistTimer = null;
function remember(key, idx) {
  memCache[key] = idx;
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(memCache)); } catch { /* private mode */ }
  }, 400);
}

function Placeholder({ label, className }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 bg-bokashi text-aizuri-deep ${className}`}>
      <svg viewBox="0 0 120 44" className="w-24 opacity-60" aria-hidden="true">
        <path d="M4 38 C 20 36, 24 18, 38 20 C 30 12, 20 14, 16 10 C 30 6, 44 12, 50 24 C 60 10, 82 8, 96 20 L 116 38 Z"
          fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
      <span className="px-4 text-center text-xs tracking-wide">{label}<br />reference scan pending</span>
    </div>
  );
}

function useCandidates(cacheKey, count) {
  const [idx, setIdx] = useState(() => memCache[cacheKey] ?? 0);
  useEffect(() => { setIdx(memCache[cacheKey] ?? 0); }, [cacheKey]);
  const fail = () => setIdx(i => {
    const next = i + 1;
    remember(cacheKey, next); // remember progress even mid-waterfall
    return next;
  });
  const win = () => remember(cacheKey, idx);
  return [Math.min(idx, count), fail, win];
}

/** Generic Commons image with candidate fallback, for editorial figures. */
export function CommonsImg({ candidates, width = 700, alt, label, cacheKey, className = '' }) {
  const key = cacheKey ?? `c:${candidates[0]}`;
  const [idx, fail, win] = useCandidates(key, candidates.length);
  if (idx >= candidates.length) return <Placeholder label={label ?? alt} className={className} />;
  return (
    <img
      src={filePath(candidates[idx], width)}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={fail}
      onLoad={win}
    />
  );
}

export default function PrintImage({ design, src, width = 900, alt, className = '' }) {
  const candidates = design?.imageCandidates ?? [];
  const [idx, fail, win] = useCandidates(`d:${design?.id ?? 'none'}`, candidates.length);

  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" decoding="async" />;
  if (idx >= candidates.length) return <Placeholder label={design?.displayLabel ?? 'Artwork'} className={className} />;

  return (
    <img
      src={filePath(candidates[idx], width)}
      alt={alt ?? `${design.displayLabel} — public-domain reference scan (dev placeholder)`}
      className={`object-cover ${className}`}
      loading="lazy"
      decoding="async"
      onError={fail}
      onLoad={win}
    />
  );
}
