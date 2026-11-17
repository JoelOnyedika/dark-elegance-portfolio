import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/data";
import { ScrollTrigger, scrollToId } from "@/lib/motion";
import Magnetic from "./Magnetic";

const useClock = () => {
  const [t, setT] = useState(() => new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const time = useClock();

  useEffect(() => {
    const sts = NAV.map(({ id }) => ScrollTrigger.create({
      trigger: `#${id}`, start: "top 55%", end: "bottom 55%",
      onToggle: (s) => s.isActive && setActive(id),
    }));
    return () => sts.forEach((s) => s.kill());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); scrollToId(id); };

  return (
    <>
      <header className="nav">
        <nav className="nav__pill" aria-label="Main">
          <a href="#home" className="nav__logo" onClick={go("home")} aria-label="Joel Onyedika, home">
            <span className="nav__dot" />Joel Onyedika
          </a>
          <span className="nav__time" aria-hidden="true">{time}</span>
          <ul className="nav__links">
            {NAV.filter((n) => n.id !== "home" && n.id !== "contact").map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)} className={active === n.id ? "is-active" : ""}>{n.label}</a>
              </li>
            ))}
          </ul>
          <Magnetic strength={0.25}>
            <a href="#contact" onClick={go("contact")} className="nav__cta">Hire me</a>
          </Magnetic>
          <button className="nav__burger" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={20} /></button>
        </nav>
      </header>

      <div className={`sheet ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button className="sheet__close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={24} /></button>
        <ul>
          {NAV.map((n) => (
            <li key={n.id}><a href={`#${n.id}`} onClick={go(n.id)} tabIndex={open ? 0 : -1}>{n.label}</a></li>
          ))}
        </ul>
        <p className="sheet__avail"><span className="nav__dot" />Available for work</p>
      </div>
    </>
  );
}
