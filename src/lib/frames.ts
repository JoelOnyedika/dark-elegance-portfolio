import { clamp, lerp, smoothstep } from "./motion";

export const FRAME_COUNT = 238;
export const FRAME_W = 1280;
export const FRAME_H = 720;
/** Share of the opening's scroll used to play frames; the rest is the final zoom into the screen. */
export const P_FRAMES = 0.72;
const ZOOM_MAX = 2.15;
const ZOOM_MAX_PORTRAIT = 1.6; // portrait is already cropped in; less upscaling of the 1280px source
/** Focal point (fraction of frame) the final zoom travels toward: the middle of the laptop screen. */
const FOCUS = { x: 0.5, y: 0.4 };

/** Blur (px) applied at the end of the zoom, to hide upscaling artefacts; the environment still uses the same value. */
export const endBlur = (w: number, h: number) => (w / h < 0.9 ? 1.6 : 1);

export const frameUrl = (i: number) => `/frames/f${String(i + 1).padStart(3, "0")}.jpg`;

export const store: { frames: (HTMLImageElement | undefined)[] } = { frames: [] };

function loadImage(src: string, retries = 2): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => (retries > 0 ? resolve(loadImage(src, retries - 1)) : resolve(undefined));
    img.src = src;
  });
}

/** Loads every frame exactly once with a bounded pool, reporting genuine progress. */
export async function preloadFrames(onProgress: (loaded: number) => void, concurrency = 14) {
  const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
  let next = 0;
  let done = 0;
  async function worker() {
    while (next < FRAME_COUNT) {
      const i = next++;
      const img = await loadImage(frameUrl(i));
      if (img && img.decode) await img.decode().catch(() => undefined);
      frames[i] = img;
      onProgress(++done);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  // Never show a hole: borrow the nearest earlier (or later) loaded frame for any frame that failed.
  for (let i = 0; i < FRAME_COUNT; i++) {
    if (!frames[i]) {
      let j = i;
      while (j >= 0 && !frames[j]) j--;
      if (j < 0) { j = i; while (j < FRAME_COUNT && !frames[j]) j++; }
      frames[i] = frames[j];
    }
  }
  store.frames = frames;
  return frames;
}

export function frameIndexFor(p: number) {
  return Math.round(clamp(p / P_FRAMES) * (FRAME_COUNT - 1));
}

/** Zoom phase progress 0..1 (0 while frames are still playing). */
export const zoomPhase = (p: number) => clamp((p - P_FRAMES) / (1 - P_FRAMES));

export type Placement = { x: number; y: number; w: number; h: number; scale: number; feather: number };

/**
 * Where to draw a 1280×720 frame in a w×h viewport at scroll progress p.
 * Landscape: cover. Portrait: keep the whole laptop in view first, then ease into cover.
 * Both: the final phase zooms toward the middle of the laptop screen.
 */
export function placement(w: number, h: number, p: number): Placement {
  const cover = Math.max(w / FRAME_W, h / FRAME_H);
  const portrait = w / h < 0.9;
  let scale = cover;
  let anchorX = w / 2, anchorY = h / 2, srcX = FRAME_W / 2, srcY = FRAME_H / 2;
  let feather = 0;
  if (portrait) {
    const fit = w / (FRAME_W * 0.5); // starts with the closed laptop filling most of the width
    const t = smoothstep(0.2, P_FRAMES, p);
    scale = lerp(fit, cover, t);
    anchorY = h * lerp(0.4, 0.5, smoothstep(0, 0.2, p)); // starts high, leaving room for the type below
    feather = 56 * (1 - t);
  } else {
    srcX = FRAME_W * FOCUS.x; srcY = FRAME_H * FOCUS.y;
    anchorX = w / 2 - (FRAME_W / 2 - srcX) * scale;
    anchorY = h / 2 - (FRAME_H / 2 - srcY) * scale;
  }
  const z = zoomPhase(p);
  if (z > 0) {
    const k = z * z * (3 - 2 * z);
    const fx = FRAME_W * FOCUS.x, fy = FRAME_H * FOCUS.y;
    const sx = anchorX + (fx - srcX) * scale; // screen position of the focus point before zoom
    const sy = anchorY + (fy - srcY) * scale;
    const s2 = scale * lerp(1, portrait ? ZOOM_MAX_PORTRAIT : ZOOM_MAX, k);
    // slide the focus point toward the screen centre while zooming so the screen ends up filling the view
    const tx = lerp(sx, w / 2, k), ty = lerp(sy, h * 0.46, k);
    return { x: tx - fx * s2, y: ty - fy * s2, w: FRAME_W * s2, h: FRAME_H * s2, scale: s2, feather: 0 };
  }
  return { x: anchorX - srcX * scale, y: anchorY - srcY * scale, w: FRAME_W * scale, h: FRAME_H * scale, scale, feather };
}

export function drawFrame(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number, pl: Placement, dpr: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cw, ch);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, pl.x, pl.y, pl.w, pl.h);
  if (pl.feather > 0.5) {
    // soften the top/bottom edges where a portrait screen shows the frame letterboxed
    ctx.globalCompositeOperation = "destination-out";
    const top = ctx.createLinearGradient(0, pl.y, 0, pl.y + pl.feather);
    top.addColorStop(0, "rgba(0,0,0,1)"); top.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = top; ctx.fillRect(0, pl.y, cw / dpr, pl.feather);
    const by = pl.y + pl.h;
    const bot = ctx.createLinearGradient(0, by - pl.feather, 0, by);
    bot.addColorStop(0, "rgba(0,0,0,0)"); bot.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = bot; ctx.fillRect(0, by - pl.feather, cw / dpr, pl.feather);
    ctx.globalCompositeOperation = "source-over";
  }
}
