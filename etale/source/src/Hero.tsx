import type { CSSProperties } from "react";
import { afterFirstSlack, beforeFirstSlack, currentStation, day, firstSlack } from "./tide";

// Stagger index for the load entrance (MASTER.md, motion).
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const strongest = afterFirstSlack.find((e) => e.kind !== "slack");

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-intro">
        <h1 id="hero-title" className="h1 enter" style={at(0)}>
          Slack water off Aquatic Park, before you walk down to the beach.
        </h1>
        <p className="lede enter" style={at(1)}>
          Étale is an iPhone app for the people who swim in the cove all year. It answers one
          question: when is the water slack, and how strong does the current run between two
          slacks. And it tells you the evening before.
        </p>
        <p className="definition enter" style={at(2)}>
          <i lang="fr">étale</i>: slack water, the still moment between ebb and flood, when the
          current is weakest.
        </p>
      </div>

      <div className="hero-pair">
        <article
          className="card enter"
          style={at(3)}
          aria-labelledby="slack-title"
        >
          <h2 id="slack-title" className="label">
            Slack water, {day.weekday} {day.written}
          </h2>
          {beforeFirstSlack && (
            <dl className="rows rows-before">
              <div className="row">
                <dt>Before it, {beforeFirstSlack.kind}, strongest</dt>
                <dd>
                  {beforeFirstSlack.knots} kn at {beforeFirstSlack.time}
                </dd>
              </div>
            </dl>
          )}
          <p className="slack-time">
            <time dateTime={`${day.iso}T${firstSlack.time}-07:00`}>{firstSlack.time}</time>
            <span className="slack-zone">PDT</span>
          </p>
          <dl className="rows">
            {afterFirstSlack.map((e) => (
              <div className="row" key={e.time}>
                <dt>{e.kind === "slack" ? "Next slack" : `Then ${e.kind}, strongest`}</dt>
                <dd>{e.kind === "slack" ? e.time : `${e.knots} kn at ${e.time}`}</dd>
              </div>
            ))}
          </dl>
          <p className="src">
            NOAA CO-OPS current predictions, station {currentStation.id}, {currentStation.name},{" "}
            {currentStation.where}. {day.written}, PDT.
          </p>
        </article>

        <article
          className="alert enter"
          style={at(4)}
          aria-labelledby="alert-title"
        >
          <h2 id="alert-title" className="h2">
            The evening before
          </h2>
          <p className="alert-copy">
            An alert the evening before, with tomorrow's slack and the current that follows it, so
            you know before you set the alarm.
          </p>
          <figure className="notif-figure">
            <div className="notif">
              <p className="notif-app">Étale</p>
              <p className="notif-title">
                Tomorrow, {day.short}: slack at {firstSlack.time}
              </p>
              {strongest && (
                <p className="notif-body">
                  Then the {strongest.kind} builds to {strongest.knots} kn by {strongest.time}.{" "}
                  {currentStation.id}.
                </p>
              )}
            </div>
            <figcaption className="src">
              Illustration of the alert, with the {currentStation.id} predictions for{" "}
              {day.written}.
            </figcaption>
          </figure>
        </article>
      </div>

      <div className="hero-cta enter" style={at(5)}>
        <a className="btn" href="/beta">
          Join the TestFlight beta
        </a>
        <p className="cta-note">iPhone only, through Apple's TestFlight.</p>
      </div>
    </section>
  );
}
