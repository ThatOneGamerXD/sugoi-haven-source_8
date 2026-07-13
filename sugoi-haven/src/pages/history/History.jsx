import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { gsap, ScrollTrigger, usePageReveals } from '../../lib/animations';
import { WaveDivider } from '../../components/Marks';
import { Button } from '../../components/ui';
import { CommonsImg } from '../../components/PrintImage';

/* Editorial reading experience (blueprint §1 skill note): measured serif
   headings, generous measure, magazine-style rhythm on the washi ground. */

const subnav = [
  ['/history', 'Overview', true],
  ['/history/process', 'The process'],
  ['/history/timeline', 'Timeline'],
  ['/history/hokusai', 'Hokusai'],
  ['/history/hiroshige', 'Hiroshige'],
  ['/history/glossary', 'Glossary'],
  ['/history/authentication', 'Authentication & condition'],
];

export function HistoryLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <p className="text-xs tracking-[0.3em] text-aizuri-deep">浮世絵 · THE FLOATING WORLD</p>
        <h1 className="mt-1 font-display text-4xl text-sumi">History of Woodblock</h1>
      </header>
      <nav className="mb-10 flex flex-wrap gap-x-5 gap-y-2 border-b rule pb-3 text-sm">
        {subnav.map(([to, label, end]) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `pb-1 transition-colors ${isActive ? 'border-b-2 border-aizuri text-aizuri-deep' : 'text-sumi-soft hover:text-aizuri'}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}

const P = ({ children }) => <p className="max-w-2xl leading-relaxed text-sumi-soft" data-reveal>{children}</p>;
const H2 = ({ children }) => <h2 className="max-w-2xl font-display text-2xl text-sumi" data-reveal>{children}</h2>;

/** Editorial figure pinned to the left column on desktop, above the text on mobile. */
export function HistoryFigure({ candidates, alt, caption }) {
  return (
    <figure data-reveal className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-md border border-sumi/12 bg-bokashi">
        <CommonsImg candidates={candidates} alt={alt} label={caption} width={640} className="w-full" />
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-sumi-soft">{caption}</figcaption>
    </figure>
  );
}

/** Two-column article: figure left, prose right (stacks on small screens). */
export function FiguredArticle({ figure, children }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div>{figure}</div>
      <article className="space-y-6">{children}</article>
    </div>
  );
}

export function HistoryOverview() {
  usePageReveals();
  return (
    <FiguredArticle
      figure={
        <HistoryFigure
          candidates={[
            'Utagawa Hiroshige (the first) - Shono from the Fifty-three Stations on Tokaido Highway, Hoeido version - Google Art Project.jpg',
            'Shono-Rijksmuseum RP-P-2010-310-95-46.jpeg',
          ]}
          alt="Hiroshige's Driving Rain at Shōno — travelers caught in a sudden downpour"
          caption="Driving Rain at Shōno, Hiroshige, c. 1833–34 — one of the landscape era's most famous sheets. Public-domain museum scan."
        />
      }
    >
      <H2>Pictures of the floating world</H2>
      <P>
        Ukiyo-e translates as "pictures of the floating world" — the world of pleasure and fashion
        in Edo-period Japan. For most of its history the genre pictured people: kabuki actors,
        courtesans, wrestlers, city crowds. Landscape was a supporting player, a backdrop behind
        the stars.
      </P>
      <P>
        That changed in the 1830s. Hokusai's Thirty-Six Views of Mount Fuji (c. 1830–32) and
        Hiroshige's Fifty-Three Stations of the Tōkaidō (c. 1833–34) turned the view itself into
        the subject, and both series sold at a scale no actor print ever matched. Landscape —
        fūkei-ga — became the dominant late-period genre. A shop devoted to these two artists'
        landscape sets isn't a narrow slice of ukiyo-e; it's the genre at its commercial and
        artistic peak.
      </P>
      <H2>Why a print is not a picture of a print</H2>
      <P>
        Every sheet was made by hand from carved wooden blocks — the craft called moku hanga.
        Because the blocks themselves were durable property, and because European painters made
        these designs world-famous, the most loved compositions were re-carved and re-printed by
        many publishers for over a century. The result is the situation our shop is built around:
        one artwork, many physical editions, each with its own paper, color, and condition.
      </P>
      <div data-reveal className="flex flex-wrap gap-3 pt-2">
        <Button variant="indigo" to="/history/process">How a print was made →</Button>
        <Button variant="outline" to="/shop">See the designs in the shop</Button>
      </div>
    </FiguredArticle>
  );
}

export function HistoryProcess() {
  usePageReveals();
  const steps = [
    ['The artist', 'e-shi 絵師', 'Draws the design as a brush drawing on thin paper. Hokusai and Hiroshige never carved or printed a sheet themselves — their line was the beginning, not the end, of the object you buy.'],
    ['The carver', 'hori-shi 彫師', 'Pastes the drawing face-down on cherry wood and cuts away everything that is not a line, destroying the original in the process. One "key block" carries the outlines; a further block is carved for every color.'],
    ['The printer', 'suri-shi 摺師', 'Brushes water-based pigment onto each block and presses dampened washi paper against it by hand with a flat pad called a baren — once per color, in sequence. Registration notches (kentō) cut into every block keep the passes aligned to within a hair.'],
    ['The publisher', 'hanmoto 版元', 'Finances the whole operation, coordinates the three crafts, sells the sheets — and usually owns the blocks. Ownership of blocks is why editions continued long after everyone in the original workshop had died.'],
  ];
  return (
    <FiguredArticle
      figure={
        <HistoryFigure
          candidates={[
            'Vrouwen maken prenten (middendeel), RP-P-2015-26-2135-2.jpg',
            'Utagawa Kunisada - Printmaking triptych.jpg',
          ]}
          alt="Edo-period woodblock print workshop scene by Kunisada showing printing in progress"
          caption="A print workshop at work, from a Kunisada triptych, Edo period. Public-domain museum scan (Rijksmuseum)."
        />
      }
    >
      <div className="space-y-6" data-reveal-group>
        <H2>Four crafts, one sheet</H2>
        <P>
          No single person made a woodblock print. Production was split across four specialist
          roles, and the credit line on the sheet names at least two of them — artist and
          publisher — which is exactly the information you'll compare between listings in the shop.
        </P>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2" data-reveal-group>
        {steps.map(([role, jp, text], i) => (
          <li key={role} data-reveal className="rounded-md border border-sumi/12 bg-washi p-5">
            <p className="text-xs tracking-widest text-aizuri-deep">{String(i + 1).padStart(2, '0')} · {jp}</p>
            <h3 className="mt-1 font-display text-xl text-sumi">{role}</h3>
            <p className="mt-2 text-sm leading-relaxed text-sumi-soft">{text}</p>
          </li>
        ))}
      </ol>
      <div className="space-y-6" data-reveal-group>
        <H2>Bokashi, and why gradients matter here</H2>
        <P>
          The soft graduated skies you'll see across Hiroshige's Tōkaidō — deep blue fading to
          paper at the horizon — are bokashi: the printer wiping pigment into a gradient on the
          block by hand for every single impression. No two sheets are identical, which is one
          honest reason two listings of the same design can look, and cost, different. Our own
          section backgrounds borrow the effect; the originals did it first, ten thousand times,
          by hand.
        </P>
        <div data-reveal><WaveDivider className="text-aizuri" /></div>
      </div>
    </FiguredArticle>
  );
}

/* Timeline with a GSAP draw-on line that extends as you scroll (§4). */
const ERAS = [
  ['1600s', 'Edo-period origins', 'Woodblock printing, long used for Buddhist texts, turns commercial in the new capital of Edo. Early single-color prints of city life establish the ukiyo-e trade.'],
  ['1700s', 'The golden age of figures', 'Full-color printing (nishiki-e, "brocade pictures") arrives in the 1760s. Actor portraits and pictures of famous beauties dominate; publishers grow into real businesses.'],
  ['1830s', 'The landscape era', 'Hokusai (active on Fuji c. 1830–32) and Hiroshige (Tōkaidō c. 1833–34) make the view itself the star. Everything in this shop\u2019s launch catalogue comes from this decade\u2019s two great series.'],
  ['1860s–90s', 'Decline', 'The Edo period ends in 1868; photography and imported inks change the market. Yet the same era carries ukiyo-e to Europe, where it reshapes Impressionism.'],
  ['1900s', 'Revival and the reprint century', 'Foreign demand — collectors like Frank Lloyd Wright among them — keeps the craft alive. Publishing houses re-carve the famous designs again and again. This is why one artwork exists at several prices in our inventory today.'],
];

export function HistoryTimeline() {
  usePageReveals();
  const lineRef = useRef(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, transformOrigin: 'top', ease: 'none',
        scrollTrigger: { trigger: '#era-list', start: 'top 70%', end: 'bottom 65%', scrub: 0.4 },
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => { clearTimeout(t); mm.revert(); };
  }, []);

  return (
    <article>
      <div className="mb-10 space-y-6" data-reveal-group>
        <H2>Two and a half centuries in five moves</H2>
        <P>
          The timeline below also explains the shop's core mechanic: the reprint waves of the
          twentieth century are the reason a single design can be offered here from three
          publishers at three prices.
        </P>
      </div>
      <div id="era-list" className="relative ml-2 border-none pl-8">
        <span ref={lineRef} className="absolute left-0 top-1 h-full w-0.5 bg-aizuri" aria-hidden="true" />
        <ol className="space-y-10">
          {ERAS.map(([era, title, text]) => (
            <li key={era} className="relative" data-reveal>
              <span className="absolute -left-[38px] top-1 h-3 w-3 rounded-full border-2 border-aizuri bg-washi" aria-hidden="true" />
              <p className="text-xs tracking-widest text-aizuri-deep">{era}</p>
              <h3 className="mt-0.5 font-display text-xl text-sumi">{title}</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-sumi-soft">{text}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-12 text-sm text-sumi-soft" data-reveal>
        Meet the two artists behind the landscape era:{' '}
        <Link to="/history/hokusai" className="text-aizuri underline">Hokusai</Link> ·{' '}
        <Link to="/history/hiroshige" className="text-aizuri underline">Hiroshige</Link>
      </p>
    </article>
  );
}
