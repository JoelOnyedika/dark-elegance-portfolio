import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/motion";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero .rise > span");
      const fade = gsap.utils.toArray<HTMLElement>(".hero__role");
      if (reduced) return;
      gsap.set(lines, { yPercent: 110 }); gsap.set(fade, { opacity: 0, y: 14 });
      const play = () => {
        gsap.to(lines, { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.08 });
        gsap.to(fade, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.6 });
      };
      window.addEventListener("preloader:done", play, { once: true });
      gsap.to(root.current!.querySelector(".hero__in"), { y: -50, opacity: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "65% top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={root}>
      <div className="hero__in">
        <h1 className="display">
          <span className="rise"><span>Joel</span></span>{" "}
          <span className="rise"><span>Onyedika</span></span>
        </h1>
        <p className="hero__role">Software developer. I build full-stack web apps and AI systems, including RAG applications.</p>
      </div>
    </section>
  );
}
