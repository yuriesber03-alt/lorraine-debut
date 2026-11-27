"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";
import { useFx } from "./FxLayer";
import { invitation } from "@/config/invitation";
import { longDate, startDate } from "@/lib/format";

type Phase = "idle" | "crack" | "open" | "rise" | "zoom" | "done";

export default function Cover() {
  const [phase, setPhase] = useState<Phase>("idle");
  const audio = useAudio();
  const fx = useFx();
  const timers = useRef<number[]>([]);
  const sealRef = useRef<HTMLButtonElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.phase = "intro";
    document.body.classList.add("locked");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const finish = () => {
    setPhase("done");
    document.body.classList.remove("locked");
    document.documentElement.dataset.phase = "live";
  };

  const open = () => {
    if (started.current) return;
    started.current = true;
    const root = document.documentElement;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    audio.start();

    if (reduced) {
      setPhase("zoom");
      root.dataset.phase = "live";
      later(900, finish);
      return;
    }

    setPhase("crack");
    audio.sfx("crack");
    navigator.vibrate?.(25);
    fx.burstAt(sealRef.current, "gold");

    later(650, () => {
      setPhase("open");
      audio.sfx("paper");
    });
    later(1500, () => {
      setPhase("rise");
      audio.sfx("sparkle");
    });
    later(3200, () => {
      setPhase("zoom");
      audio.sfx("chime");
      root.dataset.phase = "zooming";
    });
    later(3700, () => {
      root.dataset.phase = "live";
      fx.burst(window.innerWidth / 2, window.innerHeight * 0.42, "mix", 1.2);
    });
    later(4800, finish);
  };

  if (phase === "done") return null;

  return (
    <div
      className={`cover cover--${phase}`}
      role="dialog"
      aria-label="Your invitation"
    >
      <div className="cover__bg" />

      <div className="scene" onClick={open}>
        <p className="cover__kicker">{invitation.coverText}</p>

        <button
          ref={sealRef}
          className="cvs"
          onClick={open}
          aria-label="Open the invitation"
        >
          <span className="cvs__card">
            <small>You&apos;re invited to</small>
            <em>Fabulous</em>
            <strong>{invitation.firstName}</strong>
            <span>
              at {invitation.age}
              <sup>th</sup> Birthday
            </span>
            <b>{longDate(startDate)}</b>
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cvs__env"
            src="/art/env-body.png"
            alt=""
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />
        </button>

        <p className="cover__hint">
          <span>Tap the seal to open</span>
          <small>Best with sound on</small>
        </p>
      </div>
    </div>
  );
}
