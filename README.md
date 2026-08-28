# KenE Creative

Portfolio for Kenneth Espinoza — creative strategist and developer.
Vite + React SPA. The site is laid out as a musical score: a persistent WebGL2
"score field" runs behind every page and resolves into the hand-coded staff footer.

## Stack

- **Vite 8** + **React 19** + **TypeScript 7**
- **React Router 7** — one persistent `RootLayout`; the header, footer and
  `ScoreCanvas` never unmount, only the `<Outlet>` swaps
- **Motion** — route transitions (View Transitions API barline wipe), scroll
  reveals, the Works drag carousel, `CountUp` stats
- **GSAP ScrollTrigger** + **Lenis** — smooth scroll on one shared `gsap.ticker`
- **raw WebGL2** — the hero score field (`src/webgl/`)
- **Tailwind v4** (via `@tailwindcss/vite`), CSS Modules per component

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build -> dist/
npm run typecheck
```

## Layout

```
src/
  layout/RootLayout.tsx      persistent shell
  webgl/                     ScoreCanvas + shaders + scroll signals
  lib/SmoothScroll.tsx       Lenis + ScrollTrigger on one ticker
  components/                Header, Footer, NameReveal, CountUp, PageTransition
  routes/                    Overture, Works, CaseStudy, About, Archive, DndTracker
    caseStudies.ts           structured case-study content
legacy/                      original standalone HTML (referenced by /musicdashboard)
```

The music dashboard (`/musicdashboard`) is embedded from `legacy/musicdashboard.html`
via a lazy iframe, re-themed to the site palette on load.

## Assets

Optimized web images live in `public/works/<slug>/`. Raw source media (originals,
campaign videos) stays local under `legacy/Images/` (gitignored). After adding new
raster files to `public/works/`, run `npm run optimize-images` (sharp → webp).

## Not yet done

- Case-study images: AAP and Unopened Letter are wired; Red Cross and Dutch Bros
  still use gradient tiles
- Unopened Letter campaign videos need hosting (YouTube / Vimeo / Cloudflare Stream)
  then embed URLs into `caseStudies.ts`
- DnD Tracker route is a stub
- Self-hosted fonts (currently Google Fonts `<link>`)
- Code-split GSAP
