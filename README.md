# Joel Onyedika — Portfolio

A cinematic, scroll-driven portfolio. React + Vite + TypeScript, GSAP ScrollTrigger, Lenis, and a small WebGL layer.

## How it works
- **Opening** (`src/components/Opening.tsx`): the 238 supplied frames (`public/frames/f001.jpg … f238.jpg`) are preloaded with real progress, then scrubbed to scroll position on a canvas inside a sticky (pinned) section. The hero type is real HTML. The last ~28% of the scroll zooms into the laptop screen.
- **Environment** (`src/components/Env.tsx`): the final frame, painted with the exact placement the opening ends on, sits behind the whole site, so the hand-off is pixel-identical. A light WebGL shader adds twinkling stars and drifting mist.
- **Frame maths** (`src/lib/frames.ts`): landscape uses cover; portrait keeps the laptop in view, then eases into cover.
- **Reduced motion / no JS**: no sequence; a static hero over the final frame, everything visible. `<noscript>` content is in `index.html`.

## Edit your content
Everything is in `src/lib/data.ts`: projects, skills, links, testimonials.
- **Screenshots:** put an image in `public/projects/` and set `screenshot: "/projects/collecto.jpg"` on the project.
- **LinkedIn:** set `LINKEDIN` (currently a marked placeholder).
- **Testimonials:** currently marked placeholders.

## Run
```bash
npm install
npm run dev      # http://localhost:8080
npm run build
```
Deploys to Vercel as-is (`vercel.json` adds immutable caching for frames and assets).
