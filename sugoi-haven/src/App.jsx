import { HashRouter, Route, Routes } from 'react-router-dom';
// HashRouter lets the static build run straight from a double-clicked file.
// For deployment, swap to BrowserRouter (see README) to get the blueprint's
// clean paths: /shop/print/otsu etc. — the route table below is already exact.
import Layout from './components/Layout';
import { CartProvider } from './lib/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import PrintPage from './pages/PrintPage';
import { SetPage, ArtistShop } from './pages/SetAndArtist';
import { CartPage, CheckoutPage } from './pages/CartCheckout';
import { HistoryLayout, HistoryOverview, HistoryProcess, HistoryTimeline } from './pages/history/History';
import { ArtistSpotlight, Glossary, AuthenticationGuide } from './pages/history/HistoryRef';
import { About, ShippingReturns, FAQ, Contact, Search } from './pages/Utility';

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/set/:seriesSlug" element={<SetPage />} />
            <Route path="/shop/print/:designSlug" element={<PrintPage />} />
            <Route path="/shop/artist/:artistSlug" element={<ArtistShop />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/history" element={<HistoryLayout />}>
              <Route index element={<HistoryOverview />} />
              <Route path="process" element={<HistoryProcess />} />
              <Route path="timeline" element={<HistoryTimeline />} />
              <Route path=":artistSlug" element={<ArtistSpotlight />} />
              <Route path="glossary" element={<Glossary />} />
              <Route path="authentication" element={<AuthenticationGuide />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </CartProvider>
  );
}
