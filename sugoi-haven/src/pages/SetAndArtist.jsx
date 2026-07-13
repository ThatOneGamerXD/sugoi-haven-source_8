import { Link, useParams } from 'react-router-dom';
import { seriesBySlug, designsForSeries, listingsForSeries, artists, designs } from '../data/catalog';
import DesignCard from '../components/DesignCard';
import { Badge } from '../components/ui';
import { usePageReveals } from '../lib/animations';

/** /shop/set/[series-slug] — every design available within one set (§2, §3).
 *  Tiles still resolve to the single canonical page per Design. */
export function SetPage() {
  const { seriesSlug } = useParams();
  const s = seriesBySlug[seriesSlug];
  usePageReveals([seriesSlug]);

  if (!s) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-sumi">Set not found</h1>
        <p className="mt-3 text-sm text-sumi-soft"><Link className="text-aizuri underline" to="/shop">Back to the shop.</Link></p>
      </div>
    );
  }

  const ds = designsForSeries(s);
  const setListings = listingsForSeries(s);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-6 text-xs text-sumi-soft">
        <Link to="/shop" className="hover:text-aizuri">Shop</Link><span className="mx-1.5">/</span>
        <span className="text-sumi">{s.title}</span>
      </nav>
      <header className="mb-10 max-w-2xl">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl text-sumi">{s.title}</h1>
          {s.comingSoon && <Badge tone="paper">being catalogued</Badge>}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-sumi-soft">{s.publisherNote}</p>
        <p className="mt-2 text-xs text-sumi-soft">
          {artists[s.artist].name} · {ds.length} designs
          {s.listingPublisher && ` · ${setListings.length} ${s.listingPublisher} ${setListings.length === 1 ? 'copy' : 'copies'} currently in stock across the set`}
        </p>
      </header>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {ds.map(d => <DesignCard key={d.id} design={d} />)}
      </div>
    </div>
  );
}

/** /shop/artist/[hokusai|hiroshige] — cross-set browse by artist (§2). */
export function ArtistShop() {
  const { artistSlug } = useParams();
  const a = artists[artistSlug];
  usePageReveals([artistSlug]);

  if (!a) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-sumi">Artist not found</h1>
        <p className="mt-3 text-sm text-sumi-soft"><Link className="text-aizuri underline" to="/shop">Back to the shop.</Link></p>
      </div>
    );
  }

  const ds = designs.filter(d => d.artist === artistSlug);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs tracking-[0.25em] text-aizuri-deep">{a.jp}</p>
        <h1 className="mt-1 font-display text-3xl text-sumi">{a.name}</h1>
        <p className="mt-1 text-sm text-sumi-soft">
          {a.years} · {ds.length} designs in the catalogue ·{' '}
          <Link to={`/history/${artistSlug}`} className="text-aizuri underline">read the artist spotlight</Link>
        </p>
      </header>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {ds.map(d => <DesignCard key={d.id} design={d} />)}
      </div>
    </div>
  );
}
