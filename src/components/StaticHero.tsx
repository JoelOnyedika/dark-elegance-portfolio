import { TITLE } from "@/lib/data";

/** Reduced-motion and fallback hero: the same identity, no scroll sequence. */
export default function StaticHero() {
  return (
    <section id="top" className="static-hero is-in" aria-label="Introduction">
      <div className="hero hero--static">
        <h1 className="hero__static-name"><span>JOEL</span> <span>ONYEDIKA</span></h1>
        <p className="hero__title">{TITLE}</p>
        <p className="hero__sub"><span>Web apps</span><i aria-hidden="true" /><span>RAG &amp; AI</span><i aria-hidden="true" /><span>Agents</span><i aria-hidden="true" /><span>Payments</span></p>
      </div>
    </section>
  );
}
