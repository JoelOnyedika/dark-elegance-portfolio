/** Fisher–Yates over several parallel typed arrays (so draw-range culling removes points evenly). */
export function shuffleInPlace(pos: Float32Array, nor: Float32Array, rnd: Float32Array, ao: Float32Array, n: number) {
  let s = 99991;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    for (let k = 0; k < 3; k++) {
      let t = pos[i * 3 + k]; pos[i * 3 + k] = pos[j * 3 + k]; pos[j * 3 + k] = t;
      t = nor[i * 3 + k]; nor[i * 3 + k] = nor[j * 3 + k]; nor[j * 3 + k] = t;
    }
    { const t = ao[i]; ao[i] = ao[j]; ao[j] = t; }
    for (let k = 0; k < 4; k++) {
      const t = rnd[i * 4 + k]; rnd[i * 4 + k] = rnd[j * 4 + k]; rnd[j * 4 + k] = t;
    }
  }
}
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (t: number) => { t = clamp01(t); return t * t * (3 - 2 * t); };
