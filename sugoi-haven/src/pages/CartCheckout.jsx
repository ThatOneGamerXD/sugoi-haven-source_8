import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { listings, designs, artists } from '../data/catalog';
import PrintImage from '../components/PrintImage';
import { Badge, Button, Card, Field, inputCls } from '../components/ui';

const resolve = id => {
  const listing = listings.find(l => l.id === id);
  const design = listing && designs.find(d => d.id === listing.designId);
  return listing && design ? { listing, design } : null;
};

export function CartPage() {
  const cart = useCart();
  const rows = cart.items.map(resolve).filter(Boolean);
  const total = rows.reduce((s, r) => s + r.listing.price, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-display text-3xl text-sumi">Your cart</h1>
      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-sumi-soft">
          Your cart is empty. Every print you add here is a unique physical copy —{' '}
          <Link to="/shop" className="text-aizuri underline">start with the Tōkaidō sets</Link>.
        </Card>
      ) : (
        <>
          <ul className="space-y-3">
            {rows.map(({ listing, design }) => (
              <li key={listing.id}>
                <Card className="flex items-center gap-4 p-3">
                  <Link to={`/shop/print/${design.slug}`} className="block h-20 w-28 shrink-0 overflow-hidden rounded bg-bokashi">
                    <PrintImage design={design} src={listing.photos?.[0]} width={280} className="h-full w-full" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/shop/print/${design.slug}`} className="font-display text-sm font-medium text-sumi hover:text-aizuri-deep">
                      {design.displayLabel}
                    </Link>
                    <p className="mt-0.5 text-xs text-sumi-soft">
                      {listing.publisher} · {listing.printYear} · <Badge tone="mist">{listing.condition}</Badge>
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-ume">${listing.price}</span>
                  <button
                    type="button"
                    onClick={() => cart.remove(listing.id)}
                    className="cursor-pointer rounded px-2 py-1 text-xs text-sumi-soft hover:text-ume-deep"
                    aria-label={`Remove ${design.displayLabel} from cart`}
                  >
                    Remove
                  </button>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between border-t rule pt-5">
            <span className="text-sm text-sumi-soft">{rows.length} unique {rows.length === 1 ? 'print' : 'prints'}</span>
            <div className="flex items-center gap-5">
              <span className="font-display text-xl text-sumi">Total <span className="font-semibold text-ume">${total}</span></span>
              <Button variant="primary" to="/checkout">Proceed to checkout</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const rows = cart.items.map(resolve).filter(Boolean);
  const total = rows.reduce((s, r) => s + r.listing.price, 0);

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-sumi">Order recorded — thank you</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-sumi-soft">
          This is the development build, so no payment was taken and nothing ships.
          In production this step hands off to your payment provider.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => navigate('/shop')}>Keep browsing</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 font-display text-3xl text-sumi">Checkout</h1>
      <p className="mb-8 text-sm text-sumi-soft">
        Demo checkout — no payment details are requested or stored in this build.
      </p>
      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-sumi-soft">
          Nothing to check out yet. <Link to="/shop" className="text-aizuri underline">Back to the shop.</Link>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_280px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><input className={inputCls} placeholder="Hana Sato" /></Field>
            <Field label="Email"><input className={inputCls} type="email" placeholder="you@example.com" /></Field>
            <div className="sm:col-span-2">
              <Field label="Shipping address"><input className={inputCls} placeholder="Street, city, postcode, country" /></Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Notes for packing (optional)">
                <input className={inputCls} placeholder="e.g. leave with neighbour" />
              </Field>
            </div>
          </div>
          <Card className="h-fit p-5">
            <h2 className="mb-3 font-display text-lg text-sumi">Summary</h2>
            <ul className="space-y-1.5 text-sm text-sumi-soft">
              {rows.map(({ listing, design }) => (
                <li key={listing.id} className="flex justify-between gap-3">
                  <span className="truncate">{design.titleEn} — {listing.publisher}</span>
                  <span className="shrink-0 text-sumi">${listing.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t rule pt-3 font-medium">
              <span>Total</span><span className="text-ume">${total}</span>
            </div>
            <Button variant="primary" className="mt-5 w-full" onClick={() => { cart.clear(); setPlaced(true); }}>
              Place order (demo)
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-sumi-soft">
              Prints ship flat between acid-free boards. See <Link to="/shipping-returns" className="text-aizuri underline">shipping & returns</Link>.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
