"use client";

import { useEffect, useRef } from "react";
import Panel from "./Panel";
import Frame from "./Frame";
import PhotoSlot from "./PhotoSlot";
import Letters from "./Letters";
import { useAudio } from "./AudioProvider";
import { useFx } from "./FxLayer";
import { invitation } from "@/config/invitation";
import { shortDigits, startDate } from "@/lib/format";

export default function SaveTheDate({ photo }: { photo?: string }) {
  const [mm, dd, yy] = shortDigits(startDate);
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const { sfx } = useAudio();
  const fx = useFx();

  // celebratory burst the first time the finale scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true;
          sfx("chime");
          fx.burst(window.innerWidth / 2, window.innerHeight * 0.55, "mix", 1.4);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sfx, fx]);

  return (
    <Panel id="save" tone="velvet" chandelier clusters={["tl", "tr", "bl", "br"]} butterflies={3}>
      <div ref={ref}>
        <Frame>
          <PhotoSlot src={photo} name="finale" alt={invitation.firstName} shape="oval" optional className="finale__photo" sizes="220px" />
          <p className="eyebrow">Save the</p>
          <h2 className="script-title">
            <Letters text="Date" />
          </h2>
          <div className="std">
            <span className="gold-text">{mm}</span>
            <i />
            <span className="gold-text">{dd}</span>
            <i />
            <span className="gold-text">{yy}</span>
          </div>
          <div className="divider" />
          <p className="eyebrow">Thank you for being part of my special day.</p>
          <p className="finale__sign">See you there, {invitation.firstName}</p>
          <button className="link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to the top ↑
          </button>
        </Frame>
      </div>
    </Panel>
  );
}
