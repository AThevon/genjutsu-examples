import CurrentDay from "./CurrentDay";
import TideChart, { TurnTable } from "./TideChart";
import { currentStation, dateWritten, depthFt, fetchedAt, slacks, tideStation } from "./data";

const BETA = "/beta";
const CTA = "Join the TestFlight beta";

const fetched = new Date(`${fetchedAt}T12:00:00`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function App() {
  const [first, ...rest] = slacks;

  return (
    <>
      <header className="masthead">
        <p className="wordmark">Étale</p>
      </header>

      <main>
        <div className="hero">
          <div className="hero__text">
            <h1>Know when the water goes slack before you walk down to the beach.</h1>
            <p className="lead">
              Étale is an iPhone app for people who swim at Aquatic Park all year. It gives you the next slack, the
              still moment between ebb and flood, and how strong the current runs between two slacks.
            </p>
            <p className="hero__name">Étale is the French word for slack water.</p>
            <a className="button" href={BETA}>
              {CTA}
            </a>
            <p className="hero__fine">For iPhone, through Apple's TestFlight.</p>
          </div>
          <CurrentDay />
        </div>

        <section className="section turn" aria-labelledby="turn-title">
          <div className="turn__text">
            <h2 id="turn-title">Slack is not high or low tide.</h2>
            <p>
              A tide table gives high and low water. Slack in the bay off the cove comes after the turn, and not by a
              fixed amount. Étale takes its slack times from NOAA's current predictions, never
              from the tide.
            </p>
          </div>
          <TideChart />
          <TurnTable />
        </section>

        <section className="section evening" aria-labelledby="evening-title">
          <h2 id="evening-title" className="evening__kicker">
            The evening before
          </h2>
          <p className="statement">
            Étale sends you an alert with tomorrow's slack times. For {dateWritten} at {currentStation.id}, that was{" "}
            <span className="slack-time">{first.time}</span>, then {rest.map((s) => s.time).join(" and ")}.
          </p>
        </section>

        <section className="section sources" aria-labelledby="sources-title">
          <h2 id="sources-title">Where the numbers come from</h2>
          <div className="sources__pair">
            <div>
              <h3>Current and slack</h3>
              <p className="sources__station">
                {currentStation.id}, {currentStation.name}
              </p>
              <p>
                The closest predicted current station, {currentStation.where}. Speeds in knots, flood into the bay and
                ebb out of it, predicted {depthFt} ft below the surface.
              </p>
            </div>
            <div>
              <h3>Tide height</h3>
              <p className="sources__station">
                {tideStation.id}, {tideStation.name}
              </p>
              <p>
                {capitalise(tideStation.where)}. Heights in feet above Mean Lower Low Water (MLLW).
              </p>
            </div>
          </div>
          <p className="sources__note">
            Both are NOAA CO-OPS predictions, not measurements, in Pacific time. Neither station is inside the cove,
            and nobody measures the water there.
          </p>
        </section>

        <section className="section beta" aria-labelledby="beta-title">
          <h2 id="beta-title">Étale is in beta on TestFlight.</h2>
          <p>iPhone only. There is no Android app and no web version.</p>
          <a className="button" href={BETA}>
            {CTA}
          </a>
        </section>
      </main>

      <footer className="footer">
        <p>
          Tide and current predictions:{" "}
          <a className="link" href="https://tidesandcurrents.noaa.gov/">
            NOAA CO-OPS
          </a>
          , fetched {fetched}. The figures on this page are for {dateWritten}.
        </p>
      </footer>
    </>
  );
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
