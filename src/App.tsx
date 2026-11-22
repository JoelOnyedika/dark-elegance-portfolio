import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger, gsap, lockScroll, reduced, startSmooth } from "@/lib/motion";
import { Cursor, Nav, Preloader } from "@/components/ui";
import Hero from "@/components/Hero";
import { Contact, Process, Proof, Services, Trust, Why, Work } from "@/components/Sections";

export default function App() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const stop = startSmooth();
    lockScroll(true);
    return stop;
  }, []);

  const onDone = useCallback(() => { lockScroll(false); setEntered(true); }, []);

  useEffect(() => {
    if (!entered) return;
    const ctx = gsap.context(() => {
      if (!reduced) {
        // headline reveals
        gsap.utils.toArray<HTMLElement>(".words:not([data-hero])").forEach((el) => {
          gsap.fromTo(el.querySelectorAll(".wi"), { yPercent: 115, rotate: 3, opacity: 0 }, {
            yPercent: 0, rotate: 0, opacity: 1, duration: 1.2, stagger: 0.07, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        // generic fades
        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.fromTo(el, { y: 44, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
        // image parallax
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8, scale: 1.16 }, {
            yPercent: 8, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
        // stacked sections: each one pins at its bottom while the next slides over it
        gsap.utils.toArray<HTMLElement>("[data-stack]").forEach((sec) => {
          const inner = sec.querySelector<HTMLElement>(".stack__in");
          const st = { trigger: sec, start: "bottom bottom", end: "+=100%" };
          ScrollTrigger.create({ ...st, pin: true, pinSpacing: false });
          if (inner) gsap.to(inner, { scale: 0.94, opacity: 0.35, transformOrigin: "50% 100%", ease: "none", scrollTrigger: { ...st, scrub: true } });
        });
      }
      ScrollTrigger.refresh();
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => { window.removeEventListener("load", refresh); ctx.revert(); };
  }, [entered]);

  return (
    <>
      <Preloader onDone={onDone} />
      <Cursor />
      <Nav />
      <main>
        <Hero entered={entered} />
        <Services />
        <Work />
        <Process />
        <Why />
        <Proof />
        <Trust />
        <Contact />
      </main>
    </>
  );
}
