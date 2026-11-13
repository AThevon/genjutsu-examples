import { useState } from "react";
import DayStrip from "./DayStrip";
import TideCurve from "./TideCurve";
import { DATE, FETCHED, SOURCE_URL, lagRange, slacks, stations, turnToSlack, type CurrentEvent } from "./data";

const BETA_HREF = "/beta";
const BETA_LABEL = "Join the TestFlight beta";

function flow(e: CurrentEvent | null, lower = false) {
  if (!e) return lower ? "nothing on this day" : "Not on this day";
  const kind = e.kind === "flood" ? "Flood" : "Ebb";
  return `${lower ? kind.toLowerCase() : kind} ${e.knots} kn at ${e.time}`;
}

function splitClock(t: string) {
  const [hm, ampm] = t.split(" ");
  return { hm, ampm };
}

function Readout({ index }: { index: number }) {
  const s = slacks[index];
  const { hm, ampm } = splitClock(s.time);
  return (
    <section className="readout" aria-live="polite" aria-label="Selected slack">
      <p className="readout-kicker">Slack at {stations.current.id}</p>
      <p className="readout-time">
        {hm}
        <span className="readout-ampm">{ampm} PDT</span>
      </p>
      <p className="source">{DATE}, NOAA current prediction</p>
      <dl className="readout-rows">
        <div>
          <dt>Before</dt>
          <dd>{flow(s.before)}</dd>
        </div>
        <div>
          <dt>After</dt>
          <dd>{flow(s.after)}</dd>
        </div>
        {s.turn && s.lagMinutes !== null && (
          <div>
            <dt>Tide turn</dt>
            <dd>
              {s.turn.kind} {s.turn.ft} ft at {s.turn.time}, {s.lagMinutes} min earlier
              <span className="source"> at {stations.tide.id}, {stations.tide.name}</span>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}

export default function App() {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <header className="site-header">
        <p className="wordmark" lang="fr">
          Étale
        </p>
        <p className="site-header-note">Aquatic Park, San Francisco. For iPhone.</p>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-text">
            <h1 id="hero-title">Slack water at Aquatic Park, before you walk down.</h1>
            <p className="lede">
              Étale reads the current off Alcatraz, not the tide. It gives you the next slack, how hard the water runs
              between two slacks, and an alert the evening before.
            </p>
            <a className="btn" href={BETA_HREF}>
              {BETA_LABEL}
            </a>
            <p className="cta-note">iPhone only, through Apple's TestFlight.</p>
          </div>
          <Readout index={selected} />
          <DayStrip selected={selected} onSelect={setSelected} />
        </section>

        <section className="section slack-vs-tide" aria-labelledby="svt-title">
          <div className="section-text">
            <h2 id="svt-title">Slack is not high or low tide.</h2>
            <p>
              A printed table gives you the turn of the tide. The current keeps running after it. On {DATE}, each slack
              at {stations.current.id} came {lagRange.min} to {lagRange.max} minutes after the high or low at{" "}
              {stations.tide.id}. Étale takes the slack from the current station.
            </p>
          </div>
          <TideCurve />
          <table className="tide-table">
            <caption>
              {DATE}. Tide turns at {stations.tide.id}, slacks at {stations.current.id}, Pacific Daylight Time.
            </caption>
            <thead>
              <tr>
                <th scope="col">Tide turn</th>
                <th scope="col" className="num">
                  Height, ft MLLW
                </th>
                <th scope="col" className="num">
                  Slack
                </th>
                <th scope="col" className="num">
                  Later by
                </th>
              </tr>
            </thead>
            <tbody>
              {turnToSlack.map(({ turn, slack, lag }) => (
                <tr key={turn.minute}>
                  <th scope="row">
                    {turn.kind}, {turn.time}
                  </th>
                  <td className="num">{turn.ft}</td>
                  <td className="num">{slack ? slack.time : "None before midnight"}</td>
                  <td className="num">{lag === null ? "" : `${lag} min`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="section evening" aria-labelledby="evening-title">
          <h2 id="evening-title">The evening before.</h2>
          <div className="evening-body">
            <p>
              You decide the night before whether you swim at first light. Étale sends you the morning's slack, with the
              current on either side of it, so you know tonight whether to set the alarm.
            </p>
            <div className="evening-example">
              <p className="source">For the morning of {DATE}, from the NOAA predictions at {stations.current.id}:</p>
              <p className="evening-line">
                Slack at {slacks[0].time}. Before it, {flow(slacks[0].before, true)}. After it,{" "}
                {flow(slacks[0].after, true)}.
              </p>
            </div>
          </div>
        </section>

        <section className="section sources" aria-labelledby="sources-title">
          <h2 id="sources-title">Where the numbers come from.</h2>
          <div className="sources-body">
            <dl className="station">
              <dt>
                Current: {stations.current.id}, {stations.current.name}
              </dt>
              <dd>NOAA {stations.current.measures}, {stations.current.where}. Knots; flood into the bay, ebb out of it.</dd>
            </dl>
            <dl className="station">
              <dt>
                Tide: {stations.tide.id}, {stations.tide.name}
              </dt>
              <dd>NOAA {stations.tide.measures}, {stations.tide.where}. Feet above Mean Lower Low Water.</dd>
            </dl>
            <p className="sources-note">
              Both stations are outside the cove. The water in the cove itself is not measured. These are predictions,
              not observations: read the water before you go in. Data from the{" "}
              <a className="link" href={SOURCE_URL}>
                NOAA CO-OPS Data API
              </a>
              , fetched {FETCHED}.
            </p>
          </div>
        </section>

        <section className="section closing" aria-labelledby="closing-title">
          <h2 id="closing-title">On TestFlight now.</h2>
          <p>The beta is for iPhone. Join it, and tomorrow's slack is on your phone tonight.</p>
          <a className="btn" href={BETA_HREF}>
            {BETA_LABEL}
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <p>Étale. Tide and current predictions from NOAA CO-OPS.</p>
      </footer>
    </>
  );
}
