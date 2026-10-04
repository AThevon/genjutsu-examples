// The sky over Lisbon at 22:00 WEST on Friday 9 October 2026, from data/stars.json.
// Only `stars` and `planets` are drawn; `checked_below_cut` never is.
import raw from "../data/stars.json";

interface RawStar {
  id: string;
  name: string | null;
  alt: number;
  az: number;
  mag: number;
  bv: number | null;
}

export interface Body {
  id: string;
  name: string | null;
  alt: number;
  az: number;
  mag: number;
  planet: boolean;
  x: number;
  y: number;
  r: number;
  /** Catalogue tint; null means the token colour (ink for stars, saturn for the planet). */
  color: string | null;
  bin: number;
}

// Dome geometry, in SVG units (MASTER.md > Motion > Projection, Star size).
export const VIEW = 1000;
export const CENTER = VIEW / 2;
export const RADIUS = 440;

export function project(alt: number, az: number): [number, number] {
  const r = ((90 - alt) / 90) * RADIUS;
  const a = (az * Math.PI) / 180;
  return [CENTER - r * Math.sin(a), CENTER - r * Math.cos(a)];
}

const starRadius = (mag: number) => 0.8 + 0.9 * (4.7 - mag);

// Stars fade in by magnitude in 0.25-magnitude bins, so a frame writes ~20 opacities.
export const BIN_SIZE = 0.25;
const binOf = (mag: number) => Math.max(0, Math.floor((mag + 0.5) / BIN_SIZE));
// At dusk 0 the three brightest bodies (Vega, Capella, Saturn) are already lit; the faintest
// bin is complete at about 0.92.
export const binAppearAt = (bin: number) => {
  const mag = bin * BIN_SIZE - 0.5 + BIN_SIZE / 2;
  return (0.9 * (mag - 0.9)) / 3.9;
};
export const FADE_SPAN = 0.12;

// B-V index to a star tint: Ballesteros temperature, then an RGB fit, mixed 55% toward white.
function tint(bv: number | null): string | null {
  if (bv == null) return null;
  const t = (4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62))) / 100;
  const r = t <= 66 ? 255 : 329.7 * Math.pow(t - 60, -0.1332);
  const g = t <= 66 ? 99.47 * Math.log(t) - 161.12 : 288.12 * Math.pow(t - 60, -0.0755);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  const mix = (v: number) => Math.round(Math.min(255, Math.max(0, v)) * 0.45 + 255 * 0.55);
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}

const toBody = (s: RawStar, planet: boolean): Body => {
  const [x, y] = project(s.alt, s.az);
  return {
    id: s.id,
    name: s.name,
    alt: s.alt,
    az: s.az,
    mag: s.mag,
    planet,
    x,
    y,
    r: starRadius(s.mag) * (planet ? 1.15 : 1),
    color: planet ? null : tint(s.bv),
    bin: binOf(s.mag),
  };
};

const stars = (raw.stars as RawStar[]).map((s) => toBody(s, false));
const saturnRaw = raw.planets[0];
export const saturn = toBody(
  { id: "Saturn", name: saturnRaw.name, alt: saturnRaw.alt, az: saturnRaw.az, mag: saturnRaw.mag, bv: null },
  true,
);

// Faintest first, so bright stars paint on top.
export const bodies: Body[] = [...stars, saturn].sort((a, b) => b.mag - a.mag);
export const binCount = Math.max(...bodies.map((b) => b.bin)) + 1;

export const starCount = stars.length;
export const brightest = stars
  .filter((s) => s.name && s.mag < 2)
  .sort((a, b) => a.mag - b.mag);

export const moon = raw.checked_below_cut.Moon;

// Every body with a name, brightest first: the keyboard's sequential path across the dome.
export const named: Body[] = bodies.filter((b) => b.name).sort((a, b) => a.mag - b.mag);

export type Heading = "left" | "right" | "up" | "down";
const HEADINGS: Record<Heading, [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
};

// Nearest named body in a screen direction, inside a cone of about 63° either side.
// Spatial moves alone can miss a star (Thuban, on this night), so the sequential path above
// is what guarantees every name is reachable.
export function neighbour(from: Body, heading: Heading): Body | null {
  const [ux, uy] = HEADINGS[heading];
  let best: Body | null = null;
  let bestScore = Infinity;
  for (const b of named) {
    if (b === from) continue;
    const dx = b.x - from.x;
    const dy = b.y - from.y;
    const along = dx * ux + dy * uy;
    if (along <= 0) continue;
    const across = Math.abs(dx * uy - dy * ux);
    if (across > along * 2) continue;
    const score = along + across * 2;
    if (score < bestScore) {
      bestScore = score;
      best = b;
    }
  }
  return best;
}

const POINTS = [
  "north", "north-north-east", "north-east", "east-north-east",
  "east", "east-south-east", "south-east", "south-south-east",
  "south", "south-south-west", "south-west", "west-south-west",
  "west", "west-north-west", "north-west", "north-north-west",
];
export const direction = (az: number) => POINTS[Math.floor(((az + 11.25) % 360) / 22.5)];

export const formatMag = (mag: number) => mag.toFixed(2);
export const formatAlt = (alt: number) => `${Math.round(alt)}°`;

export const describe = (b: Body) =>
  `${b.name}${b.planet ? ", planet" : ""}, ${direction(b.az)}, ${formatAlt(b.alt)} up, magnitude ${formatMag(b.mag)}`;
