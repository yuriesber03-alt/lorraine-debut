import fs from "node:fs";
import path from "node:path";

/**
 * Optional illustrated artwork. Drop files into /public/art and the site picks them up.
 * Nothing here is required: without a file, the built-in vector design is used.
 * See ART-GUIDE.md for exact names, sizes and prompts.
 */
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export function getArt(): Record<string, string> {
  const dir = path.join(process.cwd(), "public", "art");
  const out: Record<string, string> = {};
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => EXT.has(path.extname(f).toLowerCase()));
  } catch {
    return out;
  }
  for (const f of files) out[path.basename(f, path.extname(f)).toLowerCase()] = `/art/${encodeURIComponent(f)}`;
  return out;
}
