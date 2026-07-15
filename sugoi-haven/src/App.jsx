import { BrowserRouter, HashRouter } from 'react-router-dom';
// HashRouter only for the double-click-able single-file preview; real deploys
// (Netlify/Vercel/etc.) get BrowserRouter and clean URLs like /shop/print/otsu.
// See vite.config.js — the SINGLEFILE env var controls which one you get.
const Router = typeof __SINGLEFILE__ !== 'undefined' && __SINGLEFILE__ ? HashRouter : BrowserRouter;
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
