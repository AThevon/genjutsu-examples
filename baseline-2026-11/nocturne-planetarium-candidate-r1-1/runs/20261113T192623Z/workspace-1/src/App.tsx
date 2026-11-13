import { SkyDome } from "./SkyDome";
import { below, brightestNamed, compass, location, polaris, saturnRow, starCount } from "./sky";

const deg = (n: number) => `${n.toFixed(1)}°`;

export default function App() {
  return (
    <main>
      <SkyDome />

      <section className="section program" aria-labelledby="program-title">
        <div className="section__head">
          <h2 id="program-title" className="h2">
            How a night runs
          </h2>
          <p className="lead">
            On Friday and Saturday nights the dome first shows the night sky above Lisbon as it is
            that evening, with a narrator. Then a 40-minute show.
          </p>
        </div>
        <ol className="timetable">
          <li className="timetable__row">
            <time className="time" dateTime="21:30">
              21:30
            </time>
            <h3 className="h3">Doors open</h3>
          </li>
          <li className="timetable__row">
            <time className="time" dateTime="22:00">
              22:00
            </time>
            <h3 className="h3">First show</h3>
          </li>
          <li className="timetable__row">
            <time className="time" dateTime="23:30">
              23:30
            </time>
            <h3 className="h3">Last show</h3>
          </li>
        </ol>
      </section>

      <section className="section tonight" aria-labelledby="tonight-title">
        <div className="section__head">
          <h2 id="tonight-title" className="h2">
            What the dome shows on Friday 9 October
          </h2>
          <p className="lead">
            Each night opens on that evening's sky. At 22:00 on Friday 9 October 2026, {starCount}{" "}
            stars of magnitude 4.5 or brighter stand above the Lisbon horizon, and one bright planet.
          </p>
        </div>

        <div className="tonight__grid">
          <article className="saturn" aria-labelledby="saturn-title">
            <h3 id="saturn-title" className="saturn__name">
              Saturn
            </h3>
            <p>
              The one bright planet in this sky. Five days after its opposition, in the
              east-south-east, and brighter than every star on the chart except Vega and Capella.
            </p>
            <dl className="readout">
              <div>
                <dt className="label">Altitude</dt>
                <dd className="num">{deg(saturnRow.alt)}</dd>
              </div>
              <div>
                <dt className="label">Azimuth</dt>
                <dd className="num">
                  {deg(saturnRow.az)} {compass(saturnRow.az)}
                </dd>
              </div>
              <div>
                <dt className="label">Magnitude</dt>
                <dd className="num">{saturnRow.mag.toFixed(2)}</dd>
              </div>
            </dl>
          </article>

          <div className="stars">
            <table className="stars__table">
              <caption className="small">The twelve brightest named stars</caption>
              <thead>
                <tr>
                  <th scope="col">Star</th>
                  <th scope="col">Direction</th>
                  <th scope="col" className="num">
                    Altitude
                  </th>
                  <th scope="col" className="num">
                    Magnitude
                  </th>
                </tr>
              </thead>
              <tbody>
                {brightestNamed.map((s) => (
                  <tr key={s.name}>
                    <th scope="row">{s.name}</th>
                    <td>{compass(s.az)}</td>
                    <td className="num">{deg(s.alt)}</td>
                    <td className="num">{s.mag.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small">Lower magnitude means brighter. Altitude is the height above the horizon.</p>
          </div>
        </div>

        <div className="tonight__notes">
          <p>
            <span className="h3 note__title">Polaris</span>
            Stands at {deg(polaris.alt)}, close to Lisbon's latitude of {location.lat.toFixed(1)}° N.
          </p>
          <p>
            <span className="h3 note__title">Not on the chart</span>
            The Moon is new, {below.Moon.illuminated_percent}% lit, and below the horizon, as are
            Mercury, Venus, Mars and Jupiter. Uranus and Neptune are up, but fainter than magnitude
            4.5.
          </p>
        </div>
      </section>

      <section className="section practical" aria-labelledby="practical-title">
        <div className="section__head">
          <h2 id="practical-title" className="h2">
            Fridays and Saturdays, after dark
          </h2>
        </div>
        <dl className="facts">
          <div className="facts__item">
            <dt className="term">Nights</dt>
            <dd>Friday and Saturday</dd>
          </div>
          <div className="facts__item">
            <dt className="term">Doors</dt>
            <dd className="num">21:30</dd>
          </div>
          <div className="facts__item">
            <dt className="term">Shows</dt>
            <dd>
              First <span className="num">22:00</span>, last <span className="num">23:30</span>
            </dd>
          </div>
          <div className="facts__item">
            <dt className="term">The program</dt>
            <dd>That evening's sky with a narrator, then a 40-minute show</dd>
          </div>
          <div className="facts__item">
            <dt className="term">Tickets</dt>
            <dd>
              <span className="num">12</span> EUR, <span className="num">8</span> EUR for students
            </dd>
          </div>
        </dl>
        <a className="button" href="/tickets">
          Book tickets
        </a>
      </section>

      <footer className="footer">
        <p className="small">
          Star positions from the{" "}
          <a className="link" href="http://tdc-www.harvard.edu/catalogs/bsc5.dat.gz">
            Yale Bright Star Catalogue
          </a>
          , 5th revised edition (public domain), computed for {location.name} at 22:00 WEST on 9
          October 2026. Star names from the{" "}
          <a className="link" href="https://www.pas.rochester.edu/~emamajek/WGSN/IAU-CSN.txt">
            IAU Catalog of Star Names
          </a>
          , IAU Working Group on Star Names. Saturn, the Moon and the planets from{" "}
          <a className="link" href="https://ssd.jpl.nasa.gov/horizons/">
            NASA JPL Horizons
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
