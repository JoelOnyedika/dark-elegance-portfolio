import { useEffect, useRef, useState } from "react";
import { GATE_TOTAL, ENV_URL } from "@/lib/frames";

const STAGES: [number, string][] = [
  [0.0, "Powering up the workstation"],
  [0.25, "Opening the laptop"],
  [0.5, "Gathering the clouds"],
  [0.8, "Aligning the stars"],
  [0.985, "Welcome in"],
];

/** Loading screen: the same star field and clouds as the site, rising as the experience loads. */
export default function Preloader({ loaded, ready, envReady, onExited }: { loaded: number; ready: boolean; envReady: boolean; onExited: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const target = useRef(0);
  const shown = useRef(0);
  const readyRef = useRef(ready);
  target.current = ready ? 1 : Math.min(loaded / GATE_TOTAL, 0.995);
  readyRef.current = ready;

  useEffect(() => {
    const canvas = cv.current!, ctx = canvas.getContext("2d")!;
    const small = innerWidth < 700;
    const stars = Array.from({ length: small ? 90 : 190 }, () => ({ x: Math.random(), y: Math.random(), z: 0.2 + Math.random() * 0.8, p: Math.random() * 6.28, s: 0.5 + Math.random() * 1.6 }));
    let w = 0, h = 0, dpr = 1, mx = 0, my = 0, raf = 0, done = false;
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; canvas.width = w * dpr; canvas.height = h * dpr; };
    size();
    const onMove = (e: PointerEvent) => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5; };
    addEventListener("resize", size); addEventListener("pointermove", onMove);
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = (now - t0) / 1000;
      shown.current += (target.current - shown.current) * 0.06;
      if (target.current - shown.current < 0.0015) shown.current = target.current;
      const v = shown.current;
      setPct((prev) => (Math.round(v * 100) === prev ? prev : Math.round(v * 100)));
      root.current?.style.setProperty("--p", v.toFixed(4));
      if (readyRef.current && v >= 1 && !done) { done = true; setExiting(true); setTimeout(onExited, 550); setTimeout(() => setGone(true), 1500); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      // drifting nebula glows
      for (const [cx, cy, r, c] of [[0.2 + Math.sin(t * 0.15) * 0.05, 0.3, 0.5, "100,90,255"], [0.8, 0.7 + Math.cos(t * 0.12) * 0.05, 0.55, "60,120,255"]] as const) {
        const g = ctx.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, r * Math.max(w, h));
        g.addColorStop(0, `rgba(${c},0.20)`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      for (const s of stars) {
        const x = ((s.x * w + mx * -40 * s.z + t * 4 * s.z) % w + w) % w, y = s.y * h + my * -40 * s.z;
        const a = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (0.8 + s.z) + s.p))) * s.z;
        ctx.fillStyle = `rgba(200,210,255,${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, s.s * s.z, 0, 6.283); ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); removeEventListener("pointermove", onMove); };
  }, [onExited]);

  if (gone) return null;
  const stage = [...STAGES].reverse().find(([t]) => pct / 100 >= t)![1];
  return (
    <div ref={root} className={`preloader ${exiting ? "is-exiting" : ""}`} role="progressbar" aria-label="Loading the experience" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className={`preloader__clouds ${envReady ? "is-in" : ""}`} style={{ backgroundImage: `url(${ENV_URL})` }} />
      <div className="preloader__shade" />
      <canvas ref={cv} className="preloader__stars" aria-hidden="true" />
      <div className="preloader__top"><span>J·O</span><span>Portfolio / {new Date().getFullYear()}</span></div>
      <div className="preloader__count" aria-hidden="true"><span>{String(pct).padStart(2, "0")}</span><i>%</i></div>
      <div className="preloader__bottom">
        <p className="preloader__name">Joel Onyedika</p>
        <div className="preloader__bar"><i /></div>
        <p className="preloader__meta"><span>{stage}</span><span>Loading experience</span></p>
      </div>
    </div>
  );
}
