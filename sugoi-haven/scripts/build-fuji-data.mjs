/**
 * build-fuji-data.mjs — generates src/data/fuji-designs.json
 *
 * The 46 designs of Hokusai's Thirty-Six Views of Mount Fuji (the original 36
 * plus the 10 supplementary prints), sourced from the series' Wikipedia page.
 *
 * Image candidates (dev placeholders ONLY):
 *   1. Filenames verified against Commons search listings this session (V: true)
 *   2. The classic descriptive-English Commons upload set (incl. its known
 *      typos, e.g. "Asakusa Honganji temple in th Eastern capital.jpg")
 *   3. Everything degrades to the on-brand SVG placeholder via the UI chain.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/fuji-designs.json');

// [seq, slug, titleEn, titleJp, romaji, candidates[], verified]
const P = [
  [1, 'great-wave', 'The Great Wave off Kanagawa', '神奈川沖浪裏', 'Kanagawa oki nami-ura',
    ['The Great Wave off Kanagawa.jpg', 'Great Wave off Kanagawa2.jpg', 'Tsunami by hokusai 19th century.jpg'], false],
  [2, 'fine-wind-clear-morning', 'Fine Wind, Clear Morning (Red Fuji)', '凱風快晴', 'Gaifū kaisei',
    ['Red Fuji southern wind clear morning.jpg'], false],
  [3, 'thunderstorm-beneath-summit', 'Thunderstorm Beneath the Summit', '山下白雨', 'Sanka hakuu',
    ['Lightnings below the summit.jpg'], false],
  [4, 'mannen-bridge-fukagawa', 'Under Mannen Bridge at Fukagawa', '深川万年橋下', 'Fukagawa Mannen-bashi shita',
    ['Fuji seen through the Mannen bridge at Fukagawa.jpg'], false],
  [5, 'sundai-edo', 'Sundai, Edo', '東都駿台', 'Tōto Sundai', ['Sundai, Edo.jpg'], false],
  [6, 'cushion-pine-aoyama', 'The Cushion Pine at Aoyama', '青山円座松', 'Aoyama Enza-no-matsu',
    ['Cushion Pine at Aoyama.jpg'], false],
  [7, 'senju-musashi', 'Senju in Musashi Province', '武州千住', 'Bushū Senju',
    ['冨嶽三十六景 武州千住-Senju in Musashi Province (Bushū Senju), from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei) MET DP141087.jpg',
     'Senju in the Musachi provimce.jpg'], true],
  [8, 'tama-river-musashi', 'Tama River in Musashi Province', '武州玉川', 'Bushū Tama-gawa',
    ['Tama river in the Musashi province.jpg'], false],
  [9, 'inume-pass-kai', 'Inume Pass in Kai Province', '甲州犬目峠', 'Kōshū Inume-tōge',
    ['Inume pass in the Kai province.jpg'], false],
  [10, 'fujimigahara-owari', 'Fujimigahara Field in Owari Province', '尾州不二見原', 'Bishū Fujimigahara',
    ['冨嶽三十六景 尾州不二見原-Fujimigahara in Owari Province (Bishū Fujimigahara), from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei) MET DP141033.jpg',
     'Fuji view field in the Owari province.jpg'], true],
  [11, 'asakusa-honganji', 'Asakusa Hongan Temple in Edo', '東都浅草本願寺', 'Tōto Asakusa Hongan-ji',
    ['Asakusa Honganji temple in th Eastern capital.jpg'], false],
  [12, 'tsukuda-island', 'Tsukuda Island in Edo', '武陽佃島', 'Buyō Tsukuda-jima',
    ['Tsukada Island in the Musashi province.jpg'], false],
  [13, 'shichirigahama', 'Shichirigahama in Sagami Province', '相州七里浜', 'Soshū Shichirigahama',
    ['Shichirigahama beach in the Sagami province.jpg', 'Shichiri beach in Sagami Province.jpg'], false],
  [14, 'umezawa-sagami', 'Umezawa in Sagami Province', '相州梅沢左', 'Soshū Umezawa-no-hidari',
    ['冨嶽三十六景 相州梅沢左-Umezawa Manor in Sagami Province (Sōshū Umezawa zai), from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei) MET DP141076.jpg',
     'Umegawa in Sagami province.jpg'], true],
  [15, 'kajikazawa-kai', 'Kajikazawa in Kai Province', '甲州石班沢', 'Kōshū Kajikazawa',
    ['Kajikazawa in Kai province.jpg'], false],
  [16, 'mishima-pass-kai', 'Mishima Pass in Kai Province', '甲州三嶌越', 'Kōshū Mishima-goe',
    ['Mishima pass in Kai province.jpg'], false],
  [17, 'lake-suwa-shinano', 'A View of Mount Fuji Across Lake Suwa', '信州諏訪湖', 'Shinshū Suwa-ko',
    ['Lake Suwa in the Shinano province.jpg'], false],
  [18, 'ejiri-suruga', 'Ejiri in Suruga Province', '駿州江尻', 'Sunshū Ejiri',
    ['Ejiri in the Suruga province.jpg'], false],
  [19, 'totomi-mountains', 'In the Mountains of Tōtōmi Province', '遠江山中', 'Tōtōmi san-chū',
    ['Mount Fuji from the mountains of Totomi.jpg', 'In the mountains of Totomi province.jpg'], false],
  [20, 'ushibori-hitachi', 'Ushibori in Hitachi Province', '常州牛堀', 'Jōshū Ushibori',
    ['Ushibori in the Hitachi province.jpg',
     'Brooklyn Museum - View of Fuji from a Boat at Ushibori from "Thirty-Six Views of Fuji" - Katsushika Hokusai.jpg'], true],
  [21, 'mitsui-shop-suruga-street', 'A Sketch of the Mitsui Shop in Suruga Street in Edo', '江都駿河町三井見世略図', 'Kōto Suruga-chō Mitsui-mise ryakuzu',
    ['Mitsui shop at Suruga street in Edo.jpg', 'A sketch of the Mitsui shop in Suruga street in Edo.jpg'], false],
  [22, 'ryogoku-bridge-sunset', 'Sunset Across Ryōgoku Bridge from Ommayagashi', '御厩川岸より両国橋夕陽見', 'Ommayagashi yori Ryōgoku-bashi yūhi-mi',
    ['Sunset across the Ryogoku bridge from the bank of the Sumida river at Onmagayashi.jpg'], false],
  [23, 'sazai-hall', 'Sazaidō at the Temple of Five Hundred Rakan', '五百らかん寺さざゐどう', 'Gohyakurakan-ji Sazaidō',
    ['Sazai hall - Temple of Five Hundred Rakan.jpg'], false],
  [24, 'koishikawa-snow', 'Morning After a Snowfall at Koishikawa', '礫川雪の旦', 'Koishikawa yuki no ashita',
    ['Tea house at Koishikawa. The morning after a snowfall.jpg'], false],
  [25, 'shimomeguro', 'Shimomeguro', '下目黒', 'Shimomeguro',
    ['Shimomeguro.jpg', 'Lower Meguro.jpg'], false],
  [26, 'watermill-onden', 'Watermill at Onden', '隠田の水車', 'Onden no suisha',
    ['Watermill at Onden.jpg'], false],
  [27, 'enoshima-sagami', 'Enoshima in Sagami Province', '相州江の島', 'Soshū Enoshima',
    ['Enoshima in the Sagami province.jpg'], false],
  [28, 'tago-bay-ejiri', 'Sketch of Tago Bay, Ejiri Along the Tōkaidō', '東海道江尻田子の浦略図', 'Tōkaidō Ejiri Tago-no-ura ryakuzu',
    ['Shore of Tago Bay, Ejiri at Tokaido.jpg'], false],
  [29, 'yoshida-tokaido', 'Yoshida Along the Tōkaidō', '東海道吉田', 'Tōkaidō Yoshida',
    ['Yoshida at Tokaido.jpg'], false],
  [30, 'kazusa-sea-route', 'Kazusa Province Sea Route', '上総の海路', 'Kazusa no kairo',
    ['Kazusa sea route.jpg', 'The Kazusa province sea route.jpg'], false],
  [31, 'nihonbashi-edo', 'Nihonbashi in Edo', '江戸日本橋', 'Edo Nihonbashi',
    ['Nihonbashi bridge in Edo.jpg'], false],
  [32, 'sekiya-sumida', 'Sekiya Village on the Sumida River', '隅田川関屋の里', 'Sumida-gawa Sekiya-no-sato',
    ['Sekiya village on the Sumida river.jpg'], false],
  [33, 'noboto-bay', 'Noboto Bay', '登戸浦', 'Noboto-ura',
    ['Bay of Noboto.jpg'], false],
  [34, 'hakone-lake-sagami', 'Hakone Lake in Sagami Province', '相州箱根湖水', 'Sōshū Hakone-kosui',
    ['The lake of Hakone in the Segami province.jpg', 'The lake of Hakone in Sagami province.jpg'], false],
  [35, 'misaka-reflection-kai', 'Reflection in Lake Kawaguchi from Misaka Pass in Kai Province', '甲州三坂水面', 'Kōshū Misaka suimen',
    ['Mount Fuji reflects in Lake Kawaguchi, seen from the Misaka pass in the Kai province.jpg'], false],
  [36, 'hodogaya-tokaido', 'Hodogaya Along the Tōkaidō', '東海道保土ケ谷', 'Tōkaidō Hodogaya',
    ['Hodogaya on the Tokaido.jpg'], false],
  [37, 'tatekawa-honjo', 'Tate River from the Timberyard at Honjo', '本所立川', 'Honjo Tatekawa',
    ['Tatekawa in Honjo.jpg', 'The timberyard at Honjo.jpg'], false],
  [38, 'senju-pleasure-district', 'Mount Fuji from the Pleasure District at Senju', '従千住花街眺望の不二', 'Senju Hana-machi yori chōbō no Fuji',
    ['Fuji from the pleasure district at Senju.jpg'], false],
  [39, 'gotenyama-shinagawa', 'Gotenyama at Shinagawa Along the Tōkaidō', '東海道品川御殿山の不二', 'Tōkaidō Shinagawa Goten\u2019yama no Fuji',
    ['Katsushika Hokusai, Goten-yama hill, Shinagawa on the Tōkaidō, ca. 1832.jpg',
     'Goten-yama hill, Shinagawa on the Tokaido.jpg'], true],
  [40, 'nakahara-sagami', 'Nakahara in Sagami Province', '相州仲原', 'Sōshū Nakahara',
    ['Nakahara in the Sagami province.jpg'], false],
  [41, 'isawa-dawn-kai', 'Dawn at Isawa in Kai Province', '甲州伊沢暁', 'Kōshū Isawa no Akatsuki',
    ['Dawn at Isawa in the Kai province.jpg'], false],
  [42, 'minobu-river-back-fuji', 'The Back of Fuji from the Minobu River', '身延川裏不二', 'Minobu-gawa ura Fuji',
    ['The back of the Fuji from the Minobu river.jpg', 'The back of Fuji from the Minobu river.jpg'], false],
  [43, 'ono-shinden-suruga', 'Ōno Field in Suruga Province', '駿州大野新田', 'Sunshū Ōno-shinden',
    ['Ono Shinden in the Suruga province.jpg'], false],
  [44, 'katakura-tea-plantation', 'Tea Plantation at Katakura in Suruga Province', '駿州片倉茶園の不二', 'Sunshū Katakura-chaen no Fuji',
    ['Tea plantation of Katakura in the Suruga province.jpg'], false],
  [45, 'kanaya-tokaido-fuji', 'Fuji Seen from Kanaya Along the Tōkaidō', '東海道金谷の不二', 'Tōkaidō Kanaya no Fuji',
    ['冨嶽三十六景 東海道金谷の不二-Fuji Seen from Kanaya on the Tōkaidō (Tōkaidō Kanaya no Fuji), from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei) MET DP141002.jpg',
     'The Fuji from Kanaya on the Tokaido.jpg'], true],
  [46, 'climbing-fuji', 'Climbing on Mount Fuji', '諸人登山', 'Shojin tozan',
    ['Climbing on Fuji.jpg', 'Groups of mountain climbers.jpg'], false],
];

const designs = P.map(([seq, slug, titleEn, titleJp, romaji, candidates, verified]) => ({
  id: `fuji-${String(seq).padStart(2, '0')}-${slug}`,
  slug,
  sequenceNo: seq,
  role: seq <= 36 ? 'original' : 'supplementary',
  stationNo: null,
  displayLabel: seq <= 36 ? `View ${seq}: ${titleEn}` : `Supplement ${seq - 36}: ${titleEn}`,
  titleEn, titleJp, romaji,
  artist: 'hokusai',
  theme: 'fuji36',
  themeLabel: 'Thirty-Six Views of Mount Fuji',
  commonsCategory: 'https://commons.wikimedia.org/wiki/Category:Prints_of_36_Views_of_Mount_Fuji',
  imageCandidates: candidates,
  imageVerified: verified,
  referenceImageStatus: verified ? 'verified via Commons listing' : 'best-guess - verify before production',
  notes: null,
}));

if (designs.length !== 46) throw new Error(`Expected 46 designs, got ${designs.length}`);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(designs, null, 2));
console.log(`Wrote ${designs.length} Fuji designs -> ${OUT}`);
