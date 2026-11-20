import { TITLE } from "@/lib/data";

/** Reduced-motion and fallback hero: the same identity, no scroll sequence. */
export default function StaticHero() {
  return (
    <section id="top" className="static-hero" aria-label="Introduction">
      <div className="hero hero--static">
        <h1 className="hero__name"><span>JOEL</span> <span>ONYEDIKA</span></h1>
        <p className="hero__title">{TITLE}</p>
      </div>
    </section>
  );
}
