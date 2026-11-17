import { useEffect, useRef, type ReactNode } from "react";
import { gsap, motion, reduced } from "@/lib/motion";

/** Infinite marquee. Speeds up with scroll velocity and eases to a stop on hover. */
export default function Marquee({ children, speed = 40, reverse = false, pauseOnHover = false, className = "" }:
  { children: ReactNode; speed?: number; reverse?: boolean; pauseOnHover?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    let x = 0, hover = 0, hoverT = 0;
    const dir = reverse ? 1 : -1;
    const tick = (_: number, dtMs: number) => {
      const w = el.scrollWidth / 3;
      if (!w) return;
      const dt = Math.min(dtMs, 50) / 1000;
      hover += (hoverT - hover) * Math.min(1, dt * 6);
      const boost = reduced ? 0 : Math.min(Math.abs(motion.lenis?.velocity ?? 0) * 0.5, 60);
      x += dir * (speed + boost * 6) * (1 - hover) * dt * (reduced ? 0 : 1);
      x = ((x % w) + w) % w - w; // wrap into [-w, 0)
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    const p = el.parentElement!;
    const on = () => (hoverT = 1), off = () => (hoverT = 0);
    if (pauseOnHover) { p.addEventListener("pointerenter", on); p.addEventListener("pointerleave", off); }
    return () => { gsap.ticker.remove(tick); p.removeEventListener("pointerenter", on); p.removeEventListener("pointerleave", off); };
  }, [speed, reverse, pauseOnHover]);

  return (
    <div className={`marquee ${className}`}>
      <div className="marquee__track" ref={track}>
        {[0, 1, 2].map((i) => (
          <div className="marquee__set" key={i} aria-hidden={i > 0}>{children}</div>
        ))}
      </div>
    </div>
  );
}
