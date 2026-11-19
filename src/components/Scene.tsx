import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, reduced, coarse } from "@/lib/motion";
import { lerp, smooth, clamp01 } from "@/lib/util";
import { PROJECTS } from "@/lib/data";

/**
 * Concept: an embedding space. Three clusters (web, AI, backend) float in a cloud of points.
 * Scrolling is a query: the camera flies through the cloud, each chapter "retrieves" its
 * cluster (points contract and light up, nearest neighbours connect) and the projects are
 * 3D nodes you arrive at one by one.
 */
const CENTERS = [new THREE.Vector3(-6.5, 2, -5), new THREE.Vector3(6.5, -1.5, -9), new THREE.Vector3(-1, -4.5, -14)];
const NODES = [new THREE.Vector3(4, 0.5, -21), new THREE.Vector3(-4, 1, -27), new THREE.Vector3(3.5, -1, -33)];
const SHIFT = 3.4;

type KF = { cam: THREE.Vector3; look: THREE.Vector3; w: number; off: number };
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const VERT = /* glsl */ `
  uniform float uTime, uSize, uPR, uPull, uMouse, uIntro;
  uniform vec3 uW, uC0, uC1, uC2, uRayO, uRayD;
  attribute float aCl;
  attribute vec4 aRand;
  varying float vW;
  varying float vAlpha;

  float wOf(float c) { return c < 0.5 ? uW.x : (c < 1.5 ? uW.y : uW.z); }
  vec3 cOf(float c) { return c < 0.5 ? uC0 : (c < 1.5 ? uC1 : uC2); }

  void main() {
    vec3 p = position;
    float w = 0.0;
    if (aCl > -0.5) {
      w = wOf(aCl);
      vec3 cc = cOf(aCl);
      p = mix(p, cc + (p - cc) * 0.6, w * uPull);
    }
    p += vec3(sin(uTime * 0.4 + aRand.x * 6.28), cos(uTime * 0.37 + aRand.y * 6.28), sin(uTime * 0.31 + aRand.z * 6.28)) * 0.06;
    // intro: points arrive from a wide scatter
    p = mix(p * 2.2 + (aRand.xyz - 0.5) * 6.0, p, uIntro);
    vec3 wp = (modelMatrix * vec4(p, 1.0)).xyz;

    vec3 ap = wp - uRayO;
    vec3 diff = wp - (uRayO + uRayD * dot(ap, uRayD));
    float dist = length(diff);
    float f = smoothstep(2.2, 0.0, dist) * uMouse;
    wp += diff / max(dist, 0.0001) * f * 0.9;

    vec4 mv = viewMatrix * vec4(wp, 1.0);
    gl_Position = projectionMatrix * mv;
    float d = length(mv.xyz);
    gl_PointSize = uSize * uPR * (0.7 + aRand.w * 0.7) * (1.0 + w * 0.8 + f * 0.6) / d;
    vW = w + f * 0.6;
    vAlpha = (0.5 + 0.5 * w) * clamp(1.5 - d / 40.0, 0.12, 1.0);
  }
`;
const FRAG = /* glsl */ `
  varying float vW;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 base = vec3(0.60, 0.65, 0.72);
    vec3 acc = vec3(1.0, 0.42, 0.21);
    gl_FragColor = vec4(mix(base, acc, clamp(vW, 0.0, 1.0)), vAlpha * smoothstep(0.5, 0.15, d));
  }
`;
const EDGE_VERT = /* glsl */ `
  uniform float uTime, uPull, uIntro;
  uniform vec3 uW, uC0, uC1, uC2;
  attribute float aCl;
  varying float vA;
  float wOf(float c) { return c < 0.5 ? uW.x : (c < 1.5 ? uW.y : uW.z); }
  vec3 cOf(float c) { return c < 0.5 ? uC0 : (c < 1.5 ? uC1 : uC2); }
  void main() {
    float w = wOf(aCl);
    vec3 cc = cOf(aCl);
    vec3 p = mix(position, cc + (position - cc) * 0.6, w * uPull);
    p = mix(p * 2.2, p, uIntro);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vA = w * w * 0.5 * clamp(1.5 - length(mv.xyz) / 40.0, 0.1, 1.0) * uIntro;
  }
`;
const EDGE_FRAG = /* glsl */ `
  varying float vA;
  void main() { gl_FragColor = vec4(1.0, 0.42, 0.21, vA); }
`;

function randn() { return (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 1.2; }

export default function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) { document.documentElement.classList.add("no-webgl"); return; }
    const canvas = ref.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch { document.documentElement.classList.add("no-webgl"); return; }

    const mobile = window.innerWidth < 768 || coarse;
    const cores = navigator.hardwareConcurrency || 4;
    const N = mobile ? 4500 : cores <= 4 ? 7000 : 10000;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);

    // --- the embedding cloud: three clusters plus scattered noise
    const pos = new Float32Array(N * 3), cl = new Float32Array(N), rnd = new Float32Array(N * 4);
    const members: number[][] = [[], [], []];
    for (let i = 0; i < N; i++) {
      const r = Math.random();
      let c = -1;
      if (r < 0.62) c = Math.floor(((r / 0.62) * 3) % 3);
      if (c >= 0) {
        const C = CENTERS[c];
        pos.set([C.x + randn() * 2.3, C.y + randn() * 1.9, C.z + randn() * 2.3], i * 3);
        members[c].push(i);
      } else {
        pos.set([(Math.random() - 0.5) * 34, (Math.random() - 0.5) * 18, 16 - Math.random() * 58], i * 3);
      }
      cl[i] = c; rnd.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aCl", new THREE.BufferAttribute(cl, 1));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 4));

    const U = {
      uTime: { value: 0 }, uSize: { value: 52 }, uPR: { value: dpr }, uPull: { value: 1 }, uMouse: { value: 0 }, uIntro: { value: reduced ? 1 : 0 },
      uW: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
      uC0: { value: CENTERS[0] }, uC1: { value: CENTERS[1] }, uC2: { value: CENTERS[2] },
      uRayO: { value: new THREE.Vector3() }, uRayD: { value: new THREE.Vector3(0, 0, -1) },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: U, transparent: true, depthWrite: false });
    const cloud = new THREE.Points(geo, mat);
    cloud.frustumCulled = false;
    scene.add(cloud);

    // --- nearest-neighbour edges inside each cluster
    const ev: number[] = [], ec: number[] = [];
    members.forEach((m, c) => {
      const sub = m.slice(0, mobile ? 40 : 70);
      sub.forEach((a) => {
        const d = sub.filter((b) => b !== a).map((b) => {
          const dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
          return { b, d: dx * dx + dy * dy + dz * dz };
        }).sort((x, y) => x.d - y.d).slice(0, 3);
        d.forEach(({ b }) => { ev.push(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2], pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]); ec.push(c, c); });
      });
    });
    const eg = new THREE.BufferGeometry();
    eg.setAttribute("position", new THREE.Float32BufferAttribute(ev, 3));
    eg.setAttribute("aCl", new THREE.Float32BufferAttribute(ec, 1));
    const em = new THREE.ShaderMaterial({ vertexShader: EDGE_VERT, fragmentShader: EDGE_FRAG, uniforms: U, transparent: true, depthWrite: false });
    const edges = new THREE.LineSegments(eg, em);
    edges.frustumCulled = false;
    scene.add(edges);

    // --- one real 3D node per project, with a ring of retrieved chunks around it
    const shapes = [new THREE.IcosahedronGeometry(1.35, 0), new THREE.OctahedronGeometry(1.6, 0), new THREE.DodecahedronGeometry(1.35, 0)];
    const accent = new THREE.Color(1.0, 0.42, 0.21);
    const nodes = PROJECTS.map((_, i) => {
      const g = new THREE.Group();
      g.position.copy(NODES[i]);
      const lineMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.2 });
      const body = new THREE.Mesh(shapes[i % 3], new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.05, depthWrite: false }));
      const wire = new THREE.LineSegments(new THREE.EdgesGeometry(shapes[i % 3]), lineMat);
      const orbitPts: number[] = [];
      for (let k = 0; k < 70; k++) {
        const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1), r = 2 + Math.random() * 0.9;
        orbitPts.push(r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a) * 0.7, r * Math.cos(b));
      }
      const og = new THREE.BufferGeometry(); og.setAttribute("position", new THREE.Float32BufferAttribute(orbitPts, 3));
      const om = new THREE.PointsMaterial({ color: accent, size: 0.07, transparent: true, opacity: 0.3, depthWrite: false });
      const orbit = new THREE.Points(og, om);
      g.add(body, wire, orbit); scene.add(g);
      return { g, lineMat, om, bodyMat: body.material as THREE.MeshBasicMaterial, orbit, wire };
    });

    // --- camera path: one keyframe per chapter, projects get one each
    const n = PROJECTS.length;
    const kfs: KF[] = [
      { cam: v(0, 0.8, 14), look: v(0, 0, -8), w: 0.5, off: 0 },
      { cam: v(0, 0.6, 4), look: v(0, 0, -10), w: 0.7, off: 0 },
      { cam: v(-1, -1.5, -3), look: v(-1, -3, -14), w: 1, off: 0 },
      ...NODES.slice(0, n).map((P) => ({ cam: v(P.x, P.y + 0.4, P.z + 10.5), look: v(P.x, P.y, P.z), w: 0.35, off: 1 })),
      { cam: v(0, 1.5, 18), look: v(0, 0, -12), w: 1, off: 1 },
    ];
    const camCurve = new THREE.CatmullRomCurve3(kfs.map((k) => k.cam), false, "catmullrom", 0.4);
    const lookCurve = new THREE.CatmullRomCurve3(kfs.map((k) => k.look), false, "catmullrom", 0.4);
    const LAST = kfs.length - 1;

    let W = 1, H = 1, aspect = 1;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight; aspect = W / H;
      renderer.setSize(W, H, false);
      camera.aspect = aspect; camera.fov = aspect < 1 ? 52 : 38; camera.updateProjectionMatrix();
      U.uSize.value = 52 * (H / 1000);
    };
    resize();
    window.addEventListener("resize", resize);

    // scroll position -> flight parameter s (0..LAST), measured from the DOM
    let marks: [number, number][] = [];
    const measure = () => {
      const mid = (id: string) => { const r = document.getElementById(id)!.getBoundingClientRect(); return r.top + scrollY + r.height / 2; };
      const wk = document.getElementById("work")!.getBoundingClientRect();
      const wTop = wk.top + scrollY, wEnd = wTop + wk.height - H;
      marks = [[mid("home"), 0], [mid("about"), 1], [mid("stack"), 2], [wTop, 3], [Math.max(wEnd, wTop + 1), 2 + n], [mid("contact"), LAST]];
    };
    const ro = new ResizeObserver(measure); ro.observe(document.body);
    setTimeout(measure, 400);
    const sAt = (y: number) => {
      if (!marks.length) return 0;
      if (y <= marks[0][0]) return 0;
      for (let i = 0; i < marks.length - 1; i++) {
        const [y0, s0] = marks[i], [y1, s1] = marks[i + 1];
        if (y <= y1) { const t = (y - y0) / (y1 - y0); return lerp(s0, s1, i === 3 ? t : smooth(t)); }
      }
      return LAST;
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0 };
    const onMove = (e: PointerEvent) => { mouse.tx = (e.clientX / W) * 2 - 1; mouse.ty = -((e.clientY / H) * 2 - 1); mouse.ta = e.pointerType === "mouse" ? 1 : 0; };
    const onLeave = () => (mouse.ta = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const intro = { t: 0 };
    const startIntro = () => gsap.to(intro, { t: 1, duration: 2.2, ease: "power3.out" });
    window.addEventListener("preloader:done", startIntro, { once: true });

    let sCur = 0, wCur = 0.5;
    const camP = new THREE.Vector3(), lookP = new THREE.Vector3(), tmp = new THREE.Vector3();
    let ema = 1 / 60, slow = 0, frac = 1;

    const tick = (time: number, dtMs: number) => {
      const dt = Math.min(dtMs / 1000, 0.05);
      const sT = sAt(scrollY + H * 0.5);
      sCur = lerp(sCur, sT, 1 - Math.exp(-dt * 4.2));
      const u = clamp01(sCur / LAST);
      camCurve.getPoint(u, camP); lookCurve.getPoint(u, lookP);
      // interpolate chapter attributes by keyframe index
      const i0 = Math.min(LAST - 1, Math.floor(sCur)), f = sCur - i0;
      const off = lerp(kfs[i0].off, kfs[i0 + 1].off, smooth(f));
      const wT = lerp(kfs[i0].w, kfs[i0 + 1].w, smooth(f));
      wCur = lerp(wCur, wT, 1 - Math.exp(-dt * 3));
      U.uW.value.set(wCur, wCur, wCur);
      // desktop: project sits right of centre; phones: sits above the text panel
      if (aspect >= 1) lookP.x -= SHIFT * off; else lookP.y -= 1.9 * off;
      mouse.x = lerp(mouse.x, mouse.tx, 1 - Math.exp(-dt * 6)); mouse.y = lerp(mouse.y, mouse.ty, 1 - Math.exp(-dt * 6)); mouse.a = lerp(mouse.a, mouse.ta, 1 - Math.exp(-dt * 5));
      camera.position.set(camP.x + mouse.x * 0.35, camP.y + mouse.y * 0.25, camP.z);
      camera.lookAt(lookP); camera.updateMatrixWorld();

      cloud.rotation.y = time * 0.006; cloud.updateMatrixWorld();
      edges.rotation.y = cloud.rotation.y; edges.updateMatrixWorld();
      tmp.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      U.uRayO.value.copy(camera.position); U.uRayD.value.copy(tmp);
      U.uMouse.value = mouse.a; U.uTime.value = time; U.uIntro.value = reduced ? 1 : intro.t;

      nodes.forEach((nd, i) => {
        const near = clamp01(1 - Math.abs(sCur - (3 + i)) * 0.9);
        nd.g.rotation.y = time * 0.18 + i; nd.g.rotation.x = time * 0.09;
        nd.orbit.rotation.y = -time * 0.25;
        nd.lineMat.opacity = (0.22 + near * 0.78) * intro.t; nd.om.opacity = (0.25 + near * 0.65) * intro.t; nd.bodyMat.opacity = (0.02 + near * 0.12) * intro.t;
        nd.g.scale.setScalar(0.85 + near * 0.15);
      });
      renderer.render(scene, camera);

      ema = lerp(ema, dt, 0.05);
      if (ema > 0.026) slow++; else slow = Math.max(0, slow - 2);
      if (slow > 120 && frac > 0.5) {
        slow = 0; frac -= 0.2; geo.setDrawRange(0, Math.floor(N * frac));
        if (dpr > 1) { dpr = 1; renderer.setPixelRatio(1); U.uPR.value = 1; resize(); }
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave); window.removeEventListener("preloader:done", startIntro);
      ro.disconnect(); geo.dispose(); eg.dispose(); mat.dispose(); em.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
