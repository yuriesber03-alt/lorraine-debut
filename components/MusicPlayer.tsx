"use client";

import { useAudio } from "./AudioProvider";

/** Small inline "now playing" pill, shown under the date. */
export default function MusicPlayer() {
  const { title, muted, playing, toggleMute } = useAudio();
  const on = playing && !muted;

  return (
    <button className={`nowplaying${on ? " nowplaying--on" : ""}`} onClick={toggleMute} aria-label={muted ? "Turn music on" : "Mute music"}>
      <span className="eq" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>{muted ? "Music off" : title}</span>
    </button>
  );
}
