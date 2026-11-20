import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
export const smooth: { lenis: Lenis | null } = { lenis: null };

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Lenis smooth scrolling wired into the GSAP ticker. Returns a cleanup function. */
export function startSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
  smooth.lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    smooth.lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  if (smooth.lenis) smooth.lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: reducedQuery.matches ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
