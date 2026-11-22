# Joel Onyedika: Portfolio

Agency-style, scroll-driven portfolio. React + Vite + TypeScript, GSAP ScrollTrigger, Lenis smooth scroll, canvas 2D.

## What's in it
- **Hero**: "Design. Build. Grow." with a live particle sphere that reacts to the pointer.
- **Stacked sections**: each section pins and scales back while the next slides over it (`data-stack` in `App.tsx`).
- **Services** accordion, **Selected work** with parallax, **Process** with scrubbed text and progress line,
  **Why hire me**, a red **standard** band, **Proof** (live links) and a **Contact** form (opens your mail client).
- Reduced-motion users get everything static; `<noscript>` content lives in `index.html`.

## Edit your content
Everything lives in `src/lib/data.ts` (projects, services, process steps, stack, stats, contact links).
Project covers are in `public/projects/`.

## Run
```bash
npm install
npm run dev
npm run build
```
Deploys to Vercel as-is.
