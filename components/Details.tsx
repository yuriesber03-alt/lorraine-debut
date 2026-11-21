"use client";

import { useState } from "react";
import Panel from "./Panel";
import Frame from "./Frame";
import Letters from "./Letters";
import { useAudio } from "./AudioProvider";
import { useFx } from "./FxLayer";
import { invitation } from "@/config/invitation";

const TABS = [
  { key: "guests", label: "Guests" },
  { key: "roses", label: "18 Roses" },
  { key: "girls", label: "Girls" },
] as const;

export default function Details() {
  const { dressCode, palette, gifts } = invitation;
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("guests");
  const { sfx } = useAudio();
  const fx = useFx();

  return (
    <>
    <Panel id="details" tone="velvet" clusters={["tr", "bl"]} butterflies={1}>
      <Frame>
        <p className="eyebrow">the</p>
        <h2 className="script-title">
          <Letters text="Details" />
        </h2>

        <h3 className="card__title">Dress Code</h3>
        <div className="tabs" role="tablist" aria-label="Dress code">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`tabs__btn${tab === t.key ? " is-on" : ""}`}
              onClick={() => {
                sfx("tick");
                setTab(t.key);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p key={tab} className="tabs__panel muted" role="tabpanel">
          {dressCode[tab]}
        </p>

        <p className="eyebrow mt">Color Motif</p>
        <ul className="swatches">
          {palette.map((c) => (
            <li key={c.name}>
              <button
                aria-label={c.name}
                onClick={(e) => {
                  sfx("sparkle");
                  fx.burstAt(e.currentTarget, "gold", 0.6);
                }}
              >
                <i style={{ background: c.hex }} />
                <span>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>

      </Frame>
    </Panel>

    <Panel id="gifts" tone="rose" rouge clusters={["tl", "br"]} butterflies={1}>
      <Frame>
        <svg className="gift" viewBox="0 0 64 64" aria-hidden>
          <rect x="8" y="26" width="48" height="30" rx="2" />
          <rect x="5" y="18" width="54" height="10" rx="2" />
          <path d="M32 18 V56 M32 18 C 24 6 12 10 18 16 C 22 20 32 18 32 18 C 32 18 42 20 46 16 C 52 10 40 6 32 18 Z" />
        </svg>
        <h3 className="card__title">Gift Guide</h3>
        <p className="muted">{gifts}</p>
        <p className="eyebrow mt">Thank you for your love and generosity!</p>
      </Frame>
    </Panel>
    </>
  );
}
