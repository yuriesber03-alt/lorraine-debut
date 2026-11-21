"use client";

import { useEffect, useRef } from "react";
import Panel from "./Panel";
import Frame from "./Frame";
import Letters from "./Letters";
import { invitation } from "@/config/invitation";

export default function Program() {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.62 - r.top) / r.height));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (invitation.program.length === 0) return null;

  return (
    <Panel id="program" tone="velvet" clusters={["tr", "bl"]} butterflies={1}>
      <Frame>
        <p className="eyebrow">the</p>
        <h2 className="script-title">
          <Letters text="Program" />
        </h2>
        <p className="muted">How the evening unfolds</p>

        <ol ref={ref} className="tl">
          <li className="tl__line" aria-hidden>
            <i />
          </li>
          {invitation.program.map((p) => (
            <li key={p.time + p.title} className="tl__item">
              <span className="tl__dot" aria-hidden />
              <b className="tl__time">{p.time}</b>
              <h3>{p.title}</h3>
              {p.note && <p>{p.note}</p>}
            </li>
          ))}
        </ol>
      </Frame>
    </Panel>
  );
}
