import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { NAV, mailto } from "@/lib/data";
import { finePointer, gsap, lockScroll, reduced, scrollToId } from "@/lib/motion";

/** Headline that reveals word by word. Any word ending in "." gets a red period. */
export function Words({
  text, as: Tag = "h2", className = "", hero = false, id,
}: { text: string; as?: ElementType; className?: string; hero?: boolean; id?: string }) {
  return (
    <Tag id={id} className={`words ${className}`} data-hero={hero ? "" : undefined} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="w" aria-hidden="true">
            <span className="wi">
              {w.endsWith(".") ? <>{w.slice(0, -1)}<b className="dot">.</b></> : w}
            </span>
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Pill button with a magnetic hover and an arrow circle. */
export function Btn({
  children, href, onClick, variant = "red", id,
}: { children: ReactNode; href?: string; onClick?: () => void; variant?: "red" | "ghost" | "light" | "dark"; id?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer || reduced) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  return (
    <a
      ref={ref}
      className={`btn btn--${variant}`}
      href={href ?? (id ? `#${id}` : "#")}
      onClick={(e) => {
        if (id) { e.preventDefault(); scrollToId(id); }
        onClick?.();
      }}
      {...(href && /^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <i aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" /></svg></i>
    </a>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker" data-fade><span className="kicker__dot" />{children}</p>;
}

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { lockScroll(open); }, [open]);
  const go = (id: string) => { setOpen(false); setTimeout(() => scrollToId(id), open ? 350 : 0); };
  return (
    <header className={`nav ${solid ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
      <a className="nav__logo" href="#top" onClick={(e) => { e.preventDefault(); setOpen(false); scrollToId("top"); }}>
        joel<b>.</b>dev
      </a>
      <nav className="nav__links" aria-label="Primary">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); go(n.id); }}>{n.label}</a>
        ))}
      </nav>
      <a className="nav__cta" href={mailto("Project enquiry")}>Let's talk</a>
      <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}><span /><span /></button>
      <div className="nav__sheet" aria-hidden={!open}>
        {NAV.map((n) => (<a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); go(n.id); }}>{n.label}</a>))}
        <a href={mailto("Project enquiry")}>Let's talk</a>
      </div>
    </header>
  );
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(o, { v: 100, duration: reduced ? 0.2 : 1.5, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0"); } })
      .to(".pre__name .wi", { yPercent: -110, duration: 0.5, ease: "power3.in", stagger: 0.04 }, "+=0.1")
      .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.2");
    return () => { tl.kill(); };
  }, [onDone]);
  return (
    <div className="pre" ref={root} aria-hidden="true">
      <p className="pre__name"><span className="w"><span className="wi">Joel</span></span> <span className="w"><span className="wi">Onyedika<b className="dot">.</b></span></span></p>
      <span className="pre__num" ref={num}>000</span>
    </div>
  );
}

/** Custom cursor that grows a label over [data-cursor] elements. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (!finePointer || reduced) return;
    const el = dot.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(t?.dataset.cursor ?? "");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  if (!finePointer) return null;
  return <div ref={dot} className={`cursor ${label ? "is-on" : ""}`} aria-hidden="true"><span>{label}</span></div>;
}
