import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, scrollToId, reduced } from "@/lib/motion";
import Split from "../Split";
import Magnetic from "../Magnetic";

const STATS = [
  { n: 3, suffix: "+", label: "years of experience" },
  { n: 15, suffix: "+", label: "projects shipped" },
  { n: 100, suffix: "%", label: "clean handoffs" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(".stat__n");
      const run = () => els.forEach((el) => {
        const end = Number(el.dataset.n); const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", onUpdate: () => (el.firstChild!.textContent = String(Math.round(o.v))) });
      });
      if (reduced) els.forEach((el) => (el.firstChild!.textContent = el.dataset.n!));
      else ScrollTrigger.create({ trigger: root.current, start: "top 55%", once: true, onEnter: run });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="about" className="sec sec--about" ref={root}>
      <div className="wrap wrap--right">
        <div className="panel panel--about" data-pane>
          <Split text="Why hire me" />
          <p className="lead">I'm a <b>full-stack developer</b> who's seen it all: legacy codebases held together by hope, half-finished features nobody understands, and production bugs that somehow made it past staging.</p>
          <p>My specialty? <strong>Cleaning up the mess.</strong> I refactor spaghetti code into maintainable architecture. I write tests that catch bugs. I document my work so the next developer doesn't curse your name.</p>
          <p>I also build SaaS from scratch. React, Next.js, Node.js, Python, whatever fits. Frontend, backend, database design, API integrations, deployment, monitoring. You get a product that works.</p>
          <dl className="stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="stat__n" data-n={s.n}>0<span>{s.suffix}</span></dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
          <Magnetic><a className="btn btn--lime" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Need someone who ships? Let's talk</a></Magnetic>
        </div>
      </div>
    </section>
  );
}
