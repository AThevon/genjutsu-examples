// Every figure on the page is read from data/tide.json (NOAA CO-OPS, as fetched).
// Nothing here is typed by hand: only parsing, formatting and differences between two times.
import tide from "../data/tide.json";

export const DAY_MINUTES = 1440;

export type CurrentEvent = {
  minute: number;
  time: string; // "5:57 AM"
  kind: "flood" | "ebb" | "slack";
  knots: string; // as NOAA returned it, sign removed for display
  knotsValue: number; // signed, for drawing
};

export type TideTurn = {
  minute: number;
  time: string;
  kind: "High" | "Low";
  ft: string;
};

export type Slack = CurrentEvent & {
  before: CurrentEvent | null;
  after: CurrentEvent | null;
  turn: TideTurn | null; // the high or low at 9414290 just before this slack
  lagMinutes: number | null;
};

function toMinute(t: string): number {
  const hm = t.slice(11, 16);
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

export function clock(minute: number): string {
  const h24 = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

export function pct(minute: number): number {
  return (minute / DAY_MINUTES) * 100;
}

function unsigned(v: string): string {
  return v.startsWith("-") ? v.slice(1) : v;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export const DATE = tide.date_written; // "2 October 2026"
export const FETCHED = longDate(tide.fetched_at);
export const SOURCE_URL = tide.source.slice(tide.source.indexOf("https://"));

export const stations = {
  tide: tide.stations.tide,
  current: tide.stations.current,
};

export const currentEvents: CurrentEvent[] = tide.current_slack_and_max.map((e) => ({
  minute: toMinute(e.t),
  time: clock(toMinute(e.t)),
  kind: e.type as CurrentEvent["kind"],
  knots: unsigned(e.velocity_knots),
  knotsValue: Number(e.velocity_knots),
}));

export const maxima = currentEvents.filter((e) => e.kind !== "slack");
export const maxKnots = Math.max(...maxima.map((e) => Math.abs(e.knotsValue)));

export const tideTurns: TideTurn[] = tide.highs_lows.map((h) => ({
  minute: toMinute(h.t),
  time: clock(toMinute(h.t)),
  kind: h.type === "H" ? "High" : "Low",
  ft: h.ft,
}));

export const slacks: Slack[] = currentEvents
  .map((e, i) => ({ e, i }))
  .filter(({ e }) => e.kind === "slack")
  .map(({ e, i }) => {
    const before = currentEvents[i - 1] ?? null;
    const after = currentEvents[i + 1] ?? null;
    const turn = [...tideTurns].reverse().find((t) => t.minute <= e.minute) ?? null;
    return {
      ...e,
      before: before && before.kind !== "slack" ? before : null,
      after: after && after.kind !== "slack" ? after : null,
      turn,
      lagMinutes: turn ? e.minute - turn.minute : null,
    };
  });

/** Each tide turn at 9414290 paired with the first slack at SFB1204 that follows it, if any on this day. */
export const turnToSlack = tideTurns.map((t) => {
  const slack = slacks.find((s) => s.minute >= t.minute) ?? null;
  return { turn: t, slack, lag: slack ? slack.minute - t.minute : null };
});

export const lagRange = (() => {
  const lags = turnToSlack.flatMap((p) => (p.lag === null ? [] : [p.lag]));
  return { min: Math.min(...lags), max: Math.max(...lags) };
})();

export const tideCurve = tide.tide_curve.map((p) => ({
  minute: toMinute(p.t),
  ft: Number(p.ft),
}));
