import { useEffect, useState } from "react";
import { scrollToId, ScrollTrigger } from "@/lib/motion";
import { go } from "@/lib/transition";

const QUERIES: Record<string, string> = {
  home: 'query: "software developer"',
  about: "retrieve(k=3): web, ai, backend",
  stack: "context: tools and languages",
  work: "rank: projects",
  contact: "answer: say hello",
};

export function Nav({ home = true }: { home?: boolean }) {
  return (
    <header className="nav">
      <a className="nav__name" href="/" onClick={(e) => { e.preventDefault(); home ? scrollToId("home") : go("/"); }}>Joel Onyedika</a>
      <nav aria-label="Main" className="nav__links mono">
        {home ? (
          <>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId("about"); }}>About</a>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollToId("work"); }}>Work</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Contact</a>
          </>
        ) : (
          <a href="/" onClick={(e) => { e.preventDefault(); go("/"); }}>All work</a>
        )}
      </nav>
    </header>
  );
}

/** Bottom-left line that narrates the "query" for the chapter you're in. */
export function Hud() {
  const [id, setId] = useState("home");
  useEffect(() => {
    const sts = Object.keys(QUERIES).map((k) => ScrollTrigger.create({
      trigger: `#${k}`, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setId(k),
    }));
    return () => sts.forEach((s) => s.kill());
  }, []);
  return <p className={`hud mono ${id === "contact" ? "is-hidden" : ""}`} aria-hidden="true"><span key={id}>{"> "}{QUERIES[id]}</span></p>;
}
