import { useEffect, useRef, useState } from "react";
import {
  COVERS, DELIVERABLES, EMAIL, GITHUB, PROJECTS, REASONS, SERVICES, STACK, STEPS, TWITTER, mailto,
} from "@/lib/data";
import { gsap, reduced } from "@/lib/motion";
import { Btn, Kicker, Words } from "@/components/ui";

/* ───────────────────────── Services ───────────────────────── */
export function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" className="sec sec--dark stack" data-stack>
      <div className="stack__in wrap">
        <header className="head">
          <div>
            <Kicker>What I do</Kicker>
            <Words text="Four disciplines. One developer." className="h2" />
          </div>
          <p className="head__side" data-fade>
            Every project is designed, built and launched by the same person. That means faster decisions, cleaner
            code and nothing lost in translation.
          </p>
        </header>
        <ul className="acc">
          {SERVICES.map((s, i) => (
            <li key={s.n} className={`acc__row ${open === i ? "is-open" : ""}`} data-fade
                onMouseEnter={() => matchMedia("(hover: hover)").matches && setOpen(i)}>
              <button className="acc__head" onClick={() => setOpen(i)} aria-expanded={open === i}>
                <span className="acc__n">{s.n}</span>
                <span className="acc__t">{s.title}</span>
                <span className="acc__chips">{s.chips.map((c) => <em key={c}>{c}</em>)}</span>
                <span className="acc__plus" aria-hidden="true" />
              </button>
              <div className="acc__body"><div><p>{s.text}</p></div></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Selected work ───────────────────────── */
export function Work() {
  return (
    <section id="work" className="sec sec--light stack" data-stack>
      <div className="stack__in wrap">
        <header className="head">
          <div>
            <Kicker>Portfolio</Kicker>
            <Words text="Selected work." className="h2" />
          </div>
          <p className="head__side" data-fade>Real products with real backends. Open them, click around, see how they hold up.</p>
        </header>
        <div className="work">
          {PROJECTS.map((p, i) => {
            const Tag = p.live ? "a" : "div";
            return (
              <article className={`work__item work__item--${i % 2 ? "b" : "a"}`} key={p.slug} data-fade>
                <Tag
                  className="work__card"
                  data-cursor={p.live ? "Open" : "Soon"}
                  {...(p.live ? { href: p.live, target: "_blank", rel: "noopener noreferrer", "aria-label": `${p.title} (opens live site)` } : {})}
                >
                  <div className="work__img"><img src={p.cover} alt="" loading="lazy" width="1200" height="1500" data-parallax /></div>
                  <span className={`badge ${p.live ? "" : "badge--soft"}`}>{p.status}</span>
                </Tag>
                <div className="work__meta">
                  <div>
                    <h3>{p.title}</h3>
                    <p className="work__kind">{p.kind}</p>
                  </div>
                  <span className="work__year">{p.year}</span>
                </div>
                <p className="work__desc">{p.description}</p>
                <ul className="tags">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
              </article>
            );
          })}
        </div>
        <div className="work__more" data-fade>
          <Btn href={GITHUB} variant="dark">More on GitHub</Btn>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Process ───────────────────────── */
export function Process() {
  const words = useRef<HTMLParagraphElement>(null);
  const line = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".dl__w", { opacity: 0.18 }, {
        opacity: 1, stagger: 0.5, ease: "none",
        scrollTrigger: { trigger: words.current, start: "top 78%", end: "bottom 45%", scrub: true },
      });
      gsap.fromTo(line.current, { scaleX: 0 }, {
        scaleX: 1, ease: "none", transformOrigin: "left center",
        scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 60%", scrub: true },
      });
      gsap.fromTo(".step", { opacity: 0.3, y: 30 }, {
        opacity: 1, y: 0, stagger: 0.25, ease: "none",
        scrollTrigger: { trigger: ".steps", start: "top 80%", end: "bottom 65%", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <section id="process" className="sec sec--dark stack" data-stack>
      <div className="stack__in wrap">
        <header className="head">
          <div>
            <Kicker>The process</Kicker>
            <Words text="From idea to launch." className="h2" />
          </div>
          <div className="head__side" data-fade>
            <p>What I build, how we get there, and the tools along the way.</p>
            <Btn href={mailto("Strategy call")} variant="ghost">Book a strategy call</Btn>
          </div>
        </header>

        <p className="dl" ref={words}>
          {DELIVERABLES.map((d, i) => (
            <span className="dl__w" key={d}>{d}{i < DELIVERABLES.length - 1 && <i> · </i>}</span>
          ))}
        </p>

        <div className="steps">
          <div className="steps__line"><div ref={line} /></div>
          <ol>
            {STEPS.map((s) => (
              <li className="step" key={s.n}>
                <span className="step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <ul className="stack-chips" data-fade aria-label="Technology">
          {STACK.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Why hire me ───────────────────────── */
export function Why() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top bottom", end: "center center", scrub: true };
      gsap.fromTo(".orb--l", { xPercent: -45 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      gsap.fromTo(".orb--r", { xPercent: 45 }, { xPercent: 0, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec sec--light why stack" data-stack ref={root}>
      <div className="orb orb--l" aria-hidden="true">
        <svg viewBox="0 0 400 400"><path d="M210 40 L186 120 L226 168 L190 232 L236 300 L214 380" /><path d="M186 120 L120 150 M226 168 L300 190 M190 232 L130 262" /></svg>
        <span>Imperfect idea</span>
      </div>
      <div className="orb orb--r" aria-hidden="true"><span>Perfected product</span></div>
      <div className="stack__in wrap why__in">
        <Kicker>Why hire me</Kicker>
        <Words text="Why teams hire me." className="h2 h2--c" />
        <p className="why__lede" data-fade>You bring the rough idea. I bring the craft to turn it into something sharp, fast and finished.</p>
        <ul className="reasons">
          {REASONS.map((r, i) => (
            <li key={r.title} data-fade><span>0{i + 1}</span><h3>{r.title}</h3><p>{r.text}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Red proof band ───────────────────────── */
export function Proof() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tilt__col").forEach((col, i) => {
        gsap.fromTo(col, { yPercent: i % 2 ? -14 : 8 }, {
          yPercent: i % 2 ? 8 : -14, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  const col = (offset: number) => Array.from({ length: 4 }, (_, i) => COVERS[(i + offset) % COVERS.length]);
  return (
    <section className="sec sec--red proof stack" data-stack ref={root}>
      <div className="tilt" aria-hidden="true">
        {[0, 1, 2, 3].map((c) => (
          <div className="tilt__col" key={c}>
            {col(c).map((src, i) => <div className="tilt__tile" key={i}><img src={src} alt="" loading="lazy" /></div>)}
          </div>
        ))}
      </div>
      <div className="stack__in wrap proof__in">
        <Kicker>The standard</Kicker>
        <Words text="One developer. One standard." className="h2 h2--xl" />
        <p data-fade>Every project gets the same obsessive care: sharp design, clean code, fast load times and a launch you can be proud of.</p>
        <Btn href={mailto("Project enquiry")} variant="dark">Start your project</Btn>
      </div>
    </section>
  );
}

/* ───────────────────────── Proof: live links ───────────────────────── */
export function Trust() {
  const live = PROJECTS.filter((p) => p.live);
  return (
    <section className="sec sec--dark trust stack" data-stack>
      <div className="stack__in wrap">
        <header className="head">
          <div>
            <Kicker>Proof</Kicker>
            <Words text="Don't take my word for it." className="h2" />
          </div>
          <p className="head__side" data-fade>Everything below is live. Open it, use it, then decide if you want this level of work on your project.</p>
        </header>
        <div className="trust__grid">
          {live.map((p) => (
            <a key={p.slug} className="trust__card" href={p.live} target="_blank" rel="noopener noreferrer" data-fade data-cursor="Visit">
              <span className="trust__q">&ldquo;</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className="trust__link">{p.live?.replace(/^https?:\/\//, "").replace(/\/$/, "")} <i aria-hidden="true">↗</i></span>
            </a>
          ))}
          <div className="trust__card trust__card--cta" data-fade>
            <h3>Your product could be next.</h3>
            <p>Tell me what you're building. I'll come back with a plan, a scope and an honest timeline.</p>
            <Btn href={mailto("Project enquiry")} variant="red">Get in touch</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */
export function Contact() {
  const [state, setState] = useState({ name: "", email: "", msg: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${state.msg}\n\n— ${state.name}\n${state.email}`;
    location.href = `${mailto(`Project enquiry from ${state.name || "your website"}`)}&body=${encodeURIComponent(body)}`;
  };
  const set = (k: keyof typeof state) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setState((s) => ({ ...s, [k]: e.target.value }));
  return (
    <section id="contact" className="sec sec--dark contact">
      <div className="wrap">
        <Kicker>Hire me</Kicker>
        <Words text="Let's build what's next." className="h2 h2--xl" />
        <div className="contact__grid">
          <div data-fade>
            <p className="contact__lede">
              Got an idea, a product to ship or a problem that needs solving? Tell me about it. I read every message and reply personally.
            </p>
            <a className="contact__mail" href={mailto()} data-cursor="Email">{EMAIL}</a>
            <ul className="socials">
              <li><a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
              <li><a href={TWITTER} target="_blank" rel="noopener noreferrer">X / Twitter ↗</a></li>
            </ul>
          </div>
          <form className="form" onSubmit={submit} data-fade>
            <label><span>Your name</span><input required value={state.name} onChange={set("name")} autoComplete="name" placeholder="Jane Doe" /></label>
            <label><span>Email</span><input required type="email" value={state.email} onChange={set("email")} autoComplete="email" placeholder="jane@company.com" /></label>
            <label><span>What are you building?</span><textarea required rows={4} value={state.msg} onChange={set("msg")} placeholder="A few lines about the project, goals and timeline" /></label>
            <button className="btn btn--red" type="submit"><span>Send message</span><i aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" /></svg></i></button>
          </form>
        </div>
      </div>
      <footer className="footer wrap">
        <p>© {new Date().getFullYear()} Joel Onyedika</p>
        <p>Full-stack software developer</p>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top ↑</a>
      </footer>
    </section>
  );
}
