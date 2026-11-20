import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/data";
import { scrollToId } from "@/lib/motion";

export default function Nav({ always }: { always: boolean }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); scrollToId(id); };
  return (
    <header className={`nav ${always ? "nav--always" : ""} ${open ? "is-open" : ""}`}>
      <a className="nav__mark" href="#top" onClick={(e) => { e.preventDefault(); setOpen(false); window.scrollTo({ top: 0 }); }} aria-label="Joel Onyedika, back to top">J·O</a>
      <button ref={btn} className="nav__toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span><i /><i />
      </button>
      <nav id="nav-links" className="nav__links" aria-label="Primary">
        {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a>)}
      </nav>
    </header>
  );
}
