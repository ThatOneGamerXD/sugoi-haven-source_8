import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// SINGLEFILE=1 npm run build  ->  one self-contained preview.html
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.SINGLEFILE ? [viteSingleFile()] : []),
  ],
});
