import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, smooth, smoothstep, scrollToId } from "@/lib/motion";
import { drawFrame, frameAt, frameIndexFor, placement, store, zoomPhase } from "@/lib/frames";
import { env, nav } from "@/lib/state";
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
  const bridge = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const root = document.documentElement;
    let w = 0, h = 0, dpr = 1, p = 0, target = 0, lastKey = "";
    const RATE = 2.2, LEASH = 0.14; // max playback speed (share of the opening per second) and how far scroll may run ahead

    const render = () => {
      if (!w) return;
      const idx = frameIndexFor(p);
      const pl = placement(w, h, p);
      const key = `${store.frames[idx] ? 1 : 0}|${idx}|${pl.x.toFixed(1)}|${pl.y.toFixed(1)}|${pl.w.toFixed(1)}|${pl.feather.toFixed(0)}`;
      if (key === lastKey) return;
      lastKey = key;
      const img = frameAt(idx);
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
      hint.current!.style.opacity = String(1 - smoothstep(0, 0.05, p));
      const br = smoothstep(0.76, 0.93, p);
      bridge.current!.style.opacity = String(br);
      bridge.current!.style.transform = `translate3d(0,${((1 - br) * 36).toFixed(1)}px,0) scale(${(1.08 - br * 0.08).toFixed(3)})`;
      const gl = smoothstep(0.55, 1, zoomPhase(p));
      env.gl = gl;
      root.style.setProperty("--gl", gl.toFixed(3));
      const done = zoomPhase(p) >= 0.999;
      cv.style.opacity = done ? "0" : "1";
      root.classList.toggle("env-live", done);
      root.classList.toggle("nav-on", p > 0.9);
    };

    const size = () => {
      const r = stage.current!.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      lastKey = "";
      stage.current!.classList.toggle("is-land", w / h >= 0.9);
      render();
    };

    let ownY = -1;
    const update = (self: ScrollTrigger) => {
      if (ownY >= 0 && Math.abs(scrollY - ownY) < 2) return; // our own correction, not the visitor
      ownY = -1;
      target = self.progress; // where the visitor is heading
    };
    // Playback chases that target at a capped speed, and the page may only run a little ahead of it,
    // so a hard flick can't skip the sequence: scroll glides forward as it plays, then lets go.
    const tick = (_t: number, dtMs: number) => {
      const dt = Math.min(dtMs, 64) / 1000;
      const before = p;
      if (performance.now() < nav.freeUntil) p = target;
      else {
        p += Math.max(-RATE * dt, Math.min(RATE * dt, (target - p) * (1 - Math.exp(-dt * 7))));
        const span = st.end - st.start;
        if (span > 0 && Math.abs(target - p) > 0.0005) {
          const q = (scrollY - st.start) / span;
          const lim = Math.max(p - LEASH, Math.min(p + LEASH, target));
          if (Math.abs(q - lim) > 0.002 && !(p < 0.001 && target < 0.001)) {
            const y = st.start + lim * span;
            ownY = y;
            if (smooth.lenis) smooth.lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y);
          }
        }
      }
      if (Math.abs(p - before) > 1e-5) { render(); apply(); }
    };
    gsap.ticker.add(tick);
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
    const onFrame = (i: number) => { if (i === frameIndexFor(p)) render(); };
    store.listeners.add(onFrame);
    size();
    apply();
    return () => {
      gsap.ticker.remove(tick); st.kill(); veil.kill(); ro.disconnect(); store.listeners.delete(onFrame); removeEventListener("pointermove", onMove);
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
        <div className="bridge" ref={bridge} aria-hidden="true">
          <span className="bridge__k">Welcome to my world</span>
          <span className="bridge__t">Let's build what's next.</span>
        </div>
        <div className="scrollhint" ref={hint}>
          <span className="scrollhint__label">Scroll to enter</span>
          <span className="scrollhint__mouse" aria-hidden="true"><i /></span>
          <span className="scrollhint__chev" aria-hidden="true"><i /><i /></span>
          <a className="scrollhint__skip" href="#about" onClick={(e) => { e.preventDefault(); scrollToId("about"); }}>Skip intro</a>
        </div>
      </div>
    </section>
  );
}
