import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { ScrollTrigger, motion, reduced } from "@/lib/motion";
import { go } from "@/lib/transition";

export default function Work() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = PROJECTS.length;

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: "top top", end: "bottom bottom",
      onUpdate: (self) => setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
    });
    return () => st.kill();
  }, [n]);

  const jump = (i: number) => {
    const el = wrap.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (el.offsetHeight - window.innerHeight) * (i / (n - 1));
    motion.lenis ? motion.lenis.scrollTo(y, { duration: 1.6 }) : window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="work" className="work-sec" aria-label="Projects">
      <div className="work" ref={wrap} style={{ ["--n" as string]: n }}>
        <div className="work__pin">
          <ol className="work__list mono">
            {PROJECTS.map((p, i) => (
              <li key={p.slug}><button className={i === active ? "is-active" : ""} onClick={() => jump(i)} aria-current={i === active}>{p.title}</button></li>
            ))}
          </ol>
          <div className="work__stage">
            {PROJECTS.map((p, i) => (
              <article key={p.slug} className={`proj ${i === active ? "is-active" : ""}`} aria-hidden={i !== active}>
                <p className="mono proj__status"><i className={p.status === "Live" ? "on" : ""} />{p.status}</p>
                <h2 className="display proj__title">{p.title}</h2>
                <p className="lead">{p.line}</p>
                {p.tech.length > 0 && <p className="mono proj__tech">{p.tech.join("  /  ")}</p>}
                <div className="proj__links">
                  <a className="link" href={`/work/${p.slug}`} tabIndex={i === active ? 0 : -1} onClick={(e) => { e.preventDefault(); go(`/work/${p.slug}`); }}><span>Case study</span><i aria-hidden="true">→</i></a>
                  {p.url && <a className="link link--quiet" href={p.url} target="_blank" rel="noopener noreferrer" tabIndex={i === active ? 0 : -1}><span>Visit</span><ExternalLink size={14} /></a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
