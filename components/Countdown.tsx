"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";

type Parts = { d: number; h: number; m: number; s: number };

const split = (ms: number): Parts => {
  const t = Math.max(0, ms);
  return {
    d: Math.floor(t / 864e5),
    h: Math.floor((t % 864e5) / 36e5),
    m: Math.floor((t % 36e5) / 6e4),
    s: Math.floor((t % 6e4) / 1e3),
  };
};

const CELLS: [keyof Parts, string][] = [
  ["d", "Days"],
  ["h", "Hours"],
  ["m", "Minutes"],
  ["s", "Seconds"],
];

export default function Countdown({ start, end }: { start: string; end: string }) {
  const [now, setNow] = useState<number | null>(null);
  const { sfx } = useAudio();
  const lastMin = useRef<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const p = now === null ? null : split(s - now);
  const status = now === null ? "" : now >= e ? "has ended. Thank you!" : now >= s ? "is happening now!" : "has started.";

  // soft tick each time a minute rolls over
  useEffect(() => {
    if (!p) return;
    if (lastMin.current !== null && lastMin.current !== p.m) sfx("tick");
    lastMin.current = p.m;
  }, [p, sfx]);

  return (
    <>
      <p className="muted">The countdown to my debut {status}</p>
      <div className="countdown" role="timer" aria-live="off">
        {CELLS.map(([k, label]) => (
          <div key={k} className="countdown__cell">
            <b key={p ? p[k] : "x"} className="tick">
              {p ? String(p[k]).padStart(2, "0") : "--"}
            </b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
