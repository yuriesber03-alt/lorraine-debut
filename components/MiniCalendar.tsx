import { dateParts, monthName, startDate } from "@/lib/format";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export default function MiniCalendar() {
  const { y, m, d } = dateParts(startDate);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="cal" aria-label={`${monthName(startDate)} ${y}`}>
      <div className="cal__head">
        <span>{monthName(startDate)}</span>
        <b className="gold-text">{y}</b>
      </div>
      <div className="cal__grid">
        {DOW.map((x, i) => (
          <i key={i} className="cal__dow">
            {x}
          </i>
        ))}
        {cells.map((n, i) =>
          n === null ? (
            <span key={i} />
          ) : n === d ? (
            <span key={i} className="cal__day cal__day--on">
              <svg viewBox="0 0 40 40" aria-hidden>
                <path d="M20 34 C 4 22 4 9 13 7 C 17 6 19.5 8.5 20 11 C 20.5 8.5 23 6 27 7 C 36 9 36 22 20 34 Z" />
              </svg>
              <em>{n}</em>
            </span>
          ) : (
            <span key={i} className="cal__day">
              {n}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
