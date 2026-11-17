import { useEffect, useRef, createElement } from "react";
import { gsap, ScrollTrigger, reduced } from "@/lib/motion";

/** Headline whose words rise out of a mask when it scrolls into view. */
export default function Split({ text, as = "h2", className = "" }: { text: string; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const words = el.querySelectorAll<HTMLElement>(".w > span");
    if (reduced) { gsap.set(words, { yPercent: 0 }); return; }
    gsap.set(words, { yPercent: 115, rotate: 4 });
    const st = ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.1, ease: "power4.out", stagger: 0.06 }),
    });
    return () => st.kill();
  }, [text]);
  return createElement(as, { ref, className: `split ${className}`, "aria-label": text },
    text.split(" ").map((w, i, a) => (
      <span key={i} aria-hidden="true"><span className="w"><span>{w}</span></span>{i < a.length - 1 ? " " : null}</span>
    )));
}
