"use client";

import { useEffect, useState } from "react";
import { usePhase } from "@/lib/hooks";

export default function CountUp({ to, duration = 1700 }: { to: number; duration?: number }) {
  const phase = usePhase();
  const [v, setV] = useState(to);

  useEffect(() => {
    if (phase === "intro") setV(0);
  }, [phase]);

  useEffect(() => {
    if (phase !== "live") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, to, duration]);

  return <>{v}</>;
}
