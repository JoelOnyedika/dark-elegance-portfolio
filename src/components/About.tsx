import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { scrollToId } from "@/lib/motion";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="about" className="sec about" ref={ref} aria-labelledby="about-h">
      <div className="wrap">
        <p className="kicker" data-reveal><span>01</span> About</p>
        <h2 id="about-h" className="h2 h2--big" data-reveal>
          I build software people actually want to use: <em>beautiful websites, 3D experiences, AI products</em> and everything behind them.
        </h2>
        <div className="about__cols">
          <p className="lede" data-reveal>
            I'm Joel, a full-stack developer. I design and build full websites and web apps, including immersive 3D ones, and
            I work across the whole stack: the interface, the API, the data and the AI that sits on top. If you have an idea or a problem worth solving, I'll help you turn it into something real,
            shipped and dependable.
          </p>
          <ul className="signals" data-reveal data-delay="0.1">
            <li><span className="live-dot" aria-hidden="true" />Open to new projects and roles</li>
            <li>From first sketch to deployed product</li>
            <li>Front-end, 3D, back-end and AI under one roof</li>
          </ul>
        </div>
        <a className="btn" href="#contact" data-reveal onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Let's talk <i aria-hidden="true">→</i></a>
      </div>
    </section>
  );
}
