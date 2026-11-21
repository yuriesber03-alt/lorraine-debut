"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll driver:
 *  - top progress bar
 *  - --sy on the hero (parallax)
 *  - --pp on every [data-panel]: how far the panel centre is from the viewport centre,
 *    in viewport heights (negative = above centre). CSS uses it for parallax.
 */
export default function ScrollVars() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let panels: HTMLElement[] = [];
    const collect = () => (panels = Array.from(document.querySelectorAll<HTMLElement>("[data-panel]")));
    collect();

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;

      for (const el of panels) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.6 || r.top > vh * 1.6) continue;
        const pp = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty("--pp", pp.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const t = window.setTimeout(() => {
      collect();
      update();
    }, 300);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="progress" aria-hidden>
      <div ref={bar} className="progress__bar" />
    </div>
  );
}
