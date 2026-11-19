import { gsap, reduced } from "./motion";

let navigate: ((p: string) => void) | null = null;
let curtain: HTMLElement | null = null;
export const bindTransition = (n: (p: string) => void, el: HTMLElement | null) => { navigate = n; curtain = el; };

/** Route change: the curtain slides over, the route swaps underneath, the curtain leaves. */
export function go(path: string) {
  if (!navigate) return;
  if (reduced || !curtain) { navigate(path); window.scrollTo(0, 0); return; }
  const el = curtain;
  gsap.timeline()
    .set(el, { display: "grid", yPercent: 100 })
    .to(el, { yPercent: 0, duration: 0.7, ease: "power4.inOut" })
    .add(() => { navigate!(path); window.scrollTo(0, 0); })
    .to(el, { yPercent: -100, duration: 0.7, ease: "power4.inOut", delay: 0.2 })
    .set(el, { display: "none" });
}
