import { useEffect, useRef } from "react";
import { drawFrame, endBlur, placement, store } from "@/lib/frames";
import Cosmos from "./Cosmos";

/**
 * Persistent atmosphere behind the whole site.
 *  - still: a large, cleaned render of the final frame, painted with exactly the placement the opening ends on,
 *    so when the opening canvas fades out nothing changes on screen.
 *  - cosmos: stars, constellation, aurora and orbs that react to scroll and pointer.
 */
export default function Env({ reduced, ready }: { reduced: boolean; ready: boolean }) {
  const still = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ready) return;
    const cv = still.current!;
    const ctx = cv.getContext("2d")!;
    const paint = () => {
      const img = store.env;
      if (!img) return;
      const w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      // the soft finish is baked in once here, so nothing has to be blurred while scrolling
      const tmp = document.createElement("canvas");
      tmp.width = cv.width; tmp.height = cv.height;
      drawFrame(tmp.getContext("2d")!, img, cv.width, cv.height, placement(w, h, 1), dpr);
      ctx.clearRect(0, 0, cv.width, cv.height);
      try { ctx.filter = `blur(${(endBlur(w, h) * dpr).toFixed(2)}px)`; } catch { /* unsupported: stays sharp */ }
      ctx.drawImage(tmp, 0, 0);
      ctx.filter = "none";
      document.documentElement.classList.add("env-ready");
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(cv);
    return () => ro.disconnect();
  }, [ready]);

  return (
    <div className="env" aria-hidden="true">
      <div className="env__base" />
      <canvas className="env__still" ref={still} />
      <div className="env__veil" />
      <Cosmos reduced={reduced} />
    </div>
  );
}
