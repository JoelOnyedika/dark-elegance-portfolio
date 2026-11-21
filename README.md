# Joel Onyedika — Portfolio

A cinematic, scroll-driven portfolio. React + Vite + TypeScript, GSAP ScrollTrigger, Lenis, canvas 2D.

## How it works
- **Opening** (`src/components/Opening.tsx`): 238 frames (`public/frames/f001.webp … f238.webp`) are preloaded with real progress and scrubbed to scroll on a canvas in a sticky section. Hero type is real HTML (JOEL top-left, ONYEDIKA bottom-right). The last ~28% zooms into the laptop screen.
- **Frame quality**: the originals (1280×720) had video macroblock banding. They were deblocked, upscaled to 1920×1080 and re-encoded as WebP with baked grain. Portrait screens use a colour-matched blurred fill so there are no mismatched bands.
- **Environment** (`Env.tsx`, `Cosmos.tsx`): the final frame (`env.webp`) is painted with the exact placement the opening ends on, so the hand-off is seamless. A living canvas (parallax stars, constellations, aurora, shooting stars) reacts to scroll and pointer.
- **Projects** (`Projects.tsx`): a 3D ribbon that scales to any number of projects (drag / swipe / keys), with a Grid toggle.
- **Reduced motion / no JS**: static hero over the final frame; `<noscript>` content in `index.html`.

## Edit your content
Everything lives in `src/lib/data.ts`.
- **Projects:** add an entry to `PROJECTS`. Covers are in `public/projects/` (generated abstract art). Set `screenshot: "/projects/x.webp"` to use a real image.
- **Placeholders to replace:** `LINKEDIN`, all `TESTIMONIALS`, the life-sim project copy, and project screenshots.

## Run
```bash
npm install
npm run dev
npm run build
```
Deploys to Vercel as-is (`vercel.json` adds immutable caching for frames and assets).
