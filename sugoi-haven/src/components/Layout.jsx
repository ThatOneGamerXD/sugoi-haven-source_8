import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SealMark } from './Marks';
import { useCart } from '../lib/CartContext';
import { useSEO } from '../lib/useSEO';

const nav = [
  { to: '/shop', label: 'Shop' },
  { to: '/history', label: 'History of Woodblock' },
  { to: '/about', label: 'About' },
  { to: '/search', label: 'Search' },
];

export default function Layout() {
  const cart = useCart();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useSEO();
  useEffect(() => { window.scrollTo(0, 0); setMenuOpen(false); }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b rule bg-washi/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <SealMark className="h-8 w-8" />
            <span className="font-display text-xl font-semibold tracking-wide text-sumi">Sugoi Haven</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-4">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `hidden px-2 py-1 tracking-wide transition-colors sm:block ${isActive ? 'text-aizuri-deep underline underline-offset-8' : 'text-sumi-soft hover:text-aizuri'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link to="/cart" className="relative ml-2 rounded border border-sumi/25 px-3 py-1.5 text-sm text-sumi hover:border-aizuri hover:text-aizuri">
              Cart
              {cart.count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ume text-[11px] font-semibold text-washi">
                  {cart.count}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="ml-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-sumi/25 text-sumi hover:border-aizuri hover:text-aizuri sm:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                {menuOpen
                  ? <path d="M4 4 L16 16 M16 4 L4 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  : <path d="M3 5 h14 M3 10 h14 M3 15 h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg>
            </button>
          </nav>
        </div>
        {menuOpen && (
          <nav className="border-t rule bg-washi sm:hidden" aria-label="Mobile">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `block border-b rule px-5 py-3 text-sm tracking-wide ${isActive ? 'text-aizuri-deep font-medium' : 'text-sumi-soft'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-20 border-t rule bg-washi-deep/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-sumi-soft sm:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <SealMark className="h-6 w-6" />
              <span className="font-display text-base text-sumi">Sugoi Haven</span>
            </div>
            <p>Ukiyo-e woodblock prints — every design catalogued once, every physical copy photographed and graded honestly.</p>
          </div>
          <nav className="grid grid-cols-2 gap-1">
            {[
              ['/shop', 'Shop all sets'], ['/shop/artist/hiroshige', 'Hiroshige'],
              ['/shop/artist/hokusai', 'Hokusai'], ['/history', 'History'],
              ['/history/glossary', 'Glossary'], ['/history/authentication', 'Condition guide'],
              ['/shipping-returns', 'Shipping & returns'], ['/faq', 'FAQ'], ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-aizuri">{label}</Link>
            ))}
          </nav>
          <p className="text-xs leading-relaxed">
            Browse images are public-domain 19th-century reference scans (development placeholders).
            Every purchasable listing is photographed individually before it goes live.
          </p>
        </div>
      </footer>
    </div>
  );
}
