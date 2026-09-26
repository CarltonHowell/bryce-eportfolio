// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL / BASE_PATH are set by the GitHub Pages workflow (served from /bryce-eportfolio/).
// Left unset, the site builds for the domain root (e.g. Cloudflare Pages).
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://carltonhowell.github.io',
  base: process.env.BASE_PATH ?? '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
