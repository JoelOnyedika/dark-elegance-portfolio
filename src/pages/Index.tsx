import { lazy, Suspense, useEffect } from "react";
import { gsap, ScrollTrigger, startSmoothScroll, reduced } from "@/lib/motion";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import { Nav, Hud } from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Work from "@/components/sections/Work";
import Contact from "@/components/sections/Contact";
const Scene = lazy(() => import("@/components/Scene"));

const Index = () => {
  useEffect(() => {
    document.title = "Joel Onyedika | Software developer";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const stop = startSmoothScroll();
    const ctx = gsap.context(() => {
      if (reduced) return;
      // blocks rise out of the depth and leave upward
      gsap.utils.toArray<HTMLElement>("[data-pane]").forEach((el) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 95%", end: "bottom 5%", scrub: 0.5 } })
          .fromTo(el, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" })
          .to(el, { duration: 0.5 })
          .to(el, { opacity: 0, y: -50, duration: 0.25, ease: "power2.in" });
      });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { ctx.revert(); stop(); };
  }, []);

  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <Suspense fallback={null}><Scene /></Suspense>
      <Preloader />
      <Cursor />
      <Nav />
      <Hud />
      <main className="main">
        <Hero />
        <About />
        <Stack />
        <Work />
        <Contact />
      </main>
    </>
  );
};

export default Index;
