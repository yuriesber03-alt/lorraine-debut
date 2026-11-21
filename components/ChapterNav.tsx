"use client";

import { useEffect, useState } from "react";
import { useAudio } from "./AudioProvider";

const CHAPTERS = [
  { id: "top", label: "Welcome" },
  { id: "date", label: "The Day" },
  { id: "note", label: "A Note" },
  { id: "program", label: "Program" },
  { id: "moments", label: "Moments" },
  { id: "venue", label: "Venue" },
  { id: "map", label: "Directions" },
  { id: "details", label: "Dress Code" },
  { id: "gifts", label: "Gifts" },
  { id: "eighteens", label: "The 18s" },
  { id: "wish", label: "Wish" },
  { id: "rsvp", label: "RSVP" },
  { id: "save", label: "Finale" },
];

export default function ChapterNav() {
  const [items, setItems] = useState<typeof CHAPTERS>([]);
  const [active, setActive] = useState("top");
  const { sfx } = useAudio();

  useEffect(() => {
    const present = CHAPTERS.filter((c) => document.getElementById(c.id));
    setItems(present);
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let best = present[0]?.id ?? "top";
      for (const c of present) {
        const el = document.getElementById(c.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid) best = c.id;
      }
      setActive((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav className="chapters" aria-label="Sections">
      {items.map((c) => (
        <button
          key={c.id}
          className={`chapters__dot${active === c.id ? " is-active" : ""}`}
          aria-label={c.label}
          aria-current={active === c.id}
          onClick={() => {
            sfx("tick");
            document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span>{c.label}</span>
        </button>
      ))}
    </nav>
  );
}
