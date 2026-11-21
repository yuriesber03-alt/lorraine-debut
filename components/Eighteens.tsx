import Panel from "./Panel";
import Frame from "./Frame";
import { invitation } from "@/config/invitation";

/** One scene per group: 18 Candles, 18 Treasures, 18 Roses ... */
export default function Eighteens() {
  const { eighteens: groups, age } = invitation;

  return (
    <>
      {groups.map((g, i) => {
        const alt = i % 2 === 1;
        return (
          <Panel
            key={g.title}
            id={i === 0 ? "eighteens" : undefined}
            tone={alt ? "rose" : "velvet"}
            rouge={alt}
            clusters={alt ? ["tr", "bl"] : ["tl", "br"]}
            butterflies={alt ? 0 : 1}
          >
            <Frame>
              <div className="ecard__num gold-text">{age}</div>
              <h2 className="script-title">{g.title}</h2>
              {g.subtitle && <p className="eyebrow">{g.subtitle}</p>}
              <div className="divider" />
              <ol className="ecard__list">
                {g.people.map((p, j) => (
                  <li key={`${p.name}-${j}`}>
                    {p.role && <em>({p.role})</em>}
                    {p.name}
                  </li>
                ))}
              </ol>
            </Frame>
          </Panel>
        );
      })}
    </>
  );
}
