"use client";

import { useEffect, useState } from "react";
import { useAudio } from "./AudioProvider";

const CHAPTERS = [
  { id: "top", label: "Welcome" },
  { id: "date", label: "The Day" },
  { id: "note", label: "A Note" },
  { id: "program", label: "Program" },
  { id: "venue", label: "Venue" },
  { id: "details", label: "Details" },
  { id: "eighteens", label: "Eighteens" },
  { id: "wish", label: "Wish" },
  { id: "rsvp", label: "RSVP" },
];

export default function ChapterNav() {
  const [items, setItems] = useState<typeof CHAPTERS>([]);
  const [active, setActive] = useState("top");
  const { sfx } = useAudio();

  useEffect(() => {
    const present = CHAPTERS.filter((c) => document.getElementById(c.id));
    setItems(present);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    present.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
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
