import { useRef, useState } from "react";
import { PROJECTS, Project } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

function Shot({ p }: { p: Project }) {
  const [failed, setFailed] = useState(false);
  if (failed || !p.screenshot) {
    return (
      <div className="shot shot--placeholder" role="img" aria-label={`Screenshot placeholder for ${p.title}`}>
        <span>Screenshot placeholder</span>
        <small>Add public/projects/{p.slug}.jpg</small>
      </div>
    );
  }
  return <img className="shot" src={p.screenshot} alt={`${p.title} screenshot`} width={1440} height={900} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

function Folder({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--ry", `${x * 7}deg`);
    ref.current.style.setProperty("--rx", `${-y * 6}deg`);
  };
  const leave = () => { ref.current?.style.setProperty("--ry", "0deg"); ref.current?.style.setProperty("--rx", "0deg"); };
  return (
    <article className="folder" ref={ref} onPointerMove={move} onPointerLeave={leave} data-reveal data-delay={i * 0.1}>
      <div className="folder__tab">
        <span>{String(i + 1).padStart(2, "0")}</span>
        <span className={`status ${p.status === "Live" ? "is-live" : ""}`}>{p.status}</span>
      </div>
      <div className="folder__body">
        <div className="folder__sheet"><Shot p={p} /></div>
        <div className="folder__front">
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          {p.tech.length > 0 ? (
            <ul className="tags" aria-label="Technologies used">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
          ) : (
            <ul className="tags" aria-label="Technologies used"><li className="is-ph">Tech stack: placeholder</li></ul>
          )}
          <div className="folder__links">
            {p.live ? <a href={p.live} target="_blank" rel="noopener noreferrer">Live project <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a> : <span className="is-ph">Live link: not yet available</span>}
            {p.source && <a href={p.source} target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="projects" className="sec projects" ref={ref} aria-labelledby="projects-h">
      <div className="wrap wrap--wide">
        <p className="kicker" data-reveal><span>03</span> Projects</p>
        <h2 id="projects-h" className="h2" data-reveal>Selected work, <em>filed away.</em></h2>
        <div className="folders">{PROJECTS.map((p, i) => <Folder key={p.slug} p={p} i={i} />)}</div>
      </div>
    </section>
  );
}
