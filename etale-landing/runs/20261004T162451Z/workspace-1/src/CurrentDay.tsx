import { useState, type CSSProperties } from "react";
import { DAY_MINUTES, currentStation, dateWritten, depthFt, maxima, peakKnots, slacks } from "./data";

const pct = (minute: number) => (minute / DAY_MINUTES) * 100;
const hours = [0, 6, 12, 18];

export default function CurrentDay() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="day" aria-labelledby="day-title">
      <p className="day__label" id="day-title">
        Slack water, {dateWritten}, at {currentStation.id} ({currentStation.name})
      </p>

      <div className="day__picker" role="group" aria-label={`Slacks on ${dateWritten}`}>
        {slacks.map((s, i) => (
          <button
            key={s.time}
            type="button"
            className="pick"
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
          >
            {s.time}
          </button>
        ))}
      </div>

      <div className="day__figures" aria-live="polite">
        {slacks.map((s, i) => {
          const on = i === selected;
          return (
            <div key={s.time} className="figure" data-on={on} aria-hidden={!on} inert={!on}>
              <p className="figure__time">
                {s.time}
                <span className="figure__zone">PDT</span>
              </p>
              <dl className="figure__flows">
                <div>
                  <dt>Before it</dt>
                  <dd>
                    {s.before.flow} {s.before.knots} kn at {s.before.time}
                  </dd>
                </div>
                <div>
                  <dt>After it</dt>
                  <dd>
                    {s.after.flow} {s.after.knots} kn at {s.after.time}
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <figure className="strip">
        <div className="strip__plot">
          <div className="strip__zero" aria-hidden="true" />
          {hours.map((h) => (
            <span key={h} className="strip__hour" style={{ left: `${pct(h * 60)}%` }} aria-hidden="true">
              {String(h).padStart(2, "0")}:00
            </span>
          ))}
          {maxima.map((m) => (
            <div
              key={m.time}
              className={`strip__max strip__max--${m.flow}`}
              style={{ left: `${pct(m.minute)}%`, "--reach": Number(m.knots) / peakKnots } as CSSProperties}
            >
              <span className="strip__bar" aria-hidden="true" />
              <span className="strip__value">
                <span className="visually-hidden">{m.flow}, </span>
                {m.knots} kn
              </span>
            </div>
          ))}
          {slacks.map((s) => (
            <span key={s.time} className="strip__slack" style={{ left: `${pct(s.minute)}%` }} aria-hidden="true" />
          ))}
          <div className="strip__marker" style={{ transform: `translateX(${pct(slacks[selected].minute)}%)` }} aria-hidden="true">
            <span />
          </div>
        </div>
        <figcaption className="caption">
          Current at {currentStation.id}, {dateWritten}: flood into the bay above the line, ebb out of it below, at
          its strongest of each run. Slack marks in amber. NOAA prediction, {depthFt} ft below the surface, Pacific
          Daylight Time.
        </figcaption>
      </figure>
    </section>
  );
}
