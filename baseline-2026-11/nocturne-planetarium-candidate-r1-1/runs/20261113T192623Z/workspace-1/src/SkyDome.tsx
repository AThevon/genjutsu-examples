import { useEffect, useRef, type CSSProperties } from "react";
import { FADE, R, bodies, litStars, location, starCount } from "./sky";

const RIM = R + 26;

const cardinals = [
  { k: "N", x: 0, y: -RIM },
  { k: "S", x: 0, y: RIM },
  { k: "E", x: -RIM, y: 0 },
  { k: "W", x: RIM, y: 0 },
];

const dotStyle = (t: number, warmth: number): CSSProperties =>
  ({
    "--t": t,
    fill: `color-mix(in oklab, var(--c-ink), var(--c-saturn) ${Math.round(warmth * 100)}%)`,
  }) as CSSProperties;

/**
 * The hero: the all-sky disc of 22:00, Friday 9 October 2026, over Lisbon.
 * The one motion: while the disc is pinned, scroll dims the ground from dusk to
 * night and lights the stars in order of magnitude.
 */
export function SkyDome() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const count = countRef.current;
    if (!hero || !stage || !count) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = (p: number) => {
      hero.style.setProperty("--p", p.toFixed(4));
      count.textContent = String(litStars(p));
    };

    const measure = () => {
      frame = 0;
      if (reduce.matches) return apply(1);
      // Progress runs while the stage holds the disc pinned.
      const travel = stage.offsetHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / travel)) : 1;
      apply(p);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section
      className="hero"
      ref={heroRef}
      aria-labelledby="hero-title"
      style={{ "--p": 0, "--fade": FADE } as CSSProperties}
    >
      <div className="hero__dusk" aria-hidden="true" />

      <div className="hero__layout">
        <div className="hero__copy">
          <h1 id="hero-title" className="display">
            Nocturne
          </h1>
          <p className="lead">
            The planetarium after hours. Friday and Saturday nights under the dome, starting from
            the sky above Lisbon as it is that evening.
          </p>
          <p className="hero__when">Doors 21:30. First show 22:00, last show 23:30.</p>
          <a className="button" href="/tickets">
            Book tickets
          </a>
        </div>

        <div className="hero__stage" ref={stageRef}>
        <figure className="hero__sky">
          <svg
            className="dome"
            viewBox={`${-RIM - 24} ${-RIM - 24} ${(RIM + 24) * 2} ${(RIM + 24) * 2}`}
            role="img"
            aria-labelledby="dome-title dome-desc"
          >
            <title id="dome-title">The sky over Lisbon at 22:00, Friday 9 October 2026</title>
            <desc id="dome-desc">
              All-sky chart of the {starCount} stars of magnitude 4.5 or brighter above the horizon,
              and Saturn. Zenith at the centre, horizon at the edge, north at the top, east at the
              left.
            </desc>
            <circle className="dome__horizon" r={R} />
            {cardinals.map((c) => (
              <text key={c.k} className="dome__cardinal" x={c.x} y={c.y} aria-hidden="true">
                {c.k}
              </text>
            ))}
            {bodies.map((b) =>
              b.kind === "planet" ? (
                <g key={b.id} className="star" style={{ "--t": b.t } as CSSProperties} aria-hidden="true">
                  <circle className="dome__saturn-ring" cx={b.x} cy={b.y} r={b.r + 6} />
                  <circle className="dome__saturn" cx={b.x} cy={b.y} r={b.r} />
                </g>
              ) : (
                <circle
                  key={b.id}
                  className="star"
                  cx={b.x}
                  cy={b.y}
                  r={b.r}
                  style={dotStyle(b.t, b.warmth)}
                  aria-hidden="true"
                />
              ),
            )}
            {bodies
              .filter((b) => b.label)
              .map((b) => {
                const left = b.x > R * 0.55;
                return (
                  <text
                    key={`${b.id}-label`}
                    className={`star dome__name${b.kind === "planet" ? " dome__name--saturn" : ""}`}
                    style={{ "--t": b.t } as CSSProperties}
                    x={b.x + (left ? -(b.r + 10) : b.r + 10)}
                    y={b.y + 6}
                    textAnchor={left ? "end" : "start"}
                    aria-hidden="true"
                  >
                    {b.label}
                  </text>
                );
              })}
          </svg>
          <figcaption className="hero__caption">
            <span className="label hero__count">
              <span ref={countRef} className="num">
                2
              </span>{" "}
              of {starCount} stars lit, and Saturn
            </span>
            <span className="label">22:00, Friday 9 October 2026</span>
            <span className="label">
              {location.lat_text}, {location.lon_text}
            </span>
            <span className="small">
              As the dome will show it. Zenith at the centre, north at the top, east at the left,
              as you see it looking up.
            </span>
          </figcaption>
        </figure>
        </div>
      </div>
    </section>
  );
}
