import { useEffect, useRef } from "react";
import { ScrollTrigger, smoothstep, scrollToId } from "@/lib/motion";
import { FRAME_H, drawFrame, endBlur, frameIndexFor, placement, store, zoomPhase } from "@/lib/frames";
import { env } from "@/lib/state";
import { NAME, TITLE } from "@/lib/data";

/** Pinned (sticky) scroll section that scrubs the supplied frame sequence and zooms into the laptop screen. */
export default function Opening({ ready }: { ready: boolean }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const root = document.documentElement;
    let w = 0, h = 0, dpr = 1, p = 0, lastKey = "";

    const render = () => {
      if (!w) return;
      const idx = frameIndexFor(p);
      const pl = placement(w, h, p);
      const key = `${idx}|${pl.x.toFixed(1)}|${pl.y.toFixed(1)}|${pl.w.toFixed(1)}|${pl.feather.toFixed(0)}`;
      if (key === lastKey) return;
      lastKey = key;
      const img = store.frames[idx];
      if (img) drawFrame(ctx, img, cv.width, cv.height, pl, dpr);
    };

    const apply = () => {
      const heroFade = 1 - smoothstep(0.015, 0.13, p);
      hero.current!.style.opacity = String(heroFade);
      hero.current!.style.transform = `translate3d(0,${-p * 160}px,0)`;
      hero.current!.style.visibility = heroFade < 0.01 ? "hidden" : "visible";
      scrim.current!.style.opacity = String(heroFade);
      hint.current!.style.opacity = String(1 - smoothstep(0, 0.04, p));
      const gl = smoothstep(0.55, 1, zoomPhase(p));
      env.gl = gl;
      root.style.setProperty("--gl", gl.toFixed(3));
      const done = zoomPhase(p) >= 0.999;
      cv.style.opacity = done ? "0" : "1";
      const k = smoothstep(0, 1, zoomPhase(p));
      cv.style.filter = k > 0.01 ? `blur(${(k * endBlur(w, h)).toFixed(2)}px)` : "";
      root.classList.toggle("env-live", done);
      root.classList.toggle("nav-on", p > 0.9);
    };

    const size = () => {
      const r = stage.current!.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      lastKey = "";
      // Landscape: the free band of desk above the laptop holds the type, so it never touches the laptop.
      const pl0 = placement(w, h, 0);
      root.style.setProperty("--b0", `${endBlur(w, h)}px`);
      const land = w / h >= 0.9;
      stage.current!.classList.toggle("is-land", land);
      if (land) {
        const top = Math.max(pl0.y, 0) + 0.04 * FRAME_H * pl0.scale + 14;
        const laptopTop = pl0.y + 0.205 * FRAME_H * pl0.scale;
        stage.current!.style.setProperty("--hero-top", `${top}px`);
        stage.current!.style.setProperty("--hero-h", `${Math.max(60, laptopTop - top)}px`);
      }
      render();
    };

    const update = (self: ScrollTrigger) => { p = self.progress; render(); apply(); };
    const st = ScrollTrigger.create({ trigger: section.current, start: "top top", end: "bottom bottom", onUpdate: update, onRefresh: update });
    // readability veil only arrives once the opening has finished and content starts to scroll in
    const veil = ScrollTrigger.create({ trigger: section.current, start: "bottom bottom", end: "bottom 20%", onUpdate: (self) => root.style.setProperty("--veil", self.progress.toFixed(3)), onRefresh: (self) => root.style.setProperty("--veil", self.progress.toFixed(3)) });
    const ro = new ResizeObserver(size);
    ro.observe(stage.current!);
    size();
    apply();
    return () => {
      st.kill(); veil.kill(); ro.disconnect();
      root.style.setProperty("--gl", "0"); root.style.setProperty("--veil", "0"); root.classList.remove("nav-on"); env.gl = 0;
    };
  }, [ready]);

  return (
    <section id="top" className="opening" ref={section} aria-label="Introduction">
      <div className="opening__stage" ref={stage}>
        <canvas className="opening__canvas" ref={canvas} aria-hidden="true" />
        <div className="opening__scrim" ref={scrim} aria-hidden="true" />
        <div className="hero" ref={hero}>
          <h1 className="hero__name"><span>JOEL</span> <span>ONYEDIKA</span></h1>
          <p className="hero__title">{TITLE}</p>
        </div>
        <div className="scrollhint" ref={hint}>
          <span className="scrollhint__label">Scroll</span>
          <span className="scrollhint__line" aria-hidden="true" />
          <a className="scrollhint__skip" href="#about" onClick={(e) => { e.preventDefault(); scrollToId("about"); }}>Skip intro</a>
        </div>
        <span className="sr-only">{NAME}</span>
      </div>
    </section>
  );
}
