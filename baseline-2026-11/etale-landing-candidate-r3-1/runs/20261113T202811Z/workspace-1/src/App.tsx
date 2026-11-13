import { useState } from "react";
import { CurrentChart } from "./CurrentChart";
import { TideChart, TideSlackTable } from "./TideChart";
import {
  slacks,
  around,
  tideToSlack,
  DATE,
  FETCHED,
  CURRENT_STATION,
  TIDE_STATION,
  currentDepthFt,
  floodDirection,
  ebbDirection,
} from "./data";

const BETA = "/beta";
const CTA = "Join the TestFlight beta";

export default function App() {
  const [selected, setSelected] = useState(0);
  const [touched, setTouched] = useState(false);
  const slack = slacks[selected];
  const { before, after, nextSlack } = around(slack);
  const morning = slacks[0];
  const morningAfter = around(morning).after;
  const lags = tideToSlack.filter((p) => p.lag !== undefined).map((p) => `${p.lag}`);

  return (
    <>
      <header className="site-header">
        <div className="frame">
          <span className="wordmark" lang="fr">
            Étale
          </span>
        </div>
      </header>

      <main>
        <section className="hero frame" aria-labelledby="hero-title">
          <div className="hero__text">
            <h1 id="hero-title">Know when the water goes slack before you walk down to the beach.</h1>
            <p className="lead">
              Étale is an iPhone app for swimmers at Aquatic Park. It gives you the next slack off the cove, and how
              hard the current runs until the one after.
            </p>
            <div className="cta">
              <a className="button" href={BETA}>
                {CTA}
              </a>
              <span className="cta__note">iPhone only, through Apple's TestFlight.</span>
            </div>
          </div>

          <div className="readout" aria-live="polite">
            <p className="source">
              {DATE}, NOAA station {CURRENT_STATION.id}
            </p>
            <div key={selected} className={touched ? "readout__body is-swapped" : "readout__body"}>
              <p className="readout__time">
                {slack.hhmm}
                <span className="readout__unit">slack</span>
              </p>
              <p className="readout__then">
                {after ? (
                  <>
                    Then {after.type}, strongest <strong>{after.speed} kn</strong> at {after.hhmm}.
                  </>
                ) : null}{" "}
                {nextSlack ? <>Next slack {nextSlack.hhmm}.</> : <>No further slack before midnight.</>}
              </p>
              {before ? (
                <p className="readout__before">
                  Before it, {before.type} up to {before.speed} kn at {before.hhmm}.
                </p>
              ) : null}
            </div>
            <div className="chips" role="group" aria-label={`Slacks at ${CURRENT_STATION.id} on ${DATE}`}>
              {slacks.map((s, i) => (
                <button
                  key={s.hhmm}
                  type="button"
                  className="chip"
                  aria-pressed={i === selected}
                  onClick={() => {
                    setSelected(i);
                    setTouched(true);
                  }}
                >
                  {s.hhmm}
                </button>
              ))}
            </div>
          </div>

          <div className="hero__chart">
            <CurrentChart selected={selected} />
          </div>
        </section>

        <section className="section frame" aria-labelledby="tide-title">
          <div className="prose">
            <h2 id="tide-title">Slack is not high or low water</h2>
            <p>
              A printed table gives you high and low water at the San Francisco gauge. The current off the cove keeps
              running after the tide turns. On {DATE}, each slack at {CURRENT_STATION.id} came {lags.join(", ")}{" "}
              minutes after the high or low before it. Étale takes its slack times from the current predictions, not
              from the tide.
            </p>
          </div>
          <TideChart />
          <TideSlackTable />
        </section>

        <section className="section frame" aria-labelledby="alert-title">
          <div className="prose">
            <h2 id="alert-title">The evening before</h2>
            <p>
              Étale alerts you the evening before with the next morning's slack and the strongest current after it,
              so the decision is made before you set the alarm.
            </p>
          </div>
          <div className="example">
            <p className="source">Example, from NOAA's predictions for {DATE}</p>
            <dl>
              <div className="example__row">
                <dt>Slack</dt>
                <dd className="is-slack">{morning.hhmm}</dd>
              </div>
              {morningAfter ? (
                <div className="example__row">
                  <dt>Then</dt>
                  <dd>
                    {morningAfter.type}, strongest {morningAfter.speed} kn at {morningAfter.hhmm}
                  </dd>
                </div>
              ) : null}
              <div className="example__row">
                <dt>Station</dt>
                <dd>
                  {CURRENT_STATION.id}, {CURRENT_STATION.name}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section frame" aria-labelledby="source-title">
          <div className="prose">
            <h2 id="source-title">Where the numbers come from</h2>
            <p>
              Two NOAA CO-OPS stations, both outside the cove. The water inside the cove itself is not measured, and
              Étale does not show water temperature.
            </p>
          </div>
          <div className="stations">
            <dl className="station">
              <dt className="station__name">
                {CURRENT_STATION.id}
                <span>{CURRENT_STATION.name}</span>
              </dt>
              <dd>Current predictions: slack times, and flood and ebb maxima in knots.</dd>
              <dd>{capitalise(CURRENT_STATION.where)}.</dd>
              <dd>
                Predicted {currentDepthFt} ft below the surface. Flood runs toward {floodDirection}°, ebb toward{" "}
                {ebbDirection}°.
              </dd>
            </dl>
            <dl className="station">
              <dt className="station__name">
                {TIDE_STATION.id}
                <span>{TIDE_STATION.name}</span>
              </dt>
              <dd>Tide predictions: height every 6 minutes, highs and lows.</dd>
              <dd>{capitalise(TIDE_STATION.where)}.</dd>
              <dd>Heights in feet above MLLW (Mean Lower Low Water).</dd>
            </dl>
          </div>
        </section>

        <section className="section section--close frame" aria-labelledby="beta-title">
          <div className="prose">
            <h2 id="beta-title">The beta is open</h2>
            <p>Étale is in beta on TestFlight, for iPhone. There is no Android or web version.</p>
          </div>
          <a className="button" href={BETA}>
            {CTA}
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="frame">
          <p>
            Tide and current predictions from the NOAA CO-OPS Data API, stations {TIDE_STATION.id} and{" "}
            {CURRENT_STATION.id}, for {DATE}, fetched {FETCHED}. Times are Pacific Daylight Time.
          </p>
        </div>
      </footer>
    </>
  );
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
