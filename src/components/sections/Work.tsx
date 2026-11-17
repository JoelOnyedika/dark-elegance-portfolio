import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import { gsap, reduced } from "@/lib/motion";

const CYCLE = 2.4;

export default function Work() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = PROJECTS.length;

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".pcard");
      gsap.set(cards, { opacity: 0, transformPerspective: 1500 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: 0.7,
          onUpdate: (self) => setActive((a) => { const i = Math.min(n - 1, Math.floor((self.progress * tl.duration()) / CYCLE + 0.0001)); return i === a ? a : i; }),
        },
      });
      cards.forEach((c, i) => {
        const t = i * CYCLE;
        tl.fromTo(c, { z: i === 0 ? -500 : -1100, y: i === 0 ? 70 : 160, rotateX: i === 0 ? 14 : 32, opacity: 0, scale: 0.9 }, { z: 0, y: 0, rotateX: 0, opacity: 1, scale: 1, duration: i === 0 ? 0.45 : 1, ease: "power2.out" }, t);
        if (i < n - 1) tl.to(c, { z: 460, y: -170, rotateX: -20, opacity: 0, duration: 1, ease: "power2.in" }, t + 1.6);
      });
      tl.to({}, { duration: 0.6 }, n * CYCLE - 0.4);
    }, wrap);
    return () => ctx.revert();
  }, [n]);

  return (
    <section id="work" className="sec sec--work">
      <div className="work" ref={wrap} style={{ ["--n" as string]: n }}>
        <div className="work__pin">
          <header className="work__head">
            <h2 className="work__title">Projects I've shipped</h2>
            <p>Real applications solving real problems. Not demos, production code people actually use.</p>
          </header>
          <ol className="work__index" aria-label="Project index">
            {PROJECTS.map((p, i) => <li key={p.title} className={i === active ? "is-active" : ""}>{p.title}</li>)}
          </ol>
          <div className="work__stage">
            {PROJECTS.map((p, i) => (
              <article className={`pcard ${i === active ? "is-active" : ""}`} key={p.title} aria-hidden={reduced ? undefined : i !== active}>
                <div className="pcard__img"><img src={p.image} alt="" loading="lazy" onError={(e) => ((e.currentTarget.style.display = "none"))} /><span className="pcard__tag">{p.highlight}</span></div>
                <div className="pcard__body">
                  <p className="pcard__tagline">{p.tagline}</p>
                  <h3>{p.title}</h3>
                  <p className="pcard__desc">{p.description}</p>
                  <p className="pcard__metric">{p.metrics}</p>
                  <ul className="pcard__tech">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
                  {p.liveUrl !== "#" ? (
                    <a className="btn btn--lime" href={p.liveUrl} target="_blank" rel="noopener noreferrer">View live <ExternalLink size={16} /></a>
                  ) : <p className="pcard__nda">Under NDA</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
