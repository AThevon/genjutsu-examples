import { useState } from "react";
import { SkyChart } from "./SkyChart";
import { absentBodies, compass, featured, listWords, location, stars } from "./sky";

const TICKETS = "/tickets";

const CHART_LABEL =
  `The sky above Lisbon at 22:00 on Friday 9 October 2026: ${stars.length} stars and Saturn, ` +
  "on a round chart with the point straight overhead at the centre and the horizon at the edge.";

function Hero() {
  return (
    <section className="band band--dusk hero" aria-labelledby="title">
      <div className="grid">
        <div className="hero-text">
          <p className="stamp">Friday and Saturday nights</p>
          <h1 id="title" className="title">Nocturne</h1>
          <p className="lede">
            The planetarium after hours. The dome first shows the night sky above Lisbon as it is
            that evening, with a narrator, then a 40-minute show.
          </p>
          <dl className="times">
            <div><dt>Doors</dt><dd>21:30</dd></div>
            <div><dt>First show</dt><dd>22:00</dd></div>
            <div><dt>Last show</dt><dd>23:30</dd></div>
          </dl>
          <p className="price">
            <span className="num">12 EUR</span>, students <span className="num">8 EUR</span>
          </p>
          <a className="btn" href={TICKETS}>Book tickets</a>
        </div>
        <figure className="hero-chart">
          <SkyChart label={CHART_LABEL} />
          <figcaption>
            The sky above Lisbon at <span className="num">22:00</span> on Friday 9 October 2026, as
            the dome will show it: the <span className="num">{stars.length}</span> stars of
            magnitude 4.5 or brighter, and Saturn. Centre: straight overhead. Edge: the horizon.
            North at the top and east on the left, as when you look up.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Evening() {
  return (
    <section className="band band--evening" aria-labelledby="evening">
      <div className="grid">
        <h2 id="evening" className="heading evening-heading">The evening</h2>
        <ol className="timeline">
          <li>
            <p className="t-time">21:30</p>
            <p className="t-text">Doors open.</p>
          </li>
          <li>
            <p className="t-time">22:00</p>
            <p className="t-text">
              First show. The dome shows the night sky above Lisbon as it is that evening, with a
              narrator. Then the show itself, 40 minutes long.
            </p>
          </li>
          <li>
            <p className="t-time">23:30</p>
            <p className="t-text">Last show of the night.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}

function TonightsSky() {
  const [selected, setSelected] = useState("Saturn");
  const { moon, below, faint } = absentBodies();

  return (
    <section className="band band--night sky" aria-labelledby="sky">
      <div className="grid">
        <div className="sky-chart">
          <SkyChart
            selected={selected}
            label={`${CHART_LABEL} A red ring marks ${selected}.`}
            id="sky-chart"
          />
        </div>
        <div className="sky-body">
          <p className="stamp">Friday 9 October 2026, 22:00</p>
          <h2 id="sky" className="heading">Tonight's sky</h2>
          <p className="body-text">
            On a Nocturne night the dome shows that evening's sky. This is the one for Friday 9
            October at 22:00. Pick a name to find it on the chart.
          </p>
          <ul className="sky-list">
            {featured.map((o) => (
              <li key={o.key}>
                <button
                  type="button"
                  className="sky-item"
                  aria-pressed={selected === o.key}
                  aria-controls="sky-chart"
                  onMouseEnter={() => setSelected(o.key)}
                  onFocus={() => setSelected(o.key)}
                  onClick={() => setSelected(o.key)}
                >
                  <span className="sky-name">{o.name}</span>
                  <span className="sky-where">
                    <span className="num">{Math.round(o.alt)}°</span> above the horizon,{" "}
                    {compass(o.az)}
                  </span>
                  <span className="sky-note">{o.note}</span>
                  <span className="sky-figs num">
                    alt {o.alt.toFixed(1)}° az {o.az.toFixed(1)}° mag {o.mag.toFixed(2)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="body-text absent">
            {moon && (
              <>
                No Moon: it is under {Math.ceil(moon.illuminated_percent ?? 1)} percent lit and below
                the horizon.{" "}
              </>
            )}
            {below.length > 0 && <>{listWords(below)} are below the horizon too. </>}
            {faint.length > 0 && (
              <>{listWords(faint)} are up, but fainter than magnitude 4.5, the limit of this chart.</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function Practical() {
  return (
    <section className="band band--late" aria-labelledby="practical">
      <div className="grid">
        <h2 id="practical" className="heading practical-heading">Practical</h2>
        <dl className="facts">
          <div><dt>When</dt><dd>Friday and Saturday nights</dd></div>
          <div><dt>Doors</dt><dd className="num">21:30</dd></div>
          <div><dt>Shows</dt><dd>First at <span className="num">22:00</span>, last at <span className="num">23:30</span></dd></div>
          <div><dt>Each show</dt><dd>That evening's sky with a narrator, then a <span className="num">40</span>-minute show</dd></div>
          <div><dt>Tickets</dt><dd><span className="num">12 EUR</span>, students <span className="num">8 EUR</span></dd></div>
        </dl>
        <div className="practical-action">
          <a className="btn" href={TICKETS}>Book tickets</a>
        </div>
      </div>
    </section>
  );
}

function Credits() {
  return (
    <footer className="band band--late credits">
      <div className="grid">
        <p className="credits-text">
          Star positions from the Yale Bright Star Catalogue (public domain), computed for{" "}
          <span className="num">{location.lat_text}</span>, <span className="num">{location.lon_text}</span>.
          Star names from the IAU Working Group on Star Names. Saturn, the Moon and the planets from
          NASA JPL Horizons.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <Evening />
        <TonightsSky />
        <Practical />
      </main>
      <Credits />
    </>
  );
}
