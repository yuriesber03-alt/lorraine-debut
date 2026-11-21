import type { CSSProperties } from "react";

/* =====================================================================
   Royal art kit. All vector, all code, no image files.
   Colors: blush, ivory, deep rose, gold.
   ===================================================================== */

type Style = CSSProperties & { [k: `--${string}`]: string | number };

const ROSE = {
  blush: [
    ["#f0b2c0", "#f8d2da", "#fff1f4"],
    ["#e599ac", "#f2bcc8", "#fde0e6"],
    ["#d6718b", "#ea9aae", "#f6c6d2"],
    ["#c25a77", "#e0869d", "#f0adbc"],
  ],
  ivory: [
    ["#e6cfa6", "#f5e8d3", "#fffaf0"],
    ["#dcbf8d", "#eedbb6", "#fbf0dc"],
    ["#c9a269", "#e4cc9b", "#f5e6c4"],
    ["#b58648", "#d6b476", "#ecd3a2"],
  ],
  rouge: [
    ["#b8506b", "#d9879c", "#f0b8c6"],
    ["#9c3a56", "#c5667f", "#e49bad"],
    ["#7f2641", "#a94661", "#cf7a90"],
    ["#5e172d", "#85344b", "#b05d73"],
  ],
} as const;

export type RoseTone = keyof typeof ROSE;

/** One hidden <svg> holding every gradient the art uses. Render once per page. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6420" />
          <stop offset=".3" stopColor="#f1dc9f" />
          <stop offset=".55" stopColor="#c9a14a" />
          <stop offset=".8" stopColor="#f1dc9f" />
          <stop offset="1" stopColor="#8a6420" />
        </linearGradient>
        <linearGradient id="g-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde0e6" />
          <stop offset=".55" stopColor="#f4c6cf" />
          <stop offset="1" stopColor="#d9a54a" />
        </linearGradient>
        <radialGradient id="g-glow">
          <stop offset="0" stopColor="#fff3cf" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffd37a" stopOpacity=".45" />
          <stop offset="1" stopColor="#ffd37a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g-crystal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff8e6" />
          <stop offset="1" stopColor="#e8c878" />
        </linearGradient>
        {(Object.keys(ROSE) as RoseTone[]).flatMap((name) =>
          ROSE[name].map((s, k) => (
            <linearGradient key={`${name}${k}`} id={`rose-${name}-${k}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={s[0]} />
              <stop offset=".55" stopColor={s[1]} />
              <stop offset="1" stopColor={s[2]} />
            </linearGradient>
          )),
        )}
      </defs>
    </svg>
  );
}

/* ---------------------------- Rose ---------------------------- */

const petal = (r: number, w: number) =>
  `M0 0 C ${-w} ${-r * 0.25}, ${-w * 1.1} ${-r * 0.85}, 0 ${-r} C ${w * 1.1} ${-r * 0.85}, ${w} ${-r * 0.25}, 0 0Z`;

const RINGS = [
  { n: 8, r: 50, w: 32, o: 0 },
  { n: 7, r: 40, w: 26, o: 13 },
  { n: 6, r: 30, w: 21, o: 29 },
  { n: 5, r: 21, w: 15, o: 47 },
  { n: 4, r: 12, w: 9, o: 8 },
];

export function Rose({
  tone = "blush",
  size = 120,
  rotate = 0,
  className = "",
  style,
}: {
  tone?: RoseTone;
  size?: number;
  rotate?: number;
  className?: string;
  style?: Style;
}) {
  return (
    <svg className={`rose ${className}`} viewBox="-58 -58 116 116" width={size} height={size} style={{ ...style, rotate: `${rotate}deg` }} aria-hidden>
      {RINGS.map((ring, k) => (
        <g key={k} transform={`rotate(${ring.o})`}>
          {Array.from({ length: ring.n }, (_, i) => (
            <path
              key={i}
              d={petal(ring.r, ring.w)}
              transform={`rotate(${(360 / ring.n) * i})`}
              fill={`url(#rose-${tone}-${Math.min(k, 3)})`}
              stroke="rgba(120,60,50,.3)"
              strokeWidth=".6"
            />
          ))}
        </g>
      ))}
      <path d="M-4 -1 C -2 -5, 3 -4, 3 0 C 3 4, -2 5, -4 2" fill="none" stroke="rgba(110,30,55,.5)" strokeWidth=".9" strokeLinecap="round" />
      <circle r="1.6" fill="rgba(110,30,55,.55)" />
    </svg>
  );
}

/* ---------------------------- Sprig ---------------------------- */

const LEAVES: [number, number, number, number][] = [
  [22, 50, -62, 0.9],
  [34, 41, 38, 0.9],
  [48, 32, -58, 1],
  [60, 24, 34, 1],
  [74, 16, -52, 0.9],
  [88, 9, 30, 0.85],
  [104, 3, -40, 0.7],
];

export function Sprig({ className = "", style }: { className?: string; style?: Style }) {
  return (
    <svg className={`sprig ${className}`} viewBox="0 0 120 70" style={style} aria-hidden>
      <path d="M2 66 C 30 56, 60 34, 112 6" fill="none" stroke="#b98d33" strokeWidth="1.6" strokeLinecap="round" />
      {LEAVES.map(([x, y, a, s], i) => (
        <path
          key={i}
          d="M0 0 C 7 -8, 21 -8, 30 0 C 21 8, 7 8, 0 0Z"
          transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}
          fill="url(#g-gold)"
          stroke="rgba(120,80,20,.5)"
          strokeWidth=".5"
        />
      ))}
      {[
        [14, 56],
        [66, 28],
        [100, 10],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#f6e3b0" stroke="#c9a14a" strokeWidth=".6" />
      ))}
    </svg>
  );
}

/* ---------------------------- Butterfly ---------------------------- */

export function Butterfly({ className = "", style }: { className?: string; style?: Style }) {
  const upper = "M50 38 C 38 8, 8 2, 5 22 C 3 34, 24 42, 50 40Z";
  const lower = "M50 42 C 30 44, 14 52, 20 66 C 26 78, 44 62, 50 46Z";
  return (
    <svg className={`butterfly ${className}`} viewBox="0 0 100 80" style={style} aria-hidden>
      <g className="butterfly__wing butterfly__wing--l">
        <path d={upper} fill="url(#g-wing)" stroke="#c9a14a" strokeWidth="1" />
        <path d={lower} fill="url(#g-wing)" stroke="#c9a14a" strokeWidth="1" />
        <path d="M50 40 C 36 30, 20 22, 10 20 M50 41 C 34 38, 20 40, 8 30 M50 44 C 38 50, 28 56, 22 62" fill="none" stroke="rgba(154,116,37,.6)" strokeWidth=".7" />
        <circle cx="22" cy="24" r="3.2" fill="#fff3cf" opacity=".85" />
      </g>
      <g className="butterfly__wing butterfly__wing--r">
        <path d={upper} transform="translate(100 0) scale(-1 1)" fill="url(#g-wing)" stroke="#c9a14a" strokeWidth="1" />
        <path d={lower} transform="translate(100 0) scale(-1 1)" fill="url(#g-wing)" stroke="#c9a14a" strokeWidth="1" />
        <path d="M50 40 C 64 30, 80 22, 90 20 M50 41 C 66 38, 80 40, 92 30 M50 44 C 62 50, 72 56, 78 62" fill="none" stroke="rgba(154,116,37,.6)" strokeWidth=".7" />
        <circle cx="78" cy="24" r="3.2" fill="#fff3cf" opacity=".85" />
      </g>
      <ellipse cx="50" cy="42" rx="2.3" ry="14" fill="#6b4a14" />
      <path d="M49 29 C 44 20, 40 16, 36 15 M51 29 C 56 20, 60 16, 64 15" fill="none" stroke="#6b4a14" strokeWidth=".9" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------- Frame ornaments ---------------------------- */

export function Corner({ className = "" }: { className?: string }) {
  const p = { fill: "none", stroke: "#b98d33", strokeWidth: 1.2, strokeLinecap: "round" as const, pathLength: 1 };
  return (
    <svg className={`corner ${className}`} viewBox="0 0 64 64" aria-hidden>
      <path {...p} d="M4 60 V4 H60" />
      <path {...p} d="M12 42 V12 H42" />
      <path {...p} d="M12 12 C 12 26, 26 31, 31 22 C 34 16, 26 12, 22 17" />
      <path {...p} d="M12 12 C 26 12, 31 26, 22 31 C 16 34, 12 26, 17 22" />
      <path {...p} d="M4 4 L 12 12" />
      <circle cx="4" cy="4" r="2.2" fill="url(#g-gold)" />
      <circle cx="31" cy="22" r="1.4" fill="#b98d33" />
      <circle cx="22" cy="31" r="1.4" fill="#b98d33" />
    </svg>
  );
}

export function Crest({ className = "" }: { className?: string }) {
  const p = { fill: "none", stroke: "#b98d33", strokeWidth: 1.2, strokeLinecap: "round" as const, pathLength: 1 };
  return (
    <svg className={`crest ${className}`} viewBox="0 0 140 32" aria-hidden>
      <path {...p} d="M4 16 H52" />
      <path {...p} d="M88 16 H136" />
      <path {...p} d="M52 16 C 46 6, 38 6, 36 12" />
      <path {...p} d="M88 16 C 94 6, 102 6, 104 12" />
      <path d="M70 2 L80 16 L70 30 L60 16Z" fill="url(#g-gold)" stroke="#8a6420" strokeWidth=".8" />
      <circle cx="70" cy="16" r="2.4" fill="#fff3cf" />
      <circle cx="4" cy="16" r="2" fill="#b98d33" />
      <circle cx="136" cy="16" r="2" fill="#b98d33" />
    </svg>
  );
}

export function Star({ className = "", style }: { className?: string; style?: Style }) {
  return (
    <svg className={`star ${className}`} viewBox="0 0 20 20" style={style} aria-hidden>
      <path d="M10 0 C 11 6, 14 9, 20 10 C 14 11, 11 14, 10 20 C 9 14, 6 11, 0 10 C 6 9, 9 6, 10 0Z" fill="url(#g-gold)" />
    </svg>
  );
}

/* ---------------------------- Chandelier ---------------------------- */

const BULBS: [number, number][] = [
  [40, 98],
  [200, 98],
  [78, 120],
  [162, 120],
  [120, 128],
];
const CRYSTALS: [number, number, number][] = [
  [56, 100, 1],
  [92, 108, 0.9],
  [148, 108, 0.9],
  [184, 100, 1],
  [24, 106, 0.8],
  [216, 106, 0.8],
  [108, 134, 1.3],
  [132, 134, 1.3],
  [120, 140, 1.7],
];

export function Chandelier({ className = "" }: { className?: string }) {
  return (
    <svg className={`chandelier ${className}`} viewBox="0 0 240 190" aria-hidden>
      <g fill="none" stroke="#c9a14a" strokeWidth="1.6" strokeLinecap="round">
        <path d="M120 0 V34" />
        <path d="M120 46 C 120 72, 72 70, 40 96" />
        <path d="M120 46 C 120 72, 168 70, 200 96" />
        <path d="M120 46 C 120 80, 98 94, 78 118" />
        <path d="M120 46 C 120 80, 142 94, 162 118" />
        <path d="M120 46 V 122" />
        <path d="M104 70 C 108 82, 132 82, 136 70" strokeWidth="1" />
      </g>
      <circle cx="120" cy="40" r="7" fill="url(#g-gold)" />
      <circle cx="120" cy="40" r="2.4" fill="#fff3cf" />
      {BULBS.map(([x, y], i) => (
        <g key={i} className="bulb" style={{ "--k": i } as Style}>
          <circle cx={x} cy={y - 10} r="22" fill="url(#g-glow)" />
          <rect x={x - 3.5} y={y - 6} width="7" height="9" rx="1.5" fill="url(#g-gold)" />
          <path d={`M${x} ${y - 7} C ${x + 3} ${y - 12}, ${x + 2} ${y - 17}, ${x} ${y - 20} C ${x - 2} ${y - 17}, ${x - 3} ${y - 12}, ${x} ${y - 7}Z`} fill="#fff3cf" />
        </g>
      ))}
      {CRYSTALS.map(([x, y, s], i) => (
        <path
          key={i}
          className="crystal"
          style={{ "--k": i } as Style}
          d="M0 0 C 3 4, 3 10, 0 14 C -3 10, -3 4, 0 0Z"
          transform={`translate(${x} ${y}) scale(${s})`}
          fill="url(#g-crystal)"
          stroke="#c9a14a"
          strokeWidth=".5"
        />
      ))}
    </svg>
  );
}

/* ---------------------------- Rose cluster ---------------------------- */

export type Anchor = "tl" | "tr" | "bl" | "br";

/** A lush cluster anchored to a panel corner. Flipping and parallax are done in CSS. */
export function Cluster({ corner, tone = "blush", className = "" }: { corner: Anchor; tone?: "blush" | "rouge"; className?: string }) {
  const accent: RoseTone = tone === "rouge" ? "blush" : "ivory";
  const k = (n: number) => ({ "--k": n }) as Style;
  return (
    <div className={`cluster cluster--${corner} ${className}`} aria-hidden>
      <div className="cluster__inner">
        <Sprig className="cluster__sprig cluster__sprig--a" />
        <Sprig className="cluster__sprig cluster__sprig--b" />
        <Rose tone={tone} size={150} className="cluster__rose cluster__rose--1" style={k(0)} rotate={8} />
        <Rose tone={accent} size={112} className="cluster__rose cluster__rose--2" style={k(1)} rotate={24} />
        <Rose tone="blush" size={84} className="cluster__rose cluster__rose--3" style={k(2)} rotate={-14} />
        <Rose tone={tone === "rouge" ? "rouge" : "ivory"} size={54} className="cluster__rose cluster__rose--4" style={k(3)} rotate={30} />
      </div>
    </div>
  );
}
