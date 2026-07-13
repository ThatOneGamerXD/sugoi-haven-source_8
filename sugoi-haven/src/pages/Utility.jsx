import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { designs, listings } from '../data/catalog';
import DesignCard from '../components/DesignCard';
import { Card, Field, inputCls, Button } from '../components/ui';
import { usePageReveals } from '../lib/animations';

const Page = ({ title, children }) => {
  usePageReveals();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12" data-reveal-group>
      <h1 className="mb-8 font-display text-3xl text-sumi" data-reveal>{title}</h1>
      <div className="space-y-5">{children}</div>
    </div>
  );
};
const P = ({ children }) => <p className="leading-relaxed text-sumi-soft" data-reveal>{children}</p>;
const H2 = ({ children }) => <h2 className="pt-2 font-display text-xl text-sumi" data-reveal>{children}</h2>;

export const About = () => (
  <Page title="About Sugoi Haven">
    <P>
      Sugoi Haven is a small shop for Japanese and anime-adjacent art, launching with the two
      cornerstones of the woodblock landscape tradition: Hokusai's Thirty-Six Views of Mount Fuji
      and Hiroshige's Fifty-Three Stations of the Tōkaidō — 101 designs in all, sold as
      individual sheets across editions from many historical publishers.
    </P>
    <P>
      Our catalogue is organized the way the art actually works: one page per artwork, with every
      physical copy we hold — publisher, era, condition, and its own photographs — listed side by
      side on that page. No duplicate tiles, no guessing which "Ōtsu" is which.
    </P>
    <P>
      A word on what you're actually buying, because the word "print" undersells it. Nothing we
      sell came out of a machine. Every sheet in this shop was made the same way Hiroshige's
      originals were: a craftsman carved the design into cherry-wood blocks by hand — one block
      per color — and a printer brushed pigment onto each block and pressed dampened washi paper
      against it with a hand-held baren, pass after pass, gradating the skies by wiping the block
      before each impression. A single sheet passes through skilled hands dozens of times before
      it's finished.
    </P>
    <P>
      That is why no two copies of the same design are ever identical, and why we photograph each
      one individually rather than showing you a stock image. What arrives at your door isn't a
      poster or a giclée reproduction — it's a piece of mastercrafted work from a living
      four-hundred-year-old tradition, with the slight variations in pressure, gradation, and
      paper that only a human hand leaves behind.
    </P>
    <P>
      New to the medium? Start with the <Link to="/history" className="text-aizuri underline">History of Woodblock</Link>{' '}
      or jump straight to the <Link to="/history/authentication" className="text-aizuri underline">condition guide</Link>.
    </P>
  </Page>
);

export const ShippingReturns = () => (
  <Page title="Shipping & returns">
    <H2>Shipping</H2>
    <P>
      Prints ship flat, sleeved in archival polyester and sandwiched between rigid acid-free
      boards. Domestic orders ship within 3 business days; international within 5, with tracking
      on everything.
    </P>
    <H2>Returns</H2>
    <P>
      Because every listing shows photographs of the exact sheet you receive, surprises should be
      rare — but if a print arrives damaged or isn't what its page showed, contact us within 14
      days of delivery for a full refund on return. Sheets must come back in the packaging they
      arrived in.
    </P>
    <H2>A note on color</H2>
    <P>
      Hand-printed pigment on cream washi photographs slightly differently under every light.
      Our listing photos are shot on a neutral grey background in daylight-balanced light; minor
      variation from your screen is normal and not grounds for a condition claim.
    </P>
  </Page>
);

const FAQS = [
  ['Are these original Edo-period prints?', 'Almost always no, and each listing says exactly what it is. Our inventory spans decades of hand-printed reprint editions — see the authentication guide for what "reprint" and "restrike" mean.'],
  ['Why does the same artwork have several prices?', 'Because each listing is a different physical object: a different publisher\u2019s edition, printed in a different decade, in its own condition. The artwork\u2019s page lets you compare them directly.'],
  ['Why did the photo change when I picked a different publisher?', 'That\u2019s deliberate. Selecting a listing shows the actual photographed copy you\u2019d receive — a fair-condition 1930s sheet genuinely looks different from a fine 1950s one.'],
  ['The browse image says "reference scan" — what is that?', 'Grid thumbnails use public-domain 19th-century museum scans while our own photography is completed. Anything you can add to the cart is photographed for real.'],
  ['Do you sell complete sets?', 'You can assemble one design by design — each artwork\u2019s page shows every copy we hold. If you\u2019re after a full matched set from a single publisher, contact us and we\u2019ll tell you honestly how close our current inventory gets.'],
  ['Will you stock more than Hokusai and Hiroshige?', 'That\u2019s the plan: the launch focuses on the two landscape masters, with the broader Japanese and anime-inspired catalogue arriving after.'],
];

export const FAQ = () => (
  <Page title="Frequently asked questions">
    {FAQS.map(([q, a]) => (
      <div key={q} data-reveal>
        <h2 className="font-display text-lg text-sumi">{q}</h2>
        <p className="mt-1 leading-relaxed text-sumi-soft">{a}</p>
      </div>
    ))}
  </Page>
);

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Page title="Contact">
      {sent ? (
        <Card className="p-8 text-center text-sm text-sumi-soft" data-reveal>
          Message noted — this development build doesn't send email yet, but the form and flow are
          wired for your provider of choice.
        </Card>
      ) : (
        <div className="grid gap-4" data-reveal>
          <Field label="Your email"><input className={inputCls} type="email" placeholder="you@example.com" /></Field>
          <Field label="Message">
            <textarea className={`${inputCls} min-h-32`} placeholder="Ask about a design, a set, or a specific listing…" />
          </Field>
          <div><Button variant="primary" onClick={() => setSent(true)}>Send message</Button></div>
        </div>
      )}
      <P>Asking about a specific print? Include the artwork name and publisher from its listing card.</P>
    </Page>
  );
}

export function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return designs.filter(d =>
      [d.displayLabel, d.titleEn, d.titleJp, d.romaji, d.themeLabel, d.artist]
        .filter(Boolean).some(f => f.toLowerCase().includes(needle)) ||
      listings.some(l => l.designId === d.id && l.publisher.toLowerCase().includes(needle)),
    );
  }, [q]);
  usePageReveals([q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 font-display text-3xl text-sumi">Search</h1>
      <input
        className={`${inputCls} max-w-md`}
        placeholder="Station name, 大津, romaji, artist, publisher…"
        value={q}
        onChange={e => setParams(e.target.value ? { q: e.target.value } : {})}
        autoFocus
      />
      {q && (
        <p className="mt-3 text-sm text-sumi-soft">
          {results.length} {results.length === 1 ? 'design matches' : 'designs match'} “{q}”
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.map(d => <DesignCard key={d.id} design={d} />)}
      </div>
    </div>
  );
}
