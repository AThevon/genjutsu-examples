import { useEffect, useRef, useState, type CSSProperties } from "react";
import { currentEvents, date, datum, slacks, stations, tideCurve, tideTurns, zone } from "./tide";

// SVG user units. The chart scrolls inside its well below 48rem, so labels stay at 1:1.
const W = 960;
const H = 416;
const LEFT = 56;
const RIGHT = 24;
const TIDE_TOP = 56;
const TIDE_BOTTOM = 176;
const FT_MIN = -1;
const FT_MAX = 7;
const ZERO = 292;
const KNOT_PX = 32;

const x = (minute: number) => LEFT + (minute / 1440) * (W - LEFT - RIGHT);
const yTide = (ft: number) => TIDE_BOTTOM - ((ft - FT_MIN) / (FT_MAX - FT_MIN)) * (TIDE_BOTTOM - TIDE_TOP);
const yCurrent = (knots: number) => ZERO - knots * KNOT_PX;

const tidePath = tideCurve
  .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.minute).toFixed(1)} ${yTide(p.ft).toFixed(1)}`)
  .join(" ");
const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const peaks = currentEvents.filter((e) => e.kind !== "slack");

export default function DayChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  // One entrance, the first time the chart is seen. Reduced motion is handled in CSS.
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={drawn ? "daychart is-drawn" : "daychart"}>
      <div className="daychart__scroll" tabIndex={0} role="region" aria-label="Day chart, scrolls sideways on small screens">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="daychart-title daychart-desc">
          <title id="daychart-title">Tide and current predictions for {date}</title>
          <desc id="daychart-desc">
            Tide height at NOAA {stations.tide.id} {stations.tide.name}, and current at NOAA {stations.current.id}{" "}
            {stations.current.name}. Slack water at {slacks.map((s) => s.time).join(", ")} {zone}. The same figures
            are listed in the tables below.
          </desc>

          <text className="daychart__heading" x={LEFT} y={24}>
            Tide height, ft above {datum}, NOAA {stations.tide.id} {stations.tide.name}
          </text>
          <line className="daychart__axis" x1={LEFT} x2={W - RIGHT} y1={yTide(0)} y2={yTide(0)} />
          {[0, 2, 4, 6].map((ft) => (
            <text key={ft} className="daychart__tick" x={LEFT - 8} y={yTide(ft) + 4} textAnchor="end">
              {ft}
            </text>
          ))}
          <path className="daychart__tide" d={tidePath} pathLength={1} />
          {tideTurns.map((t) => (
            <g key={t.time}>
              <line className="daychart__guide" x1={x(t.minute)} x2={x(t.minute)} y1={yTide(Number(t.ft))} y2={ZERO} />
              <text
                className="daychart__turn"
                x={x(t.minute)}
                y={t.kind === "High" ? yTide(Number(t.ft)) - 10 : yTide(Number(t.ft)) + 20}
                textAnchor="middle"
              >
                {t.kind} {t.time}
              </text>
            </g>
          ))}

          <text className="daychart__heading" x={LEFT} y={208}>
            Current, knots, NOAA {stations.current.id} {stations.current.name}: flood up, ebb down
          </text>
          <line className="daychart__axis" x1={LEFT} x2={W - RIGHT} y1={ZERO} y2={ZERO} />
          {peaks.map((p) => {
            const k = Number(p.knots);
            const top = Math.min(ZERO, yCurrent(k));
            return (
              <g key={p.time} className={`daychart__peak daychart__peak--${p.kind}`}>
                <rect x={x(p.minute) - 3} y={top} width={6} height={Math.abs(k) * KNOT_PX} rx={2} />
                <text x={x(p.minute)} y={k > 0 ? top - 8 : top + Math.abs(k) * KNOT_PX + 18} textAnchor="middle">
                  {p.kind} {p.speed} kn, {p.time}
                </text>
              </g>
            );
          })}
          {slacks.map((s, i) => (
            <g key={s.time} className="daychart__slack" style={{ "--i": i } as CSSProperties}>
              <circle cx={x(s.minute)} cy={ZERO} r={6} />
              <text x={x(s.minute)} y={ZERO + 24} textAnchor="middle">
                slack {s.time}
              </text>
            </g>
          ))}

          {hours.map((h) => (
            <text key={h} className="daychart__tick" x={x(h * 60)} y={H - 8} textAnchor="middle">
              {String(h).padStart(2, "0")}:00
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
