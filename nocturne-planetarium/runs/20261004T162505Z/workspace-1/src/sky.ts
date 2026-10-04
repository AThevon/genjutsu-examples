import data from "../data/stars.json";

export type Star = {
  id: string;
  name: string | null;
  alt: number;
  az: number;
  mag: number;
  bv: number | null;
};

export const VIEW = 1000;
const CENTER = VIEW / 2;
const RADIUS = 470;

export const stars: Star[] = data.stars as Star[];
export const saturn = data.planets[0];
export const moon = data.checked_below_cut.Moon;
export const starCount = data.count;
export const lisbonLat = data.location.lat;
export const polaris = stars.find((s) => s.name === "Polaris")!;

/** Azimuthal projection seen from below: zenith at the centre, horizon at the rim, north up, east left. */
export function project(alt: number, az: number): [number, number] {
  const r = ((90 - alt) / 90) * RADIUS;
  const a = (az * Math.PI) / 180;
  return [CENTER - r * Math.sin(a), CENTER - r * Math.cos(a)];
}

export function ringRadius(alt: number): number {
  return ((90 - alt) / 90) * RADIUS;
}

/** Disc radius in view units from visual magnitude. */
export function discSize(mag: number): number {
  return Math.max(1.1, 7.2 - 1.45 * mag);
}

/** Tint from the catalogue B-V colour index (MASTER.md, star tints). */
export function tint(bv: number | null): string {
  if (bv == null) return "#f2f4fa";
  if (bv < 0) return "#b9c9ff";
  if (bv < 0.3) return "#e3e9ff";
  if (bv < 0.6) return "#fbf7f0";
  if (bv < 1.0) return "#ffe6c4";
  if (bv < 1.4) return "#ffd2a0";
  return "#ffbe82";
}

/** Stars grouped by 0.25 magnitude so the scroll fades one group at a time. */
export function magnitudeBins(): [number, Star[]][] {
  const bins = new Map<number, Star[]>();
  for (const s of stars) {
    const m = Math.ceil(s.mag * 4) / 4;
    if (!bins.has(m)) bins.set(m, []);
    bins.get(m)!.push(s);
  }
  return [...bins.entries()].sort((a, b) => a[0] - b[0]);
}

const COMPASS = [
  "north", "north-north-east", "north-east", "east-north-east",
  "east", "east-south-east", "south-east", "south-south-east",
  "south", "south-south-west", "south-west", "west-south-west",
  "west", "west-north-west", "north-west", "north-north-west",
];

export function direction(az: number): string {
  return COMPASS[Math.round(az / 22.5) % 16];
}

/** Named stars labelled on the dome: the brightest named ones, plus Polaris. */
export const LABELLED = ["Vega", "Capella", "Altair", "Fomalhaut", "Deneb", "Mirfak", "Polaris"];

/** The ten brightest named stars, for the list beside the dome. */
export const brightest: Star[] = stars
  .filter((s) => s.name)
  .sort((a, b) => a.mag - b.mag)
  .slice(0, 10);
