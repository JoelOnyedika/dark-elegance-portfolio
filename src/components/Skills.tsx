import { useRef } from "react";
import { SKILLS } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="skills" className="sec skills" ref={ref} aria-labelledby="skills-h">
      <div className="wrap">
        <p className="kicker" data-reveal><span>02</span> Technical skills</p>
        <h2 id="skills-h" className="h2" data-reveal>The tools I <em>reach for.</em></h2>
        <div className="skills__grid">
          {SKILLS.map((g, i) => (
            <section key={g.group} className="skillgroup" data-reveal data-delay={(i % 2) * 0.08} aria-label={g.group}>
              <h3><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{g.group}</h3>
              <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
