import { useState } from "react";
import SkyChart from "./SkyChart";
import { belowCut, byName, degrees, direction, location, sourceUrls, starCount } from "./sky";

const HERO_LABELS = ["Saturn", "Vega", "Capella", "Altair", "Deneb", "Fomalhaut", "Polaris"];

const saturn = byName("Saturn");
const polaris = byName("Polaris");

// Every note below restates data/stars.json; nothing here is outside it.
const TONIGHT: { name: string; note: string | null }[] = [
  {
    name: "Saturn",
    note: "The one planet up and bright enough to draw. Five days after its opposition, and brighter than every star on the chart except Vega and Capella.",
  },
  { name: "Vega", note: "The brightest star on the chart." },
  { name: "Capella", note: "The second brightest, low in the north-east." },
  { name: "Deneb", note: "Almost overhead." },
  { name: "Altair", note: null },
  { name: "Fomalhaut", note: null },
  {
    name: "Polaris",
    note: `It stands ${degrees(polaris.alt)} above the north horizon. Lisbon lies at ${degrees(location.lat)} N.`,
  },
];

const BELOW = ["Mercury", "Venus", "Mars", "Jupiter"] as const;

export default function App() {
  const [selected, setSelected] = useState<string>("Saturn");
  const current = byName(selected);
  const currentNote = TONIGHT.find((t) => t.name === selected)?.note;

  return (
    <>
      <a className="skip" href="#program">
        Skip to the program
      </a>

      <header className="hero">
        <div className="hero__text">
          <h1 className="display">Nocturne</h1>
          <p className="lead">
            The planetarium after hours, on Friday and Saturday nights in Lisbon. That
            evening's sky over the city, narrated, then a 40-minute show.
          </p>
          <p className="hero__facts">
            Doors 21:30. First show 22:00, last show 23:30. 12 EUR, students 8 EUR.
          </p>
          <a className="btn" href="/tickets">
            Book tickets
          </a>
        </div>

        <figure className="hero__sky">
          <SkyChart labels={HERO_LABELS} arrive labelledBy="hero-sky-caption" />
          <figcaption id="hero-sky-caption" className="caption">
            The sky above Lisbon at 22:00 on Friday 9 October 2026, as the dome will show it:{" "}
            {starCount} stars of magnitude 4.5 or brighter, and Saturn. North at the top, east at
            the left, as seen looking up.
          </figcaption>
        </figure>
      </header>

      <main>
        <section id="program" className="section program" aria-labelledby="program-title">
          <h2 id="program-title" className="h2">
            The program
          </h2>
          <ol className="program__parts">
            <li>
              <h3 className="h3">The sky over Lisbon, that evening</h3>
              <p>
                The dome first shows the night sky above Lisbon as it is that evening, with a
                narrator.
              </p>
            </li>
            <li>
              <h3 className="h3">The show</h3>
              <p>Then a 40-minute show under the same dome.</p>
            </li>
          </ol>
          <p className="program__when">Friday and Saturday nights, after hours.</p>
        </section>

        <section className="section tonight" aria-labelledby="tonight-title">
          <div className="tonight__intro">
            <h2 id="tonight-title" className="h2">
              Friday 9 October, 22:00
            </h2>
            <p>
              What the dome will show that night. Pick a name to find it on the sky.
            </p>
          </div>

          <div className="tonight__body">
            <figure className="tonight__sky">
              <SkyChart
                labels={HERO_LABELS}
                selected={selected}
                labelledBy="tonight-sky-caption"
              />
              <figcaption id="tonight-sky-caption" className="caption">
                The same sky, {current.name} ringed.
              </figcaption>
            </figure>

            <div className="tonight__list">
              <ul className="picks" aria-label="Bright objects in the sky">
                {TONIGHT.map((t) => (
                  <li key={t.name}>
                    <button
                      type="button"
                      className="pick"
                      aria-pressed={selected === t.name}
                      onClick={() => setSelected(t.name)}
                    >
                      {t.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="detail" aria-live="polite">
                <p className="detail__name">{current.name}</p>
                <p className="detail__pos">
                  {degrees(current.alt)} up, {direction(current.az)}. Magnitude{" "}
                  {current.mag.toFixed(2)}.
                  {current.designation ? ` Catalogue label ${current.designation}.` : ""}
                </p>
                <p>{currentNote ?? ""}</p>
              </div>

              <div className="absent">
                <h3 className="h3">Not in this sky</h3>
                <p>
                  The Moon is below the horizon, and nearly new: {belowCut.Moon.illuminated_percent}{" "}
                  percent lit. {BELOW.join(", ").replace(/, (?=[^,]*$)/, " and ")} are below the
                  horizon too. Uranus and Neptune are up, but fainter than the magnitude 4.5 the
                  chart stops at.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section practical" aria-labelledby="practical-title">
          <h2 id="practical-title" className="h2">
            Practical
          </h2>
          <dl className="times">
            <div>
              <dt>Doors</dt>
              <dd className="num">21:30</dd>
            </div>
            <div>
              <dt>First show</dt>
              <dd className="num">22:00</dd>
            </div>
            <div>
              <dt>Last show</dt>
              <dd className="num">23:30</dd>
            </div>
          </dl>
          <dl className="prices">
            <div>
              <dt>Ticket</dt>
              <dd>
                <span className="num">12</span> EUR
              </dd>
            </div>
            <div>
              <dt>Student</dt>
              <dd>
                <span className="num">8</span> EUR
              </dd>
            </div>
          </dl>
          <p>Friday and Saturday nights. Tickets are booked online.</p>
          <a className="btn" href="/tickets">
            Book tickets
          </a>
        </section>
      </main>

      <footer className="footer">
        <p>
          Star positions computed for {location.lat_text}, {location.lon_text} at 22:00 WEST on
          Friday 9 October 2026, from the <a href={sourceUrls[1]}>Yale Bright Star Catalogue</a>,
          5th revised edition (public domain). Star names from the{" "}
          <a href={sourceUrls[2]}>IAU Working Group on Star Names</a> (CC BY). Saturn's position
          from <a href={sourceUrls[3]}>NASA JPL Horizons</a>: {degrees(saturn.alt)} up,{" "}
          {direction(saturn.az)}.
        </p>
      </footer>
    </>
  );
}
