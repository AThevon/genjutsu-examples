import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Dome, type DomeHandle } from "./Dome";
import { useDusk, useReveal } from "./useDusk";
import {
  brightest, direction, formatAlt, formatMag, moon, saturn, starCount, type Body,
} from "./sky";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

function FactsBar() {
  const bar = useRef<HTMLElement>(null);

  // The sky layer sits under the bar; --bar-h tells it how much room the bar takes.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--bar-h", `${el.offsetHeight}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header ref={bar} className="facts">
      <div className="facts__in">
        <a className="facts__brand" href="#top">Nocturne</a>
        <dl className="facts__list">
          <div><dt>When</dt><dd>Fri &amp; Sat</dd></div>
          <div><dt>Doors</dt><dd>21:30</dd></div>
          <div><dt>First show</dt><dd>22:00</dd></div>
          <div><dt>Last show</dt><dd>23:30</dd></div>
          <div><dt>Tickets</dt><dd>12 €</dd></div>
          <div><dt>Students</dt><dd>8 €</dd></div>
        </dl>
        <a className="btn facts__book" href="/tickets">Book tickets</a>
      </div>
    </header>
  );
}

export default function App() {
  const dome = useRef<DomeHandle>(null);
  const closing = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<Body | null>(null);
  const [picked, setPicked] = useState<Body | null>(null);

  const figure = useRef<HTMLElement>(null);
  const applyDusk = useCallback((dusk: number) => dome.current?.setDusk(dusk), []);
  useDusk(closing, applyDusk);
  useReveal();

  // Below 1100px the star list docks under the dome; --sky-bottom is where the dome ends.
  useEffect(() => {
    const el = figure.current;
    if (!el) return;
    const measure = () => {
      document.documentElement.style.setProperty("--sky-bottom", `${el.offsetTop + el.offsetHeight}px`);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const chips = [saturn, ...brightest];

  return (
    <>
      <FactsBar />

      <div className="sky">
        <figure ref={figure} className="sky__figure">
          <Dome ref={dome} active={hovered ?? picked} onHover={setHovered} onPick={setPicked} />
          <figcaption className="sky__caption">
            Lisbon, 22:00, Friday 9 October 2026. North at the top, east on the left, as you see
            it lying back.
            <span id="dome-keys" className="sky__keys">
              Arrow keys move to the nearest named star. Page Up and Page Down step through all
              of them, brightest first.
            </span>
          </figcaption>
        </figure>
      </div>

      <main id="top" className="page">
        <section className="section section--hero" aria-labelledby="hero-title">
          <div className="panel" data-reveal>
            <h1 id="hero-title" className="display" style={step(0)}>Nocturne</h1>
            <p className="lead" style={step(1)}>
              After hours at the planetarium, on Friday and Saturday nights. The dome shows the sky
              above Lisbon as it is that evening, then a 40-minute show.
            </p>
            <p style={step(2)}>
              <a className="btn" href="/tickets">Book tickets</a>
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="program-title">
          <div className="panel" data-reveal>
            <h2 id="program-title" style={step(0)}>First the sky, then the show</h2>
            <div className="part" style={step(1)}>
              <h3>The sky above Lisbon, that evening</h3>
              <p>
                The house lights go down and the dome fills with tonight's sky over the city, as it
                is at that hour. A narrator talks you through it.
              </p>
            </div>
            <div className="part" style={step(2)}>
              <h3>Then a 40-minute show</h3>
              <p>
                Doors open at 21:30, late enough to come after dinner. The first show starts at
                22:00, the last at 23:30.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="tonight-title">
          <div className="panel" data-reveal>
            <h2 id="tonight-title" style={step(0)}>The sky on Friday 9 October</h2>
            <p style={step(1)}>
              Each Nocturne night shows that night's own sky. This is the one for Friday 9 October
              2026 at 22:00, the sky drawn behind this page.
            </p>

            <div className="part" style={step(2)}>
              <h3>Saturn, low in the east-south-east</h3>
              <p>
                The one bright planet above the horizon: {formatAlt(saturn.alt)} up, magnitude{" "}
                {formatMag(saturn.mag)}, five days after opposition. Of the stars above the horizon,
                only Vega and Capella are brighter.
              </p>
            </div>

            <div className="part" style={step(3)}>
              <h3>No Moon</h3>
              <p>
                It is below the horizon, and nearly new: {moon.illuminated_percent}% lit.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--stars" aria-labelledby="stars-title">
          <div className="panel" data-reveal>
            <div className="part" style={step(0)}>
              <h3 id="stars-title">The brightest stars</h3>
              <p>
                {starCount} stars of magnitude 4.5 or brighter are above the horizon. Here are the
                twelve brightest, with Saturn: point at one, tap it or tab to it to find it on the
                dome. On the dome itself, every named star can be found by pointing, tapping, or
                with the keyboard.
              </p>
            </div>
          </div>
          <div className="dock">
            <ul className="stars dock__list" aria-label="Saturn and the twelve brightest stars">
              {chips.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    className="star-item"
                    onPointerEnter={(e) => e.pointerType === "mouse" && setPicked(b)}
                    onPointerLeave={(e) => e.pointerType === "mouse" && setPicked(null)}
                    onFocus={() => setPicked(b)}
                    onBlur={() => setPicked(null)}
                    onClick={() => setPicked(b)}
                  >
                    <span className="star-item__name">{b.name}</span>
                    <small>
                      {direction(b.az)}, {formatAlt(b.alt)} up, magnitude {formatMag(b.mag)}
                    </small>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" aria-labelledby="practical-title">
          <div className="panel" data-reveal>
            <h2 id="practical-title" style={step(0)}>Practical information</h2>
            <dl className="practical" style={step(1)}>
              <dt>When</dt><dd>Friday and Saturday nights</dd>
              <dt>Doors</dt><dd>21:30</dd>
              <dt>First show</dt><dd>22:00</dd>
              <dt>Last show</dt><dd>23:30</dd>
              <dt>Program</dt><dd>The sky above Lisbon with a narrator, then a 40-minute show</dd>
              <dt>Tickets</dt><dd>12 €</dd>
              <dt>Students</dt><dd>8 €</dd>
              <dt>Book</dt><dd><a className="link" href="/tickets">/tickets</a></dd>
            </dl>
            <p style={step(2)}>
              <a className="btn" href="/tickets">Book tickets</a>
            </p>
          </div>
        </section>

        <section ref={closing} className="section section--closing" aria-labelledby="closing-title">
          <div className="panel" data-reveal>
            <h2 id="closing-title" className="display" style={step(0)}>22:00</h2>
            <p className="lead" style={step(1)}>
              The house lights are down and the whole sky is up. The first show begins.
            </p>
            <p style={step(2)}>
              <a className="btn" href="/tickets">Book tickets</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="credits">
        <p>
          Star positions from the Yale Bright Star Catalogue, 5th revised edition (public domain),
          computed for Lisbon (38.7223 N, 9.1393 W) at 22:00 WEST on 9 October 2026. Star names
          from the IAU Working Group on Star Names. Saturn and the Moon from NASA JPL Horizons.
        </p>
      </footer>
    </>
  );
}
