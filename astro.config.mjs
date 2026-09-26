// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages default domain; update when a custom domain is added.
  site: 'https://bryce-howell.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
