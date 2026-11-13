import { tideCurve, tideToSlack, slacks, pct, DATE, TIDE_STATION, CURRENT_STATION } from "./data";

// Tide height in feet above MLLW, mapped to percent of the plot height.
const FT_MIN = -0.5;
const FT_MAX = 8;
const y = (ft: number) => 100 - ((ft - FT_MIN) / (FT_MAX - FT_MIN)) * 100;

const HOURS = [0, 6, 12, 18, 24];

export function TideChart() {
  const points = tideCurve.map((p) => `${p.min},${y(p.ft)}`).join(" ");

  return (
    <figure className="chart chart--tide">
      <div className="chart__plot chart__plot--tide" aria-hidden="true">
        <svg className="chart__svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          {HOURS.map((h) => (
            <line key={h} className="chart__grid" x1={h * 60} x2={h * 60} y1={0} y2={100} vectorEffect="non-scaling-stroke" />
          ))}
          {slacks.map((s) => (
            <line
              key={s.hhmm}
              className="chart__slack-rule"
              x1={s.min}
              x2={s.min}
              y1={0}
              y2={100}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polyline className="chart__line" points={points} vectorEffect="non-scaling-stroke" />
        </svg>

        {tideToSlack.map(({ hl }) => (
          <span
            key={hl.hhmm}
            className={`chart__hl chart__hl--${hl.kind.toLowerCase()}`}
            style={{ left: `${pct(hl.min)}%`, top: `${y(hl.value)}%` }}
          >
            <span className="chart__hl-label">
              {hl.kind} {hl.hhmm}
            </span>
          </span>
        ))}

        {slacks.map((s) => (
          <span key={s.hhmm} className="chart__slack-top" style={{ left: `${pct(s.min)}%` }}>
            <span className="chart__slack-word">Slack </span>
            {s.hhmm}
          </span>
        ))}
      </div>

      <div className="chart__axis" aria-hidden="true">
        {HOURS.map((h) => (
          <span key={h} className="chart__tick" style={{ left: `${(h / 24) * 100}%` }}>
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
      </div>

      <figcaption className="chart__caption">
        <span className="source">
          Tide height, {DATE}, NOAA station {TIDE_STATION.id}, {TIDE_STATION.name}, feet above MLLW, every 6 minutes.
          Amber lines: slack at {CURRENT_STATION.id}.
        </span>
      </figcaption>
    </figure>
  );
}

export function TideSlackTable() {
  return (
    <table className="pairs">
      <caption className="visually-hidden">
        High and low water at {TIDE_STATION.id} and the slack that followed at {CURRENT_STATION.id}, {DATE}
      </caption>
      <thead>
        <tr>
          <th scope="col">Tide at {TIDE_STATION.id}</th>
          <th scope="col">Height (ft, MLLW)</th>
          <th scope="col">Slack at {CURRENT_STATION.id}</th>
          <th scope="col">Later by</th>
        </tr>
      </thead>
      <tbody>
        {tideToSlack.map(({ hl, slack, lag }) => (
          <tr key={hl.hhmm}>
            <td>
              {hl.kind} {hl.hhmm}
            </td>
            <td>{hl.ft}</td>
            <td className={slack ? "is-slack" : undefined}>{slack ? slack.hhmm : "None before midnight"}</td>
            <td>{lag !== undefined ? `${lag} min` : "n/a"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
