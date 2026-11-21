import { useEffect, useRef } from "react";
import { ScrollTrigger, smoothstep, scrollToId } from "@/lib/motion";
import { drawFrame, endBlur, frameIndexFor, placement, store, zoomPhase } from "@/lib/frames";
import { env } from "@/lib/state";
import { TITLE } from "@/lib/data";

const Letters = ({ text, base = 0 }: { text: string; base?: number }) => (
  <span className="hero__letters" aria-hidden="true">
    {text.split("").map((c, i) => <i key={i} style={{ ["--i" as string]: i + base } as React.CSSProperties}>{c}</i>)}
  </span>
);

/** Pinned (sticky) scroll section that scrubs the frame sequence and zooms into the laptop screen. */
export default function Opening({ ready, entered }: { ready: boolean; entered: boolean }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLDivElement>(null);
  const meta = useRef<HTMLDivElement>(null);
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
      const fade = 1 - smoothstep(0.02, 0.15, p);
      const away = smoothstep(0, 0.16, p);
      first.current!.style.transform = `translate3d(${-away * 38}vw,${-away * 6}vh,0)`;
      last.current!.style.transform = `translate3d(${away * 38}vw,${away * 6}vh,0)`;
      meta.current!.style.transform = `translate3d(0,${away * 40}px,0)`;
      for (const el of [first.current!, last.current!, meta.current!, scrim.current!]) {
        el.style.opacity = String(fade);
        el.style.visibility = fade < 0.01 ? "hidden" : "visible";
      }
      hint.current!.style.opacity = String(1 - smoothstep(0, 0.04, p));
      const gl = smoothstep(0.55, 1, zoomPhase(p));
      env.gl = gl;
      root.style.setProperty("--gl", gl.toFixed(3));
      const done = zoomPhase(p) >= 0.999;
      cv.style.opacity = done ? "0" : "1";
      root.classList.toggle("env-live", done);
      const k = smoothstep(0, 1, zoomPhase(p));
      cv.style.filter = k > 0.01 ? `blur(${(k * endBlur(w, h)).toFixed(2)}px)` : "";
      root.classList.toggle("nav-on", p > 0.9);
    };

    const size = () => {
      const r = stage.current!.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      lastKey = "";
      root.style.setProperty("--b0", `${endBlur(w, h)}px`);
      stage.current!.classList.toggle("is-land", w / h >= 0.9);
      render();
    };

    const update = (self: ScrollTrigger) => { p = self.progress; render(); apply(); };
    const st = ScrollTrigger.create({ trigger: section.current, start: "top top", end: "bottom bottom", onUpdate: update, onRefresh: update });
    // readability veil only arrives once the opening has finished and content starts to scroll in
    const veil = ScrollTrigger.create({ trigger: section.current, start: "bottom bottom", end: "bottom 20%", onUpdate: (self) => root.style.setProperty("--veil", self.progress.toFixed(3)), onRefresh: (self) => root.style.setProperty("--veil", self.progress.toFixed(3)) });
    const ro = new ResizeObserver(size);
    ro.observe(stage.current!);
    // pointer parallax for the hero words (desktop)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || p > 0.2) return;
      stage.current!.style.setProperty("--mx", (e.clientX / innerWidth - 0.5).toFixed(3));
      stage.current!.style.setProperty("--my", (e.clientY / innerHeight - 0.5).toFixed(3));
    };
    addEventListener("pointermove", onMove);
    size();
    apply();
    return () => {
      st.kill(); veil.kill(); ro.disconnect(); removeEventListener("pointermove", onMove);
      root.style.setProperty("--gl", "0"); root.style.setProperty("--veil", "0"); root.classList.remove("nav-on"); env.gl = 0;
    };
  }, [ready]);

  return (
    <section id="top" className={`opening ${entered ? "is-in" : ""}`} ref={section} aria-label="Introduction">
      <div className="opening__stage" ref={stage}>
        <canvas className="opening__canvas" ref={canvas} aria-hidden="true" />
        <div className="opening__scrim" ref={scrim} aria-hidden="true" />
        <h1 className="sr-only">Joel Onyedika, {TITLE.toLowerCase()}</h1>
        <div className="hero">
          <div className="hero__side hero__side--first" ref={first}><div className="hero__word"><Letters text="JOEL" /></div></div>
          <div className="hero__side hero__side--last" ref={last}><div className="hero__word"><Letters text="ONYEDIKA" base={3} /></div></div>
          <div className="hero__meta" ref={meta}>
            <p className="hero__title">{TITLE}</p>
            <p className="hero__sub"><span>Web apps</span><i aria-hidden="true" /><span>RAG &amp; AI</span><i aria-hidden="true" /><span>Agents</span><i aria-hidden="true" /><span>Payments</span></p>
          </div>
        </div>
        <div className="scrollhint" ref={hint}>
          <span className="scrollhint__label">Scroll to enter</span>
          <span className="scrollhint__line" aria-hidden="true" />
          <a className="scrollhint__skip" href="#about" onClick={(e) => { e.preventDefault(); scrollToId("about"); }}>Skip intro</a>
        </div>
      </div>
    </section>
  );
}
