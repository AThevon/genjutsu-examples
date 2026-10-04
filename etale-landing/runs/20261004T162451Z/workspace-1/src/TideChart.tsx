import { DAY_MINUTES, currentStation, dateWritten, highsLows, slacks, tideCurve, tideStation } from "./data";

const VIEW_H = 100;
const PAD = 12;
const heights = tideCurve.map((p) => p.ft);
const top = Math.max(...heights);
const bottom = Math.min(...heights);
const y = (ft: number) => PAD + ((top - ft) / (top - bottom)) * (VIEW_H - PAD * 2);
const pct = (minute: number) => (minute / DAY_MINUTES) * 100;
const points = tideCurve.map((p) => `${p.minute},${y(p.ft).toFixed(2)}`).join(" ");

export default function TideChart() {
  return (
    <figure className="tide">
      <div className="tide__plot">
        <svg viewBox={`0 0 ${DAY_MINUTES} ${VIEW_H}`} preserveAspectRatio="none" aria-hidden="true">
          <line className="tide__zero" x1="0" x2={DAY_MINUTES} y1={y(0)} y2={y(0)} vectorEffect="non-scaling-stroke" />
          <polyline className="tide__line" points={points} vectorEffect="non-scaling-stroke" />
        </svg>
        {slacks.map((s) => (
          <span key={s.time} className="tide__slack" style={{ left: `${pct(s.minute)}%` }} aria-hidden="true" />
        ))}
        {highsLows.map((h) => (
          <span
            key={h.time}
            className={`tide__turn tide__turn--${h.type.toLowerCase()}`}
            style={{ left: `${pct(h.minute)}%`, top: `${y(Number(h.ft))}%` }}
            aria-hidden="true"
          >
            {h.type === "High" ? "H" : "L"} {h.time}
          </span>
        ))}
      </div>
      <figcaption className="caption">
        Tide height at {tideStation.id} {tideStation.name}, {dateWritten}, feet above MLLW. Amber: slack at{" "}
        {currentStation.id}. NOAA predictions, Pacific Daylight Time.
      </figcaption>
    </figure>
  );
}

export function TurnTable() {
  return (
    <table className="turns">
      <caption className="caption">
        {dateWritten}. Turn of the tide at {tideStation.id} {tideStation.name}; slack at {currentStation.id}{" "}
        {currentStation.name}.
      </caption>
      <thead>
        <tr>
          <th scope="col">Tide turns</th>
          <th scope="col">Height</th>
          <th scope="col">Slack</th>
          <th scope="col">Later by</th>
        </tr>
      </thead>
      <tbody>
        {slacks.map((s) => (
          <tr key={s.time}>
            <td>
              <span className="turns__kind">{s.turn.type} water</span> {s.turn.time}
            </td>
            <td>{s.turn.ft} ft</td>
            <td className="turns__slack">{s.time}</td>
            <td>{s.turn.minutesBefore} min</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
