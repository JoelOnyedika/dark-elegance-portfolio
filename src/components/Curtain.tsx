import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { bindTransition } from "@/lib/transition";

export default function Curtain() {
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  useEffect(() => bindTransition(nav, ref.current), [nav]);
  return <div className="curtain" ref={ref} aria-hidden="true"><span>Retrieving</span></div>;
}
