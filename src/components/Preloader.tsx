import { useEffect, useRef, useState } from "react";
import { gsap, reduced } from "@/lib/motion";

export default function Preloader() {
  const wrap = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("is-loading");
    const o = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.to(o, { v: 100, duration: reduced ? 0.1 : 1.5, ease: "power2.inOut",
        onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0"); } });
      tl.add(() => { window.dispatchEvent(new Event("preloader:done")); }, "-=0.2");
      tl.to(".pre__inner", { opacity: 0, duration: 0.3 }, "<");
      tl.to(wrap.current, { yPercent: -100, duration: reduced ? 0.1 : 1, ease: "power4.inOut" }, "<0.1");
      tl.add(() => { document.documentElement.classList.remove("is-loading"); setGone(true); });
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1800))]).then(() => tl.play());
    }, wrap);
    return () => ctx.revert();
  }, []);

  if (gone) return null;
  return (
    <div className="pre" ref={wrap} role="status" aria-label="Loading">
      <div className="pre__inner">
        <p className="pre__name">Joel Onyedika</p>
        <span className="pre__num" ref={num}>000</span>
      </div>
    </div>
  );
}
