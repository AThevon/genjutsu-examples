import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { DATE, maxKnots, maxima, pct, slacks, stations, type CurrentEvent } from "./data";

const HOURS = [0, 360, 720, 1080, 1440];
const hourLabel = (m: number) => (m === 720 ? "Noon" : m === 360 ? "6 AM" : m === 1080 ? "6 PM" : "Midnight");
// Longest stem reaches this share of the plot height, so labels keep room at the edge.
const STEM_REACH = 34;

function stemLabel(e: CurrentEvent) {
  return (
    <>
      <span className="stem-kind">{e.kind === "flood" ? "Flood" : "Ebb"}</span> {e.knots} kn
      <span className="stem-time">{e.time}</span>
    </>
  );
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function DayStrip({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (i: number) => void;
}) {
  // The marker starts at midnight and glides to the selected slack once mounted:
  // the day runs until the water goes still. With reduced motion it starts in place.
  const [markerAt, setMarkerAt] = useState(() => (prefersReducedMotion() ? pct(slacks[selected].minute) : 0));
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const target = pct(slacks[selected].minute);
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setMarkerAt(target));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [selected]);

  function onKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
    const step = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? 1 : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? -1 : 0;
    const jump = ev.key === "Home" ? 0 : ev.key === "End" ? slacks.length - 1 : null;
    if (!step && jump === null) return;
    ev.preventDefault();
    const next = jump ?? (selected + step + slacks.length) % slacks.length;
    onSelect(next);
    buttons.current[next]?.focus();
  }

  return (
    <figure className="strip" aria-labelledby="strip-caption">
      <figcaption id="strip-caption" className="strip-caption">
        <span className="strip-title">
          Current at {stations.current.id}, {DATE}
        </span>
        <span className="source">
          NOAA prediction, {stations.current.name}, {stations.current.where}. Flood above the line, ebb below.
        </span>
      </figcaption>

      <div className="strip-plot" aria-hidden="true">
        <div className="zero-line" />
        {maxima.map((e) => {
          const reach = (Math.abs(e.knotsValue) / maxKnots) * STEM_REACH;
          const up = e.knotsValue > 0;
          return (
            <div
              key={e.minute}
              className={`stem ${up ? "stem-up" : "stem-down"}`}
              style={{ left: `${pct(e.minute)}%`, height: `${reach}%` }}
            >
              <span className="stem-label">{stemLabel(e)}</span>
            </div>
          );
        })}
        {slacks.map((s) => (
          <span key={s.minute} className="slack-dot" style={{ left: `${pct(s.minute)}%` }} />
        ))}
        <div className="marker-track" style={{ transform: `translateX(${markerAt}%)` }}>
          <span className="marker" />
        </div>
      </div>

      <div className="strip-picks" role="group" aria-label={`Slack times at ${stations.current.id}, ${DATE}`} onKeyDown={onKeyDown}>
        {slacks.map((s, i) => (
          <button
            key={s.minute}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            className="slack-pick"
            style={{ left: `${pct(s.minute)}%` }}
            aria-pressed={i === selected}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => onSelect(i)}
          >
            <span className="slack-pick-dot" aria-hidden="true" />
            <span className="slack-pick-time">{s.time}</span>
            <span className="visually-hidden"> slack</span>
          </button>
        ))}
      </div>

      <div className="strip-hours" aria-hidden="true">
        {HOURS.map((m) => (
          <span key={m} className="hour" style={{ left: `${pct(m)}%` }}>
            {hourLabel(m)}
          </span>
        ))}
      </div>
    </figure>
  );
}
