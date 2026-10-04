import { useState } from "react";
import { Dome } from "./Dome";
import { brightest, direction, lisbonLat, moon, polaris, saturn, starCount, type Star } from "./sky";
import { useSkyProgress } from "./useSkyProgress";

const TICKETS = "/tickets";

export default function App() {
  const [selected, setSelected] = useState<Star | null>(null);
  const [ringAt, setRingAt] = useState<Star | null>(null);
  useSkyProgress("sky", "practical");

  const choose = (star: Star) => {
    const next = selected?.id === star.id ? null : star;
    setSelected(next);
    if (next) setRingAt(next);
  };

  return (
    <main className="layout">
      <header className="intro">
        <h1 className="display">Nocturne</h1>
        <p className="lead">
          On Friday and Saturday nights the planetarium stays open late. The dome first shows
          the sky above Lisbon as it is that evening, with a narrator, then a 40-minute show.
        </p>
        <dl className="facts facts-inline">
          <div>
            <dt>Doors</dt>
            <dd>21:30</dd>
          </div>
          <div>
            <dt>First show</dt>
            <dd>22:00</dd>
          </div>
          <div>
            <dt>Last show</dt>
            <dd>23:30</dd>
          </div>
          <div>
            <dt>Tickets</dt>
            <dd>12 EUR, students 8 EUR</dd>
          </div>
        </dl>
        <a className="button" href={TICKETS}>Book tickets</a>
      </header>

      <figure className="sky" id="sky">
        <div className="sky-pin">
          <Dome selected={selected} ringAt={ringAt} />
          <figcaption className="caption">
            The sky above Lisbon at 22:00 on Friday 9 October 2026, as the dome will show it.
            The centre is straight overhead, the rim is the horizon.
          </figcaption>
        </div>
      </figure>

      <div className="rest">
        <section className="section" aria-labelledby="evening-title">
          <h2 id="evening-title">The evening</h2>
          <p>
            Each show is in two parts. First the dome opens on the sky above Lisbon as it is
            that night, and a narrator takes you through it. Then the 40-minute show.
          </p>
          <ol className="timeline">
            <li>
              <time dateTime="21:30">21:30</time>
              <span>Doors open</span>
            </li>
            <li>
              <time dateTime="22:00">22:00</time>
              <span>First show</span>
            </li>
            <li>
              <time dateTime="23:30">23:30</time>
              <span>Last show</span>
            </li>
          </ol>
        </section>

        <section className="section" aria-labelledby="tonight-title">
          <h2 id="tonight-title">The sky at 22:00 on Friday 9 October</h2>
          <p>
            Each evening the dome shows that evening's sky. On this one, {starCount} stars of
            magnitude 4.5 or brighter are above Lisbon's horizon, and one planet.
          </p>
          <ul className="notes">
            <li>
              <strong>Saturn</strong> sits low in the {direction(saturn.az)},{" "}
              {Math.round(saturn.alt)}° above the horizon. At magnitude {saturn.mag.toFixed(2)},
              only Vega and Capella outshine it.
            </li>
            <li>
              <strong>No Moon.</strong> It is new, {moon.illuminated_percent}% lit, and below the
              horizon.
            </li>
            <li>
              <strong>Deneb</strong>, 78° up, is the brightest star near the top of the dome.
            </li>
            <li>
              <strong>Polaris</strong> stands {polaris.alt.toFixed(1)}° up, close to Lisbon's
              latitude of {lisbonLat.toFixed(1)}° north.
            </li>
          </ul>

          <h3 className="table-title" id="brightest-title">The ten brightest named stars</h3>
          <p className="hint">Choose a star to ring it on the dome.</p>
          <ul className="star-list" aria-labelledby="brightest-title">
            <li className="star-head" aria-hidden="true">
              <span>Star</span>
              <span>Magnitude</span>
              <span>Height</span>
              <span>Direction</span>
            </li>
            {brightest.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="star-row"
                  aria-pressed={selected?.id === s.id}
                  aria-label={`${s.name}, magnitude ${s.mag.toFixed(2)}, ${Math.round(s.alt)} degrees up, in the ${direction(s.az)}`}
                  onClick={() => choose(s)}
                >
                  <span className="star-name">{s.name}</span>
                  <span>{s.mag.toFixed(2)}</span>
                  <span>{Math.round(s.alt)}°</span>
                  <span className="star-dir">{direction(s.az)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="practical" aria-labelledby="practical-title">
          <h2 id="practical-title">Practical information</h2>
          <dl className="facts">
            <div>
              <dt>When</dt>
              <dd>Friday and Saturday nights</dd>
            </div>
            <div>
              <dt>Doors</dt>
              <dd>21:30</dd>
            </div>
            <div>
              <dt>Shows</dt>
              <dd>First at 22:00, last at 23:30</dd>
            </div>
            <div>
              <dt>Each show</dt>
              <dd>The narrated sky of the evening, then a 40-minute show</dd>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd>12 EUR, students 8 EUR</dd>
            </div>
          </dl>
          <a className="button" href={TICKETS}>Book tickets</a>
        </section>

        <footer className="credits">
          <p>
            Star positions from the{" "}
            <a className="link" href="http://tdc-www.harvard.edu/catalogs/bsc5.dat.gz">Yale Bright Star Catalogue</a>,
            5th revised edition (public domain), computed for Lisbon at 22:00 on 9 October 2026.
            Star names from the{" "}
            <a className="link" href="https://www.pas.rochester.edu/~emamajek/WGSN/IAU-CSN.txt">IAU Working Group on Star Names</a>.
            Saturn and the Moon from{" "}
            <a className="link" href="https://ssd.jpl.nasa.gov/horizons/">NASA JPL Horizons</a>.
          </p>
        </footer>
      </div>
    </main>
  );
}
