import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { PHRASES } from "@/lib/data";
import { gsap, ScrollTrigger, reduced, scrollToId } from "@/lib/motion";
import Magnetic from "../Magnetic";

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (reduced) { setText(phrases[0]); return; }
    let i = 0, c = 0, del = false, id: number;
    const step = () => {
      const p = phrases[i];
      c += del ? -1 : 1;
      setText(p.slice(0, c));
      let wait = del ? 35 : 75;
      if (!del && c === p.length) { del = true; wait = 1400; }
      else if (del && c === 0) { del = false; i = (i + 1) % phrases.length; wait = 350; }
      id = window.setTimeout(step, wait);
    };
    id = window.setTimeout(step, 2400);
    return () => clearTimeout(id);
  }, [phrases]);
  return text;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const typed = useTypewriter(PHRASES);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".hero__bg .ch");
      const ins = gsap.utils.toArray<HTMLElement>(".hero__in");
      gsap.set(chars, { yPercent: 120, opacity: 0 });
      gsap.set(ins, { y: 30, opacity: 0 });
      const play = () => {
        gsap.to(chars, { yPercent: 0, opacity: 1, duration: 1.3, ease: "power4.out", stagger: 0.045, delay: 0.1 });
        gsap.to(ins, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12, delay: 1.1 });
      };
      window.addEventListener("preloader:done", play, { once: true });

      // Giant type recedes as the head flies toward the camera.
      gsap.to(root.current!.querySelector(".hero__bg"), {
        scale: 1.25, opacity: 0, yPercent: -8, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(root.current!.querySelector(".hero__fg"), {
        y: -80, opacity: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const word = (w: string) => w.split("").map((c, i) => <span className="chw" key={i}><span className="ch">{c}</span></span>);

  return (
    <section id="home" className="hero" ref={root}>
      <h1 className="hero__bg" aria-label="Hello, I'm Joel. Full-stack developer.">
        <span className="hero__line" aria-hidden="true">{word("HELLO,")}</span>
        <span className="hero__line" aria-hidden="true">{word("I'M JOEL")}</span>
      </h1>

      <div className="hero__fg">
        <div className="hero__in hero__pitch">
          <p className="hero__lead">Your codebase is a mess. I clean it up.</p>
          <p className="hero__sub">Full-stack developer who turns spaghetti code into clean architecture. I build SaaS apps and rescue legacy systems, fast.</p>
        </div>
        <div className="hero__in hero__side">
          <p className="hero__type" aria-hidden="true">{typed}<i /></p>
          <div className="hero__cta">
            <Magnetic><a className="btn btn--lime" href="#work" onClick={(e) => { e.preventDefault(); scrollToId("work"); }}>See my work</a></Magnetic>
            <Magnetic><a className="btn btn--ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Hire me</a></Magnetic>
          </div>
        </div>
      </div>
      <a className="hero__scroll" href="#about" onClick={(e) => { e.preventDefault(); scrollToId("about"); }} aria-label="Scroll to about"><ArrowDown size={18} /></a>
    </section>
  );
}
