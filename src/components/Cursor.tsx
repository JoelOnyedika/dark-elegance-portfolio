import { useEffect, useRef } from "react";
import { gsap, coarse } from "@/lib/motion";

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (coarse) return;
    const el = ring.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      el.style.opacity = "1";
      xTo(e.clientX); yTo(e.clientY);
      const t = (e.target as HTMLElement)?.closest?.("a,button,input,textarea,[data-hover]");
      el.classList.toggle("is-hover", !!t);
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, []);
  if (coarse) return null;
  return <div className="cursor" ref={ring} aria-hidden="true" />;
}
