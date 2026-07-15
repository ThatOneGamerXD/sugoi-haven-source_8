import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { CartProvider } from './lib/CartContext';
import AppRoutes from './AppRoutes';
import { seoForRoute, allRoutes, sitemapRoutes } from './lib/seo';

/** Renders one route to an HTML string (server-side, no DOM/browser needed). */
export function render(url) {
  const html = renderToString(
    <CartProvider>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </CartProvider>,
  );
  return { html, seo: seoForRoute(url) };
}

export { allRoutes, sitemapRoutes };
