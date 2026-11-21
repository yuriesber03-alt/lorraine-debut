import { Corner, Crest } from "./Art";

/** Ivory parchment card with a double gold border, filigree corners and a crest. */
export default function Frame({ children, className = "", crest = true }: { children: React.ReactNode; className?: string; crest?: boolean }) {
  return (
    <div className={`frame ${className}`}>
      <div className="frame__paper" />
      <i className="frame__line" />
      <i className="frame__line frame__line--in" />
      <Corner className="corner corner--tl" />
      <Corner className="corner corner--tr" />
      <Corner className="corner corner--br" />
      <Corner className="corner corner--bl" />
      {crest && <Crest className="frame__crest" />}
      <span className="frame__shine" aria-hidden />
      <div className="frame__body">{children}</div>
    </div>
  );
}
