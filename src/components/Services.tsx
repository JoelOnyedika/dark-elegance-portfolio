import { useRef } from "react";
import { SERVICES } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";
import { scrollToId } from "@/lib/motion";

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="services" className="sec services" ref={ref} aria-labelledby="svc-h">
      <div className="wrap wrap--wide">
        <p className="kicker" data-reveal><span>02</span> Services</p>
        <h2 id="svc-h" className="h2 h2--big" data-reveal>What I can <em>build for you.</em></h2>
        <div className="svc">
          {SERVICES.map((s, i) => (
            <article key={s.title} className="svc__card" style={{ ["--i" as string]: i } as React.CSSProperties} data-reveal data-delay={i * 0.08}>
              <span className="chip">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul className="mini" aria-label="Key technologies">{s.chips.map((c) => <li key={c}>{c}</li>)}</ul>
              <a className="arrowlink" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Start a project <i aria-hidden="true">→</i></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
