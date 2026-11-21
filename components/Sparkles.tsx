"use client";

import { useEffect, useState } from "react";

type Spark = { left: number; top: number; dur: number; delay: number; pink: boolean };

export default function Sparkles({ count = 14 }: { count?: number }) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Generated on the client only, so server and client HTML match.
  useEffect(() => {
    setSparks(
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        dur: 2 + Math.random() * 4,
        delay: Math.random() * 4,
        pink: i % 3 === 0,
      })),
    );
  }, [count]);

  return (
    <div className="sparkles" aria-hidden>
      {sparks.map((s, i) => (
        <i
          key={i}
          className={`spark${s.pink ? " spark--pink" : ""}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
