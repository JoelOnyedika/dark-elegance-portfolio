import { useEffect, useRef } from "react";
import { STATS } from "@/lib/data";
import { gsap, reduced } from "@/lib/motion";
import { Btn, Words } from "@/components/ui";

/** A rotating sphere of points, softly rippled, that pushes away from the pointer. */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const small = innerWidth < 760;
    const N = small ? 900 : 2200;
    const pts = Array.from({ length: N }, (_, i) => {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * k;
      return { x: Math.cos(th) * Math.sin(phi), y: Math.cos(phi), z: Math.sin(th) * Math.sin(phi), ox: 0, oy: 0 };
    });
    let w = 0, h = 0, dpr = 1;
    const mouse = { x: -9999, y: -9999, tx: 0, ty: 0 };
    const fit = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      mouse.tx = (mouse.x / w - 0.5) * 0.6;
      mouse.ty = (mouse.y / h - 0.5) * 0.4;
    };
    addEventListener("pointermove", onMove);
    addEventListener("resize", fit);
    let rotX = 0, rotY = 0, visible = true, raf = 0, last = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(c);
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || t - last < 30) return; // ~30fps is plenty for dots
      last = t;
      const time = t / 1000;
      rotY += 0.0035 + (mouse.tx - rotY * 0) * 0.0006;
      rotX += (mouse.ty - rotX) * 0.04;
      const R = Math.min(w, h * 1.5) * 0.34;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.58;
      const sy = Math.sin(rotY), cyy = Math.cos(rotY), sx = Math.sin(rotX), cx2 = Math.cos(rotX);
      for (const p of pts) {
        const rip = 1 + 0.09 * Math.sin(p.y * 7 + time * 1.3) + 0.06 * Math.sin(p.x * 6 - time);
        const x = p.x * rip, y = p.y * rip, z = p.z * rip;
        const x1 = x * cyy + z * sy, z1 = -x * sy + z * cyy;
        const y1 = y * cx2 - z1 * sx, z2 = y * sx + z1 * cx2;
        const persp = 1 / (1.9 - z2 * 0.55);
        let px = cx + x1 * R * persp * 1.7, py = cy + y1 * R * persp * 1.7;
        const dx = px - mouse.x, dy = py - mouse.y, d2 = dx * dx + dy * dy;
        const push = d2 < 14000 ? (1 - d2 / 14000) * 38 : 0;
        const d = Math.sqrt(d2) || 1;
        p.ox += ((dx / d) * push - p.ox) * 0.12;
        p.oy += ((dy / d) * push - p.oy) * 0.12;
        px += p.ox; py += p.oy;
        const a = Math.max(0.06, Math.min(1, 0.25 + z2 * 0.55));
        ctx.fillStyle = `rgba(${z2 > 0.55 ? "255,70,80" : "235,235,240"},${a * 0.8})`;
        ctx.fillRect(px, py, 1.6 * persp * 1.9, 1.6 * persp * 1.9);
      }
    };
    if (reduced) { rotY = 0.6; draw(100); cancelAnimationFrame(raf); } else raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("pointermove", onMove); removeEventListener("resize", fit); };
  }, []);
  return <canvas ref={ref} className="hero__canvas" aria-hidden="true" />;
}

export default function Hero({ entered }: { entered: boolean }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!entered || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero .wi", { yPercent: 115, rotate: 3, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.3, stagger: 0.12 })
        .fromTo(".hero__canvas", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }, 0)
        .fromTo(".hero [data-in]", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, 0.5);
      gsap.utils.toArray<HTMLElement>(".hero__stat b").forEach((el) => {
        const o = { v: 0 }, target = Number(el.dataset.v);
        gsap.to(o, { v: target, duration: 2, delay: 0.9, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
      });
    }, root);
    return () => ctx.revert();
  }, [entered]);

  return (
    <section id="top" className="hero stack" data-stack ref={root}>
      <div className="stack__in">
        <Particles />
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__main">
          <p className="hero__kicker" data-in><span className="pulse" />Full-stack developer · Websites, apps &amp; AI</p>
          <Words as="h1" hero text="Design. Build. Grow." className="hero__title" />
          <p className="hero__sub" data-in>
            Premium websites, web apps and AI systems for businesses that want to look sharp, ship fast and scale.
            One developer, from first sketch to live product.
          </p>
          <div className="hero__cta" data-in>
            <Btn id="contact" variant="light">Start a project</Btn>
            <Btn id="work" variant="ghost">See the work</Btn>
          </div>
        </div>
        <div className="hero__foot" data-in>
          <ul className="hero__stats">
            {STATS.map((s) => (
              <li className="hero__stat" key={s.label}>
                <span><b data-v={s.value}>{reduced ? s.value : 0}</b>{s.suffix}</span>
                <small>{s.label}</small>
              </li>
            ))}
          </ul>
          <p className="hero__avail"><span className="pulse" />Booking new projects now. I reply to every message personally.</p>
        </div>
      </div>
    </section>
  );
}
