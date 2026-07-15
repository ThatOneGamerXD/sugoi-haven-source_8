import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import PrintPage from './pages/PrintPage';
import { SetPage, ArtistShop } from './pages/SetAndArtist';
import { HistoryLayout, HistoryOverview, HistoryProcess, HistoryTimeline } from './pages/history/History';
import { ArtistSpotlight, Glossary, AuthenticationGuide } from './pages/history/HistoryRef';
import { About, ShippingReturns, FAQ, Contact, Search } from './pages/Utility';
import NotFound from './pages/NotFound';

/** The full route table, shared between the client app (App.jsx) and the
 *  server-side prerenderer (entry-server.jsx) so the two can never drift. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/set/:seriesSlug" element={<SetPage />} />
        <Route path="/shop/print/:designSlug" element={<PrintPage />} />
        <Route path="/shop/artist/:artistSlug" element={<ArtistShop />} />
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
