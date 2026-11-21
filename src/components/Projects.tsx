import { useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS, Project } from "@/lib/data";
import { gsap, ScrollTrigger, clamp, reducedQuery, scrollToId } from "@/lib/motion";
import { useReveal } from "@/hooks/useReveal";

const N = PROJECTS.length;
const pad = (n: number) => String(n).padStart(2, "0");

function Media({ p }: { p: Project }) {
  return (
    <div className="pcard__media">
      <img src={p.screenshot || p.cover} alt={p.cta ? "" : `${p.title}: ${p.screenshot ? "screenshot" : "cover art placeholder"}`} width={1200} height={1500} loading="lazy" decoding="async" draggable={false} />
      {!p.screenshot && !p.cta && <span className="pcard__ph">Cover art · screenshot to add</span>}
    </div>
  );
}

function Links({ p }: { p: Project }) {
  if (p.cta) return <a className="btn btn--sm" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Start a project <i aria-hidden="true">→</i></a>;
  return (
    <div className="plinks">
      {p.live ? <a href={p.live} target="_blank" rel="noopener noreferrer">Live project <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a> : <span className="is-ph">Live link: not yet available</span>}
      {p.source && <a href={p.source} target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
    </div>
  );
}

export default function Projects() {
  const sec = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const st = useRef({ pos: reducedQuery.matches ? 0 : -1.5 });
  const drag = useRef({ on: false, x: 0, pos: 0, moved: 0, t: 0, v: 0 });
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"3d" | "grid">("3d");
  useReveal(sec);

  const render = useCallback(() => {
    const pos = st.current.pos;
    const small = innerWidth < 760;
    const gap = small ? 138 : 250;
    let best = 0, bd = 99;
    cards.current.forEach((c, i) => {
      if (!c) return;
      const o = i - pos, a = Math.abs(o);
      const x = Math.sign(o) * (a <= 1 ? a * gap : gap + (a - 1) * gap * 0.62);
      const y = -o * (small ? 10 : 24);
      const z = -Math.min(a, 4) * (small ? 80 : 140);
      const ry = -clamp(o, -2, 2) * (small ? 24 : 27);
      const sc = 1 - Math.min(a, 3) * 0.06 + (a < 1 ? (1 - a) * 0.07 : 0);
      c.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      c.style.opacity = String(clamp(1 - Math.max(a - 2.2, 0) * 0.55));
      c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.pointerEvents = a > 3.4 ? "none" : "auto";
      c.style.visibility = a > 3.6 ? "hidden" : "visible";
      if (a < bd) { bd = a; best = i; }
    });
    setActive((prev) => (prev === best ? prev : best));
  }, []);

  const goTo = useCallback((i: number) => {
    const t = clamp(Math.round(i), 0, N - 1);
    gsap.to(st.current, { pos: t, duration: reducedQuery.matches ? 0 : 0.9, ease: "power3.out", overwrite: true, onUpdate: render });
  }, [render]);

  useEffect(() => {
    render();
    const onResize = () => render();
    addEventListener("resize", onResize);
    let trig: ScrollTrigger | undefined;
    if (!reducedQuery.matches && stage.current) {
      // the ribbon fans in the first time it nears the viewport
      trig = ScrollTrigger.create({
        trigger: stage.current, start: "top 95%", once: true,
        onEnter: () => gsap.to(st.current, { pos: 0, duration: 1.8, ease: "power3.out", overwrite: true, onUpdate: render }),
      });
    }
    const state = st.current;
    return () => { removeEventListener("resize", onResize); trig?.kill(); gsap.killTweensOf(state); };
  }, [render, view]);

  // if the fan-in trigger never fires (e.g. no scrolling happens), still show a settled ribbon
  useEffect(() => {
    const t = setTimeout(() => { if (st.current.pos < -1) goTo(0); }, 9000);
    return () => clearTimeout(t);
  }, [goTo]);

  const gap = () => (innerWidth < 760 ? 138 : 250);
  const down = (e: React.PointerEvent) => {
    gsap.killTweensOf(st.current);
    drag.current = { on: true, x: e.clientX, pos: st.current.pos, moved: 0, t: performance.now(), v: 0 };
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current; if (!d.on) return;
    const dx = e.clientX - d.x; d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved > 6) (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    const now = performance.now(); d.v = (-dx / gap() - (st.current.pos - d.pos)) / Math.max(now - d.t, 1) * 16; d.t = now;
    st.current.pos = clamp(d.pos - dx / gap(), -0.35, N - 0.65);
    render();
  };
  const up = () => { const d = drag.current; if (!d.on) return; d.on = false; goTo(st.current.pos + clamp(d.v * 6, -1, 1)); };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(active - 1); }
  };
  const click = (i: number) => { if (drag.current.moved > 6) return; if (i !== active) goTo(i); };
  const p = PROJECTS[active];

  return (
    <section id="projects" className="sec projects" ref={sec} aria-labelledby="proj-h">
      <div className="wrap wrap--wide">
        <p className="kicker" data-reveal><span>04</span> Projects</p>
        <div className="projects__head">
          <h2 id="proj-h" className="h2 h2--big" data-reveal>Selected work, <em>in three dimensions.</em></h2>
          <div className="seg" role="group" aria-label="Project view" data-reveal>
            <button aria-pressed={view === "3d"} onClick={() => setView("3d")}>3D</button>
            <button aria-pressed={view === "grid"} onClick={() => setView("grid")}>Grid</button>
          </div>
        </div>

        {view === "3d" ? (
          <>
            <div className="p3d" data-reveal role="group" aria-roledescription="carousel" aria-label="Projects. Drag, swipe or use the arrow keys to browse."
              tabIndex={0} onKeyDown={key} ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
              <div className="p3d__stage">
                {PROJECTS.map((pr, i) => (
                  <figure key={pr.slug} ref={(el) => (cards.current[i] = el)} className={`pcard ${i === active ? "is-active" : ""}`} onClick={() => click(i)} aria-label={`${pad(i + 1)}: ${pr.title}`}>
                    <Media p={pr} />
                    <figcaption className="pcard__info"><span>{pad(i + 1)}</span><b>{pr.title}</b><em>{pr.kind}</em></figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="p3d__ctrl" data-reveal>
              <button onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project">←</button>
              <ul className="dots" aria-label="All projects">
                {PROJECTS.map((pr, i) => <li key={pr.slug}><button aria-label={`Show project ${i + 1}: ${pr.title}`} aria-current={i === active} onClick={() => goTo(i)} /></li>)}
              </ul>
              <button onClick={() => goTo(active + 1)} disabled={active === N - 1} aria-label="Next project">→</button>
            </div>
            <div className="pdetail" key={p.slug} aria-live="polite">
              <div className="pdetail__top"><span>{pad(active + 1)} / {pad(N)}</span><span className={`status ${p.status === "Live" ? "is-live" : ""}`}>{p.status}</span></div>
              <div className="pdetail__body">
                <div><h3>{p.title}</h3><p className="pdetail__kind">{p.kind}</p></div>
                <div><p>{p.description}</p>{p.tech.length > 0 && <ul className="mini" aria-label="Technologies used">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>}<Links p={p} /></div>
              </div>
            </div>
          </>
        ) : (
          <ul className="pgrid">
            {PROJECTS.map((pr, i) => (
              <li key={pr.slug} className="pgrid__item">
                <div className="pcard pcard--flat"><Media p={pr} /></div>
                <div className="pgrid__text">
                  <p className="pdetail__kind">{pad(i + 1)} · {pr.kind}</p><h3>{pr.title}</h3><p>{pr.description}</p>
                  {pr.tech.length > 0 && <ul className="mini" aria-label="Technologies used">{pr.tech.map((t) => <li key={t}>{t}</li>)}</ul>}
                  <Links p={pr} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
