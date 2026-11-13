import type { CSSProperties } from "react";
import {
  BAND_COUNT,
  LABELLED,
  bandOf,
  planets,
  project,
  radiusOf,
  saturn,
  stars,
  tintOf,
  type Body,
} from "./sky";
import { SATURN } from "./tokens";

const R = 1000;

function Star({ s }: { s: Body }) {
  const { x, y } = project(s.alt, s.az);
  return <circle cx={x * R} cy={y * R} r={radiusOf(s.mag)} fill={tintOf(s.bv)} />;
}

const rest = stars.filter((s) => bandOf(s.mag) === -1);
const bands = Array.from({ length: BAND_COUNT }, (_, k) => stars.filter((s) => bandOf(s.mag) === k));
const labelled = [...stars, ...planets].filter((s) => s.name && s.name in LABELLED);

const COMPASS: [string, number][] = [
  ["N", 0],
  ["E", 90],
  ["S", 180],
  ["W", 270],
];

export function Dome() {
  const names = labelled.map((s) => s.name).join(", ");
  return (
    <div className="dome">
      <div className="dome__inner">
      <svg
        className="dome__sky"
        viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`}
        role="img"
        aria-label={`Map of the sky over Lisbon, zenith at the centre, horizon at the edge, north at the top. ${stars.length} stars and Saturn. Named: ${names}.`}
      >
        <circle className="dome__rim" r={R - 2} />
        <g>
          {rest.map((s) => (
            <Star key={s.id} s={s} />
          ))}
        </g>
        {bands.map((band, k) => (
          <g key={k} className="dome__band" style={{ "--k": k } as CSSProperties}>
            {band.map((s) => (
              <Star key={s.id} s={s} />
            ))}
          </g>
        ))}
        {(() => {
          const { x, y } = project(saturn.alt, saturn.az);
          return (
            <g>
              <circle cx={x * R} cy={y * R} r={radiusOf(saturn.mag)} fill={SATURN} />
              <circle
                cx={x * R}
                cy={y * R}
                r={radiusOf(saturn.mag) + 14}
                fill="none"
                stroke={SATURN}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })()}
      </svg>
      <div className="dome__labels" aria-hidden="true">
        {labelled.map((s) => {
          const { x, y } = project(s.alt, s.az);
          const side = LABELLED[s.name as string];
          return (
            <span
              key={s.id}
              className={`dome__label dome__label--${side}${s.planet ? " dome__label--planet" : ""}`}
              style={{ left: `${((x + 1) / 2) * 100}%`, top: `${((y + 1) / 2) * 100}%` }}
            >
              {s.name}
            </span>
          );
        })}
        {COMPASS.map(([t, az]) => {
          const { x, y } = project(-7, az);
          return (
            <span
              key={t}
              className="dome__compass"
              style={{ left: `${((x + 1) / 2) * 100}%`, top: `${((y + 1) / 2) * 100}%` }}
            >
              {t}
            </span>
          );
        })}
      </div>
      </div>
    </div>
  );
}
