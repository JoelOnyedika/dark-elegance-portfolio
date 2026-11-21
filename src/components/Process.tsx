import { useRef } from "react";
import { CRAFT, STACK, STEPS } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

function Visual({ n }: { n: number }) {
  if (n === 0) return (
    <div className="viz viz--brief" aria-hidden="true">
      <p className="bub bub--them">I need an app that lets customers ask questions about our documents.</p>
      <p className="bub bub--me">Got it. Who uses it, what data, and when do you need it live?</p>
      <p className="bub bub--them">Support team, PDFs and wikis, six weeks.</p>
      <p className="bub bub--typing"><i /><i /><i /></p>
    </div>
  );
  if (n === 1) return (
    <div className="viz viz--system" aria-hidden="true">
      {["Interface", "API & logic", "Data & AI"].map((r, i) => <div key={r} className="row" style={{ ["--d" as string]: `${i * 1.6}s` } as React.CSSProperties}><b />{r}<span /></div>)}
    </div>
  );
  return (
    <div className="viz viz--ship" aria-hidden="true">
      <p><span>✓</span> tests passing</p><p><span>✓</span> performance budget met</p><p><span>✓</span> deployed to production</p><p className="viz__live"><span className="live-dot" /> live</p>
    </div>
  );
}

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="process" className="sec process" ref={ref} aria-labelledby="proc-h">
      <div className="wrap wrap--wide">
        <p className="kicker" data-reveal><span>03</span> Process</p>
        <h2 id="proc-h" className="h2 h2--big" data-reveal>From idea to launch, <em>in three steps.</em></h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className="step" data-reveal data-delay={i * 0.1}>
              <p className="step__n">Step {s.n}</p>
              <h3>{s.title}</h3>
              <p className="step__t">{s.text}</p>
              <Visual n={i} />
            </li>
          ))}
        </ol>

        <div className="stack" data-reveal>
          <div className="stack__head">
            <p className="kicker"><span>Under the hood</span></p>
            <h3>The best tools on the planet, <em>pointed at your problem.</em></h3>
            <p>I pick the right tool for the job, not the trendy one, then go deep: architecture, performance, security and the details that make software feel effortless.</p>
          </div>
          <div className="marquee" aria-label={`Technologies I work with: ${STACK.join(", ")}`}>
            {[0, 1].map((row) => (
              <div key={row} className={`marquee__row ${row ? "is-rev" : ""}`} aria-hidden="true">
                <div className="marquee__track">{[...STACK, ...STACK].map((t, i) => <span key={i}>{t}</span>)}</div>
              </div>
            ))}
          </div>
          <ul className="craft">
            {CRAFT.map((c) => <li key={c.title}><h4>{c.title}</h4><p>{c.text}</p></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
