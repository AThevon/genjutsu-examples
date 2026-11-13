import raw from "../data/stars.json";

export interface Star {
  id: string;
  name: string | null;
  bsc_designation: string;
  alt: number;
  az: number;
  mag: number;
  bv: number | null;
}

interface Planet {
  name: string;
  alt: number;
  az: number;
  mag: number;
}

interface BelowCut {
  alt: number;
  az: number;
  mag: number;
  illuminated_percent?: number;
}

interface SkyData {
  location: { name: string; lat: number; lon: number; lat_text: string; lon_text: string };
  time: { local: string; local_text: string };
  planets: Planet[];
  checked_below_cut: Record<string, BelowCut>;
  stars: Star[];
}

const data = raw as unknown as SkyData;

export const location = data.location;
export const stars = data.stars;
export const planets = data.planets;
export const belowCut = data.checked_below_cut;

/** Faintest magnitude kept in the data (the cut stated in its method). */
export const MAG_LIMIT = 4.5;

/** Chart radius in SVG user units: zenith at 0, horizon at R. */
export const R = 100;

/**
 * Zenith-centred azimuthal equidistant projection, as on a sky chart held overhead:
 * north up, east on the left.
 */
export function project(alt: number, az: number): [number, number] {
  const r = ((90 - alt) / 90) * R;
  const a = (az * Math.PI) / 180;
  return [-Math.sin(a) * r, -Math.cos(a) * r];
}

export function starRadius(mag: number): number {
  return Math.max(0.35, 2.5 - 0.48 * mag);
}

export function tint(bv: number | null): "cool" | "neutral" | "warm" {
  if (bv === null) return "neutral";
  if (bv < 0) return "cool";
  if (bv < 0.8) return "neutral";
  return "warm";
}

const POINTS = [
  "north", "north-north-east", "north-east", "east-north-east",
  "east", "east-south-east", "south-east", "south-south-east",
  "south", "south-south-west", "south-west", "west-south-west",
  "west", "west-north-west", "north-west", "north-north-west",
];

export function compass(az: number): string {
  return POINTS[Math.round(az / 22.5) % 16];
}

const ORDINALS = ["", "", "second", "third", "fourth", "fifth", "sixth", "seventh"];

const byBrightness = [...stars].sort((a, b) => a.mag - b.mag);

function brightnessNote(name: string): string | null {
  const rank = byBrightness.findIndex((s) => s.name === name) + 1;
  if (rank === 1) return "The brightest star on this chart.";
  if (rank > 1 && rank < ORDINALS.length) return `The ${ORDINALS[rank]} brightest star on this chart.`;
  return null;
}

export interface SkyObject {
  key: string;
  name: string;
  kind: "planet" | "star";
  alt: number;
  az: number;
  mag: number;
  note: string;
  /** Label on the left of the dot, where the right side would run into a neighbour. */
  labelLeft?: boolean;
}

function findStar(name: string): Star {
  const s = stars.find((x) => x.name === name);
  if (!s) throw new Error(`${name} is not in data/stars.json`);
  return s;
}

const saturn = planets.find((p) => p.name === "Saturn");

/** The objects named on the charts and listed in "Tonight's sky". All values read from the data. */
export const featured: SkyObject[] = [
  ...(saturn
    ? [{
        key: "Saturn",
        name: "Saturn",
        kind: "planet" as const,
        alt: saturn.alt,
        az: saturn.az,
        mag: saturn.mag,
        note:
          "The one bright planet above the horizon, five days after its opposition. " +
          "Brighter than every star on this chart except Vega and Capella.",
      }]
    : []),
  ...["Vega", "Capella", "Altair", "Fomalhaut", "Deneb"].map((n) => {
    const s = findStar(n);
    return {
      key: n, name: n, kind: "star" as const, alt: s.alt, az: s.az, mag: s.mag,
      labelLeft: n === "Deneb",
      note:
        (brightnessNote(n) ?? "") +
        (n === "Deneb" ? " Close to the zenith, the centre of the chart." : ""),
    };
  }),
  (() => {
    const s = findStar("Polaris");
    return {
      key: "Polaris", name: "Polaris", kind: "star" as const, alt: s.alt, az: s.az, mag: s.mag,
      note: `Due north, ${s.alt.toFixed(1)}° up. Lisbon lies at ${location.lat.toFixed(2)}° N.`,
    };
  })(),
];

/** Bodies the data checked and that are not drawn, grouped by why. */
export function absentBodies() {
  const entries = Object.entries(belowCut);
  const moon = belowCut["Moon"];
  const below = entries.filter(([n, b]) => n !== "Moon" && b.alt <= 0).map(([n]) => n);
  const faint = entries.filter(([n, b]) => n !== "Moon" && b.alt > 0 && b.mag > MAG_LIMIT).map(([n]) => n);
  return { moon, below, faint };
}

export function listWords(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
