"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";

export type BurstKind = "confetti" | "gold" | "mix";

type Fx = {
  burst: (x: number, y: number, kind?: BurstKind, scale?: number) => void;
  burstAt: (el: Element | null, kind?: BurstKind, scale?: number) => void;
};

const FxCtx = createContext<Fx>({ burst() {}, burstAt() {} });
export const useFx = () => useContext(FxCtx);

type Bit = {
  kind: "confetti" | "spark";
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  life: number;
  max: number;
  color: string;
  g: number;
  phase: number;
};

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  phase: number;
  flip: number;
  color: string;
  alpha: number;
};

const CONFETTI = ["#f4c6cf", "#ecd393", "#c9a14a", "#ffffff", "#e88fa4", "#f9dde3"];
const PETALS = ["#f4c6cf", "#f0aebd", "#e88fa4", "#fbdde3", "#f4c6cf", "#ecd393"];
const SPARKS = ["#ecd393", "#fff3cf", "#f4c6cf", "#c9a14a"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function FxProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitsRef = useRef<Bit[]>([]);
  const reducedRef = useRef(false);

  const burst = useCallback((x: number, y: number, kind: BurstKind = "mix", scale = 1) => {
    const bits = bitsRef.current;
    const k = reducedRef.current ? 0.2 : 1;
    const base = kind === "gold" ? 60 : kind === "confetti" ? 110 : 90;
    const n = Math.round(base * scale * k);
    for (let i = 0; i < n && bits.length < 460; i++) {
      const confetti = kind === "confetti" || (kind === "mix" && i % 3 !== 0);
      if (confetti) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
        const sp = 260 + Math.random() * 520;
        bits.push({
          kind: "confetti",
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          rot: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 14,
          size: 6 + Math.random() * 6,
          life: 0,
          max: 2.6 + Math.random() * 1.6,
          color: pick(CONFETTI),
          g: 620,
          phase: Math.random() * 6.28,
        });
      } else {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 340;
        bits.push({
          kind: "spark",
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          rot: 0,
          vr: 0,
          size: 1 + Math.random() * 2.2,
          life: 0,
          max: 0.7 + Math.random() * 0.9,
          color: pick(SPARKS),
          g: 90,
          phase: 0,
        });
      }
    }
  }, []);

  const burstAt = useCallback(
    (el: Element | null, kind?: BurstKind, scale?: number) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, kind, scale);
    },
    [burst],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onMq = () => (reducedRef.current = mq.matches);
    mq.addEventListener("change", onMq);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    const petals: Petal[] = [];

    const target = () => (reducedRef.current ? 0 : Math.max(8, Math.min(18, Math.round((w * h) / 90000))));

    const spawn = (initial: boolean): Petal => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20 - Math.random() * 80,
      vx: -10 + Math.random() * 20,
      vy: 22 + Math.random() * 34,
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 1.6,
      size: 6 + Math.random() * 9,
      phase: Math.random() * 6.28,
      flip: 1 + Math.random() * 2,
      color: pick(PETALS),
      alpha: 0.45 + Math.random() * 0.4,
    });

    const resize = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = target();
      while (petals.length < t) petals.push(spawn(true));
      petals.length = Math.min(petals.length, t);
    };
    resize();
    window.addEventListener("resize", resize);

    let lx = 0;
    let ly = 0;
    const onMove = (e: PointerEvent) => {
      if (reducedRef.current) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      if (dx * dx + dy * dy < 26 * 26) return;
      lx = e.clientX;
      ly = e.clientY;
      const bits = bitsRef.current;
      for (let i = 0; i < 2 && bits.length < 460; i++) {
        bits.push({
          kind: "spark",
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 40,
          vy: 10 + Math.random() * 40,
          rot: 0,
          vr: 0,
          size: 0.8 + Math.random() * 1.6,
          life: 0,
          max: 0.5 + Math.random() * 0.5,
          color: pick(SPARKS),
          g: 40,
          phase: 0,
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const drawPetal = (p: Petal) => {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(0.25 + 0.75 * Math.abs(Math.cos(p.phase)), 1);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.8, s * 0.5, 0, s);
      ctx.bezierCurveTo(-s * 0.8, s * 0.5, -s * 0.9, -s * 0.6, 0, -s);
      ctx.fill();
      ctx.restore();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (document.hidden) return;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      for (const p of petals) {
        p.phase += dt * p.flip;
        p.x += (p.vx + Math.sin(p.phase * 0.9) * 18) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > h + 30) Object.assign(p, spawn(false));
        if (p.x < -30) p.x = w + 20;
        if (p.x > w + 30) p.x = -20;
        drawPetal(p);
      }

      const bits = bitsRef.current;
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.life += dt;
        if (b.life >= b.max) {
          bits.splice(i, 1);
          continue;
        }
        const drag = Math.exp(-(b.kind === "confetti" ? 1.6 : 2.4) * dt);
        b.vx *= drag;
        b.vy = b.vy * drag + b.g * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rot += b.vr * dt;
        b.phase += dt * 9;
        const left = 1 - b.life / b.max;
        if (b.kind === "confetti") {
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = Math.min(1, left * 2.2);
          ctx.fillStyle = b.color;
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.rot);
          ctx.scale(1, Math.cos(b.phase));
          ctx.fillRect(-b.size / 2, -b.size / 4, b.size, b.size / 2);
          ctx.restore();
        } else {
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = left;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  const api = useMemo(() => ({ burst, burstAt }), [burst, burstAt]);

  return (
    <FxCtx.Provider value={api}>
      <canvas ref={canvasRef} className="fx" aria-hidden />
      {children}
    </FxCtx.Provider>
  );
}
