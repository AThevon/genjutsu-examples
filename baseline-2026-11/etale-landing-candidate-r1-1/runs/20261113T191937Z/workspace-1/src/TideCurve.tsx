import { DATE, lagRange, pct, slacks, stations, tideCurve, tideTurns } from "./data";

// Plot bounds in feet: the curve's own range, padded by half a foot. Not displayed as figures.
const lo = Math.floor(Math.min(...tideCurve.map((p) => p.ft)) * 2) / 2 - 0.5;
const hi = Math.ceil(Math.max(...tideCurve.map((p) => p.ft)) * 2) / 2 + 0.5;
const H = 100;
const y = (ft: number) => H - ((ft - lo) / (hi - lo)) * H;
const yPct = (ft: number) => (y(ft) / H) * 100;

const path = tideCurve.map((p, i) => `${i ? "L" : "M"}${p.minute} ${y(p.ft).toFixed(2)}`).join(" ");

export default function TideCurve() {
  return (
    <figure className="tide" aria-labelledby="tide-caption">
      <figcaption id="tide-caption" className="strip-caption">
        <span className="strip-title">
          Tide at {stations.tide.id} and slack at {stations.current.id}, {DATE}
        </span>
        <span className="source">
          Tide height in feet above MLLW, NOAA prediction every 6 minutes, {stations.tide.name}. Orange lines: slack at{" "}
          {stations.current.id}.
        </span>
      </figcaption>
      <div className="tide-plot" aria-hidden="true">
        <div className="tide-area">
        <svg viewBox={`0 0 1440 ${H}`} preserveAspectRatio="none" className="tide-svg">
          <line x1="0" x2="1440" y1={y(0)} y2={y(0)} className="tide-datum" vectorEffect="non-scaling-stroke" />
          {slacks.map((s) => (
            <line key={s.minute} x1={s.minute} x2={s.minute} y1="0" y2={H} className="tide-slack" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={path} className="tide-line" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="tide-datum-label" style={{ top: `${yPct(0)}%` }}>
          0 ft MLLW
        </span>
        {tideTurns.map((t) => (
          <span
            key={t.minute}
            className={`tide-turn ${t.kind === "High" ? "tide-turn-high" : "tide-turn-low"}`}
            style={{ left: `${pct(t.minute)}%`, top: `${yPct(Number(t.ft))}%` }}
          >
            <span className="tide-turn-label">
              {t.kind} {t.ft} ft
              <span className="stem-time">{t.time}</span>
            </span>
          </span>
        ))}
        </div>
      </div>
      <p className="visually-hidden">
        On {DATE}, each slack at {stations.current.id} came {lagRange.min} to {lagRange.max} minutes after the high or low
        at {stations.tide.id}.
      </p>
    </figure>
  );
}
