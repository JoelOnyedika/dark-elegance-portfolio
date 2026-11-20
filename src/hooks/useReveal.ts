import { RefObject, useEffect } from "react";
import { gsap, reducedQuery } from "@/lib/motion";

/**
 * Fades/rises every [data-reveal] element as it enters the viewport; reverses on the way back up.
 * Elements are visible by default in CSS, so a failed trigger can never leave content hidden
 * (the hidden state is only applied from here, by GSAP, once the trigger exists).
 */
export function useReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    if (reducedQuery.matches || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root.current!).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", delay: Number(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [root]);
}
