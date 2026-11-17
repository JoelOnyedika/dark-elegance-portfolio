import { useEffect, useRef } from "react";
import { SERVICES } from "@/lib/data";
import { gsap, coarse, reduced } from "@/lib/motion";
import Split from "../Split";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".svc").forEach((el, i) => {
        // each card swings in from depth on scroll, and back out as you leave
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 100%", end: "bottom 0%", scrub: 0.6 } })
          .fromTo(el, { rotateY: -38, x: -80, z: -260, opacity: 0, transformPerspective: 1100 }, { rotateY: 0, x: 0, z: 0, opacity: 1, duration: 0.35, ease: "power2.out" })
          .to(el, { duration: 0.3 })
          .to(el, { rotateY: 22, x: 40, z: -200, opacity: 0, duration: 0.35, ease: "power2.in" });
        void i;
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (coarse || reduced) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section id="services" className="sec sec--services" ref={root}>
      <div className="wrap wrap--left">
        <Split text="What I can do for you" className="services__title" />
        <div className="svc-list">
          {SERVICES.map((s) => (
            <article className="svc panel" key={s.title} onPointerMove={tilt} data-hover>
              <s.icon className="svc__icon" size={26} strokeWidth={1.6} />
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
