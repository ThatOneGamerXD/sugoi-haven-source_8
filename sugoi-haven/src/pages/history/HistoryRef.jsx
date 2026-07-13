import { Link, useParams } from 'react-router-dom';
import { usePageReveals } from '../../lib/animations';
import { Badge, Button } from '../../components/ui';
import { CONDITION_MEANING } from '../../data/catalog';
import { FiguredArticle, HistoryFigure } from './History';

const P = ({ children }) => <p className="max-w-2xl leading-relaxed text-sumi-soft" data-reveal>{children}</p>;
const H2 = ({ children }) => <h2 className="max-w-2xl font-display text-2xl text-sumi" data-reveal>{children}</h2>;

/* ---------------- Artist spotlights (§5.4) ---------------- */
const SPOTLIGHTS = {
  hokusai: {
    name: 'Katsushika Hokusai', jp: '葛飾北斎', years: '1760–1849',
    body: [
      'Hokusai worked for seventy years under some thirty different art names, restlessly changing styles, studios, and even addresses — he is said to have moved house more than ninety times. By his own account he only began to understand the structure of nature in his seventies.',
      'It was precisely then, around 1830–32, that he produced Thirty-Six Views of Mount Fuji: forty-six designs (the series outgrew its own title) that view the mountain from tea houses, rooftops, rice fields, and the trough of a cresting sea. The Great Wave off Kanagawa, printed in the imported Prussian blue that gives our brand its primary color, became the most reproduced image in Japanese art.',
      'That fame is directly relevant to what you buy here: demand from Europe — where the wave and the red Fuji stunned painters from Monet\u2019s circle onward — kept publishers re-carving Hokusai\u2019s blocks for more than a century, producing the spread of editions and conditions our listings compare.',
    ],
    defining: 'Thirty-Six Views of Mount Fuji (c. 1830–32) · 46 designs',
    shop: '/shop/artist/hokusai',
    portrait: {
      candidates: ['Portrait of Hokusai by Keisai Eisen.jpg', 'Hokusai portrait.jpg', 'Portrait of Katsushika Hokusai by disciple Keisai Eisen.png'],
      alt: 'Painted portrait of Katsushika Hokusai by his pupil Keisai Eisen',
      caption: 'Hokusai, portrayed by his pupil Keisai Eisen. Public-domain scan, Wikimedia Commons.',
    },
  },
  hiroshige: {
    name: 'Utagawa Hiroshige', jp: '歌川広重', years: '1797–1858',
    body: [
      'Hiroshige was born into a family of Edo fire wardens and kept the hereditary post for years while training as a print designer, only devoting himself fully to art in the early 1830s. Where Hokusai is dramatic, Hiroshige is lyrical: rain, snow, mist, and dusk carry the emotion of his scenes.',
      'His breakthrough came from the road. The Fifty-Three Stations of the Tōkaidō (c. 1833–34, published by Hōeidō) portrays the great highway between Edo and Kyoto — one print per post station, plus the departure at Nihonbashi and the arrival at Kyoto, 55 designs in all. It became the best-selling print series ever made, and Hiroshige returned to the Tōkaidō in roughly thirty further series.',
      'Van Gogh copied Hiroshige outright in oils; that European appetite drove reprint editions from many publishers across the following century. The Yuyudo, Nihon Mokuhan, and Bijutsusha sets in our shop are chapters of that afterlife — the same 55 compositions, re-carved and re-printed decades apart.',
    ],
    defining: 'The Fifty-Three Stations of the Tōkaidō (c. 1833–34) · 55 designs',
    shop: '/shop/artist/hiroshige',
    portrait: {
      candidates: ['Memorial Portrait of Hiroshige, by Kunisada.jpg', 'Memorial Portrait of Hiroshige LACMA M.66.35.2.jpg', 'Memorial Portrait of Utagawa Hiroshige (5765350019)FXD.jpg'],
      alt: 'Memorial woodblock portrait of Utagawa Hiroshige by Kunisada, 1858',
      caption: 'Hiroshige\u2019s memorial portrait by Kunisada (Toyokuni III), 1858, published weeks after his death. Public-domain scan, Wikimedia Commons.',
    },
  },
};

export function ArtistSpotlight() {
  const { artistSlug } = useParams();
  const a = SPOTLIGHTS[artistSlug];
  usePageReveals([artistSlug]);
  if (!a) return <P>Unknown artist. <Link to="/history" className="text-aizuri underline">Back to overview.</Link></P>;
  return (
    <FiguredArticle figure={<HistoryFigure key={artistSlug} {...a.portrait} />}>
      <div data-reveal>
        <p className="text-xs tracking-[0.25em] text-aizuri-deep">{a.jp} · {a.years}</p>
        <h2 className="mt-1 font-display text-3xl text-sumi">{a.name}</h2>
      </div>
      {a.body.map((t, i) => <P key={i}>{t}</P>)}
      <p className="max-w-2xl text-sm text-sumi" data-reveal><span className="font-medium">Defining series:</span> {a.defining}</p>
      <div data-reveal>
        <Button variant="indigo" to={a.shop}>Shop {a.name.split(' ').pop()}'s inventory →</Button>
      </div>
    </FiguredArticle>
  );
}

/* ---------------- Glossary (§5.5) ---------------- */
const GLOSSARY = [
  ['ukiyo-e 浮世絵', '"Pictures of the floating world" — the popular print genre of Edo-period Japan.'],
  ['moku hanga 木版画', 'Japanese woodblock printing: water-based pigment, hand-carved blocks, hand-pressed paper.'],
  ['nishiki-e 錦絵', '"Brocade pictures" — full-color prints made from many blocks, standard from the 1760s.'],
  ['fūkei-ga 風景画', 'Landscape prints, the genre Hokusai and Hiroshige made dominant in the 1830s.'],
  ['key block', 'The block carved with the design\u2019s outlines, printed first; color blocks follow.'],
  ['kentō 見当', 'Registration notches cut into every block so successive color passes align.'],
  ['baren 馬楝', 'The flat hand-held pad the printer uses to burnish paper against the inked block.'],
  ['bokashi ぼかし', 'Hand-wiped tonal gradation on the block — the soft graded skies in Hiroshige\u2019s prints.'],
  ['washi 和紙', 'Handmade Japanese paper, typically from mulberry fiber; the cream ground of every sheet (and of this site).'],
  ['ōban 大判', 'The standard large print format, roughly 25 × 37 cm; the Tōkaidō series is horizontal ōban.'],
  ['hanmoto 版元', 'The publisher: financier, coordinator, and usually owner of the blocks.'],
  ['restrike', 'An impression pulled from original or re-carved blocks later than the first edition.'],
];

export function Glossary() {
  usePageReveals();
  return (
    <article>
      <div className="mb-8 space-y-6" data-reveal-group>
        <H2>Glossary</H2>
        <P>The dozen terms that appear on our listing pages and in the condition guide.</P>
      </div>
      <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2" data-reveal-group>
        {GLOSSARY.map(([term, def]) => (
          <div key={term} data-reveal className="border-l-2 border-aizuri/40 pl-4">
            <dt className="font-display text-base font-medium text-sumi">{term}</dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-sumi-soft">{def}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/* ---------------- Authentication & condition guide (§5.5) ---------------- */
export function AuthenticationGuide() {
  usePageReveals();
  return (
    <article className="space-y-6" data-reveal-group>
      <H2>Authentication & condition</H2>
      <P>
        Nearly everything sold here is a reprint, and we say so plainly — that is the honest
        state of the ukiyo-e market. Original Edo-period impressions of famous designs are rare
        and priced like the museum pieces they are. What circulates, and what fills our sets, are
        the twentieth-century editions: sheets printed by hand from re-carved blocks, by
        publishing houses keeping the craft alive for a global audience.
      </P>
      <H2>Three words on every listing</H2>
      <P>
        <strong className="text-sumi">Reprint</strong> means an impression made after the original
        edition, usually from newly carved blocks that copy the composition.{' '}
        <strong className="text-sumi">Restrike</strong> is the narrower case of later impressions
        pulled from surviving earlier blocks. Practically, the label that matters most is the{' '}
        <strong className="text-sumi">publisher and era</strong> we state on each listing — a
        1950s Yuyudo sheet and a 1930s Nihon Mokuhan sheet of the same design are different
        objects with different papers, palettes, and prices.
      </P>
      <H2>Our condition grades</H2>
      <div className="max-w-2xl space-y-3" data-reveal>
        {Object.entries(CONDITION_MEANING).map(([grade, meaning]) => (
          <div key={grade} className="flex items-start gap-3 rounded-md border border-sumi/12 bg-washi p-4">
            <Badge tone={grade === 'Fine' ? 'indigo' : grade === 'Good' ? 'mist' : 'paper'}>{grade}</Badge>
            <p className="text-sm leading-relaxed text-sumi-soft">{meaning}</p>
          </div>
        ))}
      </div>
      <P>
        Grades summarize; photographs decide. Every listing carries photos of the exact sheet
        being sold, plus a copy-specific note (toning, a soft corner, a printer&rsquo;s smudge). When
        two listings of one design sit side by side on its page, you are comparing real objects,
        not tiers.
      </P>
      <div data-reveal>
        <Button variant="indigo" to="/shop/print/otsu">See it in practice: Station 53, Ōtsu →</Button>
      </div>
    </article>
  );
}
