import { useCallback, useEffect, useState } from "react";
import { ENV_URL, loadImage, preloadFrames, store } from "@/lib/frames";
import { ScrollTrigger, reducedQuery, startSmoothScroll } from "@/lib/motion";
import Preloader from "@/components/Preloader";
import Env from "@/components/Env";
import Nav from "@/components/Nav";
import ScrollRail from "@/components/ScrollRail";
import Opening from "@/components/Opening";
import StaticHero from "@/components/StaticHero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function App() {
  const [reduced] = useState(() => reducedQuery.matches);
  const [loaded, setLoaded] = useState(0);
  const [envReady, setEnvReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(reduced);
  const root = document.documentElement;

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (reduced) {
      // static visual state: only the cleaned final frame is needed, as the environment
      root.classList.add("nav-on");
      loadImage(ENV_URL).then((img) => { if (img) store.env = img; setReady(true); });
      return;
    }
    root.classList.add("is-loading");
    let alive = true;
    preloadFrames((n) => alive && setLoaded(n), 12, () => alive && setEnvReady(true)).then(() => alive && setReady(true));
    return () => { alive = false; };
  }, [reduced, root]);

  useEffect(() => {
    if (!ready || reduced) return;
    const stop = startSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    requestAnimationFrame(refresh);
    return () => { stop(); window.removeEventListener("load", refresh); };
  }, [ready, reduced]);

  const onExited = useCallback(() => { root.classList.remove("is-loading"); setEntered(true); }, [root]);

  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <Env reduced={reduced} ready={ready} />
      <Nav always={reduced} />
      <ScrollRail />
      <main>
        {reduced ? <StaticHero /> : <Opening ready={ready} entered={entered} />}
        <About />
        <Services />
        <Process />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      {!reduced && <Preloader loaded={loaded} ready={ready} envReady={envReady} onExited={onExited} />}
      <div className="grain" aria-hidden="true" />
    </>
  );
}
