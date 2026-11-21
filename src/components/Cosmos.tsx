import { useEffect, useRef } from "react";
import { env } from "@/lib/state";

type Star = { x: number; y: number; z: number; p: number; r: number; hue: number };
type Node = { x: number; y: number; vx: number; vy: number; z: number; p: number };

/**
 * The living background: parallax star layers, a drifting constellation (a nod to knowledge graphs / RAG),
 * soft aurora ribbons and bokeh orbs. All of it responds to scroll speed and the pointer.
 */
export default function Cosmos({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d", { alpha: true })!;
    const small = innerWidth < 760;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const stars: Star[] = Array.from({ length: small ? 110 : 230 }, () => ({ x: Math.random(), y: Math.random(), z: rnd(0.15, 1), p: rnd(0, 6.28), r: rnd(0.5, 1.7), hue: Math.random() < 0.25 ? 270 : 225 }));
    const nodes: Node[] = Array.from({ length: small ? 26 : 52 }, () => ({ x: Math.random(), y: Math.random(), vx: rnd(-0.00004, 0.00004), vy: rnd(-0.00004, 0.00004), z: rnd(0.3, 1), p: rnd(0, 6.28) }));
    const orbs = [
      { x: 0.15, y: 0.25, r: 0.34, z: 0.25, c: "110,90,255", a: 0.16 },
      { x: 0.85, y: 0.55, r: 0.4, z: 0.4, c: "70,120,255", a: 0.14 },
      { x: 0.35, y: 0.95, r: 0.38, z: 0.55, c: "170,100,255", a: 0.12 },
    ];
    let w = 0, h = 0, dpr = 1, raf = 0, vel = 0, last = scrollY, px = 0, py = 0, tx = 0, ty = 0, cx = -1, cy = -1;
    const shoot: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, small ? 1 : 1.5); w = innerWidth; h = innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    };
    size();
    const onMove = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; tx = e.clientX / w - 0.5; ty = e.clientY / h - 0.5; cx = e.clientX; cy = e.clientY; };
    const onLeave = () => { cx = cy = -1; };

    const draw = (t: number, still = false) => {
      const sy = scrollY;
      const dv = sy - last; last = sy;
      vel += (Math.min(Math.abs(dv), 90) - vel) * 0.08; // smoothed scroll speed
      px += (tx - px) * 0.05; py += (ty - py) * 0.05;
      const boost = still ? 0 : Math.min(vel / 40, 1.6);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // bokeh orbs drift with scroll at different depths
      for (const o of orbs) {
        const y = (((o.y * h - sy * o.z * 0.35) % (h * 1.5)) + h * 1.5) % (h * 1.5) - h * 0.25;
        const x = o.x * w + px * -60 * o.z + Math.sin(t * 0.00012 + o.x * 9) * 30;
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r * Math.max(w, h));
        g.addColorStop(0, `rgba(${o.c},${(o.a + boost * 0.04).toFixed(3)})`); g.addColorStop(1, `rgba(${o.c},0)`);
        const rr = o.r * Math.max(w, h); ctx.fillStyle = g; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }

      // aurora ribbons: flow with time, shear with scroll speed
      const ribbons = small ? 2 : 3;
      for (let k = 0; k < ribbons; k++) {
        const base = h * (0.28 + k * 0.26) - ((sy * (0.08 + k * 0.05)) % (h * 0.9)) + h * 0.2;
        for (const [lw, al] of [[56, 0.022], [14, 0.045], [3, 0.11]] as const) {
          ctx.beginPath();
          for (let x = -20; x <= w + 20; x += 24) {
            const y = base + Math.sin(x * 0.004 + t * 0.00022 * (1 + k * 0.4) + k * 2) * (40 + boost * 40) + Math.sin(x * 0.011 - t * 0.0003 + k) * 14 + px * 40;
            if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.lineWidth = lw; ctx.lineCap = "round";
          ctx.strokeStyle = `hsla(${236 + k * 24},90%,68%,${(al * (1 + boost * 0.8)).toFixed(3)})`;
          ctx.stroke();
        }
      }

      // stars: three parallax depths; they stream upward as you scroll, and stretch with speed
      for (const s of stars) {
        const y = (((s.y * h * 1.3 - sy * s.z * 0.28) % (h * 1.3)) + h * 1.3) % (h * 1.3) - h * 0.15;
        const x = s.x * w + px * -50 * s.z;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.0012 * (0.6 + s.z) + s.p);
        const a = Math.min(1, tw * s.z * 1.1);
        ctx.strokeStyle = `hsla(${s.hue},80%,88%,${a.toFixed(3)})`;
        ctx.fillStyle = ctx.strokeStyle;
        if (boost > 0.35 && s.z > 0.5) { ctx.lineWidth = s.r; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + boost * 9 * s.z); ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(x, y, s.r * (0.6 + s.z * 0.6), 0, 6.283); ctx.fill(); }
      }

      // constellation: nodes wander, link when close, glow near the pointer
      const maxD = small ? 120 : 170;
      const pts = nodes.map((n) => {
        if (!still) { n.x += n.vx * 16; n.y += n.vy * 16; if (n.x < -0.05 || n.x > 1.05) n.vx *= -1; if (n.y < -0.05 || n.y > 1.05) n.vy *= -1; }
        const y = (((n.y * h - sy * n.z * 0.12) % (h * 1.1)) + h * 1.1) % (h * 1.1) - h * 0.05;
        return { x: n.x * w + px * -30 * n.z, y, z: n.z, p: n.p };
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
          if (d < maxD) {
            let a = (1 - d / maxD) * 0.22 * Math.min(pts[i].z, pts[j].z) * (1 + boost * 0.7);
            if (cx >= 0) { const m = Math.hypot((pts[i].x + pts[j].x) / 2 - cx, (pts[i].y + pts[j].y) / 2 - cy); if (m < 190) a += (1 - m / 190) * 0.3; }
            ctx.strokeStyle = `rgba(160,170,255,${a.toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      for (const n of pts) {
        let r = 1.4 + n.z * 1.4 + Math.sin(t * 0.002 + n.p) * 0.5;
        if (cx >= 0) { const m = Math.hypot(n.x - cx, n.y - cy); if (m < 150) r += (1 - m / 150) * 2.5; }
        ctx.fillStyle = `rgba(190,200,255,${(0.35 + n.z * 0.5).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.283); ctx.fill();
      }

      // shooting stars when the page is scrolled fast
      if (!still && boost > 0.9 && Math.random() < 0.06 && shoot.length < 3) shoot.push({ x: rnd(0.2, 1) * w, y: rnd(0, 0.4) * h, vx: -rnd(7, 12), vy: rnd(4, 8), life: 1 });
      for (let i = shoot.length - 1; i >= 0; i--) {
        const s = shoot[i]; s.x += s.vx; s.y += s.vy; s.life -= 0.022;
        if (s.life <= 0) { shoot.splice(i, 1); continue; }
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
        g.addColorStop(0, `rgba(230,235,255,${s.life})`); g.addColorStop(1, "rgba(230,235,255,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9); ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    if (reduced) {
      draw(40000, true);
      const onResize = () => { size(); draw(40000, true); };
      addEventListener("resize", onResize);
      return () => removeEventListener("resize", onResize);
    }
    let lastT = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - lastT < (small ? 32 : 22)) return; // ~30fps phones, ~45fps desktop: plenty for a soft background
      lastT = t;
      if (document.hidden || env.gl < 0.002) { last = scrollY; return; } // nothing to show during the opening
      draw(t);
    };
    raf = requestAnimationFrame(loop);
    addEventListener("resize", size); addEventListener("pointermove", onMove); document.addEventListener("pointerleave", onLeave);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); };
  }, [reduced]);

  return <canvas ref={ref} className="env__cosmos" aria-hidden="true" />;
}
