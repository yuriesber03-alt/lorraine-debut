"use client";

import { useAudio } from "./AudioProvider";

export default function MusicToggle() {
  const { playing, muted, toggleMute, title } = useAudio();
  const on = playing && !muted;

  return (
    <button className={`sound${on ? " sound--on" : ""}`} onClick={toggleMute} aria-label={muted ? "Turn music on" : "Mute music"} aria-pressed={!muted}>
      <span className="eq" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound__label">
        <small>{muted ? "Sound off" : "Now playing"}</small>
        <b>{title}</b>
      </span>
    </button>
  );
}
