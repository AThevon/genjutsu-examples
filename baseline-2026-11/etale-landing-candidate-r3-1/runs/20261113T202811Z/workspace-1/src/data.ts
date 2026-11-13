// Every figure on the page comes from data/tide.json (NOAA CO-OPS, 2 October 2026).
// Nothing here invents a value: it parses times and keeps NOAA's strings as given.
import raw from "../data/tide.json";

export const DATE = raw.date_written; // "2 October 2026"
export const FETCHED = raw.fetched_at;
export const SOURCE = raw.source;
export const CURRENT_STATION = raw.stations.current;
export const TIDE_STATION = raw.stations.tide;

const minutesOf = (t: string) => {
  const [h, m] = t.slice(11, 16).split(":").map(Number);
  return h * 60 + m;
};
const hhmmOf = (t: string) => t.slice(11, 16);

export type CurrentEvent = {
  hhmm: string;
  min: number;
  type: "flood" | "ebb" | "slack";
  knots: string; // as NOAA returned it, signed
  speed: string; // magnitude, NOAA's digits without the sign
  value: number;
};

export const currentEvents: CurrentEvent[] = raw.current_slack_and_max.map((e) => ({
  hhmm: hhmmOf(e.t),
  min: minutesOf(e.t),
  type: e.type as CurrentEvent["type"],
  knots: e.velocity_knots,
  speed: e.velocity_knots.replace(/^-/, ""),
  value: Number(e.velocity_knots),
}));

export const slacks = currentEvents.filter((e) => e.type === "slack");
export const maxima = currentEvents.filter((e) => e.type !== "slack");

/** The maximum before a slack, the one after it, and the next slack, all on this day. */
export function around(slack: CurrentEvent) {
  const before = [...maxima].reverse().find((e) => e.min < slack.min);
  const after = maxima.find((e) => e.min > slack.min);
  const nextSlack = slacks.find((e) => e.min > slack.min);
  return { before, after, nextSlack };
}

export const currentDepthFt = raw.current_slack_and_max[0].depth_ft;
export const floodDirection = raw.current_slack_and_max[0].mean_flood_direction_deg;
export const ebbDirection = raw.current_slack_and_max[0].mean_ebb_direction_deg;

export const tideCurve = raw.tide_curve.map((p) => ({ min: minutesOf(p.t), ft: Number(p.ft) }));

export type HighLow = { hhmm: string; min: number; kind: "High" | "Low"; ft: string; value: number };
export const highsLows: HighLow[] = raw.highs_lows.map((p) => ({
  hhmm: hhmmOf(p.t),
  min: minutesOf(p.t),
  kind: p.type === "H" ? "High" : "Low",
  ft: p.ft,
  value: Number(p.ft),
}));

/** Each high or low, paired with the first slack after it (if any on this day). */
export const tideToSlack = highsLows.map((hl) => {
  const slack = slacks.find((s) => s.min > hl.min);
  const next = highsLows.find((o) => o.min > hl.min);
  const paired = slack && (!next || slack.min < next.min) ? slack : undefined;
  return { hl, slack: paired, lag: paired ? paired.min - hl.min : undefined };
});

export const DAY = 24 * 60;
export const pct = (min: number) => (min / DAY) * 100;
