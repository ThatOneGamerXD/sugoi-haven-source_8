import { Link } from 'react-router-dom';
import PrintImage from './PrintImage';
import { Badge } from './ui';
import { priceFrom, availableCount } from '../data/catalog';

/**
 * One Design = one tile, always (blueprint §3 pitfall rule).
 * Pricing rolls up from Listings: "from $40 · 3 available".
 */
export default function DesignCard({ design }) {
  const from = priceFrom(design.id);
  const count = availableCount(design.id);

  return (
    <Link
      to={`/shop/print/${design.slug}`}
      data-reveal
      className="ink-card group block overflow-hidden rounded-md border border-sumi/12 bg-washi"
    >
      <div className="aspect-[3/2] overflow-hidden bg-bokashi">
        <PrintImage design={design} width={480} className="h-full w-full" />
      </div>
      <div className="space-y-1.5 p-3">
        <p className="font-display text-sm font-medium leading-snug text-sumi group-hover:text-aizuri-deep">
          {design.displayLabel}
        </p>
        <p className="text-xs text-sumi-soft">{design.titleJp} · {design.romaji}</p>
        <div className="flex items-center justify-between pt-1">
          {from != null ? (
            <>
              <span className="text-sm font-semibold text-ume">from ${from}</span>
              <Badge tone="mist">{count} available</Badge>
            </>
          ) : (
            <Badge tone="paper">inventory pending</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
