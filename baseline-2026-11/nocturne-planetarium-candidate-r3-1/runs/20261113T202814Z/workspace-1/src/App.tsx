import { useRef } from "react";
import { Dome } from "./sky/Dome";
import { useDimming } from "./sky/useDimming";
import { below, brightest, compass, namedCount, sky, stars } from "./sky/sky";

const polaris = stars.find((s) => s.name === "Polaris")!;
const deg = (v: number) => `${v.toFixed(1)}°`;

export default function App() {
  const hero = useRef<HTMLElement>(null);
  useDimming(hero);

  return (
    <>
      <header className="hero" ref={hero}>
        <div className="hero__night" aria-hidden="true" />
        <div className="hero__stage">
          <div className="hero__text">
            <h1 className="hero__title">Nocturne</h1>
            <p className="hero__lede">
              The planetarium after hours, on Friday and Saturday nights. The dome shows the sky
              above Lisbon as it is that evening, then a 40-minute show.
            </p>
            <a className="btn" href="/tickets">
              Book tickets
            </a>
          </div>
          <figure className="hero__figure">
            <Dome />
            <figcaption className="hero__caption">
              The sky over Lisbon as the dome will show it at 22:00 on Friday 9 October 2026,
              from {sky.location.lat_text}, {sky.location.lon_text}.
            </figcaption>
          </figure>
        </div>
      </header>

      <main>
        <section className="section evening" aria-labelledby="evening-title">
          <p className="label">The program</p>
          <h2 className="heading" id="evening-title">
            First the sky, then the show
          </h2>
          <ol className="times">
            <li className="times__item">
              <span className="times__clock">21:30</span>
              <span className="times__what">Doors open</span>
            </li>
            <li className="times__item">
              <span className="times__clock">22:00</span>
              <span className="times__what">First show</span>
            </li>
            <li className="times__item">
              <span className="times__clock">23:30</span>
              <span className="times__what">Last show</span>
            </li>
          </ol>
          <div className="parts">
            <p className="parts__item">
              <span className="parts__name">The sky tonight</span>
              The dome opens on the night sky above Lisbon as it is that evening, with a narrator
              in the room.
            </p>
            <p className="parts__item">
              <span className="parts__name">The show</span>
              Then a 40-minute show under the same dome.
            </p>
          </div>
        </section>

        <section className="section sky" aria-labelledby="sky-title">
          <p className="label">In the sky</p>
          <h2 className="heading" id="sky-title">
            Friday 9 October 2026, 22:00
          </h2>
          <p className="prose">
            Above Lisbon's horizon at that moment: {stars.length} stars of magnitude 4.5 or
            brighter, {namedCount} of them with a proper name, and one planet bright enough to
            join them. Saturn, five days after its opposition, stands in the east-south-east,
            brighter than every star in the list except Vega and Capella.
          </p>

          <table className="bodies">
            <caption className="bodies__caption">
              Saturn and the ten brightest named stars, by magnitude. Lower is brighter.
            </caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Magnitude</th>
                <th scope="col">Altitude</th>
                <th scope="col">Direction</th>
              </tr>
            </thead>
            <tbody>
              {brightest.map((b) => {
                const c = compass(b.az);
                return (
                  <tr key={b.id} className={b.planet ? "bodies__planet" : undefined}>
                    <th scope="row">
                      {b.label}
                      {b.planet && <span className="bodies__kind"> planet</span>}
                    </th>
                    <td data-label="Magnitude">{b.mag.toFixed(2)}</td>
                    <td data-label="Altitude">{deg(b.alt)}</td>
                    <td data-label="Direction">
                      <abbr title={c.long}>{c.short}</abbr>, {deg(b.az)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="notes">
            <p className="notes__item">
              <span className="notes__name">Polaris</span>
              {deg(polaris.alt)} above the northern horizon. Lisbon lies at{" "}
              {sky.location.lat.toFixed(2)}° N.
            </p>
            <p className="notes__item">
              <span className="notes__name">Not in this sky</span>
              The Moon is new, {below.Moon.illuminated_percent}% lit, and below the horizon, with
              Mercury, Venus, Mars and Jupiter. Uranus and Neptune are up, but fainter than
              magnitude 4.5.
            </p>
          </div>
        </section>

        <section className="section tickets" aria-labelledby="tickets-title">
          <p className="label">Tickets</p>
          <h2 className="heading" id="tickets-title">
            Friday and Saturday nights
          </h2>
          <dl className="prices">
            <div className="prices__row">
              <dt>Full price</dt>
              <dd>12 EUR</dd>
            </div>
            <div className="prices__row">
              <dt>Students</dt>
              <dd>8 EUR</dd>
            </div>
          </dl>
          <p className="tickets__book">
            <a className="btn" href="/tickets">
              Book tickets
            </a>
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>
          Star positions and colours: Yale Bright Star Catalogue, 5th revised edition (Hoffleit
          and Warren 1991), public domain. Star names: IAU Working Group on Star Names. Saturn:
          NASA JPL Horizons. Computed for {sky.location.lat_text}, {sky.location.lon_text} at{" "}
          {sky.time.utc.replace("T", " ").replace(":00Z", " UTC")}; altitudes are geometric,
          without atmospheric refraction.
        </p>
      </footer>
    </>
  );
}
