import { useState, type CSSProperties, type PointerEvent } from "react";
import "./App.css";
import {
  DAY_MINUTES,
  clock,
  clockText,
  dateWritten,
  datum,
  fetchedAt,
  highsLows,
  lagMax,
  lagMin,
  maxAbsKnots,
  maxima,
  slacks,
  sourceUrl,
  stations,
  tideCurve,
  tideMax,
  tideMin,
  weekday,
  type CurrentEvent,
  type Slack,
} from "./data";

const pct = (minute: number) => `${(minute / DAY_MINUTES) * 100}%`;
const sentence = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}.`;
const runName = (e: CurrentEvent) => (e.type === "flood" ? "flood" : "ebb");

function Time({ t }: { t: string }) {
  const c = clock(t);
  return (
    <>
      {c.time}
      <span className="suffix"> {c.suffix}</span>
    </>
  );
}

function windowSentence(s: Slack) {
  return `Slack ${clockText(s.t)}. Before it, the ${runName(s.before)} peaks at ${s.before.knotsText} kn at ${clockText(
    s.before.t,
  )}. After it, the ${runName(s.after)} peaks at ${s.after.knotsText} kn at ${clockText(s.after.t)}.`;
}

function stripSummary() {
  const parts = maxima.map((m) => `${runName(m)} ${m.knotsText} knots at ${clockText(m.t)}`);
  return `Current predictions at station ${stations.current.id} for ${dateWritten}: ${parts.join(
    ", ",
  )}; slack at ${slacks.map((s) => clockText(s.t)).join(", ")}.`;
}

function DayStrip({ selected }: { selected: Slack }) {
  const bandStyle = {
    "--start": selected.before.minute / DAY_MINUTES,
    "--span": (selected.after.minute - selected.before.minute) / DAY_MINUTES,
  } as CSSProperties;

  return (
    <figure className="strip-figure">
      <div className="strip" role="img" aria-label={stripSummary()}>
        <div className="strip-band" style={bandStyle} aria-hidden="true" />
        <div className="strip-zero" aria-hidden="true" />
        {maxima.map((m) => (
          <div
            key={m.t}
            className={`stem stem-${m.type}`}
            style={{ left: pct(m.minute), "--k": Math.abs(m.knots) / maxAbsKnots } as CSSProperties}
            aria-hidden="true"
          >
            <span className="stem-label">
              {m.type === "flood" ? "Flood" : "Ebb"} {m.knotsText} kn
              <br />
              <Time t={m.t} />
            </span>
          </div>
        ))}
        {slacks.map((s) => (
          <div
            key={s.t}
            className={`slack-tick${s.t === selected.t ? " is-selected" : ""}`}
            style={{ left: pct(s.minute) }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="hours" aria-hidden="true">
        <span style={{ left: "0%" }}>12 am</span>
        <span style={{ left: "25%" }}>6 am</span>
        <span style={{ left: "50%" }}>noon</span>
        <span style={{ left: "75%" }}>6 pm</span>
        <span style={{ left: "100%" }}>12 am</span>
      </div>
      <ul className="strip-list" aria-hidden="true">
        {maxima.map((m) => (
          <li key={m.t}>
            {m.type === "flood" ? "Flood" : "Ebb"} {m.knotsText} kn at <Time t={m.t} />
          </li>
        ))}
      </ul>
      <figcaption className="label">
        Above the line: flood, into the bay. Below: ebb, out of it. Stem height is the predicted maximum
        speed; orange marks slack. Only NOAA&rsquo;s predicted points are drawn, nothing between them.
      </figcaption>
    </figure>
  );
}

function TideCurve() {
  const h = 100;
  const pad = 6;
  const y = (ft: number) => pad + ((tideMax - ft) / (tideMax - tideMin)) * (h - pad * 2);
  const points = tideCurve.map((p) => `${p.minute},${y(p.feet).toFixed(2)}`).join(" ");

  return (
    <figure className="curve-figure">
      <div
        className="curve"
        role="img"
        aria-label={`Predicted tide height at station ${stations.tide.id} for ${dateWritten}, with the slack times of station ${stations.current.id} marked on the same clock.`}
      >
        <svg viewBox={`0 0 ${DAY_MINUTES} ${h}`} preserveAspectRatio="none" aria-hidden="true">
          <polyline points={points} />
        </svg>
        {highsLows.map((p) => (
          <div
            key={p.t}
            className="turn"
            style={{ left: pct(p.minute), top: `${y(p.feet)}%` } as CSSProperties}
            aria-hidden="true"
          >
            <span
              className={[
                "turn-label",
                p.kind === "High" || y(p.feet) > 80 ? "turn-label-above" : "turn-label-below",
                p.minute / DAY_MINUTES > 0.85 ? "turn-label-end" : "",
              ].join(" ")}
            >
              {p.kind} <Time t={p.t} />
            </span>
          </div>
        ))}
        {slacks.map((s) => (
          <div key={s.t} className="curve-slack" style={{ left: pct(s.minute) }} aria-hidden="true" />
        ))}
      </div>
      <div className="hours" aria-hidden="true">
        <span style={{ left: "0%" }}>12 am</span>
        <span style={{ left: "25%" }}>6 am</span>
        <span style={{ left: "50%" }}>noon</span>
        <span style={{ left: "75%" }}>6 pm</span>
        <span style={{ left: "100%" }}>12 am</span>
      </div>
      <figcaption className="label">
        Line: predicted tide height at {stations.tide.id} {stations.tide.name}, in feet above MLLW, every 6
        minutes. Orange: slack at {stations.current.id}. {dateWritten}, Pacific Daylight Time.
      </figcaption>
    </figure>
  );
}

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = slacks[selectedIndex];
  const onPointerEnter = (i: number) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") setSelectedIndex(i);
  };

  return (
    <>
      <header className="site-header wrap">
        <span className="wordmark">Étale</span>
        <a className="button button-small" href="/beta">
          Join the TestFlight beta
        </a>
      </header>

      <main>
        <section className="hero wrap" aria-labelledby="hero-title">
          <h1 id="hero-title">Slack water at Aquatic Park, before you walk down to the beach.</h1>
          <p className="lead">
            Étale takes the slack times from NOAA&rsquo;s current predictions, not from the tide table,
            and tells you how hard the current runs between two slacks.
          </p>

          <p className="label readout-label" id="readout-label">
            Slack at {stations.current.id}, {stations.current.name}. {weekday} {dateWritten}, Pacific
            Daylight Time.
          </p>
          <div className="readout" role="group" aria-labelledby="readout-label">
            {slacks.map((s, i) => (
              <button
                key={s.t}
                type="button"
                className="slack-time"
                aria-pressed={i === selectedIndex}
                onClick={() => setSelectedIndex(i)}
                onFocus={() => setSelectedIndex(i)}
                onPointerEnter={onPointerEnter(i)}
              >
                <Time t={s.t} />
              </button>
            ))}
          </div>

          <DayStrip selected={selected} />

          <p className="detail" aria-live="polite">
            {windowSentence(selected)}
          </p>

          <div className="hero-action">
            <a className="button" href="/beta">
              Join the TestFlight beta
            </a>
            <p className="label">iPhone only. The beta runs on Apple&rsquo;s TestFlight.</p>
          </div>
        </section>

        <section className="section wrap" aria-labelledby="not-tide-title">
          <h2 id="not-tide-title">Slack is not high or low tide.</h2>
          <p className="prose">
            The printed table tells you when the water stops rising or falling. The current keeps running
            after that. On {dateWritten} each slack at {stations.current.id} came {lagMin} to {lagMax}{" "}
            minutes after the high or low at {stations.tide.id}.
          </p>
          <TideCurve />
          <table className="lag-table">
            <caption className="label">
              {dateWritten}. Tide turn at {stations.tide.id}, slack at {stations.current.id}.
            </caption>
            <thead>
              <tr>
                <th scope="col">Tide turns</th>
                <th scope="col">Slack</th>
                <th scope="col">Later by</th>
              </tr>
            </thead>
            <tbody>
              {slacks.map((s) => (
                <tr key={s.t}>
                  <td>
                    {s.turn.kind} <Time t={s.turn.t} />
                    <span className="cell-note">{s.turn.ft} ft</span>
                  </td>
                  <td className="cell-slack">
                    <Time t={s.t} />
                  </td>
                  <td>{s.turn.lag} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="section wrap" aria-labelledby="evening-title">
          <h2 id="evening-title">The evening before, one alert.</h2>
          <p className="prose">
            Tomorrow&rsquo;s slack times arrive the night before, so you know which window you are
            swimming in before you set the alarm.
          </p>
          <figure className="raised alert-example">
            <figcaption className="label">
              Example, written from the predictions for {weekday} {dateWritten} at {stations.current.id}.
            </figcaption>
            <p className="alert-text">
              Tomorrow, {weekday} {dateWritten}: slack at {slacks.map((s) => clockText(s.t)).join(", ")}.
              After the first, the {runName(slacks[0].after)} peaks at {slacks[0].after.knotsText} kn at{" "}
              {clockText(slacks[0].after.t)}.
            </p>
          </figure>
        </section>

        <section className="section wrap" aria-labelledby="source-title">
          <h2 id="source-title">Where the numbers come from.</h2>
          <p className="prose">
            Two NOAA CO-OPS stations, both outside the cove. The water in the cove itself is not measured.
            Every figure is a prediction.
          </p>
          <div className="stations">
            <div className="raised">
              <p className="label">
                Current station {stations.current.id}, {stations.current.measures}
              </p>
              <p className="station-name">{stations.current.name}</p>
              <p>{sentence(stations.current.where)}</p>
              <p className="label">
                Speed in knots. Flood runs into the bay, ebb out of it. Slack is when it is weakest.
              </p>
            </div>
            <div className="raised">
              <p className="label">
                Tide station {stations.tide.id}, {stations.tide.measures}
              </p>
              <p className="station-name">{stations.tide.name}</p>
              <p>{sentence(stations.tide.where)}</p>
              <p className="label">Height in feet. {datum}.</p>
            </div>
          </div>
          <p className="label source-line">
            Source:{" "}
            <a className="text-link" href={sourceUrl}>
              NOAA CO-OPS Data API
            </a>
            , predictions for {dateWritten}, fetched {fetchedAt}. Times are Pacific Daylight Time.
          </p>
        </section>

        <section className="section closing wrap" aria-labelledby="beta-title">
          <h2 id="beta-title">Swim the next slack.</h2>
          <p className="prose">
            Étale is an iPhone app in beta on TestFlight. There is no Android version and no web app.
          </p>
          <a className="button" href="/beta">
            Join the TestFlight beta
          </a>
        </section>
      </main>

      <footer className="site-footer wrap">
        <p className="label">
          Étale. Tide and current predictions from NOAA CO-OPS stations {stations.tide.id} and{" "}
          {stations.current.id}.
        </p>
      </footer>
    </>
  );
}
