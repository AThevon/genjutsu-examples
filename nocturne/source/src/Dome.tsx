import {
  memo, useEffect, useImperativeHandle, useMemo, useRef, useState,
  type KeyboardEvent, type PointerEvent, type Ref, type RefObject,
} from "react";
import {
  bodies, binAppearAt, binCount, CENTER, describe, FADE_SPAN, formatMag, named, neighbour,
  RADIUS, saturn, VIEW, type Body, type Heading,
} from "./sky";

export interface DomeHandle {
  setDusk: (dusk: number) => void;
}

interface DomeProps {
  ref?: Ref<DomeHandle>;
  active: Body | null;
  /** Mouse hover, on stars already lit. */
  onHover: (body: Body | null) => void;
  /** Keyboard focus or a tap: any named star, lit or not. */
  onPick: (body: Body | null) => void;
}

// Dome geometry, in SVG units (MASTER.md > Dome geometry).
const COMPASS_GAP = 26;
const LABEL_GAP = 8;
const HIT_MIN = 10;
const HIT_PAD = 6;
const RING_PAD = 7;
const TAG_GAP = 14;
const TAG_LINE = 22;
const TAG_FLIP = 0.45;

const COMPASS: [string, number, number][] = [
  ["N", CENTER, CENTER - RADIUS - COMPASS_GAP],
  ["E", CENTER - RADIUS - COMPASS_GAP, CENTER],
  ["S", CENTER, CENTER + RADIUS + COMPASS_GAP],
  ["W", CENTER + RADIUS + COMPASS_GAP, CENTER],
];

const KEYS: Record<string, Heading> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

const labelled = (b: Body) => b.planet || (b.name !== null && b.mag < 1.5);
const domId = (b: Body) => `star-${b.id.replace(/\W+/g, "-")}`;
const isLit = (b: Body, dusk: number) => dusk > binAppearAt(b.bin);

// The stars themselves never re-render: scroll only writes opacities on the bin groups.
const Stars = memo(function Stars({ groups }: { groups: RefObject<(SVGGElement | null)[]> }) {
  const bins = useMemo(() => {
    const out: Body[][] = Array.from({ length: binCount }, () => []);
    for (const b of bodies) out[b.bin].push(b);
    return out;
  }, []);

  return (
    <g aria-hidden="true">
      {bins.map((list, i) => (
        <g key={i} className="dome__bin" ref={(el) => { groups.current[i] = el; }}>
          {list.map((b) => (
            <g key={b.id} className={b.planet ? "dome__body dome__body--planet" : "dome__body"}>
              <circle
                className={b.color ? undefined : "dome__dot"}
                cx={b.x}
                cy={b.y}
                r={b.r}
                fill={b.color ?? undefined}
              />
              {labelled(b) && (
                <text className="dome__label" x={b.x + b.r + LABEL_GAP} y={b.y} dominantBaseline="central">
                  {b.name}
                </text>
              )}
            </g>
          ))}
        </g>
      ))}
    </g>
  );
});

// Stays mounted with the last body, so it fades out instead of vanishing. It draws the star
// itself too, so a star picked before dusk has lit it is still shown.
function Highlight({ body, on }: { body: Body; on: boolean }) {
  const flip = body.x > CENTER + RADIUS * TAG_FLIP;
  const dx = flip ? -(body.r + TAG_GAP) : body.r + TAG_GAP;
  return (
    <g className={on ? "dome__highlight is-on" : "dome__highlight"} aria-hidden="true">
      <circle
        className={body.planet ? "dome__dot dome__dot--planet" : body.color ? undefined : "dome__dot"}
        cx={body.x}
        cy={body.y}
        r={body.r}
        fill={body.color ?? undefined}
      />
      <circle className="dome__ring-hl" cx={body.x} cy={body.y} r={body.r + RING_PAD} />
      <text x={body.x + dx} y={body.y - TAG_LINE / 2} textAnchor={flip ? "end" : "start"}>
        <tspan className="dome__hl-name">{body.name}</tspan>
        <tspan x={body.x + dx} dy={TAG_LINE} className="dome__hl-detail">
          magnitude {formatMag(body.mag)}{body.planet ? ", planet" : ""}
        </tspan>
      </text>
    </g>
  );
}

export function Dome({ ref, active, onHover, onPick }: DomeProps) {
  const groups = useRef<(SVGGElement | null)[]>([]);
  const options = useRef(new Map<string, SVGCircleElement>());
  const glow = useRef<SVGCircleElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const dusk = useRef(0);
  const last = useRef<Body | null>(null);
  const [cursor, setCursor] = useState<Body>(saturn);
  if (active) last.current = active;

  useImperativeHandle(ref, () => ({
    setDusk(value) {
      dusk.current = value;
      glow.current?.setAttribute("opacity", (1 - value).toFixed(3));
      groups.current.forEach((g, i) => {
        if (!g) return;
        const o = Math.min(1, Math.max(0, (value - binAppearAt(i)) / FADE_SPAN));
        g.style.opacity = o.toFixed(3);
        g.style.visibility = o > 0 ? "visible" : "hidden";
      });
    },
  }), []);

  // Text inside the SVG scales with it; --k keeps labels at their token size in CSS pixels.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) el.style.setProperty("--k", (VIEW / w).toFixed(3));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const moveTo = (b: Body | null | undefined) => {
    if (!b) return;
    setCursor(b);
    options.current.get(b.id)?.focus();
  };

  // Arrows move to the nearest named star in that direction. Page Down / Page Up step through
  // every named star from brightest to faintest, Home and End jump to either end: that
  // sequential path is what guarantees every name is reachable.
  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    const i = named.indexOf(cursor);
    let next: Body | null | undefined;
    if (e.key in KEYS) next = neighbour(cursor, KEYS[e.key]) ?? cursor;
    else if (e.key === "PageDown") next = named[Math.min(named.length - 1, i + 1)];
    else if (e.key === "PageUp") next = named[Math.max(0, i - 1)];
    else if (e.key === "Home") next = named[0];
    else if (e.key === "End") next = named[named.length - 1];
    else return;
    e.preventDefault();
    moveTo(next);
  };

  // A tap picks the nearest lit named star within half a touch target; a tap on empty sky
  // clears the pick.
  const onPointerUp = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "mouse" || !svg.current) return;
    const ctm = svg.current.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const target = parseFloat(getComputedStyle(svg.current).getPropertyValue("--target"));
    const reach = (target / 2) / ctm.a;
    let best: Body | null = null;
    let bestD = reach;
    for (const b of named) {
      if (!isLit(b, dusk.current)) continue;
      const d = Math.hypot(b.x - p.x, b.y - p.y);
      if (d < bestD) {
        bestD = d;
        best = b;
      }
    }
    if (best) setCursor(best);
    onPick(best);
  };

  return (
    <svg
      ref={svg}
      className="dome"
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      role="group"
      aria-labelledby="dome-title"
      onPointerUp={onPointerUp}
    >
      <title id="dome-title">
        The sky over Lisbon at 22:00 on Friday 9 October 2026: the stars of the Yale Bright Star
        Catalogue down to magnitude 4.5, and Saturn low in the east-south-east.
      </title>
      <defs>
        <radialGradient id="house-lights" cx={CENTER} cy={CENTER} r={RADIUS} gradientUnits="userSpaceOnUse">
          <stop className="dome__glow-stop" offset="0.62" stopOpacity="0" />
          <stop className="dome__glow-stop" offset="1" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <g aria-hidden="true">
        <circle className="dome__disc" cx={CENTER} cy={CENTER} r={RADIUS} />
        <circle ref={glow} cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#house-lights)" />
        <circle className="dome__ring" cx={CENTER} cy={CENTER} r={(RADIUS * 2) / 3} />
        <circle className="dome__ring" cx={CENTER} cy={CENTER} r={RADIUS / 3} />
        <circle className="dome__rim" cx={CENTER} cy={CENTER} r={RADIUS} />
        {COMPASS.map(([t, x, y]) => (
          <text key={t} className="dome__compass" x={x} y={y} textAnchor="middle" dominantBaseline="central">
            {t}
          </text>
        ))}
      </g>
      <Stars groups={groups} />
      <g
        role="listbox"
        aria-label="Named stars and Saturn"
        aria-describedby="dome-keys"
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onPick(null);
        }}
      >
        {named.map((b) => (
          <circle
            key={b.id}
            id={domId(b)}
            ref={(el) => {
              if (el) options.current.set(b.id, el);
              else options.current.delete(b.id);
            }}
            role="option"
            aria-selected={b === cursor}
            aria-label={describe(b)}
            tabIndex={b === cursor ? 0 : -1}
            className="dome__opt"
            cx={b.x}
            cy={b.y}
            r={Math.max(HIT_MIN, b.r + HIT_PAD)}
            onFocus={() => {
              setCursor(b);
              onPick(b);
            }}
            onPointerEnter={(e) => e.pointerType === "mouse" && isLit(b, dusk.current) && onHover(b)}
            onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
          />
        ))}
      </g>
      {last.current && <Highlight body={last.current} on={active !== null} />}
    </svg>
  );
}
