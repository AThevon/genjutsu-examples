// Every figure on the page is read from data/tide.json (NOAA CO-OPS predictions, 2 October 2026).
// Strings are kept exactly as NOAA returned them; nothing here is rounded or typed by hand.
import tide from "../data/tide.json";

export type Flow = "flood" | "ebb";

export interface CurrentMax {
  time: string;
  minute: number;
  flow: Flow;
  knots: string;
}

export interface Slack {
  time: string;
  minute: number;
  before: CurrentMax;
  after: CurrentMax;
  /** The high or low water at 9414290 that precedes this slack. */
  turn: { time: string; type: "High" | "Low"; ft: string; minutesBefore: number };
}

export const dateWritten = tide.date_written;
export const fetchedAt = tide.fetched_at;
export const tideStation = tide.stations.tide;
export const currentStation = tide.stations.current;
export const depthFt = tide.current_slack_and_max[0].depth_ft;

const clock = (t: string) => t.slice(11, 16);
const minuteOf = (t: string) => Number(t.slice(11, 13)) * 60 + Number(t.slice(14, 16));
/** Ebb is negative in NOAA's data; the page says "ebb" in words and shows the speed. */
const speed = (knots: string) => knots.replace(/^-/, "");

export const maxima: CurrentMax[] = tide.current_slack_and_max
  .filter((p) => p.type !== "slack")
  .map((p) => ({
    time: clock(p.t),
    minute: minuteOf(p.t),
    flow: p.type as Flow,
    knots: speed(p.velocity_knots),
  }));

export const highsLows = tide.highs_lows.map((h) => ({
  time: clock(h.t),
  minute: minuteOf(h.t),
  type: h.type === "H" ? ("High" as const) : ("Low" as const),
  ft: h.ft,
}));

export const slacks: Slack[] = tide.current_slack_and_max
  .filter((p) => p.type === "slack")
  .map((p) => {
    const minute = minuteOf(p.t);
    const before = [...maxima].reverse().find((m) => m.minute < minute)!;
    const after = maxima.find((m) => m.minute > minute)!;
    const turn = [...highsLows].reverse().find((h) => h.minute < minute)!;
    return {
      time: clock(p.t),
      minute,
      before,
      after,
      turn: { time: turn.time, type: turn.type, ft: turn.ft, minutesBefore: minute - turn.minute },
    };
  });

/** Largest speed of the day, the scale of the current strip. */
export const peakKnots = Math.max(...maxima.map((m) => Number(m.knots)));

export const tideCurve = tide.tide_curve.map((p) => ({ minute: minuteOf(p.t), ft: Number(p.ft) }));

export const DAY_MINUTES = 24 * 60;
