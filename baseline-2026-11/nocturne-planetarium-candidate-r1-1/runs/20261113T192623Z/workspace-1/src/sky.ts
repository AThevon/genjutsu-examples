import data from "../data/stars.json";

/** Radius of the all-sky disc in SVG units (viewBox is centred on the zenith). */
export const R = 480;

/** Share of the hero's scroll progress over which one star fades in. Mirrors MASTER.md. */
export const FADE = 0.06;

/** Progress at which the faintest object is fully lit. */
const LAST = 0.92;

export type Body = {
  id: string;
  label: string | null;
  kind: "star" | "planet";
  alt: number;
  az: number;
  mag: number;
  x: number;
  y: number;
  /** dot radius in SVG units */
  r: number;
  /** 0-1 share of the way from --c-ink to --c-saturn, from the B-V index */
  warmth: number;
  /** hero progress at which the body starts to light */
  t: number;
};

export type SkyRow = {
  name: string;
  alt: number;
  az: number;
  mag: number;
};

/**
 * Zenith-centred azimuthal projection, as seen lying under the dome:
 * north at the top, east at the left.
 */
export function project(alt: number, az: number): [number, number] {
  const r = ((90 - alt) / 90) * R;
  const a = (az * Math.PI) / 180;
  return [-r * Math.sin(a), -r * Math.cos(a)];
}

const POINTS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

export function compass(az: number): string {
  return POINTS[Math.round(az / 22.5) % 16];
}

const dotRadius = (mag: number) => 1.2 + (4.5 - mag) * 1.15;

/** Capped below 1 so that no star takes Saturn's amber. */
const warmthOf = (bv: number | null) =>
  bv === null ? 0.3 : Math.min(0.6, Math.max(0, (bv + 0.2) / 1.8));

/** Names shown on the disc: the brightest named stars, plus Polaris. */
const LABELLED_MAG = 1.3;

const saturn = data.planets[0];

const raw = [
  ...data.stars.map((s) => ({
    id: s.id,
    label: s.name && (s.mag <= LABELLED_MAG || s.name === "Polaris") ? s.name : null,
    kind: "star" as const,
    alt: s.alt,
    az: s.az,
    mag: s.mag,
    warmth: warmthOf(s.bv),
  })),
  {
    id: saturn.name,
    label: saturn.name,
    kind: "planet" as const,
    alt: saturn.alt,
    az: saturn.az,
    mag: saturn.mag,
    warmth: 1,
  },
].sort((a, b) => a.mag - b.mag);

/** The three brightest (Vega, Capella, Saturn) are lit from the first frame, the rest follow by magnitude. */
const ALWAYS_LIT = 3;

export const bodies: Body[] = raw.map((b, rank) => {
  const [x, y] = project(b.alt, b.az);
  const t =
    rank < ALWAYS_LIT
      ? -FADE
      : FADE + ((rank - ALWAYS_LIT) / (raw.length - 1 - ALWAYS_LIT)) * (LAST - FADE * 2);
  return { ...b, x, y, r: dotRadius(b.mag), t };
});

/** Hero progress thresholds at which each star (not Saturn) counts as lit, ascending. */
const starThresholds = bodies
  .filter((b) => b.kind === "star")
  .map((b) => b.t + FADE / 2)
  .sort((a, b) => a - b);

export const starCount = data.stars.length;

export function litStars(p: number): number {
  let n = 0;
  for (const t of starThresholds) {
    if (t > p) break;
    n += 1;
  }
  return n;
}

export const saturnRow = saturn;

export const brightestNamed: SkyRow[] = data.stars
  .flatMap((s): SkyRow[] => (s.name === null ? [] : [{ name: s.name, alt: s.alt, az: s.az, mag: s.mag }]))
  .sort((a, b) => a.mag - b.mag)
  .slice(0, 12);

export const polaris = data.stars.find((s) => s.name === "Polaris")!;

export const location = data.location;

export const below = data.checked_below_cut;
