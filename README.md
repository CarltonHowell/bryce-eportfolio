# Bryce Howell — Teaching Portfolio

One-page static site (Astro 7 + Tailwind 4 + Lenis). Layout, type scale, spacing and motion are modelled
on pamidordesign.co; all content and code are our own.

## Develop
```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs dist/
```

## Deploy (Cloudflare Pages)
Connect the GitHub repo → Framework preset **Astro** · Build command `npm run build` · Output `dist` · Node 22+.

## Editing content
- **Contact email / links / hero copy / marquee:** `src/data/site.ts` (email is a placeholder).
- **Subjects + curriculum alignment:** `src/data/curriculum.ts` — re-verify codes on australiancurriculum.edu.au / qcaa.qld.edu.au.
- **Case studies:** one Markdown file per project in `src/content/work/` (`listed: false` hides it from Selected Work, e.g. the Trail Log).
- **Photos:** `src/assets/images/` — Unsplash placeholders; swap for real photos (keep filenames or update imports).

## Notes
- Clicking a project opens a full-screen case study behind a curtain transition; each has a shareable URL (`/#work/<slug>`).
- The contact form has no backend: "Send Details" opens the visitor's email app with the message pre-filled.
- Respects `prefers-reduced-motion` (intro, smooth scroll and scroll effects are disabled).
