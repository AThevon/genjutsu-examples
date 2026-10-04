import data from "../data/stars.json";

export type Body = {
  id: string;
  name: string | null;
  designation: string | null;
  alt: number;
  az: number;
  mag: number;
  bv: number | null;
  planet: boolean;
  x: number;
  y: number;
};

/** Chart radius in SVG units; the horizon circle. */
export const R = 200;

/** Azimuthal projection, zenith at the centre, north up, east left (the view looking up). */
function project(alt: number, az: number) {
  const r = ((90 - alt) / 90) * R;
  const a = (az * Math.PI) / 180;
  return { x: -Math.sin(a) * r, y: -Math.cos(a) * r };
}

export const stars: Body[] = data.stars.map((s) => ({
  id: s.id,
  name: s.name,
  designation: s.bsc_designation,
  alt: s.alt,
  az: s.az,
  mag: s.mag,
  bv: s.bv,
  planet: false,
  ...project(s.alt, s.az),
}));

// Only the bodies the data lists as above the horizon and bright enough: Saturn.
export const planets: Body[] = data.planets.map((p) => ({
  id: p.name,
  name: p.name,
  designation: null,
  alt: p.alt,
  az: p.az,
  mag: p.mag,
  bv: null,
  planet: true,
  ...project(p.alt, p.az),
}));

export const bodies = [...planets, ...stars];

export const location = data.location;
export const time = data.time;
export const starCount = data.count;
export const belowCut = data.checked_below_cut;
export const sourceUrls = data.source_urls;

export function byName(name: string): Body {
  const b = bodies.find((s) => s.name === name);
  if (!b) throw new Error(`${name} is not in data/stars.json`);
  return b;
}

/** Magnitude bands, brightest first. Upper bounds, exclusive. Delays are MASTER.md motion tokens. */
export const BANDS = [
  { max: 1, delay: 0 },
  { max: 2, delay: 180 },
  { max: 3, delay: 360 },
  { max: 3.5, delay: 720 },
  { max: 4, delay: 1080 },
  { max: Infinity, delay: 1440 },
];

export function bandOf(mag: number) {
  return BANDS.findIndex((b) => mag < b.max);
}

export function radiusOf(b: Body) {
  if (b.planet) return 3;
  return Math.max(0.45, 2.6 - 0.48 * b.mag);
}

/** Star colour from the catalogue B-V index (MASTER.md: -0.3, 0.65, 1.6 stops). */
const STOPS: [number, number[]][] = [
  [-0.3, [0xaa, 0xbf, 0xff]],
  [0.65, [0xf8, 0xf7, 0xff]],
  [1.6, [0xff, 0xd6, 0xaa]],
];

export function colourOf(bv: number | null) {
  const v = Math.min(STOPS[2][0], Math.max(STOPS[0][0], bv ?? 0.6));
  const [lo, hi] = v < STOPS[1][0] ? [STOPS[0], STOPS[1]] : [STOPS[1], STOPS[2]];
  const u = (v - lo[0]) / (hi[0] - lo[0]);
  const c = lo[1].map((n, i) => Math.round(n + (hi[1][i] - n) * u));
  return `rgb(${c.join(" ")})`;
}

const POINTS = [
  "north", "north-north-east", "north-east", "east-north-east",
  "east", "east-south-east", "south-east", "south-south-east",
  "south", "south-south-west", "south-west", "west-south-west",
  "west", "west-north-west", "north-west", "north-north-west",
];

export function direction(az: number) {
  return POINTS[Math.round(az / 22.5) % 16];
}

export function degrees(n: number) {
  return `${n.toFixed(1)}°`;
}
