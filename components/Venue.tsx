"use client";

import { useState } from "react";
import Panel from "./Panel";
import Frame from "./Frame";
import PhotoSlot from "./PhotoSlot";
import Letters from "./Letters";
import { useAudio } from "./AudioProvider";
import { invitation } from "@/config/invitation";
import { mapsEmbed, mapsLink, wazeLink } from "@/lib/format";

export default function Venue({ photo }: { photo?: string }) {
  const { venue } = invitation;
  const { sfx } = useAudio();
  const [copied, setCopied] = useState(false);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(mapsLink)}`;

  const copy = async () => {
    sfx("tick");
    try {
      await navigator.clipboard.writeText(`${venue.name}, ${venue.address}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <Panel id="venue" tone="rose" rouge clusters={["tl", "br"]} butterflies={1}>
      <Frame>
        <p className="eyebrow">the</p>
        <h2 className="script-title">
          <Letters text="Venue" />
        </h2>
        <PhotoSlot src={photo} name="venue" alt={venue.name} shape="wide" optional className="venue__photo" sizes="(max-width: 640px) 80vw, 420px" />
        <p className="venue__name">{venue.name}</p>
        <p className="muted">{venue.address}</p>
        <button className="link" onClick={copy}>
          {copied ? "Address copied ✓" : "Copy address"}
        </button>

        <div className="venue__map">
          <iframe src={mapsEmbed} title={`Map to ${venue.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="venue__qr" src={qr} alt="QR code with directions to the venue" width={130} height={130} />
        <small className="muted">Scan for directions</small>
        <div className="btn-row">
          <a className="btn" href={mapsLink} target="_blank" rel="noopener noreferrer">
            Google Maps
          </a>
          <a className="btn btn--ghost" href={wazeLink} target="_blank" rel="noopener noreferrer">
            Waze
          </a>
        </div>
      </Frame>
    </Panel>
  );
}
