"use client";

import { useRef, useState } from "react";
import Panel from "./Panel";
import Frame from "./Frame";
import Letters from "./Letters";
import { useAudio } from "./AudioProvider";
import { useFx } from "./FxLayer";
import { useGuest } from "@/lib/hooks";
import { invitation } from "@/config/invitation";

export default function Rsvp() {
  const guest = useGuest();
  const { sfx } = useAudio();
  const fx = useFx();
  const btn = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.origin + window.location.pathname; // never share a guest's personal link
    const data = { title: invitation.headline, text: `You're invited to ${invitation.headline}`, url };
    sfx("tick");
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <Panel id="rsvp" tone="rose" rouge clusters={["tr", "bl"]} butterflies={1}>
      <Frame>
        <p className="eyebrow">— please —</p>
        <h2 className="script-title">
          <Letters text="RSVP" />
        </h2>
        <p className="muted">
          {guest ? `${guest}, kindly` : "Kindly"} confirm your attendance on or before <b className="gold-text">{invitation.rsvp.deadline}</b>.
        </p>
        <div className="btn-row">
          <a
            ref={btn}
            className="btn btn--solid"
            href={invitation.rsvp.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              sfx("chime");
              fx.burstAt(btn.current, "mix", 0.8);
            }}
          >
            RSVP now
          </a>
          <button className="btn btn--ghost" onClick={share}>
            {copied ? "Link copied ✓" : "Share invitation"}
          </button>
        </div>
      </Frame>
    </Panel>
  );
}
