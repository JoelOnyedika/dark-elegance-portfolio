import { useEffect, useRef } from "react";
import { STATS } from "@/lib/data";
import { gsap, reduced } from "@/lib/motion";
import { Btn, Words } from "@/components/ui";

type Face = { a: number; n: number; p: number[]; b: number[] };

const WHITE: [number, number, number] = [244, 243, 241];
const RED: [number, number, number] = [255, 52, 64];
const TINTS = 4;
const LEVELS = 7;
const mix = (t: number) => WHITE.map((v, i) => Math.round(v + (RED[i] - v) * t)) as [number, number, number];

/**
 * A portrait traced into ~13k dots. The dots fly in from nowhere and assemble into the face,
 * react to the pointer, and the head turns slightly (yaw/pitch only, never rolls) as you move.
 */
function FaceDots({ entered }: { entered: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const start = useRef<number | null>(null);
  useEffect(() => {
    if (entered && start.current === null) start.current = performance.now();
  }, [entered]);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let dead = false, raf = 0, cleanup = () => undefined as void;
    fetch("/face.json").then((r) => r.json()).then((f: Face) => { if (!dead) cleanup = run(f); }).catch(() => undefined);

    function run(f: Face) {
      const mobile = innerWidth < 760;
      const n = mobile ? Math.floor(f.n * 0.55) : f.n; // points are pre-shuffled, so a prefix is an even, sparser face
      const tx = new Float32Array(n), ty = new Float32Array(n), tz = new Float32Array(n);
      const sx = new Float32Array(n), sy = new Float32Array(n), sz = new Float32Array(n);
      const dl = new Float32Array(n), ox = new Float32Array(n), oy = new Float32Array(n), bright = new Float32Array(n);
      const px = new Float32Array(n), py = new Float32Array(n), ps = new Float32Array(n);
      const lists: number[][] = Array.from({ length: TINTS * LEVELS + 1 }, () => []);
      for (let i = 0; i < n; i++) {
        tx[i] = f.p[i * 3] / 1000; ty[i] = f.p[i * 3 + 1] / 1000; tz[i] = f.p[i * 3 + 2] / 1000;
        const code = f.b[i], rim = code & 1, b = (code >> 1) / 255;
        bright[i] = b;
        const ang = Math.random() * Math.PI * 2, rad = 1.1 + Math.random() * 1.8;
        sx[i] = Math.cos(ang) * rad * 1.35; sy[i] = Math.sin(ang) * rad; sz[i] = -1 + Math.random() * 2.6;
        dl[i] = Math.random() * 0.55 + (1 - b) * 0.15;
        if (rim) lists[TINTS * LEVELS].push(i);
        else {
          const lvl = Math.min(LEVELS - 1, Math.floor(Math.pow(b, 1.1) * LEVELS));
          const tint = Math.min(TINTS - 1, Math.max(0, Math.round(Math.min(1, Math.max(0, (-ty[i] - 0.38) / 0.55)) * (TINTS - 1))));
          lists[tint * LEVELS + lvl].push(i);
        }
      }
      const buckets = lists.map((l) => Int32Array.from(l));

      let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, sc = 0;
      const fit = () => {
        dpr = Math.min(devicePixelRatio || 1, 2);
        w = c.clientWidth; h = c.clientHeight;
        c.width = w * dpr; c.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const small = w < 760;
        const H = small ? Math.min(h * 0.52, (w * 1.12) / f.a) : Math.min(h * 0.86, (w * 0.8) / f.a);
        sc = H / 2; cx = w / 2; cy = small ? h * 0.3 : h * 0.4;
      };
      fit();
      const mouse = { x: -9999, y: -9999, nx: 0, ny: 0 };
      const onMove = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        mouse.nx = Math.max(-1, Math.min(1, (mouse.x / w - 0.5) * 2));
        mouse.ny = Math.max(-1, Math.min(1, (mouse.y / h - 0.5) * 2));
      };
      addEventListener("pointermove", onMove);
      addEventListener("resize", fit);

      let yaw = 0, pitch = 0, visible = true, last = 0;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(c);
      const alphaOf = (lvl: number) => 0.2 + 0.8 * ((lvl + 1) / LEVELS);
      const R2 = 110 * 110, ZC = 0.12, D = 3.2, gap = mobile ? 32 : 14;

      const draw = (now: number) => {
        raf = requestAnimationFrame(draw);
        if (!visible || now - last < gap) return;
        last = now;
        const time = reduced ? 9 : start.current === null ? -1 : (now - start.current) / 1000;
        ctx.clearRect(0, 0, w, h);
        if (time < 0) return;
        const gA = Math.min(1, time / 0.7);
        yaw += (mouse.nx * 0.3 + Math.sin(now / 1800) * 0.035 - yaw) * 0.05;   // turn left/right
        pitch += (mouse.ny * 0.12 - pitch) * 0.05;                              // nod up/down, no roll
        const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
        for (let i = 0; i < n; i++) {
          const p = Math.min(1, Math.max(0, (time - dl[i]) / 1.7)), e = 1 - Math.pow(1 - p, 4);
          const x = sx[i] + (tx[i] - sx[i]) * e, y = sy[i] + (ty[i] - sy[i]) * e, z = sz[i] + (tz[i] - sz[i]) * e - ZC;
          const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
          const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp + ZC;
          const s = D / (D - z2);
          const X = cx + x1 * s * sc, Y = cy - y1 * s * sc;
          const dx = X - mouse.x, dy = Y - mouse.y, d2 = dx * dx + dy * dy;
          let tox = 0, toy = 0;
          if (d2 < R2) { const d = Math.sqrt(d2) || 1, k = (1 - d2 / R2) * 46; tox = (dx / d) * k; toy = (dy / d) * k; }
          ox[i] += (tox - ox[i]) * 0.14; oy[i] += (toy - oy[i]) * 0.14;
          px[i] = X + ox[i]; py[i] = Y + oy[i]; ps[i] = s;
        }
        for (let bi = 0; bi < buckets.length; bi++) {
          const list = buckets[bi];
          if (!list.length) continue;
          if (bi === TINTS * LEVELS) ctx.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},${gA})`;
          else {
            const tint = Math.floor(bi / LEVELS), lvl = bi % LEVELS, [r, g, b] = mix((tint / (TINTS - 1)) * 0.72);
            ctx.fillStyle = `rgba(${r},${g},${b},${alphaOf(lvl) * gA})`;
          }
          for (let k = 0; k < list.length; k++) {
            const i = list[k], sz2 = (1.15 + 1.1 * bright[i]) * ps[i] * (mobile ? 0.9 : 1);
            ctx.fillRect(px[i] - sz2 / 2, py[i] - sz2 / 2, sz2, sz2);
          }
        }
      };
      raf = requestAnimationFrame(draw);
      return () => {
        cancelAnimationFrame(raf); io.disconnect();
        removeEventListener("pointermove", onMove); removeEventListener("resize", fit);
      };
    }
    return () => { dead = true; cancelAnimationFrame(raf); cleanup(); };
  }, []);
  return <canvas ref={ref} className="hero__canvas" aria-hidden="true" />;
}

export default function Hero({ entered }: { entered: boolean }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!entered || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero .wi", { yPercent: 115, rotate: 3, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.3, stagger: 0.12, delay: 0.5 })
        .fromTo(".hero [data-in]", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, 0.9);
      gsap.utils.toArray<HTMLElement>(".hero__stat b").forEach((el) => {
        const o = { v: 0 }, target = Number(el.dataset.v);
        gsap.to(o, { v: target, duration: 2, delay: 1.2, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
      });
    }, root);
    return () => ctx.revert();
  }, [entered]);

  return (
    <section id="top" className="hero stack" data-stack ref={root}>
      <div className="stack__in">
        <FaceDots entered={entered} />
        <div className="hero__glow" aria-hidden="true" />
        <p className="hero__kicker" data-in><span className="pulse" />Full-stack developer · Websites, apps &amp; AI</p>
        <div className="hero__main">
          <Words as="h1" hero text="Design. Build. Grow." className="hero__title" />
          <div className="hero__row" data-in>
            <p className="hero__sub">
              Premium websites, web apps and AI systems for businesses that want to look sharp, ship fast and scale.
              One developer, from first sketch to live product.
            </p>
            <div className="hero__cta">
              <Btn id="contact" variant="light">Start a project</Btn>
              <Btn id="work" variant="ghost">See the work</Btn>
            </div>
          </div>
        </div>
        <div className="hero__foot" data-in>
          <ul className="hero__stats">
            {STATS.map((s) => (
              <li className="hero__stat" key={s.label}>
                <span><b data-v={s.value}>{reduced ? s.value : 0}</b>{s.suffix}</span>
                <small>{s.label}</small>
              </li>
            ))}
          </ul>
          <p className="hero__avail"><span className="pulse" />Booking new projects now. I reply to every message personally.</p>
        </div>
      </div>
    </section>
  );
}
