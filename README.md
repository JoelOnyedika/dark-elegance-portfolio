# Joel Onyedika — Portfolio

Particle-head 3D scroll portfolio. React + Vite + TypeScript, Three.js (custom point-cloud shaders), GSAP ScrollTrigger and Lenis smooth scroll.

## Run locally
```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build in dist/
```

## Deploy to Vercel
1. Push this folder to a GitHub repo (or run `npx vercel` from this folder).
2. Import it in Vercel. Framework preset: **Vite** (auto-detected). Build: `npm run build`, output: `dist`.
3. Add the environment variable `VITE_WEB3FORMS_API_KEY` (your Web3Forms key) so the contact form works.
   `vercel.json` already rewrites all routes to `index.html`.

## Where things live
- `src/lib/data.ts` — all copy: services, skills, projects, testimonials, email.
- `src/components/Scene.tsx` — the 3D particle head. `STAGES` at the top sets camera pose and dust level per section.
- `src/lib/head.ts` — procedural head/neck/shoulders generator (no model file).
- `src/components/sections/*` — one file per section.
- `src/index.css` — all styling and design tokens (`:root`).

## Performance
Particle count adapts to the device (28k mobile, 40k/56k desktop) and drops automatically if frame times run long. `prefers-reduced-motion` disables smooth scroll and heavy animation.
