"use client";

import { useEffect, useRef, useState } from "react";
import { Butterfly, Chandelier, Cluster, type Anchor } from "./Art";
import { usePhase } from "@/lib/hooks";

export type Tone = "velvet" | "rose" | "noir";

type Props = {
  id?: string;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  clusters?: Anchor[];
  butterflies?: number;
  chandelier?: boolean;
  drapes?: boolean;
  /** use deep-rose roses instead of blush */
  rouge?: boolean;
  /** hold the entrance until the envelope has finished opening (first panel only) */
  live?: boolean;
};

/** A full-width scene: velvet backdrop, curtains, bokeh, roses, butterflies. Reveals itself on scroll. */
export default function Panel({
  id,
  tone = "velvet",
  children,
  className = "",
  clusters = ["tl", "br"],
  butterflies = 1,
  chandelier = false,
  drapes = true,
  rouge = false,
  live = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const phase = usePhase();
  const on = shown && (!live || phase === "live");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} data-panel data-tone={tone} data-in={on ? "1" : "0"} className={`panel ${className}`}>
      <div className="panel__bg" aria-hidden>
        <div className="bokeh bokeh--a" />
        <div className="bokeh bokeh--b" />
        <div className="vignette" />
      </div>

      {drapes && (
        <>
          <div className="drape drape--l" aria-hidden>
            <div className="drape__cloth" />
          </div>
          <div className="drape drape--r" aria-hidden>
            <div className="drape__cloth" />
          </div>
        </>
      )}

      {chandelier && (
        <div className="panel__chandelier" aria-hidden>
          <Chandelier />
        </div>
      )}

      {clusters.map((c) => (
        <Cluster key={c} corner={c} tone={rouge ? "rouge" : "blush"} />
      ))}

      {Array.from({ length: butterflies }, (_, i) => (
        <div key={i} className={`bf bf--${i % 3}`} aria-hidden>
          <Butterfly />
        </div>
      ))}

      <div className="panel__body">{children}</div>
    </section>
  );
}
