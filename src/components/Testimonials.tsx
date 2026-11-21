import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/data";
import { gsap, ScrollTrigger, clamp, reducedQuery } from "@/lib/motion";
import { useReveal } from "@/hooks/useReveal";

const SCROLL_SPIN = 120; // degrees the ring turns while the section scrolls through the viewport

export default function Testimonials() {
  const sec = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const s = useRef({ scroll: 0, manual: 0, radius: 0 });
  const render = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const n = TESTIMONIALS.length;
  const step = 360 / n;
  useReveal(sec);

  useEffect(() => {
    const st = s.current;
    render.current = () => {
      const rot = st.scroll + st.manual;
      ring.current!.style.transform = `translateZ(${-st.radius}px) rotateY(${rot}deg)`;
      let best = 0, bestD = 999;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const a = ((((i * step + rot) % 360) + 540) % 360) - 180;
        const d = Math.abs(a);
        c.style.opacity = String(0.3 + 0.7 * (1 - clamp(d / 105)));
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    const layout = () => {
      const cw = cards.current[0]?.offsetWidth || 320;
      st.radius = Math.round(cw / 2 / Math.tan(Math.PI / n)) + (innerWidth < 640 ? 22 : 46);
      ring.current!.style.setProperty("--R", `${st.radius}px`);
      render.current();
    };
    layout();
    window.addEventListener("resize", layout);
    const trig = reducedQuery.matches ? null : ScrollTrigger.create({
      trigger: sec.current, start: "top bottom", end: "bottom top",
      onUpdate: (self) => { st.scroll = -(self.progress - 0.5) * SCROLL_SPIN; render.current(); },
    });
    return () => { window.removeEventListener("resize", layout); trig?.kill(); gsap.killTweensOf(st); };
  }, [n, step]);

  const snapTo = (target: number) =>
    gsap.to(s.current, { manual: target, duration: reducedQuery.matches ? 0 : 0.9, ease: "power3.out", overwrite: true, onUpdate: () => render.current() });
  const nearest = () => Math.round((s.current.scroll + s.current.manual) / step) * step - s.current.scroll;
  const go = (dir: 1 | -1) => snapTo(nearest() - dir * step);

  const drag = useRef({ on: false, x: 0, m: 0 });
  const down = (e: React.PointerEvent) => {
    drag.current = { on: true, x: e.clientX, m: s.current.manual };
    gsap.killTweensOf(s.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drag.current.on) return;
    s.current.manual = drag.current.m + (e.clientX - drag.current.x) * 0.32;
    render.current();
  };
  const up = () => { if (drag.current.on) { drag.current.on = false; snapTo(nearest()); } };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  return (
    <section id="testimonials" className="sec testimonials" ref={sec} aria-labelledby="testi-h">
      <div className="wrap">
        <p className="kicker" data-reveal><span>05</span> Kind words</p>
        <h2 id="testi-h" className="h2 h2--big" data-reveal>What people <em>say.</em></h2>
      </div>
      <div className="cyl" data-reveal role="group" aria-roledescription="carousel" aria-label="Testimonials carousel. Use the left and right arrow keys or drag to rotate."
        tabIndex={0} onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="cyl__ring" ref={ring}>
          {TESTIMONIALS.map((t, i) => (
            <figure key={t.id} className={`tcard ${i === active ? "is-front" : ""}`} ref={(el) => (cards.current[i] = el)}
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--R))` }} aria-label={`Testimonial ${i + 1} of ${n}`}>
              <span className="tcard__ph">Placeholder</span>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption><strong>{t.name}</strong><span>{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="cyl__controls" data-reveal>
        <button onClick={() => go(-1)} aria-label="Previous testimonial">←</button>
        <p aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
        <button onClick={() => go(1)} aria-label="Next testimonial">→</button>
      </div>
    </section>
  );
}
