import { clamp, lerp, smoothstep } from "./motion";

export const FRAME_COUNT = 238;
export const FRAME_W = 1920;
export const FRAME_H = 1080;
/** Share of the opening's scroll used to play frames; the rest is the final zoom into the screen. */
export const P_FRAMES = 0.72;
const ZOOM_MAX = 2.15;
const ZOOM_MAX_PORTRAIT = 1.6; // portrait is already cropped in; less upscaling of the 1280px source
/** Focal point (fraction of frame) the final zoom travels toward: the middle of the laptop screen. */
const FOCUS = { x: 0.5, y: 0.4 };

/** Blur (px) applied at the end of the zoom, to hide upscaling artefacts; the environment still uses the same value. */
export const endBlur = (w: number, h: number) => (w / h < 0.9 ? 1.1 : 0.7);

/** Phones and portrait screens get lighter frames (about a quarter of the weight); everything else gets the full set. */
const lite = () => typeof window !== "undefined" && (innerWidth < 760 || innerWidth / innerHeight < 0.9);
export const frameUrl = (i: number, small = lite()) => `/frames/${small ? "m/" : ""}f${String(i + 1).padStart(3, "0")}.webp`;

export const ENV_URL = "/frames/env.webp";
export const store: { frames: (HTMLImageElement | undefined)[]; env?: HTMLImageElement; listeners: Set<(i: number) => void> } = { frames: [], env: undefined, listeners: new Set() };

/** Every STRIDE-th frame gates the entrance; the rest stream in behind the scenes while the visitor reads the hero. */
const STRIDE = 6;
export const GATE_FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => i).filter((i) => i % STRIDE === 0 || i === FRAME_COUNT - 1);
export const GATE_TOTAL = GATE_FRAMES.length + 1; // + the cloud still

/** Nearest loaded frame to idx (exact one if it has arrived). */
export function frameAt(idx: number) {
  const f = store.frames;
  if (f[idx]) return f[idx];
  for (let d = 1; d < FRAME_COUNT; d++) {
    const a = f[idx - d] ?? f[idx + d];
    if (a) return a;
  }
  return undefined;
}

export function loadImage(src: string, retries = 2): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => (retries > 0 ? resolve(loadImage(src, retries - 1)) : resolve(undefined));
    img.src = src;
  });
}

async function pool(list: number[], concurrency: number, each: (i: number) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < list.length) await each(list[next++]);
  }));
}

/**
 * Loads the cloud still, then a coarse pass of frames (every 6th). Resolves as soon as that pass is in, so the
 * site opens after a fraction of the weight. The remaining frames keep loading in the background and the
 * opening upgrades to them as they arrive. Progress counts only what the entrance actually waits for.
 */
export async function preloadFrames(onProgress: (loaded: number) => void, concurrency = 10, onEnv?: (img: HTMLImageElement) => void) {
  const env = await loadImage(ENV_URL);
  if (env) { await env.decode?.().catch(() => undefined); store.env = env; onEnv?.(env); }
  onProgress(1);
  store.frames = new Array(FRAME_COUNT);
  let done = 1;
  const fetchOne = async (i: number) => {
    const img = await loadImage(frameUrl(i));
    if (img) { await img.decode?.().catch(() => undefined); store.frames[i] = img; store.listeners.forEach((fn) => fn(i)); }
  };
  await pool(GATE_FRAMES, concurrency, async (i) => { await fetchOne(i); onProgress(++done); });
  // the rest, middle first then everything else, without blocking the entrance
  const gate = new Set(GATE_FRAMES);
  const rest = Array.from({ length: FRAME_COUNT }, (_, i) => i).filter((i) => !gate.has(i));
  const pass2 = rest.filter((i) => i % 3 === 0), pass3 = rest.filter((i) => i % 3 !== 0);
  void pool(pass2, 6, fetchOne).then(() => pool(pass3, 6, fetchOne));
  return store.frames;
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
    anchorY = h * lerp(0.47, 0.5, smoothstep(0, 0.2, p)); // starts high, leaving room for the type below
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

const mk = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
let tiny: HTMLCanvasElement | undefined, mid: HTMLCanvasElement | undefined, layer: HTMLCanvasElement | undefined;

/**
 * Draws a frame. Where it doesn't reach the viewport edges (portrait phones), the gap is filled with
 * the SAME frame shrunk to a few pixels and stretched, so the extension is always colour-matched.
 */
export function drawFrame(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number, pl: Placement, dpr: number) {
  const vw = cw / dpr, vh = ch / dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cw, ch);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const covers = pl.x <= 0.5 && pl.y <= 0.5 && pl.x + pl.w >= vw - 0.5 && pl.y + pl.h >= vh - 0.5;
  if (!covers) {
    tiny ||= mk(24, 14); mid ||= mk(96, 54);
    tiny.getContext("2d")!.drawImage(img, 0, 0, 24, 14);
    const m = mid.getContext("2d")!; m.imageSmoothingQuality = "high"; m.drawImage(tiny, 0, 0, 96, 54);
    const sc = Math.max(vw / 96, vh / 54);
    try { ctx.filter = "blur(10px)"; } catch { /* older Safari: bilinear stretch is soft enough */ }
    ctx.drawImage(mid, (vw - 96 * sc) / 2 - 12, (vh - 54 * sc) / 2 - 12, 96 * sc + 24, 54 * sc + 24);
    ctx.filter = "none";
    ctx.fillStyle = "rgba(4,8,26,0.5)";
    ctx.fillRect(0, 0, vw, vh);
  }
  if (!covers && pl.feather > 0.5) {
    if (!layer || layer.width !== cw || layer.height !== ch) layer = mk(cw, ch);
    const l = layer.getContext("2d")!;
    l.setTransform(1, 0, 0, 1, 0, 0); l.clearRect(0, 0, cw, ch);
    l.setTransform(dpr, 0, 0, dpr, 0, 0); l.imageSmoothingQuality = "high";
    l.drawImage(img, pl.x, pl.y, pl.w, pl.h);
    l.globalCompositeOperation = "destination-out";
    const top = l.createLinearGradient(0, pl.y, 0, pl.y + pl.feather);
    top.addColorStop(0, "rgba(0,0,0,1)"); top.addColorStop(1, "rgba(0,0,0,0)");
    l.fillStyle = top; l.fillRect(0, pl.y, vw, pl.feather);
    const by = pl.y + pl.h;
    const bot = l.createLinearGradient(0, by - pl.feather, 0, by);
    bot.addColorStop(0, "rgba(0,0,0,0)"); bot.addColorStop(1, "rgba(0,0,0,1)");
    l.fillStyle = bot; l.fillRect(0, by - pl.feather, vw, pl.feather);
    l.globalCompositeOperation = "source-over";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(layer, 0, 0);
  } else {
    ctx.drawImage(img, pl.x, pl.y, pl.w, pl.h);
  }
}
