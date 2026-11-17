import { lazy, Suspense, useEffect } from "react";
import { gsap, ScrollTrigger, startSmoothScroll, reduced } from "@/lib/motion";
const Scene = lazy(() => import("@/components/Scene"));
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import Voices from "@/components/sections/Voices";
import Contact from "@/components/sections/Contact";

const Index = () => {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const stop = startSmoothScroll();

    // Every [data-pane] drifts in out of depth and drifts back out as it leaves.
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-pane]").forEach((el) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 100%", end: "bottom 0%", scrub: 0.5 } })
          .fromTo(el, { opacity: 0, y: 90, rotateX: 14, scale: 0.94, transformPerspective: 1200, transformOrigin: "50% 100%" },
            { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.28, ease: "power2.out" })
          .to(el, { duration: 0.44 })
          .to(el, { opacity: 0, y: -70, rotateX: -10, scale: 0.96, transformOrigin: "50% 0%", duration: 0.28, ease: "power2.in" });
      });
    });

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { ctx.revert(); stop(); };
  }, []);

  return (
    <>
      <Suspense fallback={null}><Scene /></Suspense>
      <Preloader />
      <Cursor />
      <Nav />
      <main className="main">
        <Hero />
        <About />
        <Services />
        <Skills />
        <Work />
        <Voices />
        <Contact />
      </main>
    </>
  );
};

export default Index;
