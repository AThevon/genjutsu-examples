import type { CSSProperties } from "react";
import {
  currentEvents,
  currentStation,
  day,
  highsLows,
  minutesOf,
  slackAfterTurn,
  slacks,
  tideCurve,
  tideStation,
} from "./tide";

// Chart geometry, in SVG units. The SVG is stretched horizontally only (preserveAspectRatio
// "none") and drawn at its own pixel height, so vertical units are CSS pixels and the HTML
// labels laid over it can share them.
const DAY_MINUTES = 1440;
const CURRENT = { height: 200, zero: 100, pxPerKnot: 36 };
const TIDE = { height: 140, base: 120, pxPerFoot: 100 / 7, floorFt: -0.5 };
// Gap between a point and its label: --space-2.
const LABEL_GAP = 8;
const HOURS = ["00:00", "06:00", "12:00", "18:00", "24:00"];

const xPct = (minutes: number) => (minutes / DAY_MINUTES) * 100;
const currentY = (knots: number) => CURRENT.zero - knots * CURRENT.pxPerKnot;
const tideY = (ft: number) => TIDE.base - (ft - TIDE.floorFt) * TIDE.pxPerFoot;

const currentPath = currentEvents
  .map((e, i) => `${i ? "L" : "M"}${minutesOf(e.time)} ${currentY(e.signedKnots)}`)
  .join(" ");

const tidePath = tideCurve
  .map((p, i) => `${i ? "L" : "M"}${p.minutes} ${tideY(p.ft).toFixed(1)}`)
  .join(" ");

// One time-ordered list of what both stations predict, for the table.
type DayRow = { time: string; station: string; event: string; value: string };

const rows: DayRow[] = [
  ...slackAfterTurn.map(({ slack, turn, gap }) => ({
    time: slack.time,
    station: currentStation.id,
    event: "Slack",
    value: turn && gap !== undefined ? `${gap} min after the ${turn.kind}` : "",
  })),
  ...currentEvents
    .filter((e) => e.kind !== "slack")
    .map((e) => ({
      time: e.time,
      station: currentStation.id,
      event: `${e.kind === "flood" ? "Flood" : "Ebb"}, strongest`,
      value: `${e.knots} kn`,
    })),
  ...highsLows.map((h) => ({
    time: h.time,
    station: tideStation.id,
    event: h.kind === "high" ? "High tide" : "Low tide",
    value: `${h.ft} ft`,
  })),
].sort((a, b) => minutesOf(a.time) - minutesOf(b.time));

const gaps = slackAfterTurn.flatMap((s) => (s.gap === undefined ? [] : [s.gap]));
const firstEvent = currentEvents[0];
const lastEvent = currentEvents[currentEvents.length - 1];

// Points are centred on their value by CSS; only their position is set here.
const dot = (minutes: number, top: number): CSSProperties => ({
  left: `${xPct(minutes)}%`,
  top: `${top}px`,
});

// Labels sit centred on their point, except near the right edge where they end on it.
const place = (minutes: number, top: number, below = false): CSSProperties => {
  const x = xPct(minutes);
  return {
    left: `${x}%`,
    top: `${top}px`,
    translate: `${x > 90 ? "-100%" : x < 8 ? "0" : "-50%"} ${below ? "0" : "-100%"}`,
  };
};

export default function DaySection() {
  return (
    <section className="section" aria-labelledby="day-title">
      <p className="label">
        One day at both stations, {day.weekday} {day.written}
      </p>
      <h2 id="day-title" className="h2 section-title">
        Slack is not high or low tide.
      </h2>
      <p className="lede">
        A printed table gives you high and low water at the San Francisco gauge. The current
        goes slack later, out in the bay: on {day.written}, each slack at {currentStation.id}{" "}
        came {Math.min(...gaps)} to {Math.max(...gaps)} minutes after the high or low before it
        at {tideStation.id}. Étale reads the slack from the current predictions, not from the
        tide.
      </p>

      <figure className="chart">
        <p className="chart-title" id="current-title">
          Current at {currentStation.id}, in knots. Flood above the line, ebb below.
        </p>
        <div className="plot" style={{ height: `${CURRENT.height}px` }} aria-hidden="true">
          <svg
            className="plot-svg"
            viewBox={`0 0 ${DAY_MINUTES} ${CURRENT.height}`}
            preserveAspectRatio="none"
          >
            {[360, 720, 1080].map((m) => (
              <line key={m} className="grid" x1={m} x2={m} y1={0} y2={CURRENT.height} />
            ))}
            {slacks.map((s) => (
              <line
                key={s.time}
                className="slack-mark"
                x1={minutesOf(s.time)}
                x2={minutesOf(s.time)}
                y1={0}
                y2={CURRENT.height}
              />
            ))}
            <line className="axis" x1={0} x2={DAY_MINUTES} y1={CURRENT.zero} y2={CURRENT.zero} />
          </svg>
          {/* Its own layer, so the one-time draw can clip the outer svg box. */}
          <svg
            className="plot-svg draw"
            viewBox={`0 0 ${DAY_MINUTES} ${CURRENT.height}`}
            preserveAspectRatio="none"
          >
            <path className="current-line" d={currentPath} />
          </svg>
          {currentEvents.map((e) =>
            e.kind === "slack" ? (
              <span key={e.time} className="pt pt-slack after-draw" style={dot(minutesOf(e.time), CURRENT.zero)} />
            ) : (
              <span key={e.time} className="pt after-draw" style={dot(minutesOf(e.time), currentY(e.signedKnots))} />
            ),
          )}
          {slacks.map((s) => (
            <span key={s.time} className="plot-label plot-label-slack after-draw" style={place(minutesOf(s.time), 0, true)}>
              <span className="wide-only">slack </span>
              {s.time}
            </span>
          ))}
          {currentEvents
            .filter((e) => e.kind !== "slack")
            .map((e) => (
              <span
                key={e.time}
                className="plot-label after-draw"
                style={
                  e.kind === "flood"
                    ? place(minutesOf(e.time), currentY(e.signedKnots) - LABEL_GAP)
                    : place(minutesOf(e.time), currentY(e.signedKnots) + LABEL_GAP, true)
                }
              >
                {e.knots} kn
              </span>
            ))}
        </div>

        <p className="chart-title" id="tide-title">
          Tide height at {tideStation.id} {tideStation.name}, in feet above MLLW.
        </p>
        <div className="plot" style={{ height: `${TIDE.height}px` }} aria-hidden="true">
          <svg
            className="plot-svg"
            viewBox={`0 0 ${DAY_MINUTES} ${TIDE.height}`}
            preserveAspectRatio="none"
          >
            {[360, 720, 1080].map((m) => (
              <line key={m} className="grid" x1={m} x2={m} y1={0} y2={TIDE.height} />
            ))}
            {slacks.map((s) => (
              <line
                key={s.time}
                className="slack-mark"
                x1={minutesOf(s.time)}
                x2={minutesOf(s.time)}
                y1={0}
                y2={TIDE.height}
              />
            ))}
            <line className="axis" x1={0} x2={DAY_MINUTES} y1={tideY(0)} y2={tideY(0)} />
            <path className="tide-line" d={tidePath} />
          </svg>
          {highsLows.map((h) => (
            <span key={h.time} className="pt pt-tide" style={dot(minutesOf(h.time), tideY(Number(h.ft)))} />
          ))}
          {highsLows.map((h) => (
            <span
              key={h.time}
              className="plot-label"
              style={
                h.kind === "high"
                  ? place(minutesOf(h.time), tideY(Number(h.ft)) - LABEL_GAP)
                  : place(minutesOf(h.time), tideY(Number(h.ft)) + LABEL_GAP, true)
              }
            >
              {h.kind} {h.time}
            </span>
          ))}
        </div>
        <div className="hours" aria-hidden="true">
          {HOURS.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>

        <figcaption className="src chart-src">
          NOAA CO-OPS predictions for {day.written}, PDT. Current: station {currentStation.id},{" "}
          {currentStation.name}, {currentStation.where}. Tide: station {tideStation.id}{" "}
          {tideStation.name}, {tideStation.where}. The current line joins NOAA's predicted slack
          and strongest-current times: it is not a prediction in between, and the file holds none
          before {firstEvent.time} or after {lastEvent.time}. Both stations are outside the cove,
          and the water in the cove itself is not measured.
        </figcaption>
      </figure>

      <table className="day-table">
        <caption className="label">
          Both stations, {day.written}, in time order
        </caption>
        <thead>
          <tr>
            <th scope="col">PDT</th>
            <th scope="col">Station</th>
            <th scope="col">Prediction</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.station}-${r.time}`} className={r.event === "Slack" ? "is-slack" : undefined}>
              <td>{r.time}</td>
              <td>{r.station}</td>
              <td>{r.event}</td>
              <td>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
