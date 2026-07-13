import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const routes = ['#/', '#/shop', '#/shop/set/tokaido-53-stations', '#/shop/print/otsu',
  '#/shop/artist/hokusai', '#/shop/print/kajikazawa-kai', '#/shop/set/fuji-36-views', '#/cart', '#/checkout', '#/history', '#/history/process',
  '#/history/timeline', '#/history/hiroshige', '#/history/glossary',
  '#/history/authentication', '#/about', '#/faq', '#/search'];

let js = readFileSync('dist/assets/' + readFileSync('dist/index.html', 'utf8').match(/assets\/(index-[^"]+\.js)/)[1], 'utf8');
js = js.replace(/import\.meta/g, '({url:"http://localhost/"})');

let failures = 0;
for (const route of routes) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    url: 'http://localhost/' + route, runScripts: 'outside-only', pretendToBeVisual: true,
  });
  dom.window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  dom.window.scrollTo = () => {};
  const errors = [];
  dom.window.addEventListener('error', e => errors.push(e.message));
  try {
    dom.window.eval(js);
    await new Promise(r => setTimeout(r, 250));
    const text = dom.window.document.body.textContent;
    const ok = text.includes('Sugoi Haven') && text.length > 300 && !errors.length;
    console.log(ok ? 'PASS' : 'FAIL', route, ok ? `(${text.length} chars)` : errors.slice(0,1));
    if (!ok) failures++;
    if (route === '#/shop/print/otsu') {
      for (const probe of ['Yuyudo', 'Nihon Mokuhan', 'Bijutsusha', '$70', '$50', '$40', 'This copy'])
        if (!text.includes(probe)) { console.log('  MISSING on otsu page:', probe); failures++; }
    }
  } catch (e) { console.log('FAIL', route, e.message); failures++; }
}
process.exit(failures ? 1 : 0);
