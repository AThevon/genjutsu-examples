import { currentStation, day, sources, tideStation } from "./tide";

const fetched = new Date(`${sources.fetched}T12:00:00`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Closing() {
  return (
    <section className="section closing" aria-labelledby="beta-title">
      <h2 id="beta-title" className="h2">
        The beta is on TestFlight.
      </h2>
      <p className="lede">
        Étale is in beta for iPhone, through Apple's TestFlight. There is no Android app and no
        web app. It shows slack and the current between slacks, from NOAA predictions, and an
        alert the evening before. It shows no water temperature.
      </p>
      <div className="closing-cta">
        <a className="btn" href="/beta">
          Join the TestFlight beta
        </a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="src">
        Figures on this page are NOAA CO-OPS predictions for {day.written}, fetched on {fetched}
        :{" "}
        <a className="link" href={sources.current}>
          current at {currentStation.id}
        </a>{" "}
        and{" "}
        <a className="link" href={sources.tide}>
          tide at {tideStation.id}
        </a>
        . Predictions, not measurements, from stations outside the cove.
      </p>
    </footer>
  );
}
