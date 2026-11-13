import { memo } from "react";
import { R, featured, project, starRadius, stars, tint } from "./sky";

const PAD = 14;
const RING = 7;
const VIEW = `${-R - PAD} ${-R - PAD} ${2 * (R + PAD)} ${2 * (R + PAD)}`;

/** Every star of the data, drawn once. Memoised so the pointer never re-renders it. */
const StarField = memo(function StarField() {
  return (
    <g aria-hidden="true">
      {stars.map((s) => {
        const [x, y] = project(s.alt, s.az);
        return (
          <circle
            key={s.id}
            cx={x.toFixed(2)}
            cy={y.toFixed(2)}
            r={starRadius(s.mag).toFixed(2)}
            className={`star star--${tint(s.bv)}`}
          />
        );
      })}
    </g>
  );
});

const Frame = memo(function Frame() {
  return (
    <g aria-hidden="true">
      <circle r={R} className="dome" />
      <circle r={(R * 2) / 3} className="ring" />
      <circle r={R / 3} className="ring" />
      <circle r={R} className="ring ring--horizon" />
      <text className="cardinal" x={0} y={-R - 4}>N</text>
      <text className="cardinal" x={0} y={R + 9.5}>S</text>
      <text className="cardinal" x={-R - 7} y={2.5}>E</text>
      <text className="cardinal" x={R + 7} y={2.5}>W</text>
    </g>
  );
});

interface Props {
  /** Key of the featured object the pointer rests on; omit for no pointer. */
  selected?: string;
  label: string;
  id?: string;
}

export function SkyChart({ selected, label, id }: Props) {
  const target = selected ? featured.find((o) => o.key === selected) : undefined;
  const [px, py] = target ? project(target.alt, target.az) : [0, 0];

  return (
    <svg className="chart" viewBox={VIEW} role="img" aria-label={label} id={id}>
      <Frame />
      <StarField />
      <g aria-hidden="true">
        {featured.map((o) => {
          const [x, y] = project(o.alt, o.az);
          const r = starRadius(o.mag);
          const isOn = o.key === selected;
          // Clear of the pointer ring (radius RING) when the chart has one.
          const gap = selected ? RING + 2 : r + 2;
          return (
            <g key={o.key}>
              {o.kind === "planet" && (
                <circle cx={x} cy={y} r={r} className="star star--planet" />
              )}
              <text
                x={o.labelLeft ? x - gap : x + gap}
                y={y + 1.5}
                textAnchor={o.labelLeft ? "end" : "start"}
                className={`chart-label${isOn ? " is-on" : ""}${selected ? "" : " is-plain"}`}
              >
                {o.name}
              </text>
            </g>
          );
        })}
      </g>
      {target && (
        <g className="pointer" style={{ transform: `translate(${px}px, ${py}px)` }} aria-hidden="true">
          <circle r={RING} />
        </g>
      )}
    </svg>
  );
}
