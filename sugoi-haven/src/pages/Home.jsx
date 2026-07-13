import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, usePageReveals } from '../lib/animations';
import { WaveCrest, FujiSilhouette, WaveDivider } from '../components/Marks';
import { Button, Card } from '../components/ui';
import DesignCard from '../components/DesignCard';
import { designs, listings } from '../data/catalog';

const WORDMARK = 'Sugoi Haven';

export default function Home() {
  const heroRef = useRef(null);
  usePageReveals();

  useEffect(() => {
    const mm = gsap.matchMedia(heroRef);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // wordmark: refined per-character rise, not bouncy (§4)
      gsap.from('.wm-char', {
        opacity: 0, y: 26, duration: 0.6, ease: 'power2.out', stagger: 0.045,
      });
      gsap.from('.hero-sub, .entry-card', {
        opacity: 0, y: 18, duration: 0.55, ease: 'power2.out', stagger: 0.12, delay: 0.55,
      });
      // slow left-to-right wave drift, looping parallax
      gsap.to('.wave-drift', { xPercent: -12, duration: 26, ease: 'none', repeat: -1, yoyo: true });
      gsap.to('.wave-drift-2', { xPercent: 8, duration: 34, ease: 'none', repeat: -1, yoyo: true });
    });
    return () => mm.revert();
  }, []);

  const featured = ['tokaido-54-otsu', 'tokaido-46-shono', 'tokaido-16-kanbara', 'tokaido-11-hakone']
    .map(id => designs.find(d => d.id === id));
  const demoNote = listings.some(l => l.demo);

  return (
    <>
      {/* ---------------- Hero (0–100vh) ---------------- */}
      <section ref={heroRef} className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bokashi-down">
        <div className="wave-drift pointer-events-none absolute inset-x-[-15%] top-[16%] text-aizuri opacity-[0.14]">
          <WaveCrest className="h-40 w-[130%]" />
        </div>
        <div className="wave-drift-2 pointer-events-none absolute inset-x-[-10%] top-[34%] text-aizuri-mist opacity-[0.12]">
          <WaveCrest className="h-28 w-[120%]" />
        </div>
        <FujiSilhouette className="pointer-events-none absolute bottom-0 left-0 h-56 w-full" />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-16 text-center">
          <p className="hero-sub mb-4 text-sm tracking-[0.3em] text-aizuri-deep">木版画 · UKIYO-E WOODBLOCK PRINTS</p>
          <h1 className="font-display text-5xl font-semibold tracking-wide text-sumi sm:text-7xl" aria-label={WORDMARK}>
            {WORDMARK.split('').map((c, i) => (
              <span key={i} className="wm-char inline-block" aria-hidden="true">{c === ' ' ? '\u00A0' : c}</span>
            ))}
          </h1>
          <p className="hero-sub mx-auto mt-5 max-w-xl text-base leading-relaxed text-sumi-soft">
            Landscape prints by Hokusai and Hiroshige — sold as individual sheets,
            each physical copy photographed, graded, and priced on its own merits.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            <Link to="/shop" className="entry-card group rounded-md border border-aizuri/25 bg-washi/85 p-7 text-left transition-colors hover:border-aizuri hover:bg-washi">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-2xl text-aizuri-deep">Shop</h2>
                <svg viewBox="0 0 40 16" className="h-3 w-9 text-aizuri transition-transform group-hover:translate-x-1">
                  <path d="M2 12 C 10 10, 12 4, 20 6 C 17 3, 14 4, 13 2 C 19 1, 25 4, 26 9 L 38 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M33 5 L 38 9 L 33 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm leading-relaxed text-sumi-soft">
                The two great landscape series — every design browsable, every publisher's
                copy compared on the artwork's own page.
              </p>
            </Link>
            <Link to="/history" className="entry-card group rounded-md border border-aizuri/25 bg-washi/85 p-7 text-left transition-colors hover:border-aizuri hover:bg-washi">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-2xl text-aizuri-deep">History of Woodblock</h2>
                <svg viewBox="0 0 40 16" className="h-3 w-9 text-aizuri transition-transform group-hover:translate-x-1">
                  <path d="M2 12 C 10 10, 12 4, 20 6 C 17 3, 14 4, 13 2 C 19 1, 25 4, 26 9 L 38 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M33 5 L 38 9 L 33 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm leading-relaxed text-sumi-soft">
                What ukiyo-e is, how four craftsmen made every print, and why the same
                design exists in many editions.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* -------- Bridge section: connective tissue (§2) -------- */}
      <section className="mx-auto max-w-4xl px-4 py-20" data-reveal-group>
        <WaveDivider className="mb-10 text-aizuri" />
        <h2 data-reveal className="mb-6 text-center font-display text-3xl text-sumi">What is a woodblock print?</h2>
        <p data-reveal className="mx-auto max-w-2xl text-center leading-relaxed text-sumi-soft">
          A Japanese woodblock print (moku hanga) is not a drawing or a poster — it is an impression
          taken by hand from carved cherry-wood blocks, one block per color, pressed onto handmade
          washi paper. Four specialists shared every sheet: the artist who designed it, the carver
          who cut the blocks, the printer who inked and burnished them, and the publisher who financed
          it all and owned the blocks. Because blocks outlived their makers and famous designs were
          re-carved for over a century, the <em>same artwork</em> exists today in many editions —
          different publishers, different decades, different paper. That is exactly what you'll compare
          when you shop here.
        </p>

        {/* animated process diagram: block → ink → paper → print */}
        <div data-reveal className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['Block', 'M8 10 h32 v24 H8 Z M14 18 c 6 -4 14 -4 20 0 M14 26 c 6 4 14 4 20 0'],
            ['Ink', 'M24 8 c -8 12 -12 16 -12 22 a12 12 0 0 0 24 0 c 0 -6 -4 -10 -12 -22 Z'],
            ['Paper', 'M12 8 h20 l8 8 v24 H12 Z M32 8 v8 h8'],
            ['Print', 'M10 34 C 16 32, 18 22, 26 24 C 22 18, 18 20, 16 16 C 24 14, 32 20, 33 28 L 40 34 Z'],
          ].map(([label, d], i) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-md border border-sumi/12 bg-washi p-4">
              <svg viewBox="0 0 48 48" className="h-10 w-10 text-aizuri">
                <path d={d} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-medium tracking-widest text-sumi-soft">{i + 1} · {label.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-10 text-center">
          <Button variant="ghost" to="/history">Read the full history →</Button>
        </div>
      </section>

      {/* -------- Featured designs -------- */}
      <section className="bokashi-up">
        <div className="mx-auto max-w-6xl px-4 py-20" data-reveal-group>
          <div className="mb-8 flex items-end justify-between" data-reveal>
            <div>
              <h2 className="font-display text-3xl text-sumi">From the Tōkaidō road</h2>
              <p className="mt-1 text-sm text-sumi-soft">
                Fifty-five designs, Nihonbashi to Kyoto — each with its own page, whatever the publisher.
              </p>
            </div>
            <Button variant="outline" to="/shop" className="hidden sm:inline-flex">Browse all sets</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map(d => <DesignCard key={d.id} design={d} />)}
          </div>
          {demoNote && (
            <p className="mt-6 text-center text-xs text-sumi-soft">
              Prices shown are development demo data — real listings replace them as inventory is photographed.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
