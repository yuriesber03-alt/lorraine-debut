"use client";

import { useEffect, useRef, useState } from "react";
import Panel from "./Panel";
import Letters from "./Letters";
import { useAudio } from "./AudioProvider";
import { useFx } from "./FxLayer";
import { invitation } from "@/config/invitation";

type Stage = "idle" | "lighting" | "lit" | "blown";

const N = invitation.age;
const CANDLES = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 + Math.PI / 2;
  return { i, x: 200 + 84 * Math.cos(a), y: 152 + 11 * Math.sin(a) };
}).sort((a, b) => a.y - b.y);

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
          <svg ref={cake} viewBox="0 0 400 340" role="img" aria-label={`A cake with ${N} candles`}>
            <defs>
              <linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fbdde3" />
                <stop offset="1" stopColor="#ee9fb3" />
              </linearGradient>
              <linearGradient id="goldband" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#9a7425" />
                <stop offset=".35" stopColor="#ecd393" />
                <stop offset=".6" stopColor="#c9a14a" />
                <stop offset="1" stopColor="#9a7425" />
              </linearGradient>
              <linearGradient id="candle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f3d9a0" />
                <stop offset="1" stopColor="#c9a14a" />
              </linearGradient>
              <radialGradient id="flame" cx=".5" cy=".75" r=".6">
                <stop offset="0" stopColor="#fff8dc" />
                <stop offset=".5" stopColor="#ffd37a" />
                <stop offset="1" stopColor="#ff9fb4" />
              </radialGradient>
              <radialGradient id="glow">
                <stop offset="0" stopColor="#ffd37a" stopOpacity=".55" />
                <stop offset="1" stopColor="#ffd37a" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="200" cy="304" rx="176" ry="22" fill="#1d181b" stroke="#c9a14a" strokeOpacity=".5" />

            {/* bottom tier */}
            <path d="M60 222 v70 a140 22 0 0 0 280 0 v-70 z" fill="url(#frost)" />
            <path d="M60 252 a140 22 0 0 0 280 0 v8 a140 22 0 0 1 -280 0 z" fill="url(#goldband)" />
            <ellipse cx="200" cy="222" rx="140" ry="22" fill="#fde9ed" />
            <text x="200" y="283" textAnchor="middle" className="cake__text">
              {invitation.firstName}
            </text>

            {/* top tier */}
            <path d="M100 152 v70 a100 16 0 0 0 200 0 v-70 z" fill="url(#frost)" />
            <path d="M100 196 a100 16 0 0 0 200 0 v7 a100 16 0 0 1 -200 0 z" fill="url(#goldband)" />
            <ellipse cx="200" cy="152" rx="100" ry="16" fill="#fde9ed" />

            {CANDLES.map((c) => (
              <g key={c.i} className={`candle${lit[c.i] ? " is-lit" : ""}${smoke ? " is-smoking" : ""}`}>
                <rect x={c.x - 2.6} y={c.y - 34} width="5.2" height="34" rx="1.2" fill="url(#candle)" />
                <line x1={c.x} x2={c.x} y1={c.y - 34} y2={c.y - 38} stroke="#2a2022" strokeWidth="1.2" />
                <g transform={`translate(${c.x} ${c.y - 38})`}>
                  <circle className="glow" r="15" cy="-8" fill="url(#glow)" />
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
