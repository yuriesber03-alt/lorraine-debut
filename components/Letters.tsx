import { Fragment, type CSSProperties } from "react";

/** Splits text into per-letter spans for a staggered entrance (animated in CSS). */
export default function Letters({ text, className = "", base = 0 }: { text: string; className?: string; base?: number }) {
  const words = text.split(" ");
  let n = 0;
  return (
    <span className={`letters ${className}`} aria-label={text} style={{ "--base": `${base}ms` } as CSSProperties}>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="word" aria-hidden>
            {[...w].map((c, ci) => (
              <span key={ci} style={{ "--i": n++ } as CSSProperties}>
                {c}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
