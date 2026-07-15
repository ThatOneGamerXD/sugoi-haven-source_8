import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { seoForRoute, SITE_NAME, SITE_URL } from './seo';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
function setJsonLd(data) {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach(el => el.remove());
  if (!data) return;
  for (const block of Array.isArray(data) ? data : [data]) {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo-jsonld', '');
    el.textContent = JSON.stringify(block);
    document.head.appendChild(el);
  }
}
function setRobots(noindex) {
  let el = document.head.querySelector('meta[name="robots"]');
  if (!noindex) { el?.remove(); return; }
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', 'robots'); document.head.appendChild(el); }
  el.setAttribute('content', 'noindex, follow');
}

/** Keeps <title>, meta description, canonical, Open Graph, and JSON-LD in
 *  sync on every client-side route change. The *first* load's tags come from
 *  the prerendered static HTML (scripts/prerender.mjs) — this hook takes over
 *  once the SPA is running, so in-app navigation stays correct too. */
export function useSEO() {
  const { pathname } = useLocation();
  const mounted = useRef(false);
  useEffect(() => {
    // Unknown route = the NotFound page; give it the /404 metadata (incl. noindex).
    const seo = seoForRoute(pathname) ?? seoForRoute('/404');
    document.title = seo.title;
    setRobots(Boolean(seo.noindex));
    setMeta('name', 'description', seo.description);
    setLink('canonical', `${SITE_URL}${pathname === '/' ? '' : pathname}`);
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:url', `${SITE_URL}${pathname === '/' ? '' : pathname}`);
    setMeta('property', 'og:type', seo.ogType ?? 'website');
    setMeta('property', 'og:image', seo.image ?? `${SITE_URL}/og-default.png`);
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setJsonLd(seo.jsonLd);

    // Snipcart's cart/checkout overlay lives outside our React tree — it
    // doesn't know when OUR router navigates. Without this, clicking a nav
    // link while the cart (or the post-checkout "Thank you" screen) is open
    // changes the URL and swaps the page underneath, but Snipcart's overlay
    // stays visually on top, making the site look frozen. Closing it on
    // every real navigation (not the initial page load) fixes that.
    if (mounted.current) {
      try { window.Snipcart?.api?.theme?.cart?.close?.(); } catch { /* Snipcart not loaded — nothing to close */ }
    }
    mounted.current = true;
  }, [pathname]);
}
