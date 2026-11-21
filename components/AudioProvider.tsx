"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AudioEngine, type SfxName } from "@/lib/audio-engine";

const KEY = "stacey-sound-muted";

type AudioApi = {
  title: string;
  playing: boolean;
  muted: boolean;
  start: () => void;
  toggleMute: () => void;
  sfx: (n: SfxName) => void;
};

const Ctx = createContext<AudioApi | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}

export function AudioProvider({ src, title, children }: { src?: string; title: string; children: React.ReactNode }) {
  const engine = useRef<AudioEngine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const get = () => (engine.current ??= new AudioEngine());

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") {
        setMuted(true);
        get().setMuted(true);
      }
    } catch {}
    const onVis = () => {
      const e = engine.current;
      if (!e) return;
      if (document.hidden) e.suspend();
      else e.resume();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const start = useCallback(() => {
    const e = get();
    if (!e.unlock()) return;
    e.startMusic(src || undefined);
    setPlaying(true);
  }, [src]);

  const toggleMute = useCallback(() => {
    const e = get();
    e.unlock();
    setMuted((m) => {
      const next = !m;
      e.setMuted(next);
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }, []);

  const sfx = useCallback((n: SfxName) => engine.current?.sfx(n), []);

  const api = useMemo(() => ({ title, playing, muted, start, toggleMute, sfx }), [title, playing, muted, start, toggleMute, sfx]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
