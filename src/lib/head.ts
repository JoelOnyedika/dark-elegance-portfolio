import { shuffleInPlace } from "./util";

/**
 * Procedural bust made of points: a sculpted head (nose, brows, eye sockets, cheekbones,
 * lips, chin, ears), a neck and shoulders. No model file needed, so the bundle stays tiny.
 */
const g = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) =>
  Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
const sstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Depth added to the front of the face at (x, y) relative to head centre.
function faceDepth(x: number, y: number) {
  const nose = 0.36 * g(x, y, 0, -0.03, 0.065, 0.21) + 0.15 * g(x, y, 0, -0.22, 0.12, 0.07);
  const brow = 0.12 * g(x, y, 0, 0.22, 0.36, 0.05);
  const eyes = -0.15 * (g(x, y, -0.22, 0.12, 0.11, 0.055) + g(x, y, 0.22, 0.12, 0.11, 0.055));
  const cheeks = 0.09 * (g(x, y, -0.37, -0.12, 0.12, 0.12) + g(x, y, 0.37, -0.12, 0.12, 0.12));
  const lips = 0.09 * g(x, y, 0, -0.37, 0.17, 0.032) - 0.08 * g(x, y, 0, -0.455, 0.15, 0.026) - 0.06 * g(x, y, 0, -0.335, 0.2, 0.012);
  const chin = 0.11 * g(x, y, 0, -0.64, 0.15, 0.1);
  const temples = -0.05 * (g(x, y, -0.5, 0.15, 0.1, 0.2) + g(x, y, 0.5, 0.15, 0.1, 0.2));
  return nose + brow + eyes + cheeks + lips + chin + temples;
}

/** Bare head shape (no facial relief) for a unit direction. Shared with the solid occluder mesh. */
export function headBase(dx: number, dy: number, dz: number): [number, number, number] {
  const hy = dy * 0.8;
  const jaw = Math.pow(sstep(-0.05, -0.8, hy), 1.4);
  return [dx * 0.6 * (1 - 0.24 * jaw), hy, dz * 0.7 * (1 - 0.12 * jaw)];
}
export const HEAD_Y = 0.35;

export function buildHeadCloud(count: number) {
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const rnd = new Float32Array(count * 4);
  const ao = new Float32Array(count); // baked ambient occlusion: eye sockets, nostrils, mouth, under the jaw
  let seed = 1337;
  const r = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let i = 0;
  const push = (x: number, y: number, z: number, nx: number, ny: number, nz: number, occ = 0) => {
    ao[i] = occ;
    const l = Math.hypot(nx, ny, nz) || 1;
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    nor[i * 3] = nx / l; nor[i * 3 + 1] = ny / l; nor[i * 3 + 2] = nz / l;
    rnd[i * 4] = r(); rnd[i * 4 + 1] = r(); rnd[i * 4 + 2] = r(); rnd[i * 4 + 3] = r();
    i++;
  };

  const nHead = Math.floor(count * 0.6);
  const nNeck = Math.floor(count * 0.08);
  const nShoulder = count - nHead - nNeck;
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Head
  for (let k = 0; k < nHead; k++) {
    const dy = 1 - (2 * (k + 0.5)) / nHead;
    const rr = Math.sqrt(1 - dy * dy);
    const th = golden * k;
    const dx = Math.cos(th) * rr;
    const dz = Math.sin(th) * rr;
    let [x, hy, z] = headBase(dx, dy, dz);
    const front = sstep(0.0, 0.55, dz);
    z += front * faceDepth(x, hy);
    const ear = sstep(0.44, 0.6, Math.abs(x)) * g(z, hy, 0, -0.02, 0.2, 0.15);
    x += Math.sign(x) * 0.045 * ear;
    // numeric gradient so the feature relief catches the light
    const e = 0.012;
    const dHx = (faceDepth(x + e, hy) - faceDepth(x - e, hy)) / (2 * e);
    const dHy = (faceDepth(x, hy + e) - faceDepth(x, hy - e)) / (2 * e);
    const eye = g(x, hy, -0.22, 0.12, 0.12, 0.06) + g(x, hy, 0.22, 0.12, 0.12, 0.06);
    const nostril = g(x, hy, -0.075, -0.22, 0.045, 0.03) + g(x, hy, 0.075, -0.22, 0.045, 0.03);
    const mouth = g(x, hy, 0, -0.455, 0.15, 0.024) + 0.7 * g(x, hy, 0, -0.335, 0.2, 0.012);
    const under = 0.55 * sstep(-0.45, -0.9, dy) * (dz > -0.3 ? 1 : 0);
    const occ = Math.min(0.93, front * (0.9 * eye + 0.85 * nostril + 0.9 * mouth) + under);
    push(x, hy + HEAD_Y, z, dx - front * dHx * 2.4, dy - front * dHy * 2.4, dz + 0.4 * front, occ);
  }

  // Neck
  for (let k = 0; k < nNeck; k++) {
    const a = r() * Math.PI * 2;
    const t = r();
    const y = -0.38 - t * 0.7;
    const flare = 1 + 0.35 * t * t;
    push(Math.cos(a) * 0.27 * flare, y, Math.sin(a) * 0.3 * flare + 0.04, Math.cos(a), 0, Math.sin(a), 0.7 * (1 - t) * (1 - t));
  }

  // Shoulders / chest (upper part of a wide ellipsoid)
  let made = 0;
  const total = Math.floor(nShoulder * 2.2);
  for (let k = 0; k < total && made < nShoulder; k++) {
    const dy = 1 - (2 * (k + 0.5)) / total;
    if (dy < -0.12) continue;
    const rr = Math.sqrt(1 - dy * dy);
    const th = golden * k;
    const dx = Math.cos(th) * rr;
    const dz = Math.sin(th) * rr;
    const trap = g(dx * 1.5, 0, 0, 0, 0.55, 1) * Math.max(0, dy) * 0.3;
    push(dx * 1.5, -1.62 + dy * 0.7 + trap, dz * 0.62 - 0.08, dx * 0.7, dy, dz);
    made++;
  }
  while (i < count) push(0, -1.7, 0, 0, 1, 0);

  shuffleInPlace(pos, nor, rnd, ao, count);
  return { pos, nor, rnd, ao };
}
