import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { series, designs, listingsForDesign, publishers, conditions, artists } from '../data/catalog';
import DesignCard from '../components/DesignCard';
import { Badge, Card } from '../components/ui';
import { WaveDivider } from '../components/Marks';
import { usePageReveals } from '../lib/animations';

const selectCls = 'rounded border border-sumi/25 bg-washi px-3 py-2 text-sm text-sumi focus:border-aizuri cursor-pointer';

export default function Shop() {
  const [artist, setArtist] = useState('all');
  const [publisher, setPublisher] = useState('all');
  const [condition, setCondition] = useState('all');
  const [maxPrice, setMaxPrice] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => designs.filter(d => {
    if (artist !== 'all' && d.artist !== artist) return false;
    const ls = listingsForDesign(d.id);
    if (inStockOnly && !ls.length) return false;
    if (publisher !== 'all' && !ls.some(l => l.publisher === publisher)) return false;
    if (condition !== 'all' && !ls.some(l => l.condition === condition)) return false;
    if (maxPrice !== 'all' && !ls.some(l => l.price <= Number(maxPrice))) return false;
    return true;
  }), [artist, publisher, condition, maxPrice, inStockOnly]);

  usePageReveals([filtered.length]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-display text-4xl text-sumi">Shop by set</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-sumi-soft">
          Two series, one page per artwork. Choose the print you love first — the different
          publishers&rsquo; copies of it are compared side by side on that print&rsquo;s own page.
        </p>
      </header>

      {/* Set cards — one per series, not per publisher */}
      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2" data-reveal-group>
        {series.map(s => (
          <Link key={s.slug} to={`/shop/set/${s.slug}`} data-reveal className="ink-card block">
            <Card className="h-full p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="font-display text-lg leading-snug text-aizuri-deep">{s.title}</h2>
                {s.comingSoon && <Badge tone="paper">cataloguing</Badge>}
              </div>
              <p className="text-sm leading-relaxed text-sumi-soft">{s.publisherNote}</p>
              <p className="mt-3 text-xs tracking-wide text-sumi-soft">
                {artists[s.artist].name} · {s.designIds.length} designs
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <WaveDivider className="my-14 text-aizuri" />

      {/* Browse-all with secondary filters */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-sumi">Every design</h2>
          <p className="text-sm text-sumi-soft">{filtered.length} of {designs.length} artworks</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <select aria-label="Filter by artist" className={selectCls} value={artist} onChange={e => setArtist(e.target.value)}>
            <option value="all">All artists</option>
            <option value="hiroshige">Hiroshige</option>
            <option value="hokusai">Hokusai</option>
          </select>
          <select aria-label="Filter by publisher" className={selectCls} value={publisher} onChange={e => setPublisher(e.target.value)}>
            <option value="all">All publishers</option>
            {publishers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select aria-label="Filter by condition" className={selectCls} value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="all">Any condition</option>
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Filter by price" className={selectCls} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
            <option value="all">Any price</option>
            <option value="50">Under $50</option>
            <option value="75">Under $75</option>
            <option value="100">Under $100</option>
          </select>
          <label className="flex cursor-pointer items-center gap-1.5 text-sumi-soft">
            <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-[#1d4460]" />
            In stock
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map(d => <DesignCard key={d.id} design={d} />)}
      </div>
      {!filtered.length && (
        <p className="py-16 text-center text-sm text-sumi-soft">
          No designs match those filters yet — inventory grows as it's photographed. Try loosening a filter.
        </p>
      )}
    </div>
  );
}
