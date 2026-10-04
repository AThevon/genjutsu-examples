import { useMemo, useRef, useState, type PointerEvent } from "react";
import {
  BANDS,
  R,
  bandOf,
  bodies,
  colourOf,
  degrees,
  direction,
  radiusOf,
  type Body,
} from "./sky";

type Props = {
  /** Names drawn as labels on the chart (hidden on narrow screens). */
  labels: string[];
  /** Name of the body to ring. */
  selected?: string | null;
  /** Fade the stars in by magnitude on mount. */
  arrive?: boolean;
  labelledBy: string;
};

const PAD = 18;
const VIEW = `${-R - PAD} ${-R - PAD} ${2 * (R + PAD)} ${2 * (R + PAD)}`;
const PICK_RADIUS = 14;

const named = bodies.filter((b) => b.name);

export default function SkyChart({ labels, selected, arrive = false, labelledBy }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<Body | null>(null);
  // Kept after the pointer leaves, so the label fades out with its text.
  const [lastHover, setLastHover] = useState<Body | null>(null);

  const bands = useMemo(() => {
    const groups: Body[][] = BANDS.map(() => []);
    for (const b of bodies) groups[bandOf(b.mag)].push(b);
    return groups;
  }, []);

  const ringed = selected ? bodies.find((b) => b.name === selected) ?? null : null;

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    let best: Body | null = null;
    let bestD = PICK_RADIUS;
    for (const b of named) {
      const d = Math.hypot(b.x - p.x, b.y - p.y);
      if (d < bestD) {
        best = b;
        bestD = d;
      }
    }
    setHover(best);
    if (best) setLastHover(best);
  }

  const tip = hover ?? lastHover;
  const tipLeft = tip ? tip.x > 0 : false;

  return (
    <svg
      ref={svgRef}
      className={arrive ? "sky sky--arrive" : "sky"}
      viewBox={VIEW}
      role="img"
      aria-labelledby={labelledBy}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHover(null)}
    >
      <defs>
        <radialGradient id={`${labelledBy}-halo`}>
          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="sky__disc" r={R} />

      {bands.map((group, i) => (
        <g
          key={i}
          className="sky__band"
          style={{ animationDelay: `${BANDS[i].delay}ms` }}
          aria-hidden="true"
        >
          {group.map((b) => {
            const fill = b.planet ? "var(--c-saturn)" : colourOf(b.bv);
            return (
              <g key={b.id} style={{ color: fill }}>
                {(b.planet || b.mag < 1) && (
                  <circle cx={b.x} cy={b.y} r={radiusOf(b) * 4} fill={`url(#${labelledBy}-halo)`} />
                )}
                <circle cx={b.x} cy={b.y} r={radiusOf(b)} fill={fill} />
              </g>
            );
          })}
        </g>
      ))}

      <g className="sky__labels" aria-hidden="true">
        {labels.map((name) => {
          const b = bodies.find((s) => s.name === name);
          if (!b) return null;
          return (
            <text
              key={name}
              x={b.x + radiusOf(b) + 4}
              y={b.y + 3}
              className={b.planet ? "sky__label sky__label--planet" : "sky__label"}
            >
              {name}
            </text>
          );
        })}
      </g>

      <g className="sky__cardinals" aria-hidden="true">
        <text x={0} y={-R - 6} textAnchor="middle">N</text>
        <text x={-R - 8} y={4} textAnchor="middle">E</text>
        <text x={0} y={R + 14} textAnchor="middle">S</text>
        <text x={R + 8} y={4} textAnchor="middle">W</text>
      </g>

      <circle
        className="sky__ring"
        data-on={ringed ? "true" : "false"}
        cx={ringed?.x ?? 0}
        cy={ringed?.y ?? 0}
        r={9}
        aria-hidden="true"
      />

      <g className="sky__tip" data-on={hover ? "true" : "false"} aria-hidden="true">
        {tip && (
          <text
            x={tip.x + (tipLeft ? -10 : 10)}
            y={tip.y - 8}
            textAnchor={tipLeft ? "end" : "start"}
          >
            <tspan className="sky__tip-name">{tip.name}</tspan>
            <tspan x={tip.x + (tipLeft ? -10 : 10)} dy="12">
              {degrees(tip.alt)} up, {direction(tip.az)}
            </tspan>
          </text>
        )}
      </g>
    </svg>
  );
}
