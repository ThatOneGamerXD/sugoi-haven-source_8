import {
  designs, series, artists, listingsForDesign, priceFrom, availableCount, publishers,
} from '../data/catalog';

export const SITE_NAME = 'Sugoi Haven';
export const SITE_URL = typeof __SITE_URL__ !== 'undefined'
  ? __SITE_URL__
  : (typeof process !== 'undefined' && process.env.SITE_URL) || 'https://cheery-cactus-eac4da.netlify.app';
const DEFAULT_DESC =
  'Ukiyo-e woodblock prints by Hokusai and Hiroshige — every design catalogued, every physical copy photographed and graded honestly.';

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '\u2026' : s);
const abs = path => `${SITE_URL}${path === '/' ? '' : path}`;
const commonsImg = (name, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=${width}`;

/** Static, non-catalog pages: path -> { title, description }. */
const STATIC_PAGES = {
  '/': { title: `${SITE_NAME} — Ukiyo-e Woodblock Prints by Hokusai & Hiroshige`, description: DEFAULT_DESC },
  '/shop': {
    title: `Shop All Prints — ${SITE_NAME}`,
    description: 'Browse the complete Fifty-Three Stations of the Tōkaidō and Thirty-Six Views of Mount Fuji, one page per artwork with every publisher\u2019s copy compared side by side.',
  },
  '/cart': { title: `Your Cart — ${SITE_NAME}`, description: 'Review the prints in your cart before checkout.', noindex: true },
  '/checkout': { title: `Checkout — ${SITE_NAME}`, description: 'Complete your order of hand-printed ukiyo-e woodblock prints.', noindex: true },
  '/history': {
    title: `History of Woodblock — ${SITE_NAME}`,
    description: 'What ukiyo-e is, how four craftsmen made every print by hand, and why the same design exists in many editions.',
  },
  '/history/process': {
    title: `How a Woodblock Print Was Made — ${SITE_NAME}`,
    description: 'The four crafts behind every sheet: artist, carver, printer, and publisher — and what bokashi gradation really is.',
  },
  '/history/timeline': {
    title: `A Timeline of Ukiyo-e — ${SITE_NAME}`,
    description: 'From Edo-period origins through the golden age of landscape prints to the twentieth-century reprint editions sold today.',
  },
  '/history/glossary': {
    title: `Glossary of Ukiyo-e Terms — ${SITE_NAME}`,
    description: 'Plain-English definitions of ukiyo-e, moku hanga, bokashi, hanmoto, and the other terms used across our listings.',
  },
  '/history/authentication': {
    title: `Authentication & Condition Guide — ${SITE_NAME}`,
    description: 'What "reprint" and "restrike" mean, and how we grade every print Fine, Good, or Fair.',
  },
  '/about': {
    title: `About — ${SITE_NAME}`,
    description: 'A shop for hand-carved, hand-printed ukiyo-e woodblock prints — mastercrafted work, not modern reproductions.',
  },
  '/shipping-returns': { title: `Shipping & Returns — ${SITE_NAME}`, description: 'How prints ship, and our 14-day return policy.' },
  '/faq': { title: `Frequently Asked Questions — ${SITE_NAME}`, description: 'Common questions about editions, condition, pricing, and what we sell.' },
  '/contact': { title: `Contact — ${SITE_NAME}`, description: 'Get in touch about a design, a set, or a specific listing.' },
  '/search': { title: `Search — ${SITE_NAME}`, description: 'Search the catalogue by station name, romaji, artist, or publisher.', noindex: true },
  '/404': { title: `Page Not Found — ${SITE_NAME}`, description: 'That page doesn\u2019t exist — browse the full catalogue instead.', noindex: true },
};

/** Site-level structured data for the homepage: enables the sitelinks search
 *  box and a proper Organization entity in Google's understanding of the site. */
const HOME_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.png`,
    description: DEFAULT_DESC,
  },
];

function designSEO(design) {
  const from = priceFrom(design.id);
  const count = availableCount(design.id);
  const artist = artists[design.artist];
  const path = `/shop/print/${design.slug}`;
  const desc = from != null
    ? `${design.titleEn} (${design.titleJp}) by ${artist.name} — ${count} ${count === 1 ? 'copy' : 'copies'} in stock from $${from}. Every publisher\u2019s edition compared side by side.`
    : `${design.titleEn} (${design.titleJp}) by ${artist.name} — part of ${design.themeLabel}. Join the waitlist to be notified when a copy is listed.`;
  const ls = listingsForDesign(design.id);
  // Best available image: a real listing photo > the verified public-domain
  // reference scan > the brand fallback card. Google requires an image on
  // Product structured data for rich results, so this is never left empty.
  const image =
    ls.find(l => l.photos?.[0])?.photos[0]
    ?? (design.imageVerified ? commonsImg(design.imageCandidates[0]) : null)
    ?? `${SITE_URL}/og-default.png`;
  return {
    title: `${design.displayLabel} — ${artist.name} | ${SITE_NAME}`,
    description: clip(desc, 160),
    image,
    ogType: 'product',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: design.titleEn,
        image,
        description: desc,
        brand: { '@type': 'Person', name: artist.name },
        category: design.themeLabel,
        url: abs(path),
        offers: ls.length
          ? ls.map(l => ({
              '@type': 'Offer',
              price: l.price,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              itemCondition: 'https://schema.org/UsedCondition',
              seller: { '@type': 'Organization', name: l.publisher },
              url: abs(path),
            }))
          : [{ '@type': 'Offer', availability: 'https://schema.org/OutOfStock', url: abs(path) }],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shop', item: abs('/shop') },
          { '@type': 'ListItem', position: 2, name: artist.name, item: abs(`/shop/artist/${design.artist}`) },
          { '@type': 'ListItem', position: 3, name: design.displayLabel, item: abs(path) },
        ],
      },
    ],
  };
}

function seriesSEO(s) {
  return {
    title: `${s.title} — ${SITE_NAME}`,
    description: clip(s.publisherNote, 160),
  };
}

function artistSEO(artistSlug) {
  const a = artists[artistSlug];
  if (!a) return null;
  const count = designs.filter(d => d.artist === artistSlug).length;
  return {
    title: `${a.name} (${a.jp}) — ${SITE_NAME}`,
    description: `Shop ${count} designs by ${a.name}, ${a.years} — every physical copy we hold photographed and graded honestly.`,
  };
}

const HISTORY_ARTIST_DESC = {
  hokusai: 'Katsushika Hokusai, 1760–1849 — creator of the Thirty-Six Views of Mount Fuji and The Great Wave off Kanagawa.',
  hiroshige: 'Utagawa Hiroshige, 1797–1858 — creator of the Fifty-Three Stations of the Tōkaidō, the best-selling print series ever made.',
};

/** Given a pathname, return { title, description, image, ogType, noindex, jsonLd } or null if unknown. */
export function seoForRoute(pathname) {
  const path = pathname.split('?')[0].split('#')[0] || '/';
  if (STATIC_PAGES[path]) {
    return {
      image: null, ogType: 'website',
      jsonLd: path === '/' ? HOME_JSONLD : null,
      ...STATIC_PAGES[path],
    };
  }

  let m;
  if ((m = path.match(/^\/shop\/print\/([^/]+)$/))) {
    const design = designs.find(d => d.slug === m[1]);
    return design ? designSEO(design) : null;
  }
  if ((m = path.match(/^\/shop\/set\/([^/]+)$/))) {
    const s = series.find(x => x.slug === m[1]);
    return s ? { ...seriesSEO(s), image: null, jsonLd: null } : null;
  }
  if ((m = path.match(/^\/shop\/artist\/([^/]+)$/))) {
    const seo = artistSEO(m[1]);
    return seo ? { ...seo, image: null, jsonLd: null } : null;
  }
  if ((m = path.match(/^\/history\/([^/]+)$/)) && HISTORY_ARTIST_DESC[m[1]]) {
    const a = artists[m[1]];
    return { title: `${a.name} — ${SITE_NAME}`, description: HISTORY_ARTIST_DESC[m[1]], image: null, jsonLd: null };
  }
  return null;
}

/** Every concrete path the site should prerender (includes noindex pages —
 *  they still deserve fast loads and correct tags, just not search listing). */
export function allRoutes() {
  const paths = [...Object.keys(STATIC_PAGES)];
  for (const d of designs) paths.push(`/shop/print/${d.slug}`);
  for (const s of series) paths.push(`/shop/set/${s.slug}`);
  for (const a of Object.keys(artists)) paths.push(`/shop/artist/${a}`);
  for (const a of Object.keys(HISTORY_ARTIST_DESC)) paths.push(`/history/${a}`);
  return [...new Set(paths)];
}

/** Only the indexable routes — what goes in sitemap.xml. */
export function sitemapRoutes() {
  return allRoutes().filter(p => !seoForRoute(p)?.noindex);
}
