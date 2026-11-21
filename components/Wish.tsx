"use client";

import { useEffect, useRef, useState } from "react";
import Panel from "./Panel";
import { Rose } from "./Art";
import Letters from "./Letters";
import { useAudio } from "./AudioProvider";
import { useFx } from "./FxLayer";
import { invitation } from "@/config/invitation";

type Stage = "idle" | "lighting" | "lit" | "blown";

const N = invitation.age;
const CX = 200;
const TOP = { cy: 140, rx: 56, ry: 8 };
const CANDLES = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 + Math.PI / 2;
  return { i, x: CX + TOP.rx * Math.cos(a), y: TOP.cy + TOP.ry * Math.sin(a) };
}).sort((a, b) => a.y - b.y);

const TIERS = [
  { rx: 150, cy: 262, h: 84 },
  { rx: 110, cy: 196, h: 70 },
  { rx: 76, cy: 140, h: 58 },
].map((t) => ({ ...t, ry: Math.round(t.rx * 0.16) }));

/** pearls along the front half of a tier's top rim */
const pearls = (t: (typeof TIERS)[number]) => {
  const n = Math.round(t.rx / 8);
  return Array.from({ length: n + 1 }, (_, k) => {
    const a = (Math.PI * k) / n;
    return { x: CX + t.rx * Math.cos(a), y: t.cy + t.ry * Math.sin(a) };
  });
};
/** gold swags hanging between pearls */
const swags = (t: (typeof TIERS)[number]) => {
  const n = Math.max(4, Math.round(t.rx / 22));
  const pts = Array.from({ length: n + 1 }, (_, k) => {
    const a = (Math.PI * k) / n;
    return { x: CX + t.rx * Math.cos(a), y: t.cy + t.ry * Math.sin(a) + 3 };
  });
  return pts.slice(0, -1).map((p, k) => `M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${((p.x + pts[k + 1].x) / 2).toFixed(1)} ${(Math.max(p.y, pts[k + 1].y) + 18).toFixed(1)} ${pts[k + 1].x.toFixed(1)} ${pts[k + 1].y.toFixed(1)}`);
};
const rim = (t: (typeof TIERS)[number], deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + t.rx * Math.cos(a), y: t.cy + t.ry * Math.sin(a) };
};

export default function Wish() {
  const [stage, setStage] = useState<Stage>("idle");
  const [lit, setLit] = useState<boolean[]>(() => Array(N).fill(false));
  const [smoke, setSmoke] = useState(false);
  const timers = useRef<number[]>([]);
  const cake = useRef<SVGSVGElement>(null);
  const { sfx } = useAudio();
  const fx = useFx();

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const light = () => {
    if (stage === "lighting") return;
    setStage("lighting");
    setSmoke(false);
    CANDLES.forEach((c, k) => {
      later(k * 85, () => {
        sfx("candle");
        setLit((prev) => {
          const next = prev.slice();
          next[c.i] = true;
          return next;
        });
      });
    });
    later(N * 85 + 250, () => setStage("lit"));
  };

  const blow = () => {
    if (stage !== "lit") return;
    sfx("blow");
    navigator.vibrate?.(40);
    CANDLES.forEach((c, k) => {
      later(k * 35, () =>
        setLit((prev) => {
          const next = prev.slice();
          next[c.i] = false;
          return next;
        }),
      );
    });
    later(300, () => setSmoke(true));
    later(N * 35 + 200, () => {
      setStage("blown");
      sfx("chime");
      fx.burstAt(cake.current, "mix", 1.3);
    });
  };

  const onCake = () => {
    if (stage === "idle" || stage === "blown") light();
    else if (stage === "lit") blow();
  };

  const text = stage === "idle" ? invitation.wish.idle : stage === "blown" ? invitation.wish.blown : invitation.wish.lit;

  return (
    <Panel id="wish" tone="noir" clusters={["tl", "tr"]} butterflies={2} chandelier>
      <div className="wish">
        <p className="eyebrow">before you go</p>
        <h2 className="script-title">
          <Letters text="Make a Wish" />
        </h2>

        <button className={`cake cake--${stage}`} onClick={onCake} aria-label={stage === "lit" ? "Blow out the candles" : "Light the candles"}>
          <svg ref={cake} viewBox="0 0 400 430" role="img" aria-label={`A cake with ${N} candles`}>
            <defs>
              <linearGradient id="tier" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#dc8ea5" />
                <stop offset=".16" stopColor="#f6c4d1" />
                <stop offset=".42" stopColor="#fff2f5" />
                <stop offset=".72" stopColor="#f2b9c8" />
                <stop offset="1" stopColor="#cf7a93" />
              </linearGradient>
              <radialGradient id="face" cx=".4" cy=".35" r=".8">
                <stop offset="0" stopColor="#fffafb" />
                <stop offset="1" stopColor="#f9cfda" />
              </radialGradient>
              <linearGradient id="goldband" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#8a6420" />
                <stop offset=".25" stopColor="#f1dc9f" />
                <stop offset=".5" stopColor="#c9a14a" />
                <stop offset=".75" stopColor="#f6e6b4" />
                <stop offset="1" stopColor="#8a6420" />
              </linearGradient>
              <radialGradient id="pearl" cx=".35" cy=".3" r=".8">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset=".6" stopColor="#f7e9d6" />
                <stop offset="1" stopColor="#d9c3a0" />
              </radialGradient>
              <linearGradient id="candle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#e9d3a0" />
                <stop offset=".45" stopColor="#fff7e2" />
                <stop offset="1" stopColor="#d9b868" />
              </linearGradient>
              <radialGradient id="flame" cx=".5" cy=".75" r=".6">
                <stop offset="0" stopColor="#fffbe8" />
                <stop offset=".5" stopColor="#ffd37a" />
                <stop offset="1" stopColor="#ff9fb4" />
              </radialGradient>
              <radialGradient id="glow">
                <stop offset="0" stopColor="#ffd37a" stopOpacity=".6" />
                <stop offset="1" stopColor="#ffd37a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="aura" cx=".5" cy=".4" r=".6">
                <stop offset="0" stopColor="#ffd9a0" stopOpacity=".22" />
                <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="200" cy="200" rx="200" ry="200" fill="url(#aura)" />

            {/* stand */}
            <ellipse cx="200" cy="418" rx="70" ry="9" fill="url(#goldband)" />
            <path d="M190 392 h20 l5 26 h-30 z" fill="url(#goldband)" />
            <path d="M28 372 a172 19 0 0 0 344 0 v7 a172 19 0 0 1 -344 0 z" fill="url(#goldband)" />
            <ellipse cx="200" cy="372" rx="172" ry="19" fill="#f3dc9d" />
            <ellipse cx="200" cy="371" rx="160" ry="15" fill="#c9a14a" opacity=".35" />

            {TIERS.map((t, k) => (
              <g key={k}>
                <path d={`M${CX - t.rx} ${t.cy} v${t.h} a${t.rx} ${t.ry} 0 0 0 ${2 * t.rx} 0 v${-t.h} z`} fill="url(#tier)" />
                <path d={`M${CX - t.rx} ${t.cy + t.h - 15} a${t.rx} ${t.ry} 0 0 0 ${2 * t.rx} 0 v9 a${t.rx} ${t.ry} 0 0 1 ${-2 * t.rx} 0 z`} fill="url(#goldband)" />
                <ellipse cx={CX} cy={t.cy} rx={t.rx} ry={t.ry} fill="url(#face)" stroke="rgba(255,255,255,.7)" strokeWidth="1" />
                {swags(t).map((d, j) => (
                  <path key={j} d={d} fill="none" stroke="url(#goldband)" strokeWidth="2.4" strokeLinecap="round" />
                ))}
                {pearls(t).map((p, j) => (
                  <circle key={j} cx={p.x} cy={p.y + 3} r={t.rx > 100 ? 3.2 : 2.6} fill="url(#pearl)" stroke="rgba(150,110,40,.35)" strokeWidth=".4" />
                ))}
              </g>
            ))}

            <text x="200" y="326" textAnchor="middle" className="cake__text">
              {invitation.firstName}
            </text>

            {/* sugar roses */}
            {[
              { t: 0, deg: 28, size: 44, tone: "blush" as const },
              { t: 0, deg: 152, size: 44, tone: "blush" as const },
              { t: 0, deg: 90, size: 36, tone: "ivory" as const },
              { t: 1, deg: 40, size: 34, tone: "blush" as const },
              { t: 1, deg: 140, size: 34, tone: "blush" as const },
            ].map((r, i) => {
              const p = rim(TIERS[r.t], r.deg);
              return (
                <g key={i} transform={`translate(${(p.x - r.size / 2).toFixed(1)} ${(p.y - r.size / 2 + 2).toFixed(1)})`}>
                  <Rose tone={r.tone} size={r.size} rotate={i * 40} />
                </g>
              );
            })}

            {CANDLES.map((c) => (
              <g key={c.i} className={`candle${lit[c.i] ? " is-lit" : ""}${smoke ? " is-smoking" : ""}`}>
                <rect x={c.x - 2.2} y={c.y - 36} width="4.4" height="36" rx="1.6" fill="url(#candle)" />
                <path d={`M${c.x - 2.2} ${c.y - 26} l4.4 -3 M${c.x - 2.2} ${c.y - 17} l4.4 -3 M${c.x - 2.2} ${c.y - 8} l4.4 -3`} stroke="#d89aab" strokeWidth="1.1" fill="none" />
                <line x1={c.x} x2={c.x} y1={c.y - 36} y2={c.y - 40} stroke="#2a2022" strokeWidth="1.1" />
                <g transform={`translate(${c.x} ${c.y - 40})`}>
                  <circle className="glow" r="17" cy="-8" fill="url(#glow)" />
                  <path className="flame" d="M0 0 C 3.6 -4.5 3.8 -9.5 0 -15 C -3.8 -9.5 -3.6 -4.5 0 0z" fill="url(#flame)" />
                  <circle className="smoke" r="2.2" cy="-4" />
                </g>
              </g>
            ))}
          </svg>
        </button>

        <p key={stage} className="wish__text eyebrow">
          {text}
        </p>

        <div className="btn-row">
          {(stage === "idle" || stage === "blown") && (
            <button className="btn" onClick={light}>
              {stage === "blown" ? "Light them again" : "Light the candles"}
            </button>
          )}
          {stage === "lit" && (
            <button className="btn btn--solid" onClick={blow}>
              Blow them out
            </button>
          )}
        </div>
      </div>
    </Panel>
  );
}
