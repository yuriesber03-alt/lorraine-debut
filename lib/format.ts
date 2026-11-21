import { invitation } from "@/config/invitation";

const tz = invitation.timeZone;

export const startDate = new Date(invitation.event.start);
export const endDate = new Date(invitation.event.end);

export const longDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: tz });

export const weekday = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", timeZone: tz });

export const monthName = (d: Date) => d.toLocaleDateString("en-US", { month: "long", timeZone: tz });

export const time = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });

export const shortDigits = (d: Date) =>
  d
    .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit", timeZone: tz })
    .split("/");

/** Year / month (1-12) / day as seen in the event's time zone. */
export const dateParts = (d: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
};

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.venue.mapsQuery)}`;
export const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(invitation.venue.mapsQuery)}&output=embed`;
export const wazeLink = `https://waze.com/ul?q=${encodeURIComponent(invitation.venue.mapsQuery)}&navigate=yes`;
