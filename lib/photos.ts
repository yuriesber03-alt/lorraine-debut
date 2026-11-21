import fs from "node:fs";
import path from "node:path";

/**
 * Drop photos into /public/photos and they appear automatically. No config needed.
 *
 *   hero.jpg        portrait on the first screen (best: tall, 3:4 or 4:5)
 *   note.jpg        small round portrait beside the personal note
 *   venue.jpg       picture of the venue
 *   finale.jpg      closing portrait
 *   gallery-1.jpg   gallery-2.jpg ...   extra moments (any number)
 *
 * .jpg .jpeg .png .webp .avif all work.
 */

const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export type Photos = {
  hero?: string;
  note?: string;
  venue?: string;
  finale?: string;
  gallery: string[];
};

export function getPhotos(): Photos {
  const dir = path.join(process.cwd(), "public", "photos");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => EXT.has(path.extname(f).toLowerCase()));
  } catch {
    /* folder doesn't exist yet */
  }

  const base = (f: string) => path.basename(f, path.extname(f)).toLowerCase();
  const url = (f?: string) => (f ? `/photos/${encodeURIComponent(f)}` : undefined);
  const named = (n: string) => url(files.find((f) => base(f) === n));

  const gallery = files
    .filter((f) => /^gallery[-_ ]?\d*$/.test(base(f)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => url(f)!);

  return {
    hero: named("hero"),
    note: named("note"),
    venue: named("venue"),
    finale: named("finale"),
    gallery,
  };
}
