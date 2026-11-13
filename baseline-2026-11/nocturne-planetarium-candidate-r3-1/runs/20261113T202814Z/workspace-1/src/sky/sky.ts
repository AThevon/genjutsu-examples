import data from "../../data/stars.json";
import { STAR_TINTS } from "./tokens";

export type Body = {
  id: string;
  name: string | null;
  label: string;
  alt: number;
  az: number;
  mag: number;
  bv: number | null;
  planet: boolean;
};

export const sky = data;

export const stars: Body[] = data.stars.map((s) => ({
  id: s.id,
  name: s.name,
  label: s.name ?? s.bsc_designation ?? s.id,
  alt: s.alt,
  az: s.az,
  mag: s.mag,
  bv: s.bv,
  planet: false,
}));

export const planets: Body[] = data.planets.map((p) => ({
  id: p.name,
  name: p.name,
  label: p.name,
  alt: p.alt,
  az: p.az,
  mag: p.mag,
  bv: null,
  planet: true,
}));

export const saturn = planets[0];
export const namedCount = stars.filter((s) => s.name).length;
export const below = data.checked_below_cut;

/** Magnitude cut shown at rest, and the dimming bands above it (MASTER.md, Motion). */
export const REST_MAG = 2.5;
export const BAND_COUNT = 8;
export const BAND_STEP = 0.25;

export function bandOf(mag: number): number {
  if (mag <= REST_MAG) return -1;
  return Math.min(BAND_COUNT - 1, Math.floor((mag - REST_MAG) / BAND_STEP));
}

/**
 * Azimuthal equidistant projection, seen from below the dome:
 * zenith at the centre, horizon on the unit circle, north up, east left.
 */
export function project(alt: number, az: number): { x: number; y: number } {
  const r = (90 - alt) / 90;
  const a = (az * Math.PI) / 180;
  return { x: -r * Math.sin(a), y: -r * Math.cos(a) };
}

/** Disc radius in viewBox units (R = 1000) from visual magnitude. */
export function radiusOf(mag: number): number {
  return Math.max(2.6, 13 - 2.4 * mag);
}

function mix(a: number[], b: number[], t: number): string {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

/** Star tint from the catalogue's B-V colour index. */
export function tintOf(bv: number | null): string {
  if (bv === null) return mix(STAR_TINTS.mid, STAR_TINTS.mid, 0);
  const t = Math.max(0, Math.min(1, (bv - STAR_TINTS.bvHot) / (STAR_TINTS.bvCool - STAR_TINTS.bvHot)));
  return t < 0.5
    ? mix(STAR_TINTS.hot, STAR_TINTS.mid, t * 2)
    : mix(STAR_TINTS.mid, STAR_TINTS.cool, (t - 0.5) * 2);
}

const POINTS = [
  "north", "north-north-east", "north-east", "east-north-east",
  "east", "east-south-east", "south-east", "south-south-east",
  "south", "south-south-west", "south-west", "west-south-west",
  "west", "west-north-west", "north-west", "north-north-west",
];
const SHORT = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

export function compass(az: number): { short: string; long: string } {
  const i = Math.round(((az % 360) / 22.5)) % 16;
  return { short: SHORT[i], long: POINTS[i] };
}

/** The brightest named stars plus Saturn, by magnitude: the sky table. */
export const brightest: Body[] = [
  ...planets,
  ...stars
    .filter((s) => s.name)
    .sort((a, b) => a.mag - b.mag)
    .slice(0, 10),
].sort((a, b) => a.mag - b.mag);

/** Names drawn on the dome, and the side each label sits on so none collide. */
export const LABELLED: Record<string, "start" | "end"> = {
  Vega: "start",
  Capella: "start",
  Altair: "start",
  Fomalhaut: "start",
  Deneb: "end",
  Polaris: "start",
  Saturn: "start",
};
