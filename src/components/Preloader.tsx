import { useEffect, useState } from "react";
import { FRAME_COUNT } from "@/lib/frames";
import { NAME } from "@/lib/data";

export default function Preloader({ loaded, ready }: { loaded: number; ready: boolean }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setGone(true), 1000);
    return () => clearTimeout(t);
  }, [ready]);
  if (gone) return null;
  const pct = Math.round((loaded / FRAME_COUNT) * 100);
  return (
    <div className={`preloader ${ready ? "is-done" : ""}`} role="progressbar" aria-label="Loading the experience" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="preloader__in">
        <p className="preloader__name">{NAME}</p>
        <div className="preloader__bar"><i style={{ transform: `scaleX(${loaded / FRAME_COUNT})` }} /></div>
        <p className="preloader__meta"><span>Loading experience</span><span>{String(pct).padStart(3, "0")}%</span></p>
      </div>
    </div>
  );
}
