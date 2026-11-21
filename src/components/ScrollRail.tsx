import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/data";
import { smooth, reducedQuery } from "@/lib/motion";

/** Always-visible sense of place: a progress bar, the current section, and a way back up at the end. */
export default function ScrollRail() {
  const root = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [end, setEnd] = useState(false);

  useEffect(() => {
    let raf = 0, pending = false;
    const update = () => {
      pending = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const pg = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      root.current?.style.setProperty("--pg", pg.toFixed(4));
      let cur = "";
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.5) cur = n.label;
      }
      setLabel((p) => (p === cur ? p : cur));
      setEnd((p) => { const v = pg > 0.985; return p === v ? p : v; });
    };
    const on = () => { if (!pending) { pending = true; raf = requestAnimationFrame(update); } };
    addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    update();
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  const top = () => {
    if (smooth.lenis) smooth.lenis.scrollTo(0, { duration: 2 });
    else scrollTo({ top: 0, behavior: reducedQuery.matches ? "auto" : "smooth" });
  };

  return (
    <div className={`rail ${end ? "is-end" : ""}`} ref={root}>
      <div className="rail__bar" aria-hidden="true" />
      <div className="rail__side" aria-hidden="true">
        <span>{end ? "END" : "SCROLL"}</span>
        <span className="rail__line" />
        <span className="rail__label">{label}</span>
      </div>
      <button className="rail__top" onClick={top} aria-label="Back to top">Back to top ↑</button>
    </div>
  );
}
