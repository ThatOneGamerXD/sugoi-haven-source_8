import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// SINGLEFILE=1 npm run build  ->  one self-contained preview.html (uses HashRouter,
//                                 relative asset paths, works from a double-click)
// npm run build                ->  normal deploy build (uses BrowserRouter, clean
//                                 URLs, root-relative paths) — what Netlify/Vercel serve
const singlefile = Boolean(process.env.SINGLEFILE);
const siteUrl = process.env.SITE_URL || 'https://cheery-cactus-eac4da.netlify.app';

export default defineConfig({
  base: singlefile ? './' : '/',
  define: { __SINGLEFILE__: singlefile, __SITE_URL__: JSON.stringify(siteUrl) },
  plugins: [
    react(),
    tailwindcss(),
    ...(singlefile ? [viteSingleFile()] : []),
  ],
});
