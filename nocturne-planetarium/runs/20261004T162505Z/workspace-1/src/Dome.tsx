import { memo, type CSSProperties } from "react";
import {
  VIEW, LABELLED, discSize, magnitudeBins, project, ringRadius, saturn, stars, tint,
  type Star,
} from "./sky";

const bins = magnitudeBins();
const labelled = stars.filter((s) => s.name && LABELLED.includes(s.name));
const [satX, satY] = project(saturn.alt, saturn.az);
const CARDINALS: [string, number][] = [["N", 0], ["E", 90], ["S", 180], ["W", 270]];

const Field = memo(function Field() {
  return (
    <>
      {[0, 30, 60].map((alt) => (
        <circle
          key={alt}
          className={alt === 0 ? "dome-horizon" : "dome-graticule"}
          cx={VIEW / 2}
          cy={VIEW / 2}
          r={ringRadius(alt)}
        />
      ))}
      {[30, 60].map((alt) => (
        <text key={alt} className="dome-scale" x={VIEW / 2 + 6} y={VIEW / 2 + ringRadius(alt) - 6}>
          {alt}°
        </text>
      ))}
      {CARDINALS.map(([letter, az]) => {
        const [x, y] = project(-3.6, az);
        return (
          <text key={letter} className="dome-cardinal" x={x} y={y}>
            {letter}
          </text>
        );
      })}
      {bins.map(([m, group]) => (
        <g key={m} className="dome-bin" style={{ "--m": m } as CSSProperties}>
          {group.map((s) => {
            const [x, y] = project(s.alt, s.az);
            return <circle key={s.id} cx={x.toFixed(1)} cy={y.toFixed(1)} r={discSize(s.mag).toFixed(2)} fill={tint(s.bv)} />;
          })}
          {labelled
            .filter((s) => Math.ceil(s.mag * 4) / 4 === m)
            .map((s) => {
              const [x, y] = project(s.alt, s.az);
              return (
                <text key={s.id} className="dome-label" x={x + 12} y={y + 5}>
                  {s.name}
                </text>
              );
            })}
        </g>
      ))}
      <g className="dome-saturn">
        <circle cx={satX} cy={satY} r={6.5} />
        <ellipse cx={satX} cy={satY} rx={13} ry={4} />
        <text x={satX + 20} y={satY + 6}>Saturn</text>
      </g>
    </>
  );
});

/** `ringAt` keeps the last star chosen so the ring fades out in place when `selected` clears. */
export function Dome({ selected, ringAt }: { selected: Star | null; ringAt: Star | null }) {
  const [rx, ry] = ringAt ? project(ringAt.alt, ringAt.az) : [VIEW / 2, VIEW / 2];
  return (
    <svg
      className="dome"
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      role="img"
      aria-label={`Chart of the sky above Lisbon at 22:00 on Friday 9 October 2026: ${stars.length} stars of magnitude 4.5 or brighter and Saturn, low in the east-south-east.${selected ? ` ${selected.name} is ringed.` : ""}`}
    >
      <Field />
      <circle className={`dome-ring${selected ? " is-on" : ""}`} cx={rx} cy={ry} r={20} />
    </svg>
  );
}
