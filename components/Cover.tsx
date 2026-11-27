"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";
import { useFx } from "./FxLayer";
import { useGuest } from "@/lib/hooks";
import { useArt } from "./ArtContext";
import { invitation } from "@/config/invitation";
import { longDate, startDate } from "@/lib/format";

type Phase = "idle" | "crack" | "open" | "rise" | "zoom" | "done";

export default function Cover() {
  const [phase, setPhase] = useState<Phase>("idle");
  const guest = useGuest();
  const audio = useAudio();
  const fx = useFx();
  const scene = useArt()["cover-scene"];
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    later(1700, () => {
      setPhase("rise");
      audio.sfx("sparkle");
    });
    later(3350, () => {
      setPhase("zoom");
      audio.sfx("chime");
      root.dataset.phase = "zooming";
    });
    later(3750, () => {
      root.dataset.phase = "live";
      fx.burst(window.innerWidth / 2, window.innerHeight * 0.42, "mix", 1.2);
    });
    later(4900, finish);
  };

  if (phase === "done") return null;

  const initial = invitation.firstName.charAt(0);

  return (
    <div className={`cover cover--${phase}`} role="dialog" aria-label="Your invitation">
      <div className="cover__bg" />

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <filter id="keyblack" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    2 2 2 0 -0.5"
          />
        </filter>
      </svg>

      <div className="scene" onClick={open}>
        <p className="cover__kicker">{invitation.coverText}</p>

        {scene && (
          <button ref={sealRef} className="cscene" onClick={open} aria-label="Open the invitation">
            <span className="cs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cs__b" src={scene} alt="" decoding="async" fetchPriority="high" draggable={false} />
              <i className="cs__fill" />
              <span className="cs__sheet">
                <span className="cs__card">
                  <small>You&apos;re invited to</small>
                  <em>Fabulous</em>
                  <strong>{invitation.firstName}</strong>
                  <span>at {invitation.age}<sup>th</sup> Birthday</span>
                  <b>{longDate(startDate)}</b>
                </span>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cs__a" src={scene} alt="" decoding="async" draggable={false} />
            </span>
          </button>
        )}

        <div className="env" hidden={!!scene}>
          <div className="env__back" />

          <div className="env__letter">
            <p className="letter__eyebrow">{guest ? `Dear ${guest},` : "You are invited"}</p>
            <p className="letter__name">{invitation.firstName}</p>
            <p className="letter__line">is turning {invitation.age}</p>
            <i className="letter__rule" />
            <p className="letter__date">{longDate(startDate)}</p>
          </div>

          <div className="env__pocket">
            <svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden>
              <path d="M0 0 L150 116 L300 0" />
              <path d="M0 200 L138 104" />
              <path d="M300 200 L162 104" />
            </svg>
          </div>

          <div className="env__to">
            <span>For</span>
            <strong>{guest || "you"}</strong>
          </div>

          <div className="env__flap">
            <div className="env__flap-front" />
            <div className="env__flap-back" />
          </div>

          <button ref={scene ? undefined : sealRef} className="seal" onClick={open} aria-label="Break the seal to open the invitation">
            <span className="seal__half seal__half--l">{initial}</span>
            <span className="seal__half seal__half--r">{initial}</span>
          </button>
        </div>

        <p className="cover__hint">
          <span>Tap the seal to open</span>
          <small>Best with sound on</small>
        </p>
      </div>
    </div>
  );
}
