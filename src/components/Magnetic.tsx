import { useRef, type ReactNode } from "react";
import { gsap, coarse, reduced } from "@/lib/motion";

/** Wraps a button/link so it leans toward the pointer. */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  if (coarse || reduced) return <span className="mag">{children}</span>;
  const move = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength, duration: 0.4, ease: "power3.out" });
  };
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.4)" });
  return <span className="mag" ref={ref} onPointerMove={move} onPointerLeave={leave}>{children}</span>;
}
