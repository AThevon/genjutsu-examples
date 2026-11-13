import type { CSSProperties } from "react";
import { currentEvents, maxima, slacks, pct, DATE, CURRENT_STATION, type CurrentEvent } from "./data";

// Vertical scale: knots mapped to percent of the plot height, zero (slack) in the middle.
const K_RANGE = 2.6;
const y = (knots: number) => 50 - (knots / K_RANGE) * 50;

const HOURS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

type Props = { selected: number };

export function CurrentChart({ selected }: Props) {
  const points = currentEvents.map((e) => `${e.min},${y(e.value)}`).join(" ");
  const first = slacks[0];
  // The one motion: the ring of the first slack arrives from the maximum before it.
  const from = [...maxima].reverse().find((e) => e.min < first.min);

  return (
    <figure className="chart chart--current">
      <div className="chart__plot" aria-hidden="true">
        <svg className="chart__svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          {HOURS.map((h) => (
            <line
              key={h}
              className={h % 6 === 0 ? "chart__grid" : "chart__grid chart__grid--minor"}
              x1={h * 60}
              x2={h * 60}
              y1={0}
              y2={100}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <line className="chart__zero" x1={0} x2={1440} y1={50} y2={50} vectorEffect="non-scaling-stroke" />
          <polyline className="chart__line" points={points} vectorEffect="non-scaling-stroke" />
        </svg>

        <span className="chart__side chart__side--flood">Flood, into the bay</span>
        <span className="chart__side chart__side--ebb">Ebb, out of it</span>

        {maxima.map((e) => (
          <span
            key={e.hhmm}
            className={`chart__peak chart__peak--${e.type}`}
            style={{ left: `${pct(e.min)}%`, top: `${y(e.value)}%` }}
          >
            {e.speed} kn at {e.hhmm}
          </span>
        ))}

        {slacks.map((s, i) => (
          <SlackMark
            key={s.hhmm}
            slack={s}
            selected={i === selected}
            arrive={i === 0 && from ? from : undefined}
          />
        ))}
      </div>

      <div className="chart__axis" aria-hidden="true">
        {HOURS.map((h) => (
          <span
            key={h}
            className={h % 6 === 0 ? "chart__tick" : "chart__tick chart__tick--minor"}
            style={{ left: `${(h / 24) * 100}%` }}
          >
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
      </div>

      <figcaption className="chart__caption">
        <span className="source">
          Current predictions, {DATE}, NOAA station {CURRENT_STATION.id}, {CURRENT_STATION.name}
        </span>
        <span className="note">
          The line joins NOAA's predicted maxima and slacks with straight segments. Only the marked points are
          predictions.
        </span>
      </figcaption>

      <table className="events">
        <caption className="visually-hidden">
          Current at {CURRENT_STATION.id}, {DATE}
        </caption>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Current</th>
            <th scope="col">Speed (knots)</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((e) => (
            <tr key={e.hhmm} className={e.type === "slack" ? "is-slack" : undefined}>
              <td>{e.hhmm}</td>
              <td>{e.type === "slack" ? "Slack" : e.type === "flood" ? "Flood maximum" : "Ebb maximum"}</td>
              <td>{e.knots}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function SlackMark({ slack, selected, arrive }: { slack: CurrentEvent; selected: boolean; arrive?: CurrentEvent }) {
  const pos = { left: `${pct(slack.min)}%`, top: "50%" };
  const layerStyle = arrive
    ? ({
        "--from-x": `${pct(arrive.min) - pct(slack.min)}%`,
        "--from-y": `${y(arrive.value) - 50}%`,
      } as CSSProperties)
    : undefined;

  return (
    <>
      <span className="chart__dot" style={pos} />
      <span className="chart__slack-time" style={{ left: pos.left }}>
        {slack.hhmm}
      </span>
      <span className={arrive ? "chart__ring-layer chart__ring-layer--arrive" : "chart__ring-layer"} style={layerStyle}>
        <span className={selected ? "chart__ring is-selected" : "chart__ring"} style={pos} />
      </span>
    </>
  );
}
