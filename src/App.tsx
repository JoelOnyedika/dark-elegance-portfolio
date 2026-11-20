import { useEffect, useState } from "react";
import { FRAME_COUNT, frameUrl, preloadFrames, store } from "@/lib/frames";
import { ScrollTrigger, reducedQuery, startSmoothScroll } from "@/lib/motion";
import Preloader from "@/components/Preloader";
import Env from "@/components/Env";
import Nav from "@/components/Nav";
import Opening from "@/components/Opening";
import StaticHero from "@/components/StaticHero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function App() {
  const [reduced] = useState(() => reducedQuery.matches);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const root = document.documentElement;

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (reduced) {
      // static visual state: only the final frame is needed (as the environment)
      root.classList.add("nav-on");
      const img = new Image();
      img.onload = () => { store.frames[FRAME_COUNT - 1] = img; setReady(true); };
      img.src = frameUrl(FRAME_COUNT - 1);
      return;
    }
    root.classList.add("is-loading");
    let alive = true;
    preloadFrames((n) => alive && setLoaded(n)).then(() => alive && setReady(true));
    return () => { alive = false; };
  }, [reduced, root]);

  useEffect(() => {
    if (!ready || reduced) return;
    root.classList.remove("is-loading");
    const stop = startSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    requestAnimationFrame(refresh);
    return () => { stop(); window.removeEventListener("load", refresh); };
  }, [ready, reduced, root]);

  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <Env reduced={reduced} ready={ready} />
      <Nav always={reduced} />
      <main>
        {reduced ? <StaticHero /> : <Opening ready={ready} />}
        <About />
        <Skills />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      {!reduced && <Preloader loaded={loaded} ready={ready} />}
    </>
  );
}
