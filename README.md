# Joel Onyedika — Portfolio

3D scroll portfolio built as an embedding space. React + Vite + TypeScript, Three.js (custom shaders), GSAP ScrollTrigger and Lenis. See DESIGN.md for the concept.

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
- `src/lib/data.ts`: projects, stack, email and links.
- `src/components/Scene.tsx`: the 3D scene and camera path.
- `src/components/sections/*`: one file per section. `src/pages/Case.tsx`: project case pages.
- `src/index.css`: all styling and tokens (`:root`).

## Performance
Point count adapts to the device (4.5k phone, 7k/10k desktop) and drops automatically if frames run long. `prefers-reduced-motion` disables smooth scroll and WebGL.
