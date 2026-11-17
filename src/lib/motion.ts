import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;
export const reduced = mq("(prefers-reduced-motion: reduce)");
export const coarse = mq("(pointer: coarse)");

export const motion: { lenis: Lenis | null } = { lenis: null };

/** Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger and the 3D scene stay in lockstep. */
export function startSmoothScroll() {
  if (reduced) return () => {};
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  motion.lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    motion.lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (motion.lenis) {
    motion.lenis.scrollTo(el, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
}

export { gsap, ScrollTrigger };
