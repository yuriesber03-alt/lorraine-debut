"use client";

import { invitation } from "@/config/invitation";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escIcs = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`);

export default function AddToCalendar() {
  const { event, venue } = invitation;
  const start = new Date(event.start);
  const end = new Date(event.end);
  const location = `${venue.name}, ${venue.address}`;

  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${stamp(start)}/${stamp(end)}` +
    `&location=${encodeURIComponent(location)}`;

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//invitation//EN",
      "BEGIN:VEVENT",
      `UID:${start.getTime()}@invitation`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${escIcs(event.title)}`,
      `LOCATION:${escIcs(location)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "invitation.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="btn-row">
      <a className="btn" href={google} target="_blank" rel="noopener noreferrer">
        Google Calendar
      </a>
      <button className="btn btn--ghost" onClick={downloadIcs}>
        Apple / Outlook
      </button>
    </div>
  );
}
