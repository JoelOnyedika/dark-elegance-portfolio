import { useRef } from "react";
import { ABOUT_DISCIPLINES } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="about" className="sec about" ref={ref} aria-labelledby="about-h">
      <div className="wrap">
        <p className="kicker" data-reveal><span>01</span> About</p>
        <h2 id="about-h" className="h2" data-reveal>
          I build complete software products, <em>from the interface to the database.</em>
        </h2>
        <p className="lede" data-reveal>
          I'm Joel, a full-stack software developer. I work across frontend and backend, and I take an idea from first
          sketch to a deployed, working application.
        </p>
        <ul className="disciplines">
          {ABOUT_DISCIPLINES.map((d, i) => (
            <li key={d.name} data-reveal data-delay={i * 0.08}>
              <h3>{d.name}</h3>
              <p>{d.text}</p>
              <ul className="tags" aria-label={`${d.name} technologies`}>{d.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
