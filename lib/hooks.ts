"use client";

import { useEffect, useState } from "react";

/** Guest name from ?to=Name (also ?guest= / ?g=). Empty string when absent. */
export function useGuest() {
  const [guest, setGuest] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const v = (p.get("to") || p.get("guest") || p.get("g") || "").trim().slice(0, 40);
    setGuest(v);
  }, []);
  return guest;
}

/** "intro" (envelope showing) → "zooming" → "live". Mirrors <html data-phase>. */
export function usePhase() {
  const [phase, setPhase] = useState("intro");
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setPhase(el.dataset.phase || "intro");
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["data-phase"] });
    return () => mo.disconnect();
  }, []);
  return phase;
}
