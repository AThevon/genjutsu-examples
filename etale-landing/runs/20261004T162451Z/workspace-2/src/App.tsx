import DayChart from "./DayChart";
import raw from "../data/tide.json";
import { date, datum, lastTurnWithoutSlack, slackAfterTurn, slacks, stations, stretches, zone } from "./tide";

const BETA = "/beta";
const CTA = "Join the TestFlight beta";

const first = stretches.find((s) => s.from === slacks[0]);
const lags = slackAfterTurn.map((p) => p.lag);
const depth = raw.current_slack_and_max[0].depth_ft;
const fetched = new Date(`${raw.fetched_at}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const sentence = (text: string) => `${text[0].toUpperCase()}${text.slice(1)}.`;

const range = (s: (typeof stretches)[number]) =>
  s.from && s.to ? `${s.from.time} to ${s.to.time}` : s.to ? `Until ${s.to.time}` : `From ${s.from!.time}`;

export default function App() {
  return (
    <>
      <header className="masthead">
        <span className="wordmark">Étale</span>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__text">
            <h1 id="hero-title">Slack water at Aquatic Park, before you walk down to the beach.</h1>
            <p className="lead">
              Étale is an iPhone app for people who swim the cove all year. It tells you when the current goes
              slack, and how hard it runs between two slacks.
            </p>
            <a className="button" href={BETA}>
              {CTA}
            </a>
            <p className="caption">iPhone only. The beta is on TestFlight.</p>
          </div>

          <figure className="hero__figure">
            <figcaption className="caption">First slack of {date}</figcaption>
            <p className="figure">{slacks[0].time}</p>
            <p className="caption">
              {zone}, NOAA {stations.current.id}, {stations.current.name}
            </p>
            {first && first.to && (
              <p>
                Then the {first.peak.kind}, up to {first.peak.speed} kn at {first.peak.time}. Next slack{" "}
                <span className="slack-text">{first.to.time}</span>.
              </p>
            )}
          </figure>
        </section>

        <section className="section" aria-labelledby="day-title">
          <h2 id="day-title">{date}, hour by hour</h2>
          <p className="measure">
            The tide at San Francisco and the current off the cove, as NOAA predicted them for that day. Amber marks
            slack. Times are {zone}.
          </p>
          <DayChart />
          <h3>The strongest current between slacks, at {stations.current.id}</h3>
          <ul className="stretches">
            {stretches.map((s) => (
              <li key={s.peak.time}>
                <span className="stretches__range">{range(s)}</span>
                <span>
                  {s.peak.kind}, up to <strong>{s.peak.speed} kn</strong> at {s.peak.time}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" aria-labelledby="lag-title">
          <h2 id="lag-title">Slack is not high tide</h2>
          <p className="measure">
            Slack is the moment the current is weakest, and it does not fall on the high or the low. On {date}, each
            slack at {stations.current.id} came {Math.min(...lags)} to {Math.max(...lags)} minutes after the turn of
            the tide at {stations.tide.id}. Étale reads slack from the current predictions, not from the tide table.
          </p>
          <table className="lag">
            <thead>
              <tr>
                <th scope="col">Tide turns at {stations.tide.id}</th>
                <th scope="col">Height, ft above {datum}</th>
                <th scope="col">Slack at {stations.current.id}</th>
                <th scope="col">Later by</th>
              </tr>
            </thead>
            <tbody>
              {slackAfterTurn.map(({ turn, slack, lag }) => (
                <tr key={slack.time}>
                  <td>
                    {turn.kind} {turn.time}
                  </td>
                  <td>{turn.ft}</td>
                  <td className="slack-text">{slack.time}</td>
                  <td>{lag} min</td>
                </tr>
              ))}
            </tbody>
          </table>
          {lastTurnWithoutSlack.map((t) => (
            <p key={t.time} className="caption">
              The {t.kind.toLowerCase()} at {t.time} has no slack after it in this day of predictions.
            </p>
          ))}
        </section>

        <section className="section" aria-labelledby="app-title">
          <h2 id="app-title">What the app does</h2>
          <dl className="does">
            <div>
              <dt>The next slack, at a glance</dt>
              <dd>The next slack time at {stations.current.id}, without reading a table on the way out the door.</dd>
            </div>
            <div>
              <dt>How hard it runs in between</dt>
              <dd>The strongest flood or ebb predicted between one slack and the next, in knots.</dd>
            </div>
            <div>
              <dt>An alert the evening before</dt>
              <dd>So you know the night before whether the morning slack fits ahead of work.</dd>
            </div>
          </dl>
        </section>

        <section className="section" aria-labelledby="source-title">
          <h2 id="source-title">Where the numbers come from</h2>
          <div className="sources">
            <div>
              <h3>
                Tide: NOAA {stations.tide.id}, {stations.tide.name}
              </h3>
              <p>Tide height predictions, in feet above {datum} (Mean Lower Low Water).</p>
              <p className="caption">{sentence(stations.tide.where)}</p>
            </div>
            <div>
              <h3>
                Current: NOAA {stations.current.id}, {stations.current.name}
              </h3>
              <p>
                Tidal current predictions, in knots, {depth} ft below the surface. Flood runs into the bay, ebb out of
                it.
              </p>
              <p className="caption">{sentence(stations.current.where)}</p>
            </div>
          </div>
          <p className="measure">
            Both are predictions, and both stations are outside the cove: the water in the cove itself is not measured.
            You know the cove. Étale tells you what NOAA predicts just off it.
          </p>
        </section>

        <section className="section closing" aria-labelledby="beta-title">
          <h2 id="beta-title">On your iPhone before the next swim</h2>
          <p className="measure">Étale is in beta on TestFlight, for iPhone. There is no Android app and no web app.</p>
          <a className="button" href={BETA}>
            {CTA}
          </a>
        </section>
      </main>

      <footer className="footer">
        <p className="caption">
          Predictions from{" "}
          <a className="link" href={raw.source.split(", ").pop()}>
            NOAA CO-OPS
          </a>
          , fetched {fetched}. All times {zone}.
        </p>
      </footer>
    </>
  );
}
