import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, reduced, coarse } from "@/lib/motion";
import { buildHeadCloud, headBase, HEAD_Y } from "@/lib/head";
import { lerp, smooth } from "@/lib/util";

type Stage = { cam: [number, number, number]; look: [number, number, number]; disperse: number; rot: number };

// One camera/particle "pose" per section. The scene blends between them as you scroll.
const STAGES: Record<string, Stage> = {
  home: { cam: [0, 0.05, 5.4], look: [0, -0.15, 0], disperse: 0, rot: 0 },
  about: { cam: [1.2, 0.2, 2.6], look: [1.05, 0.2, 0], disperse: 0, rot: 0.4 },
  services: { cam: [-1.5, 0.15, 3.7], look: [-1.35, 0.15, 0], disperse: 0, rot: -0.4 },
  skills: { cam: [0, 0, 6.4], look: [0, 0, 0], disperse: 0.92, rot: 0.9 },
  work: { cam: [0, 0, 6.8], look: [0, 0, 0], disperse: 1, rot: 1.4 },
  voices: { cam: [0, 0, 6.2], look: [0, 0, 0], disperse: 1, rot: 2.0 },
  contact: { cam: [1.0, 0.2, 4.2], look: [0.95, 0.05, 0], disperse: 0, rot: 0.15 },
};
const ORDER = Object.keys(STAGES);

const VERT = /* glsl */ `
  uniform float uTime, uDisperse, uSize, uPR, uPulse;
  uniform vec3 uRayO, uRayD, uPulseO, uPulseD;
  uniform float uMouse;
  attribute vec3 aNormal;
  attribute vec4 aRand;
  attribute float aAO;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.9 + aRand.x * 6.283) * 0.006;
    p += aNormal * sin(uTime * 1.3 + aRand.y * 6.283) * 0.004;

    // dust form: a slowly drifting cloud, staggered per particle so the head "melts" rather than pops
    vec3 dust = (aRand.xyz - 0.5) * vec3(10.0, 6.5, 6.0);
    dust += vec3(
      sin(uTime * 0.21 + aRand.w * 24.0),
      cos(uTime * 0.26 + aRand.x * 19.0),
      sin(uTime * 0.18 + aRand.y * 15.0)) * 0.45;
    float d = smoothstep(0.0, 1.0, clamp(uDisperse * 1.5 - aRand.w * 0.5, 0.0, 1.0));
    p = mix(p, dust, d);

    vec3 w = (modelMatrix * vec4(p, 1.0)).xyz;

    // mouse: points are pushed away from the cursor ray
    vec3 ap = w - uRayO;
    vec3 cl = uRayO + uRayD * dot(ap, uRayD);
    vec3 diff = w - cl;
    float dist = length(diff);
    float f = smoothstep(0.62, 0.0, dist) * uMouse;
    vec3 dir = diff / max(dist, 0.0001);
    w += dir * f * (0.34 + aRand.z * 0.3) + uRayD * f * 0.28;
    w += (aRand.xyz - 0.5) * f * 0.18;

    // click ripple
    vec3 pa = w - uPulseO;
    float pd = length(pa - uPulseD * dot(pa, uPulseD));
    float ring = smoothstep(0.25, 0.0, abs(pd - (1.0 - uPulse) * 2.4)) * uPulse;
    w += normalize(pa - uPulseD * dot(pa, uPulseD) + 0.0001) * ring * 0.35;

    vec4 mv = viewMatrix * vec4(w, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPR * (0.78 + aRand.z * 0.45) / -mv.z * (1.0 + f * 0.9 + ring * 1.2);

    // shading: lavender lit from upper-front, lime bleed toward the shoulders
    vec3 n = normalize((modelMatrix * vec4(aNormal, 0.0)).xyz);
    float diffuse = max(dot(n, normalize(vec3(-0.45, 0.55, 0.75))), 0.0);
    float rim = pow(1.0 - max(dot(n, normalize(uRayO - w)), 0.0), 2.5);
    vec3 lav = vec3(0.79, 0.72, 1.0);
    vec3 lime = vec3(0.89, 0.94, 0.24);
    vec3 base = mix(lav, lime, smoothstep(-0.7, -1.9, position.y) * (1.0 - d));
    vec3 dustCol = mix(vec3(0.55, 0.5, 0.85), vec3(0.95, 0.95, 1.0), aRand.x);
    vColor = mix(base * (0.34 + 1.1 * diffuse * diffuse + rim * 0.5) * (1.0 - aAO * 0.85), dustCol, d * 0.85);
    vColor += f * vec3(0.5, 0.45, 0.2);
    float twinkle = 0.65 + 0.35 * sin(uTime * 2.0 + aRand.w * 60.0);
    vAlpha = mix(0.95, 0.35 + 0.5 * twinkle * aRand.x, d);
  }
`;
const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.18, d));
  }
`;

export default function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      document.documentElement.classList.add("no-webgl");
      return;
    }

    // Budget: tuned for integrated GPUs, scaled up on strong desktops, adaptive at runtime.
    const mobile = window.innerWidth < 768 || coarse;
    const cores = navigator.hardwareConcurrency || 4;
    const COUNT = mobile ? 28000 : cores <= 4 ? 40000 : 56000;
    let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.5);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    const { pos, nor, rnd, ao } = buildHeadCloud(COUNT);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aNormal", new THREE.BufferAttribute(nor, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 4));
    geo.setAttribute("aAO", new THREE.BufferAttribute(ao, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20); // dust cloud extends past the head

    const uniforms = {
      uTime: { value: 0 }, uDisperse: { value: 1 }, uSize: { value: 22 }, uPR: { value: dpr },
      uMouse: { value: 0 }, uPulse: { value: 0 },
      uRayO: { value: new THREE.Vector3() }, uRayD: { value: new THREE.Vector3(0, 0, -1) },
      uPulseO: { value: new THREE.Vector3() }, uPulseD: { value: new THREE.Vector3(0, 0, -1) },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;

    // Solid, slightly smaller "clay" body inside the dots so the hero type doesn't show through the face.
    const occMat = new THREE.MeshBasicMaterial({ color: 0x0b0914, transparent: true, depthWrite: false, depthTest: false });
    const headGeo = new THREE.SphereGeometry(1, 48, 32);
    const hp = headGeo.attributes.position;
    for (let i = 0; i < hp.count; i++) {
      const [x, y, z] = headBase(hp.getX(i), hp.getY(i), hp.getZ(i));
      hp.setXYZ(i, x * 0.93, y * 0.93 + HEAD_Y, z * 0.93);
    }
    headGeo.computeVertexNormals();
    const neckGeo = new THREE.CylinderGeometry(0.235, 0.3, 0.9, 24, 1, true);
    neckGeo.translate(0, -0.78, 0.04);
    const shGeo = new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.56);
    shGeo.scale(1.4, 0.65, 0.56); shGeo.translate(0, -1.62, -0.08);
    const occluder = new THREE.Group();
    [headGeo, neckGeo, shGeo].forEach((g) => { const m = new THREE.Mesh(g, occMat); m.renderOrder = -1; m.frustumCulled = false; occluder.add(m); });
    const rig = new THREE.Group();
    rig.add(occluder, points);
    scene.add(rig);

    let W = 1, H = 1, aspect = 1;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight; aspect = W / H;
      renderer.setSize(W, H, false);
      camera.aspect = aspect; camera.updateProjectionMatrix();
      uniforms.uSize.value = 22 * (H / 1000);
    };
    resize();
    window.addEventListener("resize", resize);

    // Section centres, measured from the DOM so the scene follows the real layout.
    let centres: { id: string; y: number }[] = [];
    const measure = () => {
      centres = ORDER.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { id, y: r.top + window.scrollY + r.height / 2 };
      }).filter(Boolean) as { id: string; y: number }[];
    };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    setTimeout(measure, 300);

    const cur = { cx: 0, cy: 0.05, cz: 5.4, lx: 0, ly: -0.15, lz: 0, d: 1, rot: 0 };
    const tgt = { ...cur };
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: 0, tActive: 0 };
    const look = new THREE.Vector3();
    const tmp = new THREE.Vector3();

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / W) * 2 - 1;
      mouse.ty = -((e.clientY / H) * 2 - 1);
      mouse.tActive = e.pointerType === "mouse" ? 1 : 0.85;
    };
    const onLeave = () => (mouse.tActive = 0);
    const onDown = (e: PointerEvent) => {
      onMove(e);
      tmp.set(mouse.tx, mouse.ty, 0.5).unproject(camera).sub(camera.position).normalize();
      uniforms.uPulseO.value.copy(camera.position);
      uniforms.uPulseD.value.copy(tmp);
      uniforms.uPulse.value = 1;
      gsap.to(uniforms.uPulse, { value: 0, duration: 1.4, ease: "power2.out", overwrite: true });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    // Intro: dust gathers into the head once the preloader lifts.
    const intro = { t: reduced ? 1 : 0 };
    const startIntro = () => gsap.to(intro, { t: 1, duration: 2.6, ease: "power3.inOut" });
    window.addEventListener("preloader:done", startIntro, { once: true });

    const compute = () => {
      const y = window.scrollY + H * 0.5;
      let a = centres[0], b = centres[0], t = 0;
      if (centres.length) {
        if (y <= centres[0].y) { a = b = centres[0]; }
        else if (y >= centres[centres.length - 1].y) { a = b = centres[centres.length - 1]; }
        else {
          for (let i = 0; i < centres.length - 1; i++) {
            if (y >= centres[i].y && y < centres[i + 1].y) {
              a = centres[i]; b = centres[i + 1];
              t = smooth((y - a.y) / (b.y - a.y));
              break;
            }
          }
        }
      }
      const A = STAGES[a?.id ?? "home"], B = STAGES[b?.id ?? "home"];
      const zs = aspect < 1 ? 1 + (1 - aspect) * 1.0 : 1; // pull back on portrait screens
      const xs = aspect < 1 ? 0.35 : 1; // keep the head nearer centre on phones
      tgt.cx = lerp(A.cam[0], B.cam[0], t) * xs; tgt.cy = lerp(A.cam[1], B.cam[1], t); tgt.cz = lerp(A.cam[2], B.cam[2], t) * zs;
      tgt.lx = lerp(A.look[0], B.look[0], t) * xs; tgt.ly = lerp(A.look[1], B.look[1], t); tgt.lz = lerp(A.look[2], B.look[2], t);
      tgt.d = lerp(A.disperse, B.disperse, t);
      tgt.rot = lerp(A.rot, B.rot, t);
    };

    // Adaptive quality: if frames run long, shed particles and resolution.
    let ema = 1 / 60, slow = 0, drawFrac = 1;
    const tick = (time: number, dtMs: number) => {
      const dt = Math.min(dtMs / 1000, 0.05);
      compute();
      const k = 1 - Math.exp(-dt * (reduced ? 30 : 3.6));
      for (const key of Object.keys(tgt) as (keyof typeof tgt)[]) cur[key] = lerp(cur[key], tgt[key], k);
      mouse.x = lerp(mouse.x, mouse.tx, 1 - Math.exp(-dt * 7));
      mouse.y = lerp(mouse.y, mouse.ty, 1 - Math.exp(-dt * 7));
      mouse.active = lerp(mouse.active, mouse.tActive, 1 - Math.exp(-dt * 5));

      camera.position.set(cur.cx, cur.cy, cur.cz);
      look.set(cur.lx, cur.ly, cur.lz);
      camera.lookAt(look);
      camera.updateMatrixWorld();

      rig.rotation.y = cur.rot + mouse.x * 0.28;
      rig.rotation.x = -mouse.y * 0.12 + 0.02;
      rig.updateMatrixWorld(true);

      tmp.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      uniforms.uRayO.value.copy(camera.position);
      uniforms.uRayD.value.copy(tmp);
      uniforms.uMouse.value = mouse.active;
      const introE = intro.t;
      uniforms.uDisperse.value = lerp(1, cur.d, introE);
      occMat.opacity = Math.max(0, 1 - uniforms.uDisperse.value * 2.2) * 0.96;
      occluder.visible = occMat.opacity > 0.01;
      uniforms.uTime.value = time;

      renderer.render(scene, camera);

      ema = lerp(ema, dt, 0.05);
      if (ema > 0.026) slow++; else slow = Math.max(0, slow - 2);
      if (slow > 120 && drawFrac > 0.45) {
        slow = 0; drawFrac -= 0.18;
        geo.setDrawRange(0, Math.floor(COUNT * drawFrac));
        if (dpr > 1) { dpr = 1; renderer.setPixelRatio(1); uniforms.uPR.value = 1; resize(); }
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("preloader:done", startIntro);
      ro.disconnect();
      geo.dispose(); mat.dispose(); occMat.dispose(); headGeo.dispose(); neckGeo.dispose(); shGeo.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
